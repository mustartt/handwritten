import {HttpsError, onCall} from "firebase-functions/v2/https";
import {HarmBlockThreshold, HarmCategory, VertexAI} from "@google-cloud/vertexai";
import * as logger from "firebase-functions/logger";
import {z} from "zod";
import {getStorage} from "firebase-admin/storage";
import {firestore} from "firebase-admin";
import {itemSchema} from "./schemas";

const vertex_ai = new VertexAI({project: 'hand-written-prod', location: 'us-central1'});
const model = vertex_ai.preview.getGenerativeModel({
    model: 'gemini-1.0-pro-vision-001',
    generation_config: {
        "max_output_tokens": 2048,
        "temperature": 0,
        "top_p": 1,
        "top_k": 1
    },
    safety_settings: [
        {
            "category": HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            "threshold": HarmBlockThreshold.BLOCK_NONE,
        },
        {
            "category": HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            "threshold": HarmBlockThreshold.BLOCK_NONE,
        },
        {
            "category": HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            "threshold": HarmBlockThreshold.BLOCK_NONE,
        },
        {
            "category": HarmCategory.HARM_CATEGORY_HARASSMENT,
            "threshold": HarmBlockThreshold.BLOCK_NONE,
        }
    ],
});


async function extractTextGemini(imageData: string) {
    const prompt = "Please extract all the text in this page of a notebook.\n" +
        " - Use markdown to preserve document hierarchy and extract all labels\n" +
        " - Extract math using with inline $ and block with $$\n" +
        " - return the text as it is no addition comments required\n";
    const req = {
        contents: [
            {
                role: 'user', parts: [
                    {inline_data: {mime_type: 'image/jpeg', data: imageData}},
                    {text: prompt}
                ]
            }]
    };
    const {response} = await model.generateContent(req);
    logger.info(response.usageMetadata);
    return response.candidates[0].content.parts[0].text;
}

async function formatAsMarkdown(text: string) {
    const prompt = "Format the following into markdown.\n---\n";
    const req = {
        contents: [{
            role: 'user',
            parts: [{text: prompt + text}]
        }]
    };
    const {response} = await model.generateContent(req);
    return response.candidates[0].content.parts[0].text;
}

export const extractTextSchema = z.object({
    itemId: z.string().uuid(),
});

export const extractText = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'not authenticated');
    }

    const {itemId} = extractTextSchema.parse(request.data);
    const db = firestore();

    const itemDoc = await db.doc(`items/${itemId}`).get();
    if (!itemDoc.exists) {
        throw new HttpsError('not-found', 'item not found');
    }

    const itemData = itemSchema.parse(itemDoc.data());
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
