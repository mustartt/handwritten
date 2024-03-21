import {onMessagePublished} from "firebase-functions/v2/pubsub";
import * as logger from "firebase-functions/logger";
import {undefined, z} from "zod";
import {projectFileStatus, projectSchema} from "../../lib/project";
import {firestore} from "firebase-admin";
import {Timestamp, Transaction} from "firebase-admin/firestore";
import {ProjectFile} from "../../lib/project-file";
import {HttpsError} from "firebase-functions/v2/https";

export const updateProjectFileStatusSchema = z.object({
    projectId: z.string().uuid(),
    fileId: z.string().uuid(),
    userId: z.string(),
    status: projectFileStatus,
    metadata: z.record(z.any()),
});
export type UpdateProjectFileStatus = z.infer<typeof updateProjectFileStatusSchema>;

async function validateProject(projectRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>, request: UpdateProjectFileStatus) {
    const projDoc = await projectRef.get();
    if (!projDoc.exists) {
        throw new HttpsError('not-found', 'project not found');
    }
    const projData = projectSchema.parse(projDoc.data());
    if (projData.owner !== request.userId) {
        throw new HttpsError('permission-denied', 'does not own project');
    }
    return projData;
}

async function handleUploadedStatus(db: firestore.Firestore, txn: Transaction, request: UpdateProjectFileStatus) {
    const projectRef = db.doc(`projects/${request.projectId}`);
    const fileRef = db.doc(`projects/${request.projectId}/files/${request.fileId}`);
    const projData = await validateProject(projectRef, request);

    const name = request.metadata['filename'] || 'Unnamed File';
    projData.items.push({
        fileId: request.fileId,
        name: name,
        status: 'uploaded',
        metadata: {},
    });
    const file: ProjectFile = {
        id: request.fileId,
        metadata: {},
        name: name,
        owner: request.userId,
        parentProject: request.projectId,
        timeUploaded: Timestamp.now(),
    };

    txn.create(fileRef, file);
    txn.update(projectRef, {
        items: projData.items
    });
}

async function handlePreviewStatus(db: firestore.Firestore, txn: Transaction, request: UpdateProjectFileStatus) {
    const projectRef = db.doc(`projects/${request.projectId}`);
    const fileRef = db.doc(`projects/${request.projectId}/files/${request.fileId}`);
    const projData = await validateProject(projectRef, request);

    const newItems = projData.items.map((item) => {
        if (item.fileId === request.fileId) {
            return {
                ...item,
                preview: request.metadata['preview'],
                status: 'preview'
            };
        }
        return item;
    });

    txn.update(fileRef, {
        'image.imageUrl': request.metadata['preview']
    });
    txn.update(projectRef, {
        items: newItems,
    });
}

async function handleScannedStatus(db: firestore.Firestore, txn: Transaction, request: UpdateProjectFileStatus) {
    const projectRef = db.doc(`projects/${request.projectId}`);
    const fileRef = db.doc(`projects/${request.projectId}/files/${request.fileId}`);
    const projData = await validateProject(projectRef, request);

    const newItems = projData.items.map((item) => {
        if (item.fileId === request.fileId) {
            return {
                ...item,
                status: 'scanned'
            };
        }
        return item;
    });

    txn.update(fileRef, {
        'image.scanBorder': request.metadata['scanBorder'],
        'scan.scanUrl': request.metadata['scan'],
        'scan.settings.documentPreset': request.metadata['scanType']
    });
    txn.update(projectRef, {
        items: newItems,
    });
}

export const updateProjectFileStatus = onMessagePublished(
    'notify-file-process-status',
    async (event) => {
        logger.info(event.data.message.messageId, event.data.message.json);
        try {
            const request = updateProjectFileStatusSchema.parse(event.data.message.json);
            const db = firestore();
            await db.runTransaction(async (txn) => {
                switch (request.status) {
                    case "uploaded": {
                        await handleUploadedStatus(db, txn, request);
                        break;
                    }
                    case "preview": {
                        await handlePreviewStatus(db, txn, request);
                        break;
                    }
                    case "scanned": {
                        await handleScannedStatus(db, txn, request);
                    }
                }
            });
        } catch (err) {
            logger.error(event.data.message.messageId, err);
        }
    });
