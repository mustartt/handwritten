<script lang="ts">
    import logoSVG from '$lib/images/logo.svg';
    import {Button} from "$lib/components/ui/button";
    import {DownloadIcon} from "lucide-svelte";
    import HeaderIcon from "$lib/layout/HeaderIcon.svelte";

    export let name: string = "Project";
</script>

<nav class="flex z-10 w-full justify-between items-center h-16 px-6">
    <div class="flex items-center space-x-2">
        <img class="size-10 md:hidden" src={logoSVG} alt="logo"/>
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
