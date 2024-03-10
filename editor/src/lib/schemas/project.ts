import {z} from 'zod';
import {Timestamp} from 'firebase/firestore';

const itemOutputSchema = z.object({
    extractedText: z.string()
})

const baseItemSchema = z.object({
    id: z.string().uuid(),
    filename: z.string(),
    owner: z.string(),
    timeUploaded: z.date(),
    parentProject: z.string().uuid(),
    output: itemOutputSchema
});

const imageItemSchema = baseItemSchema.extend({
    type: z.literal('image'),
    image: z.object({
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

export const projectSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    owner: z.string(),
    timeCreated: z.custom<Timestamp>(),
    timeUpdated: z.custom<Timestamp>(),
    coverImage: z.string().optional(),
    items: z.array(z.object({
        name: z.string(),
        itemId: z.string().uuid()
    }))
});
export type Project = z.infer<typeof projectSchema>;
export type ProjectPreview = Omit<Project, 'items'>;