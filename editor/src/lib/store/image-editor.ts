import type {Item, Project} from "$lib/schemas/project";
import {derived, writable} from "svelte/store";

export interface EditorState {
    isProjectLoading: boolean;
    isProjectSaving: boolean;
    project: Project | null;

    isItemLoading: boolean;
    isItemSaving: boolean;
    isScanning: boolean;

    item: Item | null;
    scannerTab: 'scanner' | 'result';
    previewGeneration: number;
}

export const editor = writable<EditorState>({
    isProjectLoading: true,
    isProjectSaving: false,
    project: null,

    isItemLoading: false,
    isItemSaving: false,
    isScanning: false,

    item: null,
    scannerTab: "scanner",
    previewGeneration: 0,
});

export const editorSave = derived(editor, store => {
    return store.isItemSaving || store.isProjectSaving;
});
