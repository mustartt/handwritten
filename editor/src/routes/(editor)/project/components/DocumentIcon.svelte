<script lang="ts">
    import testNotebookIcon from '$lib/images/notebook.jpg';
    import {AspectRatio} from '$lib/components/ui/aspect-ratio/index.js';
</script>

<div class="flex-grow flex flex-col w-full max-w-64 xs:max-w-48 space-y-2 py-4 px-6 rounded hover:bg-muted">
    <AspectRatio ratio={3 / 4}
                 class="flex justify-center items-center bg-red-500 rounded overflow-hidden">
        <img src={testNotebookIcon}
             class="h-full rounded object-cover"
             alt="icon"/>
    </AspectRatio>
    <div class="shrink-0 flex flex-col justify-center items-center">
        <h3 class="text-lg font-semibold">Notebook 1</h3>
        <span class="text-xs text-muted-foreground">March 7, 2024 at 11:00pm</span>
    </div>
</div>
