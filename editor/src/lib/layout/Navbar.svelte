<script lang="ts">
    import {Button} from '$lib/components/ui/button/index.js';
    import {AlignLeftIcon, SquarePenIcon} from 'lucide-svelte';
    import {page} from '$app/stores';

    import * as Sheet from "$lib/components/ui/sheet";
    import * as Accordion from "$lib/components/ui/accordion";
    import HeaderIcon from "$lib/layout/HeaderIcon.svelte";
    import {Separator} from "$lib/components/ui/separator";
    import HomeSidebar from "$lib/layout/HomeSidebar.svelte";

    $: currentPath = $page.url.pathname;
    $: isHomePage = currentPath === '/';
</script>

<nav class="flex-none flex flex-row w-full h-16 justify-center md:justify-between items-center px-6">
    <div class="hidden md:flex items-center">
        <HeaderIcon/>
    </div>
    <div class="hidden md:flex items-center">
        <!--        <Button>Scan</Button>-->
    </div>
    <div class="flex md:hidden w-full justify-between items-center">
        <div class="flex-1 flex">
            <Sheet.Root>
                <Sheet.Trigger asChild let:builder>
                    <Button variant="ghost" size="icon" builders={[builder]}>
                        <AlignLeftIcon class="w-6 h-6"/>
                    </Button>
                </Sheet.Trigger>
                <Sheet.Content side="left" class="max-w-96">
                    <!--                    <HomeSidebar/>-->
                </Sheet.Content>
            </Sheet.Root>
        </div>
        <div class="flex-1 shrink-0 flex items-center justify-center">
            {#if isHomePage}
                <HeaderIcon/>
            {/if}
        </div>
        <div class="flex-1 flex justify-end">
            <Button variant="ghost" size="icon">
                <SquarePenIcon class="size-6"/>
            </Button>
        </div>
    </div>
</nav>
<Separator/>
