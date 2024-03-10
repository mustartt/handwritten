<script lang="ts">
    import {Root, Content, Header, Description, Title, Footer} from "$lib/components/ui/dialog";
    import {Field, Control, Button, Label, FieldErrors} from "$lib/components/ui/form";
    import {AspectRatio} from "$lib/components/ui/aspect-ratio/index.js";
    import {Loader2Icon, PlusIcon} from "lucide-svelte";
    import {Input} from "$lib/components/ui/input";
    import {defaults, superForm} from "sveltekit-superforms";
    import {z} from 'zod';
    import {zod} from "sveltekit-superforms/adapters";
    import {firestore, getCurrentUser} from "$lib/firebase.client";
    import {setDoc, collection, doc, Timestamp} from 'firebase/firestore';
    import {v4 as uuidv4} from 'uuid';
    import {toast} from "svelte-sonner";
    import type {Project} from "$lib/schemas/project";
    import {projects} from "$lib/store/project";

    let createProjectOpen = false;
    let isCreateProjectLoading = false;

    async function createNewProject(name: string) {
        const user = await getCurrentUser();
        if (!user) {
            console.error('missing user');
            toast.error('Unexpected error')
            return;
        }
        const projectId = uuidv4();
        const docRef = doc(collection(firestore, 'projects'), projectId);
        const newProject: Project = {
            id: projectId,
            name: name,
            owner: user.uid,
            items: [],
            timeCreated: Timestamp.now(),
            timeUpdated: Timestamp.now()
        }
        await setDoc(docRef, newProject);
        projects.update(value => {
            value.projects.set(projectId, newProject);
            return value;
        });
    }

    const schema = z.object({
        name: z.string()
            .min(5, {message: "name must be at least 5 characters long"})
            .max(64, {message: "name cannot be more than 64 characters long"})
    });

    const form = superForm(defaults(zod(schema)), {
        SPA: true,
        validators: zod(schema),
        validationMethod: 'auto',
        async onSubmit(data) {
        },
        async onUpdate({form}) {
            if (form.valid) {
                isCreateProjectLoading = true;
                const name = (form.data as any).name as string;
                await createNewProject(name);
            }
        },
        async onUpdated({form}) {
            isCreateProjectLoading = false;
            if (form.valid) {
                createProjectOpen = false;
            }
        },
        onError({result}) {
            isCreateProjectLoading = false;
            $message = result.error.message;
        }
    });

    const {form: formData, errors, message, enhance, validateForm, options} = form;
</script>

<Root bind:open={createProjectOpen}>
    <Content class="sm:max-w-[425px]">
        <Header>
            <Title>Create New Document</Title>
            <Description>
                Make a new project to contain your files. Click create when you're done.
            </Description>
        </Header>
        <form method="POST" use:enhance>
            <Field {form} name="name">
                <Control let:attrs>
                    <Label>Project name</Label>
                    <Input {...attrs} bind:value={$formData.name}/>
                </Control>
                <FieldErrors/>
            </Field>
            <Footer>
                {#if $message}
                    <div class="text-destructive">
                        {$message.text}
                    </div>
                {/if}
                <Button class="inline-flex w-full mt-2">
                    {#if isCreateProjectLoading}
                        <Loader2Icon class="size-5 animate-spin mr-2"/>
                        Creating...
                    {:else}
                        Create
                    {/if}
                </Button>
            </Footer>
        </form>
    </Content>
</Root>

<a class="flex-grow flex flex-col w-full max-w-64 xs:max-w-48 space-y-2 py-4 px-6 rounded hover:bg-muted"
   role="button"
   on:click={() => (createProjectOpen = true)}>
    <AspectRatio ratio={3 / 4}
                 class="flex justify-center items-center rounded overflow-hidden border-2 border-primary border-dashed">
        <PlusIcon class="size-5 text-primary"/>
    </AspectRatio>
    <div class="shrink-0 flex flex-col justify-center items-center">
        New Project
    </div>
</a>