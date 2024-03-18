import {z} from 'zod';
import {Timestamp} from 'firebase/firestore';

const itemOutputSchema = z.object({
    extractedText: z.string()
});

const pointSchema = z.object({
    x: z.number(),
    y: z.number()
});
export type ScanPoint = z.infer<typeof pointSchema>;

const scanBorderSchema = z.object({
    topLeft: pointSchema,
    topRight: pointSchema,
    bottomLeft: pointSchema,
    bottomRight: pointSchema,
});

export type ScanBorder = z.infer<typeof scanBorderSchema>;

const baseItemSchema = z.object({
    id: z.string().uuid(),
    filename: z.string(),
    owner: z.string(),
    timeUploaded: z.custom<Timestamp>(),
    parentProject: z.string().uuid(),
    output: itemOutputSchema
});

const imageItemSchema = baseItemSchema.extend({
    type: z.literal('image'),
    image: z.object({
        scanBorder: scanBorderSchema.optional(),
        imageUri: z.string(),
        scanUri: z.string().optional(),
        documentType: z.union([
            z.literal('scan_notes'),
            z.literal('scan_document'),
            z.literal('scan_figure')
        ])
    })
});

const pdfPageItemSchema = baseItemSchema.extend({
    type: z.literal('pdf'),
    pdf: z.object({
        scanBorder: scanBorderSchema.optional(),
        pageNumber: z.number().positive(),
        imageUri: z.string(),
        scanUri: z.string().optional(),
        documentType: z.union([
            z.literal('scan_notes'),
            z.literal('scan_document'),
            z.literal('scan_figure')
        ]),
    })
});

export const itemSchema = z.union([imageItemSchema, pdfPageItemSchema]);
export type Item = z.infer<typeof itemSchema>;

export const projectItemSchema = z.object({
    itemId: z.string().uuid(),
    name: z.string(),
    meta: z.string().optional(),
    preview: z.string().optional(),
});
export type ProjectItem = z.infer<typeof projectItemSchema>;

export const projectSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    owner: z.string(),
    timeCreated: z.coerce.date(),
    timeUpdated: z.coerce.date(),
    coverImage: z.string().optional(),
    items: z.array(projectItemSchema)
});
export type Project = z.infer<typeof projectSchema>;
export type ProjectPreview = Omit<Project, 'items'>;
