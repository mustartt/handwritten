import {firestore, functions, getCurrentUser} from "$lib/firebase.client";
import {toast} from "svelte-sonner";
import {collection, getDocs, query, Timestamp, where} from "firebase/firestore";
import {projectSchema} from "$lib/schemas/project";
import {projectList} from "$lib/store/project-list";
import {httpsCallable} from "firebase/functions";
import {v4 as uuidv4} from "uuid";

export async function loadProjects() {
    const user = await getCurrentUser();
    if (!user) {
        console.error('missing user');
        toast.error('Unexpected error');
        return;
    }

    projectList.update(value => {
        value.isLoading = true;
        return value;
    });
    try {
        const projectQuery = query(
            collection(firestore, 'projects'),
            where('owner', '==', user.uid),
        );

        const result = await getDocs(projectQuery);
        projectList.update(value => {
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
        projectList.update(value => {
            value.isLoading = false;
            return value;
        });
    }
}

export async function createNewProject(name: string) {
    const createProjectFunc = httpsCallable(functions, 'createProject');

    const result = await createProjectFunc({
        id: uuidv4(),
        name
    });
    const data = {
        ...(result.data as any),
        timeCreated: Timestamp.fromDate(new Date((result.data as any).timeCreated)),
        timeUpdated: Timestamp.fromDate(new Date((result.data as any).timeUpdated))
    };
    const newProject = projectSchema.parse(data);

    projectList.update(value => {
        value.projects.set(newProject.id, newProject);
        return value;
    });
}
