import {onObjectFinalized} from "firebase-functions/v2/storage";
import * as logger from "firebase-functions/logger";
import {UpdateProjectItemStatus} from "../pubsub/updateProjectItemStatus";
import {publishNotifyProjectItemStatus, pubsub} from "../../lib/pubsub";
import * as path from "path";

export const notifyUpload = onObjectFinalized({},
    async (event) => {
        const filePath = event.data.name;
        const contentType = event.data.contentType;
        const metadata = event.data.metadata;

        if (!filePath.startsWith("upload")) {
            return logger.log("not an uploaded file skipping");
        }
        if (!contentType || !contentType.startsWith("image")) {
            return logger.log("not an uploaded image skipping");
        }
        if (!metadata) {
            return logger.warn("no metadata", filePath);
        }

        const projectItemId = path.basename(filePath);
        const data: UpdateProjectItemStatus = {
            projectId: metadata['projectId'],
            projectItemId: projectItemId,
            userId: metadata['userId'],
            metadata: {},
            status: 'uploaded'
        };
        await publishNotifyProjectItemStatus(data);
    });
