<script lang="ts">
    import {Badge} from "$lib/components/ui/badge";
    import {onMount} from "svelte";

    export let item: any;

    onMount(() => {
        console.log(item);
    });
</script>

<div class="flex w-full justify-between items-center bg-card rounded p-2 max-w-xl">
    <ul class="">
        {#each item.items as subItem}
            <li class="text-nowrap">{subItem.price.product.name}</li>
        {/each}
    </ul>
    <div class="flex justify-between items-center">
        <Badge>{item.status}</Badge>
    </div>
</div>
