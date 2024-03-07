import cv2
import numpy as np
import sympy


def resize_image(image, size=256, func=min):
    height, width = image.shape[:2]
    scale = size / func(height, width)
    new_width = int(width * scale)
    new_height = int(height * scale)
    return cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA), scale


def scale_contour(contour, scale_factor):
    scaled_contour = (
        np.array(
            [
                [[int(value[0][0] * scale_factor),
                  int(value[0][1] * scale_factor)]]
                for value in contour
            ]
        )
        .astype(np.int32))
    return scaled_contour


def appx_best_fit_ngon(hull, n: int = 4):
    hull = np.array(hull).reshape((len(hull), 2))
    hull = [sympy.Point(*pt) for pt in hull]
    while len(hull) > n:
        best_candidate = None

        for edge_idx_1 in range(len(hull)):
            edge_idx_2 = (edge_idx_1 + 1) % len(hull)

            adj_idx_1 = (edge_idx_1 - 1) % len(hull)
            adj_idx_2 = (edge_idx_1 + 2) % len(hull)

            edge_pt_1 = sympy.Point(*hull[edge_idx_1])
            edge_pt_2 = sympy.Point(*hull[edge_idx_2])
            adj_pt_1 = sympy.Point(*hull[adj_idx_1])
            adj_pt_2 = sympy.Point(*hull[adj_idx_2])

            subpoly = sympy.Polygon(adj_pt_1, edge_pt_1, edge_pt_2, adj_pt_2)
            angle1 = subpoly.angles[edge_pt_1]
            angle2 = subpoly.angles[edge_pt_2]

            if sympy.N(angle1 + angle2) <= sympy.pi:
                continue

            adj_edge_1 = sympy.Line(adj_pt_1, edge_pt_1)
            adj_edge_2 = sympy.Line(edge_pt_2, adj_pt_2)
            intersect = adj_edge_1.intersection(adj_edge_2)[0]

            area = sympy.N(sympy.Triangle(edge_pt_1, intersect, edge_pt_2).area)
            if best_candidate and best_candidate[1] < area:
                continue

            better_hull = list(hull)
            better_hull[edge_idx_1] = intersect
            del better_hull[edge_idx_2]
            best_candidate = (better_hull, area)

        if not best_candidate:
            return None

        hull = best_candidate[0]

    return [[int(x), int(y)] for x, y in hull]


def locate_4gon(image):
    kernel = np.ones((3, 3), np.uint8)
    extracted = cv2.morphologyEx(image, cv2.MORPH_CLOSE, kernel=kernel, iterations=3)
    gray = cv2.cvtColor(extracted, cv2.COLOR_BGR2GRAY)

    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    blurred = cv2.medianBlur(blurred, 3)
    edges = cv2.Canny(blurred, 65, 165)

    contours, _ = cv2.findContours(edges.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contours_hull = [
        cv2.convexHull(contour)
        for contour in contours
    ]
    contours_hull = sorted(contours_hull, key=cv2.contourArea, reverse=True)

    peri = cv2.arcLength(contours_hull[0], True)
    corners = cv2.approxPolyDP(contours_hull[0], 0.01 * peri, True)

    ngon = appx_best_fit_ngon(corners, n=4)
    if ngon is None:
        return None
    return np.array([[point] for point in ngon], dtype=np.int32)


def find_image_corner(image):
    resized, scale = resize_image(image, size=256)
    height, width = resized.shape[:2]

    default_image_contour = np.array([
        [[0, 0]],
        [[width - 1, 0]],
        [[width - 1, height - 1]],
        [[0, height - 1]]
    ], dtype=np.int32)

    result_4gon = locate_4gon(resized)
    if result_4gon is None:
        return scale_contour(default_image_contour, 1 / scale)

    result_area = cv2.contourArea(result_4gon)
    total_area = cv2.contourArea(default_image_contour)

    if result_area / total_area < 0.25:
        return scale_contour(default_image_contour, 1 / scale)

    return scale_contour(result_4gon, 1 / scale)


def nearest_point(points, target_point):
    distances = np.sqrt(np.sum((points - target_point) ** 2, axis=1))
    nearest_index = np.argmin(distances)
    return points[nearest_index]


def point_distance(p1, p2):
    return np.sqrt(((p1[0] - p2[0]) ** 2) + ((p1[1] - p2[1]) ** 2))


def rotate_bounding_box(rect, width, height):
    rotated = np.zeros((4, 2), dtype='float32')

    rotated[0] = nearest_point(rect, np.array([0, 0]))
    rotated[1] = nearest_point(rect, np.array([0, height]))
    rotated[2] = nearest_point(rect, np.array([width, height]))
    rotated[3] = nearest_point(rect, np.array([width, 0]))
    return rotated


def estimate_perspective_dimension(points):
    width_top = point_distance(points[0], points[3])
    width_bottom = point_distance(points[1], points[2])

    height_left = point_distance(points[0], points[1])
    height_right = point_distance(points[2], points[3])

    estimated_width = int((width_top + width_bottom) / 2)
    estimated_height = int((height_left + height_right) / 2)

    return estimated_height, estimated_width

def unsharp_mask(image, kernel_size=(5, 5), sigma=1.0, amount=1.0, threshold=0):
    blurred = cv2.GaussianBlur(image, kernel_size, sigma)
    sharpened = float(amount + 1) * image - float(amount) * blurred
    sharpened = np.maximum(sharpened, np.zeros(sharpened.shape))
    sharpened = np.minimum(sharpened, 255 * np.ones(sharpened.shape))
    sharpened = sharpened.round().astype(np.uint8)
    if threshold > 0:
        low_contrast_mask = np.absolute(image - blurred) < threshold
        np.copyto(sharpened, image, where=low_contrast_mask)
    return sharpened

