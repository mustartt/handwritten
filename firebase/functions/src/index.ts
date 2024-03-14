import * as logger from "firebase-functions/logger";
import {onObjectFinalized} from "firebase-functions/v2/storage";
import {HttpsError, onCall} from "firebase-functions/v2/https";

import * as path from "path";
import {getStorage} from "firebase-admin/storage";
import sharp = require("sharp");
import * as admin from "firebase-admin";
import {firestore, storage} from "firebase-admin";
import {v4 as uuidv4} from 'uuid';
import {
    Item,
    itemSchema,
    projectSchema,
    ScanBorder,
    scanImageRequestSchema,
    ScanImageResponse,
    scanImageResponseSchema
} from "./schemas";
import {Timestamp} from "firebase-admin/firestore";

admin.initializeApp();


export const rescalePreviewImage = onObjectFinalized({}, async (event) => {
    const fileBucket = event.data.bucket;
    const filePath = event.data.name;
    const contentType = event.data.contentType;
    const metadata = event.data.metadata;

    if (!filePath.startsWith("upload")) {
        return logger.log("Not an newly uploaded image.");
    }
    if (!contentType || !contentType.startsWith("image/")) {
        return logger.warn("This is not an image.");
    }

    const fileName = path.basename(filePath);
    const bucket = getStorage().bucket(fileBucket);
    const downloadResponse = await bucket.file(filePath).download();
    const imageBuffer = downloadResponse[0];
    logger.log("Image downloaded!");

    const object = sharp(imageBuffer);
    const imageMetadata = await object.rotate().metadata();
    const isWidthLonger = (imageMetadata.width || 1024) > (imageMetadata.height || 1024);
    const resizeOptions = isWidthLonger
        ? {
            withoutEnlargement: true,
            width: 2048
        }
        : {
            withoutEnlargement: true,
            height: 2048
        };
    const previewBuffer = await sharp(imageBuffer)
        .rotate()
        .resize(resizeOptions)
        .jpeg({
            force: true,
            quality: 85
        })
        .toBuffer();
    logger.log("Preview resized!");

    const thumbFilePath = `preview/${fileName}`;
    await bucket.file(thumbFilePath)
        .save(previewBuffer, {
            metadata: {
                contentType: 'image/jpeg',
                metadata: metadata
            }
        });

    return logger.log("Preview uploaded!");
});

export const createProjectItem = onObjectFinalized({}, async (event) => {
    const filePath = event.data.name;
    const filename = path.basename(filePath);
    const contentType = event.data.contentType;
    const metadata = event.data.metadata;

    if (!filePath.startsWith("preview")) {
        return logger.log("Not an newly uploaded preview.");
    }
    if (!contentType || !contentType.startsWith("image/")) {
        return logger.warn("This is not an image.");
    }
    if (!metadata) {
        return logger.error("Metadata is not defined");
    }

    const previewObject = storage().bucket(event.data.bucket).file(filePath);
    await previewObject.makePublic();
    const publicUrl = previewObject.publicUrl();

    const projectId = metadata['projectId'];
    const db = firestore();
    const itemId = filename;
    await db.runTransaction(async (txn) => {
        const proj = await txn.get(db.doc(`projects/${projectId}`));
        if (!proj.exists) {
            throw new Error('Project does not exists');
        }
        const projectData = projectSchema.parse(proj.data());

        const itemRef = db.doc(`items/${itemId}`);
        txn.update(proj.ref, {
            timeUpdated: Timestamp.now(),
            items: [...projectData.items, {
                itemId,
                name: metadata['filename'],
                preview: publicUrl,
            }],
        });

        const newItem: Item = {
            id: itemId,
            filename: metadata['filename'],
            owner: metadata['user'],
            timeUploaded: Timestamp.now(),
            parentProject: projectId,
            type: 'image',
            image: {
                imageUri: publicUrl,
                documentType: "scan_notes"
            },
            output: {
                extractedText: ''
            }
        };
        txn.create(itemRef, newItem);
    });
});

function formatScanBorder(border: ScanBorder) {
    return {
        top_left: [border.topLeft.x, border.topLeft.y],
        top_right: [border.topRight.x, border.topRight.y],
        bottom_left: [border.bottomLeft.x, border.bottomLeft.y],
        bottom_right: [border.bottomRight.x, border.bottomRight.y],
    };
}

function convertToScanBorder(border: ScanImageResponse['scan_border']): ScanBorder {
    return {
        topLeft: {x: border.top_left[0], y: border.top_left[1]},
        topRight: {x: border.top_right[0], y: border.top_right[1]},
        bottomLeft: {x: border.bottom_left[0], y: border.bottom_left[1]},
        bottomRight: {x: border.bottom_right[0], y: border.bottom_right[1]},
    };
}

export const scanItem = onCall({
        cors: true,
    },
    async (request) => {
        const {itemId, scanBorder, settings} = scanImageRequestSchema.parse(request.data);
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
        const itemData = itemSchema.parse(itemDoc.data());
        if (itemData.type !== 'image') {
            return new HttpsError('unimplemented', 'only supports image right now');
        }

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
        const scanResult = scanImageResponseSchema.parse(await scanResultResponse.json());

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
