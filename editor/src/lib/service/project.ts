import {type Project, projectSchema} from "$lib/schemas/project";
import {auth, firestore, getCurrentUser} from "$lib/firebase.client";
import {toast} from "svelte-sonner";
import {doc, onSnapshot} from "firebase/firestore";

export async function subscribeToProjectUpdates(projectId: string, handler: (value: Project) => void) {
    const user = await getCurrentUser();
    if (!user) {
        console.error('missing user');
        toast.error('Unexpected error');
        throw new Error('Missing user');
    }

    return onSnapshot(doc(firestore, 'projects', projectId), (projDoc) => {
        const data = projectSchema.parse(projDoc.data());
        handler(data);
    });
}
