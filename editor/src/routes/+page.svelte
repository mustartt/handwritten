<script lang="ts">
    import {onMount} from "svelte";
    import HomeSidebar from "$lib/layout/HomeSidebar.svelte";
    import {AspectRatio} from "$lib/components/ui/aspect-ratio";
    import testNotebookIcon from '$lib/images/notebook.jpg';
    import DocumentIcon from "./components/DocumentIcon.svelte";

    onMount(() => {
    });
</script>

<svelte:head>
    <title>Editor</title>
</svelte:head>

<HomeSidebar/>

<div class="flex-auto flex flex-col p-4">
    <div class="container flex justify-between">
        <h2 class="text-2xl font-bold ml-6">Documents</h2>
    </div>
    <div class="container flex justify-center sm:justify-start items-center flex-wrap mt-2 overflow-y-auto">
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
        <DocumentIcon/>
    </div>
</div>


