import {PubSub} from "@google-cloud/pubsub";
import {UpdateProjectItemStatus} from "../impl/pubsub/updateProjectItemStatus";
import * as logger from "firebase-functions/logger";

export const pubsub = new PubSub();

export async function publishNotifyProjectItemStatus(data: UpdateProjectItemStatus) {
    const messageId = await pubsub
        .topic('notify-file-process-status')
        .publishMessage({json: data});
    logger.info('Published', messageId, data);
    return messageId;
}
