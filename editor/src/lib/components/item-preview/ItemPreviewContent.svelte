<script lang="ts">
    import FileUploadDialogue, {type UploadEvent} from "$lib/components/item-preview/FileUploadDialogue.svelte";
    import {page} from "$app/stores";
    import {createFileUpload} from "$lib/store/upload";
    import {Button} from "$lib/components/ui/button";
    import PreviewTable from "$lib/components/item-preview/PreviewTable.svelte";
    import {UploadCloudIcon} from "lucide-svelte";
    import {Separator} from "$lib/components/ui/separator";

    let fileUploadHandler: () => void;

    async function handleFileUploads(event: CustomEvent<UploadEvent>) {
        for (const file of event.detail.files) {
            await createFileUpload(file, $page.params.id);
        }
    }
</script>

<FileUploadDialogue bind:open={fileUploadHandler} on:upload={handleFileUploads}/>

<div class="flex flex-col w-full h-full">
    <div class="shrink-0 flex px-4 py-2 justify-between items-center">
        <h1 class="text-2xl font-bold">Files</h1>
        <div class="flex items-center">
            <Button variant="outline" on:click={fileUploadHandler}>
                <UploadCloudIcon class="size-5 mr-2"/>
                Upload
            </Button>
        </div>
    </div>
    <Separator/>
    <div class="flex-1 bg-background min-h-0 px-4 pt-4 pb-64 overflow-y-scroll overscroll-contain">
        <PreviewTable/>
    </div>
</div>
