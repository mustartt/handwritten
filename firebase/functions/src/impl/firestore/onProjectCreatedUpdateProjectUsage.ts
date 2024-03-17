import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {parseSchema} from "../../lib/utils";
import {projectSchema, updateProjectUsage} from "../../lib/project";

export const onProjectCreatedUpdateProjectUsage = onDocumentCreated(
    '/projects/{projectId}',
    async (event) => {
        const {data: snapshot} = event;
        if (!snapshot) {
            logger.warn('No snapshot data in event');
            return;
        }
        const data = parseSchema(snapshot.data(), projectSchema);
        await updateProjectUsage(data.owner);
    });
