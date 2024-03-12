import {derived, get, writable} from "svelte/store";
import type {UploadTask} from "firebase/storage";
import {PromisePool} from "$lib/promise-pool";
import {v4 as uuidv4} from "uuid";
import {ref, uploadBytesResumable, type UploadMetadata} from "firebase/storage";
import {getCurrentUser, storage} from "$lib/firebase.client";

export type FileUploadStatus = 'queued' | 'paused' | 'uploading' | 'failed' | 'completed';

export interface FileUploadProgress {
    status: FileUploadStatus,
    error: string | null;
    progress: number,
}

interface Document {
    id: string;
    name: string;
    timeAdded: Date;
    fileHandle: File;
    uploadHandle: UploadTask | null;
    progress: FileUploadProgress;
}

interface CustomUploadMetadata {
    [key: string]: string;

    user: string;
    projectId: string;
    filename: string;
    contentType: string;
}

export const fileQueueState = writable<Map<string, Document>>(new Map());
export const fileQueueView = derived(fileQueueState, ($store) => {
    const items = Array.from($store.entries());
    items.sort((a, b) => {
        if (a[1].timeAdded < b[1].timeAdded) {
            return -1;
        }
        return 1;
    });
    return items.map(item => item[1]);
});

const defaultUploadPool = new PromisePool(2);
const fileUploadCompletionPool = new PromisePool(1);

export async function createFileUpload(file: File, projectId: string) {
    const handle = uuidv4();
    console.log('Created file upload', handle, file.name, projectId);
    fileQueueState.update(state => {
        state.set(handle, {
            id: handle,
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

    const state = get(fileQueueState);
    const entry = state.get(handle);
    if (entry === undefined) return;

    // add upload metadata
    defaultUploadPool.submit(async () => {
        const storageRef = ref(storage, `upload/${handle}`);
        const user = await getCurrentUser();
        if (!user?.uid) {
            throw new Error('missing uid');
        }

        const customMetadata: CustomUploadMetadata = {
            user: user.uid,
            projectId: projectId,
            filename: file.name,
            contentType: file.type
        };

        const metadata: UploadMetadata = {
            contentType: file.type,
            customMetadata: customMetadata,
        };
        const task = uploadBytesResumable(storageRef, entry.fileHandle, metadata);
        entry.uploadHandle = task;

        await new Promise<void>(resolve => {
            task.on("state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                    switch (snapshot.state) {
                        case "running":
                            fileQueueState.update(state => {
                                const entry = state.get(handle);
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
                                const entry = state.get(handle);
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
                        const entry = state.get(handle);
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
                        const entry = state.get(handle);
                        if (entry !== undefined) {
                            entry.progress.progress = 1;
                            entry.progress.status = "completed";
                            entry.progress.error = null;
                        }
                        return state;
                    });
                    setTimeout(() => {
                        fileUploadCompletionPool.submit(async () => {
                            deleteFileUpload(handle);
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
