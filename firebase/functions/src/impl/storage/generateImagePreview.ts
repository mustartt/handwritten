import {onObjectFinalized} from "firebase-functions/v2/storage";
import * as logger from "firebase-functions/logger";
import {getStorage} from "firebase-admin/storage";
import {Bucket} from "@google-cloud/storage";
import * as path from "path";
import sharp = require("sharp");
import {UpdateProjectItemStatus} from "../pubsub/updateProjectItemStatus";
import {publishNotifyProjectItemStatus, pubsub} from "../../lib/pubsub";

async function scaleImage(imageBuffer: Buffer) {
    const object = sharp(imageBuffer);
    const imageMetadata = await object.rotate().metadata();
    const isWidthLonger = (imageMetadata.width || 1024) > (imageMetadata.height || 1024);
    const resizeOptions = isWidthLonger
        ? {width: 2048}
        : {height: 2048};
    return await sharp(imageBuffer)
        .rotate()
        .resize(resizeOptions)
        .jpeg({
            force: true,
            quality: 85
        })
        .toBuffer();
}

type Metadata = { [key: string]: string }

async function savePreviewToStorage(bucket: Bucket, filename: string,
                                    image: Buffer, metadata: Metadata) {
    const thumbFilePath = `preview/${filename}`;
    await bucket.file(thumbFilePath)
        .save(image, {
            metadata: {
                contentType: 'image/jpeg',
                metadata: metadata
            }
        });
}

export const generateImageScan = onObjectFinalized({}, async (event) => {
    const filePath = event.data.name;
    const contentType = event.data.contentType;
    const metadata = event.data.metadata;

    if (!filePath.startsWith("upload")) {
        return logger.log("Not an newly uploaded image.");
    }
    if (!contentType || !contentType.startsWith("image/")) {
        return logger.warn("This is not an image.");
    }
    if (!metadata) {
        return logger.warn("no metadata", filePath);
    }

    const projectItemId = path.basename(filePath);
    const bucket = getStorage().bucket(event.data.bucket);
    const downloadResponse = await bucket.file(filePath).download();

    const imageBuffer = downloadResponse[0];
    const previewBuffer = await scaleImage(imageBuffer);
    await savePreviewToStorage(bucket, projectItemId, previewBuffer, metadata || {});

    const data: UpdateProjectItemStatus = {
        projectId: metadata['projectId'],
        projectItemId: projectItemId,
        userId: metadata['userId'],
        metadata: {},
        status: 'preview'
    };
    await publishNotifyProjectItemStatus(data);
});
