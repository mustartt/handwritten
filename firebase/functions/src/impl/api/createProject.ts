import {HttpsError, onCall} from "firebase-functions/v2/https";
import {parseSchema, requireAuth} from "../../lib/utils";
import {getUserUsage} from "../../lib/quotas";
import {firestore} from "firebase-admin";
import {z} from "zod";
import {Project} from "../../lib/project";
import {Timestamp} from "firebase-admin/firestore";

export const createProjectRequestSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(3).max(256)
});

export const createProject = onCall(
    {cors: true},
    async (request) => {
        const auth = requireAuth(request);
        const data = parseSchema(request, createProjectRequestSchema);

        const {limitConfig, projectUsage} = await getUserUsage(auth.uid);
        if (projectUsage.projectCount >= limitConfig.projectLimit) {
            throw new HttpsError('resource-exhausted', 'Project count limit reached');
        }

        const projectData: Project = {
            id: data.id,
            name: data.name,
            owner: auth.uid,
            timeCreated: Timestamp.now(),
            timeUpdated: Timestamp.now(),
            items: [],
        };

        const db = firestore();
        await db.runTransaction(async (txn) => {
            const projectRef = db.doc(`projects/${data.id}`);
            const projectDoc = await txn.get(projectRef);
            if (projectDoc.exists) {
                throw new HttpsError('already-exists', 'Project already exists');
            }
            txn.create(projectRef, projectData);
        });
    });

