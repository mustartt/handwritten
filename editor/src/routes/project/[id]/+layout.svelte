<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs";
    import {ApertureIcon, FolderIcon, ScanTextIcon} from "lucide-svelte";
    import {Separator} from "$lib/components/ui/separator";
    import FileUploadDialogue, {type UploadEvent} from "$lib/components/item-preview/FileUploadDialogue.svelte";
    import {page} from "$app/stores";
    import {createFileUpload} from "$lib/store/upload";
    import {onDestroy, onMount} from "svelte";
    import {editor, subscribeToProjectUpdates} from "$lib/store/project";
    import type {Unsubscribe} from "firebase/firestore";
    import ItemPreviewContent from "$lib/components/item-preview/ItemPreviewContent.svelte";

    let fileUploadHandler: () => void;

    async function handleFileUploads(event: CustomEvent<UploadEvent>) {
        for (const file of event.detail.files) {
            await createFileUpload(file, $page.params.id);
        }
    }

    let unsub: Unsubscribe | undefined;
    onMount(async () => {
        const projectId = $page.params.id;
        editor.update((value) => {
            value.isProjectLoading = true;
            return value;
        });
        unsub = await subscribeToProjectUpdates(projectId, (data) => {
            editor.update((value) => {
                value.isProjectLoading = false;
                value.project = data;
                return value;
            });
        });
    });

    onDestroy(() => {
        if (unsub) {
            unsub();
        }
        editor.update((value) => {
            value.isProjectLoading = true;
            value.project = null;
            return value;
        });
    });
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
            <ItemPreviewContent/>
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
