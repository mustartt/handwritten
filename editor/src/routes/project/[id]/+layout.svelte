<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs";
    import {ApertureIcon, FolderIcon, ScanTextIcon, UploadCloudIcon} from "lucide-svelte";
    import PreviewTable from "$lib/components/item-preview/PreviewTable.svelte";
    import {Separator} from "$lib/components/ui/separator";
    import {Button} from "$lib/components/ui/button";
    import FileUploadDialogue, {type UploadEvent} from "$lib/components/item-preview/FileUploadDialogue.svelte";
    import {page} from "$app/stores";
    import {createFileUpload} from "$lib/store/upload";

    let fileUploadHandler: () => void;

    async function handleFileUploads(event: CustomEvent<UploadEvent>) {
        for (const file of event.detail.files) {
            createFileUpload(file, $page.params.id);
        }
    }
</script>

<!--HTML Parent Content-->
<!--<body data-sveltekit-preload-data="hover" class="flex flex-col w-screen h-screen bg-background">-->
<!--<div class="flex flex-col w-full h-full overflow-x-hidden overflow-y-auto">-->

<FileUploadDialogue bind:open={fileUploadHandler} on:upload={handleFileUploads}/>

<div class="flex flex-col w-full h-full overflow-hidden">
    <div class="shrink-0 h-12 bg-red-500">

    </div>
    <Tabs.Root value="files" class="flex-1 flex flex-col w-full justify-center overflow-hidden">
        <Tabs.Content value="files"
                      class="w-full h-full mt-0 overflow-hidden">
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
                <div class="flex-1 bg-background overflow-hidden">
                    <div class="h-full px-4 pt-4 overflow-y-auto">
                        <PreviewTable/>
                    </div>
                </div>
            </div>
        </Tabs.Content>
        <Tabs.Content value="scanner"
                      class="h-full bg-green-500 mt-0">
            Scanner
        </Tabs.Content>
        <Tabs.Content value="output"
                      class="h-full bg-green-500 mt-0">
            Output
        </Tabs.Content>

        <Separator/>
        <div class="shrink-0 flex justify-center py-2">
            <Tabs.List>
                <Tabs.Trigger value="files">
                    <FolderIcon class="size-5 mr-2"/>
                    Files
                </Tabs.Trigger>
                <Tabs.Trigger value="scanner">
                    <ApertureIcon class="size-5 mr-2"/>
                    Scanner
                </Tabs.Trigger>
                <Tabs.Trigger value="output">
                    <ScanTextIcon class="size-5 mr-2"/>
                    Output
                </Tabs.Trigger>
            </Tabs.List>
        </div>
    </Tabs.Root>
</div>
