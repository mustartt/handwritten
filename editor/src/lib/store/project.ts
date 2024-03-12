import type {Item, Project, ProjectPreview} from "$lib/schemas/project";
import {derived, get, writable} from "svelte/store";
import {firestore, getCurrentUser} from "$lib/firebase.client";
import {toast} from "svelte-sonner";
import {collection, doc, getDocs, onSnapshot, query, setDoc, where} from "firebase/firestore";
import {projectSchema} from "$lib/schemas/project";

export interface ProjectState {
    isLoading: boolean;
    projects: Map<string, Project>;
}

export const projects = writable<ProjectState>(
    {isLoading: false, projects: new Map()});

export const projectPreview = {
    loading: derived(projects, ($store) => $store.isLoading),
    previews: derived(projects, ($store) => {
        const previews = [];
        for (const [_, proj] of $store.projects) {
            const {items, ...preview} = proj;
            previews.push(preview as ProjectPreview);
        }
        return previews;
    })
};

export async function loadProjects() {
    const user = await getCurrentUser();
    if (!user) {
        console.error('missing user');
        toast.error('Unexpected error');
        return;
    }

    projects.update(value => {
        value.isLoading = true;
        return value;
    });
    try {
        const projectQuery = query(
            collection(firestore, 'projects'),
            where('owner', '==', user.uid),
        );

        const result = await getDocs(projectQuery);
        projects.update(value => {
            const newRecords = new Map();
            for (const [_, doc] of result.docs.entries()) {
                const parsedDoc = projectSchema.parse(doc.data());
                newRecords.set(parsedDoc.id, parsedDoc);
            }
            value.projects = newRecords;
            return value;
        });
    } catch (err) {
        console.error(err);
        toast.error('Unexpected error');
    } finally {
        projects.update(value => {
            value.isLoading = false;
            return value;
        });
    }
}

export interface EditorState {
    isProjectLoading: boolean;
    isProjectSaving: boolean;
    project: Project | null;
    activeItemId: string | null;
    item: Item | null;
}

export const editor = writable<EditorState>({
    isProjectLoading: true,
    isProjectSaving: false,
    project: null,
    activeItemId: null,
    item: null
});

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

let queueTimeoutId: NodeJS.Timeout;

export async function queueSaveProject(projectId: string) {
    clearTimeout(queueTimeoutId);
    queueTimeoutId = setTimeout(async () => {
        const editorState = get(editor);
        if (!editorState.project || editorState.project.id !== projectId) {
            return;
        }

        console.log('Saving project', projectId);
        editor.update(store => {
            store.isProjectSaving = true;
            return store;
        });
        try {
            const projectRef = doc(firestore, 'projects', projectId);
            await setDoc(projectRef, editorState.project);
            console.log('Saved project', projectId);
        } catch (err) {
            toast.error('Failed to save project');
            console.error(err);
        } finally {
            editor.update(store => {
                store.isProjectSaving = false;
                return store;
            });
        }
    }, 5000);
}
