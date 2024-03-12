import * as logger from "firebase-functions/logger";
import {onObjectFinalized} from "firebase-functions/v2/storage";
import * as path from "path";
import {getStorage} from "firebase-admin/storage";
import sharp = require("sharp");
import * as admin from "firebase-admin";
import {firestore, storage} from "firebase-admin";
import {v4 as uuidv4} from 'uuid';
import {Item, projectSchema} from "./schemas";
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
    const itemId = uuidv4();
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
