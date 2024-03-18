import {z} from 'zod';


export type UploadObjectMetadata = z.infer<typeof uploadObjectMetadataSchema>;
const uploadObjectMetadataSchema = z.object({
    projectId: z.string().uuid(),
    fileId: z.string().uuid(),
    owner: z.string(),
    filename: z.string(),
    metadata: z.record(z.any())
});

const unparsed = z.object({
    projectId: z.string().uuid(),
    fileId: z.string().uuid(),
    owner: z.string(),
    filename: z.string(),
    metadata: z.string().default("{}")
});

export const UploadObjectMetadataSerde = {
    serialize: function (data: UploadObjectMetadata): Record<string, string> {
        return {
            ...data,
            metadata: JSON.stringify(data.metadata)
        };
    },
    deserialize: function (data: unknown): UploadObjectMetadata {
        const result = unparsed.parse(data);
        return {
            ...result,
            metadata: JSON.parse(result.metadata)
        };
    },
};

