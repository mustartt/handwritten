import {z} from 'zod';

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

const notebookDefaultCover = 'https://images.unsplash.com/photo-1550895030-823330fc2551?q=80&w=1024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
export const projectSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    owner: z.string(),
    timeCreated: z.date(),
    timeUpdated: z.date(),
    coverImage: z.string().default(notebookDefaultCover),
    items: z.array(z.object({
        name: z.string(),
        itemId: z.string().uuid()
    }))
});
export type Project = z.infer<typeof projectSchema>;
