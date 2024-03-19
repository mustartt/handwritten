<script lang="ts">
    import EditorHeader from "./(components)/EditorHeader.svelte";
    import * as Resizable from "$lib/components/ui/resizable";

    import {page} from "$app/stores";
    import {onDestroy, onMount} from "svelte";
    import type {Unsubscribe} from "firebase/firestore";
    import {subscribeToProjectUpdates} from "$lib/service/project";
    import {project} from "$lib/store/project";
    import {toast} from "svelte-sonner";
    import {Loader2Icon} from "lucide-svelte";
    import ItemPreviewContent from "$lib/components/item-preview/ItemPreviewContent.svelte";

    let unsub: Unsubscribe | undefined;
    onMount(async () => {
        const projectId = $page.params.id;
        project.load();
        try {
            unsub = await subscribeToProjectUpdates(projectId, (data) => {
                project.resolve(data);
            });
        } catch (err) {
            toast.error('Unexpected Error loading project');
            console.error(err);
        }
    });

    onDestroy(() => {
        if (unsub) {
            unsub();
        }
        project.load();
    });

    let containerWidth: number | undefined = undefined;
    $: isDesktop = (containerWidth || 0) >= 1024;
    $: basePath = $page.url.pathname.split('/');
    $: projectFileActive =
        basePath.length === 5 &&
        basePath[1] === 'project' &&
        basePath[3] === 'item';

</script>

<EditorHeader name={$project.isLoading ? "Loading..." : $project.project.name}/>

<div bind:clientWidth={containerWidth} class="flex-1 flex flex-col w-full bg-red-500/10 overflow-hidden min-h-0">
    {`Container Width: ${containerWidth}px`}
    {`Layout Desktop: ${isDesktop}`}
    {`File Active: ${projectFileActive}`}
    {#if containerWidth === undefined}
        <div class="w-full h-full flex justify-center items-center">
            <Loader2Icon class="text-primary stroke-[2px] size-8 animate-spin"/>
        </div>
    {:else}
        {#if !isDesktop}
            {#if !projectFileActive}
                <ItemPreviewContent/>
            {:else}
                <slot/>
            {/if}
        {:else}
            <Resizable.PaneGroup direction="horizontal">
                <Resizable.Pane minSize={25} defaultSize={35} maxSize={50}>
                    <ItemPreviewContent/>
                </Resizable.Pane>
                <Resizable.Handle withHandle/>
                <Resizable.Pane>
                    <slot/>
                </Resizable.Pane>
            </Resizable.PaneGroup>
        {/if}
    {/if}
</div>
