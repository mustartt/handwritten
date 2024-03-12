<script lang="ts">
    import ItemPreview from "$lib/components/item-preview/ItemPreview.svelte";
    import {cn} from "$lib/utils";
    import Sortable from 'sortablejs';
    import {onMount} from "svelte";
    import {editor, queueSaveProject} from "$lib/store/project";

    let listEl: HTMLElement;

    function handleSwap(fromIdx: number, toIdx: number) {
        if (!$editor.project?.id) return;
        editor.update(store => {
            const items = store.project?.items;
            if (!items) return store;

            const temp = items[fromIdx];
            items[fromIdx] = items[toIdx];
            items[toIdx] = temp;

            return store;
        });
        queueSaveProject($editor.project?.id);
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

<div class="flex justify-center @container">
    <div bind:this={listEl}
         class={cn(
            "flex flex-col @md:grid @md:grid-cols-2 @2xl:grid-cols-3",
            "space-y-4 @md:space-y-0 @md:gap-4",
            "list-group",
            "w-full @md:w-[28rem] @2xl:w-[43rem]"
        )}>
        {#if $editor.project}
            {#each $editor.project.items as item, index (item.itemId)}
                <ItemPreview idx={index + 1}
                             id={item.itemId}
                             name={item.name}
                             meta={item.meta || ''}
                             image={item.preview}/>
            {/each}
        {/if}
    </div>
</div>

<!--"flex flex-col list-group w-full",-->
<!--"space-y-4 @md:space-y-0",-->
<!--"@md:gaps-2 @md:grid @md:grid-cols-2 @2xl:grid-cols-3"-->
