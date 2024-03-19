import {PromisePool} from "$lib/promise-pool";
import {v4 as uuidv4} from "uuid";
import {get} from "svelte/store";
import {type FirebaseStorage, ref, uploadBytesResumable, type UploadMetadata} from "firebase/storage";
import {getCurrentUser} from "$lib/firebase.client";
import {fileQueueState} from "$lib/store/upload";
import {z} from 'zod';

export type UploadObjectMetadata = z.infer<typeof uploadObjectMetadataSchema>;
const uploadObjectMetadataSchema = z.object({
    projectId: z.string().uuid(),
    fileId: z.string().uuid(),
    owner: z.string(),
    filename: z.string(),
    metadata: z.record(z.any())
});

const unparsed = z.object({
    projectId: z.string().uuid(),
    fileId: z.string().uuid(),
    owner: z.string(),
    filename: z.string(),
    metadata: z.string().default("{}")
});

export const UploadObjectMetadataSerde = {
    serialize: function (data: UploadObjectMetadata): Record<string, string> {
        return {
            ...data,
            metadata: JSON.stringify(data.metadata)
        };
    },
    deserialize: function (data: unknown): UploadObjectMetadata {
        const result = unparsed.parse(data);
        return {
            ...result,
            metadata: JSON.parse(result.metadata)
        };
    },
};

const defaultUploadPool = new PromisePool(2);
const fileUploadCompletionPool = new PromisePool(1);

function validateFile(file: File) {
    if (!file.type.startsWith('image/')) {
        throw new Error("Invalid media type");
    }
    if (file.size >= 1e+7) {
        throw new Error("Upload size exceeds 10Mb");
    }
}

function createUploadEntry(newFileId: string, file: File) {
    fileQueueState.update(state => {
        state.set(newFileId, {
            id: newFileId,
            name: file.name,
            timeAdded: new Date(),
            fileHandle: file,
            uploadHandle: null,
            progress: {
                status: "queued",
                error: null,
                progress: 0,
            },
        });
        return state;
    });
}

export async function createFileUpload(storage: FirebaseStorage, file: File, projectId: string) {
    validateFile(file);

    const newFileId = uuidv4();
    console.log('Created file upload', file.name, projectId, newFileId);
    createUploadEntry(newFileId, file);

    const state = get(fileQueueState);
    const entry = state.get(newFileId);
    if (entry === undefined) {
        throw new Error("Invalid upload state");
    }

    // add upload metadata
    const user = await getCurrentUser();
    if (!user?.uid) {
        throw new Error('missing uid');
    }

    const customMetadata: UploadObjectMetadata = {
        owner: user.uid,
        fileId: newFileId,
        projectId: projectId,
        filename: file.name,
        metadata: {
            contentType: file.type
        }
    };
    const metadata: UploadMetadata = {
        contentType: file.type,
        customMetadata: UploadObjectMetadataSerde.serialize(customMetadata),
    };

    defaultUploadPool.submit(async () => {
        const storageRef = ref(storage, newFileId);
        const task = uploadBytesResumable(storageRef, entry.fileHandle, metadata);
        entry.uploadHandle = task;

        await new Promise<void>(resolve => {
            task.on("state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                    switch (snapshot.state) {
                        case "running":
                            fileQueueState.update(state => {
                                const entry = state.get(newFileId);
                                if (entry !== undefined) {
                                    entry.progress.progress = progress;
                                    entry.progress.status = "uploading";
                                    entry.progress.error = null;
                                }
                                return state;
                            });
                            break;
                        case "paused":
                            fileQueueState.update(state => {
                                const entry = state.get(newFileId);
                                if (entry !== undefined) {
                                    entry.progress.status = "paused";
                                    entry.progress.error = null;
                                }
                                return state;
                            });
                            break;
                    }
                },
                (error) => {
                    fileQueueState.update(state => {
                        const entry = state.get(newFileId);
                        if (entry !== undefined) {
                            entry.progress.status = "failed";
                            entry.progress.error = error.message;
                        }
                        return state;
                    });
                    resolve();
                },
                () => {
                    fileQueueState.update(state => {
                        const entry = state.get(newFileId);
                        if (entry !== undefined) {
                            entry.progress.progress = 1;
                            entry.progress.status = "completed";
                            entry.progress.error = null;
                        }
                        return state;
                    });
                    setTimeout(() => {
                        fileUploadCompletionPool.submit(async () => {
                            deleteFileUpload(newFileId);
                            await new Promise(resolve => setTimeout(resolve, 500));
                        });
                    }, 10_000);
                    resolve();
                });
        });
    });
}

export function cancelFileUpload(id: string) {
    const state = get(fileQueueState);
    const entry = state.get(id);
    if (entry === undefined) return;
    entry.uploadHandle?.cancel();
}

export function pauseFileUpload(id: string) {
    const state = get(fileQueueState);
    const entry = state.get(id);
    if (entry === undefined) return;

    entry.uploadHandle?.pause();
}

export function resumeFileUpload(id: string) {
    const state = get(fileQueueState);
    const entry = state.get(id);
    if (entry === undefined) return;
    entry.uploadHandle?.resume();
}

export function deleteFileUpload(id: string) {
    cancelFileUpload(id);
    fileQueueState.update(state => {
        state.delete(id);
        return state;
    });
}
