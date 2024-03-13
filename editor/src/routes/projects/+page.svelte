<script lang="ts">
    import {onMount} from "svelte";
    import HomeSidebar from "$lib/layout/HomeSidebar.svelte";
    import NewProjectIcon from "./components/NewProjectIcon.svelte";
    import DocumentIcon from "./components/DocumentIcon.svelte";
    import {loadProjects, projectPreview} from "$lib/store/project";
    import {Loader2Icon} from "lucide-svelte";

    onMount(async () => {
        await loadProjects();
    });

    const {loading, previews} = projectPreview;
</script>

<svelte:head>
    <title>Editor</title>
</svelte:head>

<HomeSidebar/>

<div class="flex-auto flex flex-col p-4">
    <div class="container flex justify-between">
        <h2 class="text-2xl font-bold ml-6">Documents</h2>
    </div>
    <div class="container flex justify-center sm:justify-start flex-wrap mt-2 overflow-y-auto">
        <NewProjectIcon/>
        {#each $previews as project (project.id)}
            <DocumentIcon preview={project}/>
        {/each}
    </div>
    {#if $loading}
        <div class="flex w-full justify-center items-center">
            <span class="flex h-24 justify-center items-center">
                <Loader2Icon class="size-5 mr-2 animate-spin"/>
                Loading...
            </span>
        </div>
    {/if}
</div>


