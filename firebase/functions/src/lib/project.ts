import {z} from "zod";
import {Timestamp} from "firebase-admin/firestore";
import {firestore} from "firebase-admin";


// type: image/pdf
// page: page number
export const metadataSchema = z.record(z.string());

export const projectChildrenSchema = z.object({
    itemId: z.string().uuid(),
    name: z.string(),
    meta: z.string().optional(),
    preview: z.string().optional(),
});
export type ProjectItem = z.infer<typeof projectChildrenSchema>;

export const projectSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    owner: z.string(),
    timeCreated: z.custom<Timestamp>(),
    timeUpdated: z.custom<Timestamp>(),
    coverImage: z.string().optional(),
    items: z.array(projectChildrenSchema)
});
export type Project = z.infer<typeof projectSchema>;
export type ProjectPreview = Omit<Project, 'items'>;

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

