import {z} from "zod";
import {ScanBorder, scanBorderSchema} from "./image";
import {v4 as uuidv4} from "uuid";

export const documentTypeSchema = z.union([
    z.literal('scan_notes'),
    z.literal('scan_document'),
    z.literal('scan_figure')
]);

export const scanRequestSchema = z.object({
    itemId: z.string().uuid(),
    scanBorder: scanBorderSchema.optional(),
    settings: z.object({
        documentType: documentTypeSchema
    })
});

export type ScanImageRequest = z.infer<typeof scanRequestSchema>;

export const scanApiResponseSchema = z.object({
    id: z.string().uuid(),
    image_data: z.string(),
    scan_border: z.object({
        top_left: z.array(z.number()),
        top_right: z.array(z.number()),
        bottom_left: z.array(z.number()),
        bottom_right: z.array(z.number()),
    })
});

export type ScanApiImageResponse = z.infer<typeof scanApiResponseSchema>;

function formatScanBorder(border: ScanBorder) {
    return {
        top_left: [border.topLeft.x, border.topLeft.y],
        top_right: [border.topRight.x, border.topRight.y],
        bottom_left: [border.bottomLeft.x, border.bottomLeft.y],
        bottom_right: [border.bottomRight.x, border.bottomRight.y],
    };
}

function convertToScanBorder(border: ScanApiImageResponse['scan_border']): ScanBorder {
    return {
        topLeft: {x: border.top_left[0], y: border.top_left[1]},
        topRight: {x: border.top_right[0], y: border.top_right[1]},
        bottomLeft: {x: border.bottom_left[0], y: border.bottom_left[1]},
        bottomRight: {x: border.bottom_right[0], y: border.bottom_right[1]},
    };
}

export async function scan(imageBase64: string, scanBorder: ScanBorder, documentType: string) {
    const requestBody = {
        id: uuidv4(),
        scan_type: documentType,
        image_url: 'data:image/jpeg;base64,' + imageBase64,
        ...(scanBorder ? {scan_border: formatScanBorder(scanBorder)} : {})
    };
    const scanResultResponse = await fetch('https://docscanner-krqk5btmpq-uc.a.run.app/api/v1/image/scan', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
    });
    const scanResult = scanApiResponseSchema.parse(await scanResultResponse.json());

    const bufferHeader = 'data:image/jpeg;base64,';
    const scanBuffer = Buffer.from(scanResult.image_data.substring(bufferHeader.length), 'base64');

    return {
        scanBorder: convertToScanBorder(scanResult.scan_border),
        imageBuffer: scanBuffer
    };
}
