import type {Project} from "$lib/schemas/project";
import {writable} from "svelte/store";

type ProjectState = {
    isLoading: true,
} | {
    isLoading: false;
    isSaving: boolean;
    project: Project;
};

function createProjectState() {
    const {subscribe, update, set} = writable<ProjectState>({
        isLoading: true
    });

    function resolve(project: Project) {
        update(store => {
            if (!store.isLoading) {
                store.project = project;
            } else {
                store = {
                    isLoading: false,
                    isSaving: false,
                    project
                };
            }
            return store;
        });
    }

    function load() {
        set({isLoading: true});
    }

    return {
        subscribe, update, set,
        resolve, load
    };
}

export const project = createProjectState();


