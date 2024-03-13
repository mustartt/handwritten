<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import {ArrowLeftIcon} from "lucide-svelte";
    import {editor} from "$lib/store/project";

    export let preview: string | undefined;
    export let generation: string | undefined;

    let containerWidth: number;
    let containerHeight: number;

    function navigateBackToScanner() {
        editor.update(store => {
            store.scannerTab = 'scanner';
            return store;
        });
    }
</script>

<div bind:clientWidth={containerWidth}
     bind:clientHeight={containerHeight}
     class="relative flex flex-col w-full h-full justify-center items-center p-6 bg-card">
    <Button variant="secondary" class="absolute top-4 left-4" on:click={navigateBackToScanner}>
        <ArrowLeftIcon class="size-5 mr-2"/>
        Back
    </Button>
    {#if preview === undefined}
        <div class="flex flex-col w-full h-full justify-center items-center">
            <p class="font-semibold text-2xl text-nowrap">
                No Image Scanned
            </p>
        </div>
    {:else}
        <div style={`width: ${containerWidth}px; height: ${containerHeight - 53}px;`}>
            <img src={`${preview}${generation !== undefined ? '?generation=' + generation : ''}`}
                 class="w-full h-full object-contain rounded"
                 alt="scanned doc"/>
        </div>
    {/if}
</div>
