<script lang="ts">
    import {AspectRatio} from '$lib/components/ui/aspect-ratio/index.js';
    import type {ProjectPreview} from "$lib/schemas/project";
    import type {Timestamp} from "firebase/firestore";

    const notebookDefaultCover = 'https://images.unsplash.com/photo-1550895030-823330fc2551?q=80&w=1024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    export let preview: ProjectPreview;

    function getTimestampString(value: Timestamp) {
        const date = value.toDate();
        return `${date.toDateString()} at ${date.getHours()}:${date.getMinutes()}`
    }
</script>

<a class="flex-grow flex flex-col w-full max-w-64 xs:max-w-48 space-y-2 py-4 px-6 rounded hover:bg-muted"
   href={`/project/${preview.id}`}>
    <AspectRatio ratio={3 / 4}
                 class="flex justify-center items-center bg-red-500 rounded overflow-hidden">
        <img src={preview.coverImage || notebookDefaultCover}
             class="w-full h-full rounded object-cover"
             alt="icon"/>
    </AspectRatio>
    <div class="shrink-0 flex flex-col justify-center items-center">
        <h3 class="text-lg font-semibold">{preview.name}</h3>
        <span class="text-xs text-muted-foreground text-nowrap">{getTimestampString(preview.timeUpdated)}</span>
    </div>
</a>
