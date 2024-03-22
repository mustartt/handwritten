<script lang="ts">
    import * as Tooltip from "$lib/components/ui/tooltip";
    import {Button} from "$lib/components/ui/button";
    import {DownloadIcon} from "lucide-svelte";
    import HeaderIcon from "$lib/layout/HeaderIcon.svelte";

    export let name: string = "Project";
</script>

<nav class="flex z-10 w-full justify-between items-center h-16 px-6">
    <div class="flex items-center space-x-2">
        <Tooltip.Root openDelay={300} closeDelay={500}>
            <Tooltip.Trigger class="hover:bg-accent p-2 rounded">
                <a href="/projects">
                    <img class="size-8" src='/images/project.png' alt="project"/>
                </a>
            </Tooltip.Trigger>
            <Tooltip.Content>
                Projects Home
            </Tooltip.Content>
        </Tooltip.Root>
        <div class="flex flex-col">
            <h1 class="text-nowrap font-semibold text-2xl">
                {name}
            </h1>
        </div>
    </div>
    <div class="hidden md:flex">
        <HeaderIcon/>
    </div>
    <div>
        <Button class="inline-flex md:hidden" size="icon">
            <DownloadIcon class="size-5"/>
        </Button>
        <Button class="hidden md:inline-flex">
            <DownloadIcon class="size-5 mr-2"/>
            Export
        </Button>
    </div>
</nav>
