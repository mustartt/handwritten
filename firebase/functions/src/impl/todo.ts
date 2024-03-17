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


import {z} from 'zod';
import {Timestamp} from 'firebase-admin/firestore';


export const itemSchema = z.union([imageItemSchema, pdfPageItemSchema]);
export type Item = z.infer<typeof itemSchema>;

