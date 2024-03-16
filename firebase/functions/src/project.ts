import {z} from "zod";
import {Timestamp} from "firebase-admin/lib/firestore";

export const projectItemSchema = z.object({
    itemId: z.string().uuid(),
    name: z.string(),
    meta: z.string().optional(),
    preview: z.string().optional(),
});
export type ProjectItem = z.infer<typeof projectItemSchema>;

export const projectSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(3, "Name must be at least 3 characters"),
    owner: z.string(),
    timeCreated: z.custom<Timestamp>(),
    timeUpdated: z.custom<Timestamp>(),
    coverImage: z.string().optional(),
    items: z.array(projectItemSchema)
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectPreview = Omit<Project, 'items'>;

// quotas/$uid
//      limitConfig
//      project
//      projectUsage (collection)
//          $projectId
//      scanUsage (collection)
//          $month
//      ocrUsage (collection)
//          $month
//      visionAiUsage (collection)
//          $month

export const limitConfigSchema = z.object({
    projectLimit: z.number().nonnegative(),
    itemPerProjectLimit: z.number().nonnegative(),
    accountStorageLimit: z.number().nonnegative(),
    documentScanLimit: z.number().nonnegative(),
    extractTextOCRLimit: z.number().nonnegative(),
    extractTextAILimit: z.number().nonnegative(),
});

async function createProject(projectId: string, uid: string, name: string) {

}

async function deleteProject(projectId: string, uid: string) {

}
