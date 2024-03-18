import {onMessagePublished} from "firebase-functions/v2/pubsub";
import * as logger from "firebase-functions/logger";
import {z} from "zod";
import {projectFileStatus} from "../../lib/project";

export const updateProjectFileStatusSchema = z.object({
    projectId: z.string().uuid(),
    projectItemId: z.string().uuid(),
    userId: z.string(),
    status: projectFileStatus,
    metadata: z.record(z.any()),
});
export type UpdateProjectItemStatus = z.infer<typeof updateProjectFileStatusSchema>;

export const updateProjectItemStatus = onMessagePublished(
    'notify-file-process-status',
    async (event) => {
        logger.info(event.data.message.messageId, event.data.message.json);
        const request = updateProjectFileStatusSchema.parse(event.data.message.json);
        logger.info("parsed event", request);
    });
