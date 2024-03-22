<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import {ScanTextIcon} from "lucide-svelte";
    import {createEventDispatcher} from "svelte";
    import ScanSettingsForm from "./ScanSettingsForm.svelte";

    export let preview: string | undefined;
    export let generation: string | undefined;

    const dispatch = createEventDispatcher();

</script>

<div class="@container flex w-full h-full">
    <div class="flex flex-col">
        {#if preview === undefined}
            <div class="flex flex-col w-full h-full justify-center items-center">
                <p class="font-semibold text-2xl text-nowrap">
                    No Image Scanned
                </p>
            </div>
        {:else}
            <div class="flex-1 min-h-0 overflow-hidden bg-card">
                <img src={`${preview}${generation !== undefined ? '?generation=' + generation : ''}`}
                     class="w-full h-full object-contain p-6"
                     alt="scanned doc"/>
            </div>
        {/if}
        {#if preview !== undefined}
            <div class="shrink-0 flex py-2 justify-center items-center">
                <Button on:click={() => dispatch('extract')}>
                    <ScanTextIcon class="size-5 mr-2"/>
                    Extract Text
                </Button>
            </div>
        {/if}
    </div>
    <div class="shrink-0 h-full w-1/3 min-w-[350px] max-w-[450px]">
        <ScanSettingsForm/>
    </div>
</div>
