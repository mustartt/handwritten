<script lang="ts">

    import {Button} from "$lib/components/ui/button";
    import {ArrowLeftIcon, ArrowRightIcon} from "lucide-svelte";
    import {goto} from "$app/navigation";
    import type {ComponentType} from "svelte";

    export let backHref: string | undefined = undefined;

    export let forwardText = 'Forward';
    export let forwardHref: string | undefined = undefined;
    export let forwardIcon: ComponentType = ArrowRightIcon;

</script>

<div class="shrink-0 flex justify-between items-center">
    {#if backHref !== undefined}
        <Button on:click={() => goto(backHref || '#')} variant="secondary" size="sm">
            <ArrowLeftIcon class="size-5 mr-2"/>
            Back
        </Button>
    {/if}
    <h3 class="text-2xl font-bold">
        <slot/>
    </h3>
    {#if forwardHref !== undefined}
        <Button on:click={() => goto(forwardHref || '#')} size="sm">
            <svelte:component this={forwardIcon} class="size-5 mr-2"/>
            {forwardText}
        </Button>
    {/if}
</div>
