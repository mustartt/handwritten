import logging
from enum import Enum
from typing import Optional

import cv2
import numpy as np
from pydantic import BaseModel, Field
from skimage.exposure import rescale_intensity
from skimage.filters import threshold_yen

from scanner_service.base import find_image_corner, rotate_bounding_box, estimate_perspective_dimension, resize_image, \
    unsharp_mask


class ScanType(str, Enum):
    NOTES = "scan_notes"
    DOCUMENT = "scan_document"
    FIGURE = "scan_figure"


class ScanBorder(BaseModel):
    top_left: tuple[int, int] = Field(..., description="Top-left corner coordinates")
    top_right: tuple[int, int] = Field(..., description="Top-right corner coordinates")
    bottom_left: tuple[int, int] = Field(..., description="Bottom-left corner coordinates")
    bottom_right: tuple[int, int] = Field(..., description="Bottom-right corner coordinates")


def correct_perspective(image, scan_border: Optional[ScanBorder]):
    if scan_border is not None:
        logging.info('Using provided document border')
        border = np.array([
            [*scan_border.top_left],
            [*scan_border.bottom_left],
            [*scan_border.bottom_right],
            [*scan_border.top_right]
        ], dtype=np.float32)
    else:
        logging.info('Finding document border')
        border_contour = find_image_corner(image)
        rect = np.zeros((4, 2), dtype='float32')
        for i in range(4):
            rect[i] = border_contour[i][0]
        height, width = image.shape[:2]
        border = rotate_bounding_box(rect, width, height)

    estimated_height, estimated_width = estimate_perspective_dimension(border)
    target_points = np.array([
        [0, 0],
        [0, estimated_height],
        [estimated_width, estimated_height],
        [estimated_width, 0]
    ], dtype='float32')

    perspective_matrix = cv2.getPerspectiveTransform(border, target_points)
    return cv2.warpPerspective(image, perspective_matrix, (estimated_width, estimated_height)), border


def get_chunk_value(hsv_chunk):
    channel = hsv_chunk[:, :, 2]
    return np.argmax(cv2.calcHist([channel], [0], None, [256], [0, 256]))


def postprocessing_equalize_brightness(
    image,
    chunk_size=32,
    gblur_before=5,
    gblur_after=21,
    target_brightness=240,
    max_brightness_diff=150,
    black_ignore_threshold=75
):
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    height, width = hsv_image.shape[:2]
    blank_image = np.zeros((height // chunk_size, width // chunk_size), dtype=np.uint8)

    for y in range(0, height, chunk_size):
        for x in range(0, width, chunk_size):
            if (x + chunk_size <= width) and (y + chunk_size <= height):
                sub_chunk = hsv_image[y:y + chunk_size, x:x + chunk_size]
                blank_image[y // chunk_size, x // chunk_size] = get_chunk_value(sub_chunk)

    upscaled_image = cv2.GaussianBlur(blank_image, (gblur_before, gblur_before), 0)
    upscaled_image = cv2.resize(upscaled_image, (width, height), interpolation=cv2.INTER_LINEAR)
    upscaled_image = cv2.GaussianBlur(upscaled_image, (gblur_after, gblur_after), 0)

    target = np.full(upscaled_image.shape, target_brightness, dtype=np.int16)
    value_channel_diff = target - upscaled_image.astype(np.int16)
    value_channel_diff = np.clip(value_channel_diff, -max_brightness_diff, max_brightness_diff)

    value_channel = hsv_image[:, :, 2]
    mask = value_channel > black_ignore_threshold

    merged_value_channel = value_channel.copy().astype(np.int16)
    merged_value_channel[mask] += value_channel_diff[mask]
    merged_value_channel = np.clip(merged_value_channel, 0, 255)

    h, s, v = cv2.split(hsv_image)
    hsv_image_adjusted = cv2.merge((h, s, merged_value_channel.astype(np.uint8)))

    return cv2.cvtColor(hsv_image_adjusted, cv2.COLOR_HSV2BGR)


def postprocessing_soft_thresholding(
    image,
    black_threshold=50,
    min_threshold=175,
    yen_threshold_offset=15
):
    threshold = threshold_yen(image)
    bright = rescale_intensity(
        image,
        (black_threshold, max(threshold + yen_threshold_offset, min_threshold))
    )
    return bright


def postprocessing_sharpen(image, kernel_size=(11, 11), amount=3.0):
    return unsharp_mask(image, kernel_size=kernel_size, amount=amount)


def convert_to_point(arr):
    return arr[0], arr[1]


def scan_image(image_bytes: bytes, scan_type: ScanType, scan_border: Optional[ScanBorder] = None):
    np_buf = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_buf, cv2.IMREAD_COLOR)

    corrected, scanned_border = correct_perspective(image, scan_border)
    resized, _ = resize_image(corrected, size=2048, func=max)

    result = postprocessing_equalize_brightness(resized)
    if scan_type != ScanType.FIGURE:
        result = postprocessing_soft_thresholding(result)
    result = postprocessing_sharpen(result)

    success, encoded_image = cv2.imencode('.jpg', result, (cv2.IMWRITE_JPEG_QUALITY, 75))
    if not success:
        raise Exception("Image encoding failed")

    return encoded_image.tobytes(), ScanBorder(
        top_left=convert_to_point(scanned_border[0]),
        top_right=convert_to_point(scanned_border[3]),
        bottom_left=convert_to_point(scanned_border[1]),
        bottom_right=convert_to_point(scanned_border[2]),
    )
