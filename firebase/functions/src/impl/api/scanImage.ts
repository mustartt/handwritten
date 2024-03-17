import {ScanBorder, scanBorderSchema} from "../../lib/image";
import {z} from "zod";
import {HttpsError, onCall} from "firebase-functions/v2/https";
import {firestore} from "firebase-admin";
import {getStorage} from "firebase-admin/storage";
import {v4 as uuidv4} from 'uuid';
import {projectItemSchema} from "$lib/projectItem";

export const scanApiRequestSchema = z.object({
    itemId: z.string().uuid(),
    scanBorder: scanBorderSchema.optional(),
    settings: z.object({
        documentType: z.union([
            z.literal('scan_notes'),
            z.literal('scan_document'),
            z.literal('scan_figure')
        ]),
    })
});

export type ScanApiImageRequest = z.infer<typeof scanApiRequestSchema>;

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


export const scanImage = onCall(
    {cors: true,},
    async (request) => {
        const {itemId, scanBorder, settings} = scanApiRequestSchema.parse(request.data);
        const uid = request.auth?.uid;
        if (!uid) {
            return new HttpsError('unauthenticated', 'not logged in');
        }

        const db = firestore();

        const itemRef = db.doc(`items/${itemId}`);
        const itemDoc = await itemRef.get();
        if (!itemDoc.exists) {
            return new HttpsError('not-found', 'item not found');
        }
        const itemData = projectItemSchema.parse(itemDoc.data());

        const bucket = getStorage().bucket();
        const downloadResponse = await bucket.file(`preview/${itemId}`).download();
        const imageBase64 = downloadResponse[0].toString('base64');

        let requestBody = {
            id: uuidv4(),
            scan_type: settings.documentType,
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

        const file = bucket.file(`scan/${itemId}`);
        await file.save(scanBuffer, {
            metadata: {
                contentType: 'image/jpeg',
            }
        });
        await file.makePublic();

        return {
            scanUri: file.publicUrl(),
            scanBorder: convertToScanBorder(scanResult.scan_border)
        };
    });