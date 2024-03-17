import {z} from "zod";

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
