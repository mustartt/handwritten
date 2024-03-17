import {HarmBlockThreshold, HarmCategory, VertexAI} from "@google-cloud/vertexai";

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

export async function extractTextGemini(imageData: string) {
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
    return response.candidates[0].content.parts[0].text;
}

export async function formatAsMarkdown(text: string) {
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