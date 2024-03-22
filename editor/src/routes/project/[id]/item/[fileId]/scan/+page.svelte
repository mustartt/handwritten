<script lang="ts">
    import {ScanTextIcon} from 'lucide-svelte';
    import NavigationHeader from '$lib/components/layout/NavigationHeader.svelte';
    import Loader from '$lib/components/ui/loader/Loader.svelte';
    import type {EditorState, EditorStore} from "$lib/store/image-editor";
    import {getContext, onDestroy} from "svelte";
    import ScanPreview from "./(components)/ScanPreview.svelte";

    const editor: EditorStore = getContext('editor');

    let generation: number = 0;

    let state: EditorState;
    const unsub = editor.subscribe(store => (state = store));
    onDestroy(unsub);

    async function handleExtractText() {
        generation += 1;
    }

</script>

<div class="w-full h-full flex flex-col">
    {#if !state.isLoading}
        <div class="px-4">
            <NavigationHeader
                    backHref={`/project/${state.projectId}/item/${state.id}/crop`}
                    forwardText="Edit Text"
                    forwardIcon={ScanTextIcon}
                    forwardHref={`/project/${state.projectId}/item/${state.id}/extract`}>
                Scan Result
            </NavigationHeader>
        </div>
        <div class="flex-1 flex flex-col pt-2 min-h-0 overflow-hidden">
            <ScanPreview preview={state.scan ? state.scan : undefined}
                         generation={generation.toString()}
                         on:extract={handleExtractText}/>
        </div>
    {:else }
        <div class="w-full h-full flex justify-between items-center">
            <Loader/>
        </div>
    {/if}
</div>
