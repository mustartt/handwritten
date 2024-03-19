<script lang="ts">
    import {onMount} from "svelte";
    import NewProjectIcon from "./(components)/NewProjectIcon.svelte";
    import DocumentIcon from "./(components)/DocumentIcon.svelte";
    import {projectListView} from "$lib/store/project-list";
    import {loadProjects} from "$lib/service/project-list";
    import Loader from "$lib/components/ui/loader/Loader.svelte";

    onMount(async () => {
        await loadProjects();
    });

    const {loading, previews} = projectListView;
</script>

<svelte:head>
    <title>Projects</title>
</svelte:head>


<div class="container flex flex-col justify-center mt-6">
    <div class="flex justify-between">
        <h2 class="text-3xl font-bold ml-6">Documents</h2>
    </div>
    <div class="flex justify-center sm:justify-start flex-wrap mt-2 overflow-y-auto">
        <NewProjectIcon/>
        {#each $previews as project (project.id)}
            <DocumentIcon preview={project}/>
        {/each}
    </div>
    {#if $loading}
        <div class="flex w-full justify-center items-center">
            <span class="flex h-24 justify-center items-center">
                <Loader/>
            </span>
        </div>
    {/if}
</div>


