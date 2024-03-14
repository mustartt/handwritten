<script lang="ts">
    import {CloudIcon} from "lucide-svelte";
    import {cn} from "$lib/utils";
    import {editorSave} from "$lib/store/project";
</script>

<div class={cn("flex mt-0.5 justify-center items-center text-muted-foreground", $editorSave ? 'animate-pulse' : '')}>
    <CloudIcon class="size-4 mr-2"/>
    <span class="text-sm text-nowrap">
        {$editorSave ? 'Saving...' : 'Saved to the cloud'}
    </span>

</div>
