import {derived, get, writable} from "svelte/store";
import {firestore, getCurrentUser} from "$lib/firebase.client";
import {toast} from "svelte-sonner";
import {doc, getDoc, setDoc} from "firebase/firestore";

export interface ProjectListState {
    isLoading: boolean;
    projects: Map<string, Project>;
}

export const projectList = writable<ProjectListState>(
    {isLoading: false, projects: new Map()});

export const projectListView = {
    loading: derived(projectList, ($store) => $store.isLoading),
    previews: derived(projectList, ($store) => {
        const previews = [];
        for (const [_, proj] of $store.projects) {
            const {items, ...preview} = proj;
            previews.push(preview as ProjectPreview);
        }
        return previews;
    })
};

let projectTimeout: NodeJS.Timeout;

export async function queueSaveProject(projectId: string) {
    editor.update(store => {
        store.isProjectSaving = true;
        return store;
    });
    clearTimeout(projectTimeout);
    projectTimeout = setTimeout(async () => {
        const editorState = get(editor);
        if (!editorState.project || editorState.project.id !== projectId) {
            return;
        }

        console.log('Saving project', projectId);
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

let itemTimeout: NodeJS.Timeout;

export async function queueSaveItem(itemId: string) {
    editor.update(store => {
        store.isItemSaving = true;
        return store;
    });
    clearTimeout(itemTimeout);
    itemTimeout = setTimeout(async () => {
        const editorState = get(editor);
        if (!editorState.item || editorState.item.id !== itemId) {
            return;
        }

        console.log('Saving item', itemId);
        try {
            const itemRef = doc(firestore, 'items', itemId);
            await setDoc(itemRef, editorState.item);
            console.log('Saved item', itemId);
        } catch (err) {
            toast.error('Failed to save item');
            console.error(err);
        } finally {
            editor.update(store => {
                store.isItemSaving = false;
                return store;
            });
        }
    }, 5000);
}

export async function loadEditorItem(itemId: string) {
    editor.update(store => {
        store.isItemLoading = true;
        return store;
    });
    try {
        const itemRef = doc(firestore, 'items', itemId);
        const itemDoc = await getDoc(itemRef);
        const itemData = itemSchema.parse(itemDoc.data());

        editor.update(store => {
            store.item = itemData;
            return store;
        });
    } catch (err) {
        toast.error('Failed to load editor item');
        console.error(err);
    } finally {
        editor.update(store => {
            store.isItemLoading = false;
            return store;
        });
    }
}
