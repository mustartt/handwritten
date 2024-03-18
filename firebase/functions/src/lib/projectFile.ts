import {z} from "zod";
import {Timestamp} from "firebase-admin/firestore";
import {scanBorderSchema} from "./image";
import {metadataSchema} from "./project";


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
    image: imageSchema,
    scan: scanSchema,
    output: fileOutputSchema,
});
