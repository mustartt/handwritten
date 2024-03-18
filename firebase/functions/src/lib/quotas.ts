import {undefined, z} from "zod";
import {firestore} from "firebase-admin";
import {parseSchema} from "./utils";

// quotas/$uid
//      limitConfig
//      projectUsage
//      accountUsage
//      fileUsage (collection)
//          $projectId
//      scanUsage (collection)
//          $month
//      ocrUsage (collection)
//          $month
//      visionUsage (collection)
//          $month

export const limitConfigSchema = z.object({
    projectLimit: z.number().nonnegative(),
    itemPerProjectLimit: z.number().nonnegative(),
    accountStorageLimit: z.number().nonnegative(),
    documentScanLimit: z.number().nonnegative(),
    extractTextOCRLimit: z.number().nonnegative(),
    extractTextAILimit: z.number().nonnegative(),
});
export type LimitConfig = z.infer<typeof limitConfigSchema>;

export const projectUsageSchema = z.object({
    projectCount: z.number().nonnegative(),
});
export type ProjectUsage = z.infer<typeof projectUsageSchema>;


export const accountUsageSchema = z.object({
    storageBytes: z.number().nonnegative()
});
export type AccountUsage = z.infer<typeof accountUsageSchema>;

export const userUsageSchema = z.object({
    limitConfig: limitConfigSchema,
    accountUsage: accountUsageSchema,
    projectUsage: projectUsageSchema
});
export type UserUsage = z.infer<typeof userUsageSchema>;

export const fileUsageSchema = z.object({
    fileCount: z.number().nonnegative()
});
export type FileUsage = z.infer<typeof fileUsageSchema>;


export const scanUsageSchema = z.object({
    scanCount: z.number().nonnegative()
});
export type ScanUsage = z.infer<typeof scanUsageSchema>;

export const ocrUsageSchema = z.object({
    ocrCount: z.number().nonnegative()
});
export type OcrUsage = z.infer<typeof ocrUsageSchema>;

export const visionUsageSchema = z.object({
    visionCount: z.number().nonnegative()
});

export type VisionUsage = z.infer<typeof visionUsageSchema>;

export async function getUserUsage(uid: string) {
    const db = firestore();
    const limitDoc = await db.doc(`quotas/${uid}`).get();
    return parseSchema(limitDoc.data(), userUsageSchema);
}

export async function setUserDefaultUsage(uid: string) {
    const db = firestore();
    const limitRef = db.doc(`quotas/${uid}`);

    const defaultUsage: UserUsage = {
        limitConfig: {
            accountStorageLimit: 1e+8,
            documentScanLimit: 10,
            extractTextAILimit: 10,
            extractTextOCRLimit: 10,
            itemPerProjectLimit: 10,
            projectLimit: 10
        },
        projectUsage: {
            projectCount: 0
        },
        accountUsage: {
            storageBytes: 0
        }
    };
    await limitRef.create(defaultUsage);
}

