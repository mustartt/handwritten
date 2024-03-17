import {CallableRequest, HttpsError} from "firebase-functions/lib/v2/providers/https";
import {z, ZodSchema} from "zod";

export function requireAuth(request: CallableRequest) {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Not authenticated');
    }
    return request.auth;
}

export function parseSchema<T extends ZodSchema>(data: unknown, schema: T) {
    if (data === undefined) {
        throw new HttpsError('internal', 'data undefined');
    }
    const parseResult = schema.safeParse(data);
    if (!parseResult.success) {
        throw new HttpsError('internal', parseResult.error.message);
    }
    return parseResult.data as z.infer<T>;
}