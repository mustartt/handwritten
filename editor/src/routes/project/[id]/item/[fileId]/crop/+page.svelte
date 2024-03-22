<script lang="ts">
    import {getContext, onDestroy} from "svelte";
    import type {EditorState, EditorStore} from "$lib/store/image-editor";
    import ImageCropper from "$lib/components/image-scanner/ImageCropper.svelte";
    import {PencilLineIcon, ScanLineIcon} from "lucide-svelte";
    import NavigationHeader from "$lib/components/layout/NavigationHeader.svelte";
    import Loader from "$lib/components/ui/loader/Loader.svelte";

    const editor: EditorStore = getContext('editor');

    let state: EditorState;
    const unsub = editor.subscribe(store => (state = store));
    onDestroy(unsub);

    async function handleScan(event: any) {

    }

    async function handleChanged(event: any) {

    }

</script>

<div class="w-full h-full flex flex-col">
    {#if !state.isLoading}
        <div class="px-4">
            <NavigationHeader
                    backHref={`/project/${state.projectId}/item/${state.id}`}
                    forwardText="Scanned"
                    forwardIcon={ScanLineIcon}
                    forwardHref={`/project/${state.projectId}/item/${state.id}/scan`}>
                Crop
            </NavigationHeader>
        </div>
        <div class="flex-1 flex flex-col py-2 min-h-0 overflow-hidden">
            <ImageCropper on:scan={handleScan}
                          on:changed={handleChanged}
                          image={state.preview || ''}
                          border={state.scanBorder ? state.scanBorder : undefined}/>
        </div>
    {:else }
        <div class="w-full h-full flex justify-between items-center">
            <Loader/>
        </div>
    {/if}
</div>
