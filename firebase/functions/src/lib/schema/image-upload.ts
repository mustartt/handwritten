import {z} from 'zod';

export const metadataSchema = z.record(z.string());

export type ImageUploadObjectMetadata = z.infer<typeof imageUploadObjectMetadataSchema>;
export const imageUploadObjectMetadataSchema = z.object({
    projectId: z.string().uuid(),
    fileId: z.string().uuid(),
    owner: z.string(),
    filename: z.string(),
    metadata: z.string().transform(metadataSchema.parse)
});

