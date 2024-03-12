<script lang="ts">

    import type {Position} from "$lib/components/image-scanner/BorderHandle.svelte";

    export let width: number;
    export let height: number;

    export let pos1: Position;
    export let pos2: Position;
    export let pos3: Position;
    export let pos4: Position;

    function convertToRelativePosition(position: Position) {
        return {
            x: position.x + 28,
            y: position.y + 28
        };
    }

    $: p1 = convertToRelativePosition(pos1);
    $: p2 = convertToRelativePosition(pos2);
    $: p3 = convertToRelativePosition(pos3);
    $: p4 = convertToRelativePosition(pos4);
</script>

<svg class="absolute z-0 stroke-2 stroke-foreground"
     viewBox={`0 0 ${width} ${height}`}
     xmlns="http://www.w3.org/2000/svg">
    <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}/>
    <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y}/>
    <line x1={p3.x} y1={p3.y} x2={p4.x} y2={p4.y}/>
    <line x1={p4.x} y1={p4.y} x2={p1.x} y2={p1.y}/>
</svg>
