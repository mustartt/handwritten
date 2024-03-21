import {z} from "zod";
import {Timestamp} from "firebase/firestore";
import {metadataSchema} from "$lib/schemas/project";

const pointSchema = z.object({
    x: z.number(),
    y: z.number()
});
export type ScanPoint = z.infer<typeof pointSchema>;

export const scanBorderSchema = z.object({
    topLeft: pointSchema,
    topRight: pointSchema,
    bottomLeft: pointSchema,
    bottomRight: pointSchema,
});

export type ScanBorder = z.infer<typeof scanBorderSchema>;

const fileOutputSchema = z.object({
    extractedText: z.string()
});

const imageSchema = z.object({
    scanBorder: scanBorderSchema.optional(),
    imageUrl: z.string(),
});

const scanSchema = z.object({
    scanUrl: z.string().optional(),
    settings: z.object({
        documentPreset: z.union([
            z.literal('scan_notes'),
            z.literal('scan_document'),
            z.literal('scan_figure')
        ]),
    })
});

export const projectFileSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    owner: z.string(),
    timeUploaded: z.custom<Timestamp>(),
    parentProject: z.string().uuid(),
    metadata: metadataSchema,
    image: imageSchema.optional(),
    scan: scanSchema.optional(),
    output: fileOutputSchema.optional(),
});
