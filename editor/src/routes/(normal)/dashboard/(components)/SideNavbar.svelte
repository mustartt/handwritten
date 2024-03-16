<script lang="ts">
    import {cn} from '$lib/utils.js';
    import {page} from '$app/stores';
    import {Button} from '$lib/components/ui/button/index.js';
    import {crossfade} from 'svelte/transition';
    import {cubicInOut} from 'svelte/easing';

    export let items: { title: string, href: string }[];

    const [send, receive] = crossfade({
        duration: 250,
        easing: cubicInOut,
    });
</script>

<nav class="flex flex-wrap pt-2 lg:py-0 lg:flex-col lg:space-x-0 lg:space-y-1">
    {#each items as item}
        {@const isActive = $page.url.pathname === item.href}
        <Button
                href={item.href}
                variant="ghost"
                class={cn(
                                !isActive && "hover:underline",
				                "relative justify-start hover:bg-transparent")}
                data-sveltekit-noscroll>
            {#if isActive}
                <div class="absolute inset-0 rounded-md bg-muted"
                     in:send={{ key: "active-sidebar-tab" }}
                     out:receive={{ key: "active-sidebar-tab" }}/>
            {/if}
            <div class="relative">
                {item.title}
            </div>
        </Button>
    {/each}
</nav>
