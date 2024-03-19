import {onObjectFinalized} from "firebase-functions/v2/storage";
import * as logger from "firebase-functions/logger";
import {UpdateProjectFileStatus} from "../pubsub/updateProjectFileStatus";
import {publishNotifyProjectItemStatus} from "../../lib/pubsub";
import {UploadObjectMetadataSerde} from "../../lib/image-upload";

export const notifyUpload = onObjectFinalized({
    bucket: 'hand-written-prod-image',
    cpu: 1,
    memory: '256MiB',
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
    const data: UpdateProjectFileStatus = {
        projectId: parsedMetadata.projectId,
        fileId: parsedMetadata.fileId,
        userId: parsedMetadata.owner,
        metadata: {
            filename: parsedMetadata.filename
        },
        status: 'uploaded'
    };
    await publishNotifyProjectItemStatus(data);
});
