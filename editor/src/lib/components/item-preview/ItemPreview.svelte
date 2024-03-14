<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";

    import {cn} from "$lib/utils";
    import {page} from "$app/stores";
    import {PencilLineIcon, Trash2Icon} from "lucide-svelte";
    import {ref, deleteObject} from "firebase/storage";
    import {firestore, storage} from "$lib/firebase.client";
    import {doc, deleteDoc, runTransaction, Timestamp} from "firebase/firestore";
    import {get} from "svelte/store";
    import {editor} from "$lib/store/project";
    import {projectSchema} from "$lib/schemas/project";

    export let idx: number;
    export let id: string;
    export let name: string;
    export let meta: string;
    export let image: string = '/images/example-note-2.jpg';

    let alertOpen = false;

    async function deleteItem() {
        const editorState = get(editor);
        if (!editorState.project) return;

        const fileRef = ref(storage, `upload/${id}`);
        const scanRef = ref(storage, `scan/${id}`);
        const previewRef = ref(storage, `preview/${id}`);
        const itemDoc = doc(firestore, `items/${id}`);
        const projId = editorState.project.id;

        await Promise.all([
            deleteObject(fileRef),
            deleteObject(scanRef),
            deleteObject(previewRef),
            deleteDoc(itemDoc),
            runTransaction(firestore, async (txn) => {
                const proj = await txn.get(doc(firestore, `projects/${projId}`));
                const projData = projectSchema.parse(proj.data());

                const newItems = projData.items.filter(item => item.itemId !== id);
                txn.update(proj.ref, {
                    items: newItems,
                    timeUpdated: Timestamp.now()
                });
            })
        ]);
    }
</script>

<AlertDialog.Root bind:open={alertOpen}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
                This action cannot be undone. This will permanently delete the uploaded file.
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action on:click={deleteItem}>Delete</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

<a class={cn(
        "list-group-item border-2 border-transparent relative flex flex-col w-full rounded bg-card justify-center items-center overflow-hidden",
        $page.url.searchParams.get('item') === id ? "border-primary" : ""
    )}
   tabindex="0"
   href={`?item=${id}`}
   role="button"
   on:click={() => console.log('navigate to', id)}>
    <span class="absolute flex left-2 top-2 justify-center items-center bg-secondary size-8 rounded-full">
        {idx}
    </span>
    <img src={image}
         alt="preview"
         class="object-cover w-full h-48"/>
    <div class="flex-none h-10 px-4 w-full flex justify-between items-center">
        <div class="flex justify-center items-center space-x-2">
            <span class="font-semibold">{name}</span>
            <span class="mt-1 text-sm text-muted-foreground">{meta}</span>
        </div>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="lucide lucide-ellipsis-vertical size-5">
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="12" cy="5" r="1"/>
                    <circle cx="12" cy="19" r="1"/>
                </svg>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Group>
                    <DropdownMenu.Item disabled>
                        <PencilLineIcon class="size-5 mr-2"/>
                        Rename
                    </DropdownMenu.Item>
                    <DropdownMenu.Item class="text-red-700" on:click={() => (alertOpen = true)}>
                        <Trash2Icon class="size-5 mr-2"/>
                        Delete
                    </DropdownMenu.Item>
                </DropdownMenu.Group>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div>
</a>

