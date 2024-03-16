<script lang="ts">
    import {Loader2Icon} from 'lucide-svelte';
    import {cn} from "$lib/utils";

    export let mute: 'mute' | 'nomute' = 'nomute';
</script>

<div class={cn("flex", mute === 'mute' ? 'text-muted-foreground' : '')}>
    <Loader2Icon class="size-5 mr-2 animate-spin"/>
    Loading...
</div>
