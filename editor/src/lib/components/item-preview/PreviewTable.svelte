<script lang="ts">
    import ItemPreview from "$lib/components/item-preview/ItemPreview.svelte";
    import {cn} from "$lib/utils";

    import Sortable from 'sortablejs';
    import {onMount} from "svelte";

    const items = Array.from(Array(10).keys())
        .map((idx) => ({
            id: `id-${idx}`,
            value: `Item ${idx}`
        }));

    let listEl: HTMLElement;

    onMount(() => {
        Sortable.create(listEl, {
            animation: 500,
            sort: true,
            delay: 100,
            delayOnTouchOnly: true,
            touchStartThreshold: 10
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
        <ItemPreview idx={1} name="IMG_1000.jpg" meta="(1)"/>
        <ItemPreview idx={2} name="IMG_1100.jpg" meta="(2)"/>
        <!--        <ItemPreview idx={3} name="IMG_1200.jpg" meta="(3)"/>-->
        <!--        <ItemPreview idx={4} name="IMG_1300.jpg" meta="(4)"/>-->
        <!--        <ItemPreview idx={5} name="IMG_1400.jpg" meta="(5)"/>-->
        <!--        <ItemPreview idx={6} name="IMG_1500.jpg" meta="(6)"/>-->
        <!--        <ItemPreview idx={7} name="IMG_1600.jpg" meta="(7)"/>-->
        <!--        <ItemPreview idx={5} name="IMG_1400.jpg" meta="(5)"/>-->
        <!--        <ItemPreview idx={6} name="IMG_1500.jpg" meta="(6)"/>-->
        <!--        <ItemPreview idx={7} name="IMG_1600.jpg" meta="(7)"/>-->
        <!--        <ItemPreview idx={5} name="IMG_1400.jpg" meta="(5)"/>-->
        <!--        <ItemPreview idx={6} name="IMG_1500.jpg" meta="(6)"/>-->
        <!--        <ItemPreview idx={7} name="IMG_1600.jpg" meta="(7)"/>-->
    </div>
</div>

<!--"flex flex-col list-group w-full",-->
<!--"space-y-4 @md:space-y-0",-->
<!--"@md:gaps-2 @md:grid @md:grid-cols-2 @2xl:grid-cols-3"-->
