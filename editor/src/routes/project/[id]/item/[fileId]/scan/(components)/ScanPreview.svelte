<script lang="ts">
    import * as Sheet from "$lib/components/ui/sheet";
    import {Button} from "$lib/components/ui/button";
    import {CogIcon, ScanTextIcon} from "lucide-svelte";

    import {createEventDispatcher} from "svelte";
    import ScanSettingsForm from "./ScanSettingsForm.svelte";
    import {cn} from "$lib/utils";

    export let preview: string | undefined;
    export let generation: string | undefined;

    let settingsOpen = false;

    const dispatch = createEventDispatcher();

</script>

<Sheet.Root bind:open={settingsOpen}>
    <Sheet.Content class="w-full sm:max-w-[500px] md:max-w-[550px]">
        <Sheet.Header>
            <Sheet.Title>Scan Settings</Sheet.Title>
        </Sheet.Header>
        <ScanSettingsForm/>
    </Sheet.Content>
</Sheet.Root>

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
                     class="w-full h-full object-contain p-8"
                     alt="scanned doc"/>
            </div>
        {/if}
        {#if preview !== undefined}
            <div class="shrink-0 relative flex py-2 justify-center items-center">
                <Button on:click={() => dispatch('extract')}>
                    <ScanTextIcon class="size-5 mr-2"/>
                    Extract Text
                </Button>
                <Button size="icon"
                        variant="outline"
                        class="absolute right-4 @4xl:hidden"
                        on:click={() => (settingsOpen = true)}>
                    <CogIcon class="size-5"/>
                </Button>
            </div>
        {/if}
    </div>
    <div class={cn("shrink-0 h-full hidden @4xl:flex flex-col w-1/3 min-w-[350px] max-w-[450px]")}>
        <ScanSettingsForm/>
    </div>
</div>
