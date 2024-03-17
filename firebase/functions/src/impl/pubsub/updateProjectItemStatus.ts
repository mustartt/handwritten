import {onMessagePublished} from "firebase-functions/v2/pubsub";
import * as logger from "firebase-functions/logger";
import {z} from "zod";
import {metadataSchema, projectItemStatus} from "../../lib/project";

export const updateProjectItemStatusSchema = z.object({
    projectId: z.string().uuid(),
    projectItemId: z.string().uuid(),
    userId: z.string(),
    status: projectItemStatus,
    metadata: metadataSchema,
});
export type UpdateProjectItemStatus = z.infer<typeof updateProjectItemStatusSchema>;

export const updateProjectItemStatus = onMessagePublished(
    'notify-file-process-status',
    async (event) => {
        logger.info(event.data.message.messageId, event.data.message.json);
        const request = updateProjectItemStatusSchema.parse(event.data.message.json);
        logger.info("parsed event", request);
    });
