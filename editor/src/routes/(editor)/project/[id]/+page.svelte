<script lang="ts">

    import exampleNote from '$lib/images/example-note.jpg';
    import BorderHandle, {type Position} from "$lib/components/image-scanner/BorderHandle.svelte";
    import BorderLine from "$lib/components/image-scanner/BorderLine.svelte";
    import {onMount} from "svelte";

    let containerWidth: number;
    let containerHeight: number;

    let position1 = {x: 0, y: 0};
    let position2 = {x: 50, y: 0};
    let position3 = {x: 50, y: 50};
    let position4 = {x: 0, y: 50};

    let ready = false;

    onMount(() => {
        ready = true;
    });
</script>


<div class="flex-grow flex flex-col w-full">
    <div bind:clientWidth={containerWidth}
         bind:clientHeight={containerHeight}
         class="flex-grow flex w-full bg-card min-w-0 min-h-0 overflow-hidden"
    >
        {#if ready}
            <BorderHandle bind:position={position1} width={containerWidth} height={containerHeight}/>
            <BorderHandle bind:position={position2} width={containerWidth} height={containerHeight}/>
            <BorderHandle bind:position={position3} width={containerWidth} height={containerHeight}/>
            <BorderHandle bind:position={position4} width={containerWidth} height={containerHeight}/>

            <BorderLine width={containerWidth} height={containerHeight}
                        pos1={position1} pos2={position2} pos3={position3} pos4={position4}/>
        {/if}

        <img src={exampleNote} class="flex-1 object-contain p-6" alt="note">
    </div>
    <div>
        {containerWidth} {containerHeight}
    </div>
</div>
