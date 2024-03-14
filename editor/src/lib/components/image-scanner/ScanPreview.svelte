<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import {ArrowLeftIcon} from "lucide-svelte";
    import {editor} from "$lib/store/project";
    import {createEventDispatcher} from "svelte";

    export let preview: string | undefined;
    export let generation: string | undefined;

    let containerWidth: number;
    let containerHeight: number;

    const dispatch = createEventDispatcher();

    function navigateBackToScanner() {
        editor.update(store => {
            store.scannerTab = 'scanner';
            return store;
        });
    }
</script>

<div class="flex flex-col w-full h-full bg-card p-4">
    <div bind:clientWidth={containerWidth}
         bind:clientHeight={containerHeight}
         class="relative flex-1 flex flex-col w-full justify-center items-center rounded">
        <Button variant="secondary" class="absolute z-10 top-4 left-4" on:click={navigateBackToScanner}>
            <ArrowLeftIcon class="size-5 mr-2"/>
            Back
        </Button>
        <div class="absolute"
             style={`width: ${containerWidth}px; height: ${containerHeight}px;`}>
            {#if preview === undefined}
                <div class="flex flex-col w-full h-full justify-center items-center">
                    <p class="font-semibold text-2xl text-nowrap">
                        No Image Scanned
                    </p>
                </div>
            {:else}
                <img src={`${preview}${generation !== undefined ? '?generation=' + generation : ''}`}
                     class="w-full h-full object-contain"
                     alt="scanned doc"/>
            {/if}
        </div>
    </div>
    {#if preview !== undefined}
        <div class="shrink-0 flex justify-center items-center">
            <Button on:click={() => dispatch('extract')}>Extract Text</Button>
        </div>
    {/if}
</div>
