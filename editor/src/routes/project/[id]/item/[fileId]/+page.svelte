<script lang="ts">
    import {PencilLineIcon} from "lucide-svelte";

    import {getContext, onDestroy} from "svelte";
    import type {EditorState} from "$lib/store/image-editor";
    import Loader from "$lib/components/ui/loader/Loader.svelte";
    import MetadataTable from "./(components)/MetadataTable.svelte";
    import NavigationHeader from "$lib/components/layout/NavigationHeader.svelte";

    let state: EditorState;

    const unsub = (getContext('editor') as any).subscribe((store: EditorState) => (state = store));
    onDestroy(unsub);
</script>

<div class="w-full h-full flex flex-col px-4 pb-4">
    {#if !state.isLoading}
        <NavigationHeader forwardText="Edit"
                          forwardIcon={PencilLineIcon}
                          forwardHref={`/project/${state.projectId}/item/${state.id}/crop`}>
            Preview
        </NavigationHeader>
        <div class="flex-1 py-2 min-h-0 overflow-hidden">
            <img class="w-full h-full object-contain" src={state.scan} alt="preview"/>
        </div>
        <div class="shrink-0 h-64 w-full bg-card rounded overflow-y-auto p-2 pb-4">
            <MetadataTable items={[
                {name: "Filename", value: state.name},
            ]}/>
        </div>
    {:else }
        <div class="w-full h-full flex justify-between items-center">
            <Loader/>
        </div>
    {/if}
</div>

