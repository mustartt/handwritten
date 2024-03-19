import {HttpsError, onCall} from "firebase-functions/v2/https";
import {z} from "zod";
import {getStorage} from "firebase-admin/storage";
import {firestore} from "firebase-admin";
import {extractTextGemini, formatAsMarkdown} from "../../lib/gemini";
import {projectFileSchema} from "../../lib/project-file";


export const extractTextSchema = z.object({
    itemId: z.string().uuid(),
});

export const extractTextVision = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'not authenticated');
    }

    const {itemId} = extractTextSchema.parse(request.data);
    const db = firestore();

    const itemDoc = await db.doc(`items/${itemId}`).get();
    if (!itemDoc.exists) {
        throw new HttpsError('not-found', 'item not found');
    }

    const itemData = projectFileSchema.parse(itemDoc.data());
    if (itemData.owner !== request.auth.uid) {
        throw new HttpsError('permission-denied', 'does not own this item');
    }

    const bucket = getStorage().bucket();
    const downloadResponse = await bucket.file(`scan/${itemId}`).download();
    const imageBuffer = downloadResponse[0].toString('base64');

    const resultText = await extractTextGemini(imageBuffer) || '';
    const markdown = await formatAsMarkdown(resultText) || '';

    return {
        result: markdown
    };
});
