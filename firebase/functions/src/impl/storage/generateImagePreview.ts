import {onObjectFinalized} from "firebase-functions/v2/storage";
import * as logger from "firebase-functions/logger";
import {getStorage} from "firebase-admin/storage";
import {Bucket} from "@google-cloud/storage";
import sharp = require("sharp");
import {UpdateProjectFileStatus} from "../pubsub/updateProjectFileStatus";
import {publishNotifyProjectItemStatus} from "../../lib/pubsub";
import {
    UploadObjectMetadata,
    UploadObjectMetadataSerde,
} from "../../lib/image-upload";

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

async function savePreviewToStorage(bucket: Bucket,
                                    id: string,
                                    image: Buffer,
                                    metadata: UploadObjectMetadata) {
    const file = bucket.file(id);
    await file.save(image, {
        metadata: {
            contentType: 'image/jpeg',
            metadata: UploadObjectMetadataSerde.serialize(metadata)
        }
    });
    await file.makePublic();
    return file.publicUrl();
}

export const generateImagePreview = onObjectFinalized({
    bucket: 'hand-written-prod-image',
    cpu: 1,
    memory: '512MiB',
    minInstances: 0,
    maxInstances: 3,
}, async (event) => {
    const filePath = event.data.name;
    const contentType = event.data.contentType;
    const metadata = event.data.metadata;

    if (!contentType || !contentType.startsWith("image/")) {
        return logger.warn("This is not an image.");
    }
    if (!metadata) {
        return logger.error("no metadata", filePath);
    }

    const parsedMetadata = UploadObjectMetadataSerde.deserialize(metadata);

    const bucket = getStorage().bucket(event.data.bucket);
    const downloadResponse = await bucket.file(filePath).download();
    const imageBuffer = downloadResponse[0];

    const previewBuffer = await scaleImage(imageBuffer);

    const targetBucket = getStorage().bucket('hand-written-prod-preview');
    const url = await savePreviewToStorage(targetBucket, parsedMetadata.fileId, previewBuffer, parsedMetadata);

    const data: UpdateProjectFileStatus = {
        projectId: parsedMetadata.projectId,
        fileId: parsedMetadata.fileId,
        userId: parsedMetadata.owner,
        metadata: {
            preview: url
        },
        status: 'preview'
    };
    await publishNotifyProjectItemStatus(data);
});
