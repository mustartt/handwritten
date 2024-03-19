import {z} from "zod";
import {Timestamp} from "firebase-admin/firestore";
import {firestore} from "firebase-admin";


// type: image/pdf
// page: page number
export const metadataSchema = z.record(z.string());

export const projectFileStatus = z.union([
    z.literal('uploaded'),
    z.literal('preview'),
    z.literal('scanned'),
]);


export const projectFilePreviewSchema = z.object({
    fileId: z.string().uuid(),
    name: z.string(),
    metadata: metadataSchema,
    status: projectFileStatus,
    preview: z.string().optional(),
});

export const projectSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    owner: z.string(),
    timeCreated: z.custom<Timestamp>(),
    timeUpdated: z.custom<Timestamp>(),
    coverImage: z.string().optional(),
    items: z.array(projectFilePreviewSchema)
});
export type Project = z.infer<typeof projectSchema>;

async function getProjectCount(uid: string) {
    const db = firestore();
    const query = db.collection('projects')
        .where('owner', '==', uid)
        .count();
    const result = await query.get();
    return result.data().count;
}

export async function updateProjectUsage(ownerId: string) {
    const db = firestore();
    const count = await getProjectCount(ownerId);
    const userUsageRef = db.doc(`quotas/${ownerId}`);
    await userUsageRef.update({
        'projectUsage.projectCount': count
    });
    return count;
}

