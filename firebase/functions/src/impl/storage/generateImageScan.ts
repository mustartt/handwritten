import {onObjectFinalized} from "firebase-functions/v2/storage";
import * as logger from "firebase-functions/logger";
import {getStorage} from "firebase-admin/storage";
import * as path from "path";

export const generateImageScan = onObjectFinalized({}, async (event) => {
    const filePath = event.data.name;
    const contentType = event.data.contentType;
    const metadata = event.data.metadata;

    if (!filePath.startsWith("preview")) {
        return logger.log("Not an newly uploaded image.");
    }
    if (!contentType || !contentType.startsWith("image/")) {
        return logger.warn("This is not an image.");
    }
    if (!metadata) {
        return logger.warn("no metadata", filePath);
    }

    const filename = path.basename(filePath);
    const bucket = getStorage().bucket();
    const downloadResponse = await bucket.file(`preview/${filename}`).download();
    const imageBase64 = downloadResponse[0].toString('base64');


});
