<script context="module" lang="ts">
    export type Position = {
        x: number,
        y: number
    }
</script>

<script lang="ts">
    import {draggable} from '@neodrag/svelte';
    import {CircleIcon} from "lucide-svelte";
    import {createEventDispatcher, onMount} from "svelte";

    const dispatch = createEventDispatcher();

    function clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }

    export let width: number;
    export let height: number;

    export let position: Position;
    const padding = 12;
    const offset = 28;

    $: position = {
        x: clamp(position.x, padding - offset, width - padding - offset),
        y: clamp(position.y, padding - offset, height - padding - offset),
    };
</script>

<span class="z-20 absolute cursor-grab p-4 rounded"
      use:draggable={{
            position: position,
            onDrag: ({offsetX, offsetY}) => {
                position = {
                    x: offsetX,
                    y: offsetY
                }
                dispatch('moved');
            },
        }}
>
    <CircleIcon class="size-6"/>
</span>
