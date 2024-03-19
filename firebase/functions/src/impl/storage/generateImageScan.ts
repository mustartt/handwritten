import {onObjectFinalized} from "firebase-functions/v2/storage";
import * as logger from "firebase-functions/logger";
import {getStorage} from "firebase-admin/storage";
import {scan} from "../../lib/scan-api";
import {
    UploadObjectMetadata,
    UploadObjectMetadataSerde,
} from "../../lib/image-upload";
import {UpdateProjectFileStatus} from "../pubsub/updateProjectFileStatus";
import {publishNotifyProjectItemStatus} from "../../lib/pubsub";
import {Bucket} from "@google-cloud/storage";

async function saveScanToStorage(bucket: Bucket,
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

export const generateImageScan = onObjectFinalized({
    bucket: 'hand-written-prod-preview',
    cpu: 1,
    memory: '512MiB',
    minInstances: 0,
    maxInstances: 3
}, async (event) => {
    const filePath = event.data.name;
    const contentType = event.data.contentType;
    const metadata = event.data.metadata;

    if (!contentType || !contentType.startsWith("image/")) {
        return logger.warn("This is not an image.");
    }
    if (!metadata) {
        return logger.warn("no metadata", filePath);
    }

    const parsedMetadata = UploadObjectMetadataSerde.deserialize(metadata);

    const bucket = getStorage().bucket(event.data.bucket);
    const downloadResponse = await bucket.file(parsedMetadata.fileId).download();
    const imageBase64 = downloadResponse[0].toString('base64');

    const docType = 'scan_document';
    const {scanBorder, imageBuffer} = await scan(imageBase64, docType);
    const newMetadata = {...parsedMetadata, scanBorder};

    const targetBucket = getStorage().bucket('hand-written-prod-scan');
    const url = await saveScanToStorage(targetBucket, parsedMetadata.fileId, imageBuffer, newMetadata);

    const data: UpdateProjectFileStatus = {
        projectId: parsedMetadata.projectId,
        fileId: parsedMetadata.fileId,
        userId: parsedMetadata.owner,
        metadata: {
            scan: url,
            scanBorder: scanBorder,
            scanType: docType
        },
        status: 'scanned'
    };
    await publishNotifyProjectItemStatus(data);
});
