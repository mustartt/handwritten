<script lang="ts">
    import ItemPreview from "$lib/components/item-preview/ItemPreview.svelte";
    import Sortable from 'sortablejs';
    import {onMount} from "svelte";
    import {project} from "$lib/store/project";
    // import {editor, queueSaveProject} from "$lib/store/project-list";

    let listEl: HTMLElement;

    function handleSwap(fromIdx: number, toIdx: number) {
        // if (!$editor.project?.id) return;
        // editor.update(store => {
        //     const items = store.project?.items;
        //     if (!items) return store;
        //
        //     const temp = items[fromIdx];
        //     items[fromIdx] = items[toIdx];
        //     items[toIdx] = temp;
        //
        //     return store;
        // });
        // queueSaveProject($editor.project?.id);
    }

    onMount(() => {
        Sortable.create(listEl, {
            animation: 500,
            sort: true,
            delay: 100,
            delayOnTouchOnly: true,
            touchStartThreshold: 10,
            onEnd: ({oldIndex, newIndex}) => {
                if (oldIndex == newIndex || oldIndex === undefined || newIndex === undefined) return;
                handleSwap(oldIndex, newIndex);
            }
        });
    });
</script>

<style>
    .custom-grid-auto {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
</style>

<div bind:this={listEl}
     class="list-group grid gap-4 custom-grid-auto @container">
    {#if $project.isLoading === false}
        {#each $project.project.items as item, index (item.fileId)}
            <ItemPreview idx={index + 1}
                         projectId={$project.project.id}
                         id={item.fileId}
                         name={item.name}
                         meta={''}
                         image={item.preview}/>
        {/each}
    {/if}
</div>

<!--"flex flex-col list-group w-full",-->
<!--"space-y-4 @md:space-y-0",-->
<!--"@md:gaps-2 @md:grid @md:grid-cols-2 @2xl:grid-cols-3"-->
