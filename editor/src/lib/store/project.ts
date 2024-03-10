import type {Project, ProjectPreview} from "$lib/schemas/project";
import {derived, writable} from "svelte/store";
import {firestore, getCurrentUser} from "$lib/firebase.client";
import {toast} from "svelte-sonner";
import {collection, getDocs, query, where} from "firebase/firestore";
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
}

export async function loadProjects() {
    const user = await getCurrentUser();
    if (!user) {
        console.error('missing user');
        toast.error('Unexpected error')
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
        })
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
