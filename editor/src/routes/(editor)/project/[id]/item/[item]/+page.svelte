<script lang="ts">
    import BorderHandle, {type Position} from "$lib/components/image-scanner/BorderHandle.svelte";
    import BorderLine from "$lib/components/image-scanner/BorderLine.svelte";
    import {onMount} from "svelte";
    import {CogIcon, RotateCwIcon, ScanLineIcon} from "lucide-svelte";
    import {Button} from "$lib/components/ui/button";

    let oldContainerWidth: number;
    let oldContainerHeight: number;

    let containerWidth: number;
    let containerHeight: number;
    let imageEl: HTMLImageElement;

    const paddingSize = 48;

    export let position1 = {x: 0, y: 0};
    export let position2 = {x: 0, y: 0};
    export let position3 = {x: 0, y: 0};
    export let position4 = {x: 0, y: 0};

    let ready = false;

    onMount(() => {
        oldContainerWidth = containerWidth;
        oldContainerHeight = containerHeight;

        resetBorder();
        ready = true;
    });

    function onImageLoad() {
        // resetBorder();
        // ready = true;
    }

    function scaleContain(width, height, maxWidth, maxHeight) {
        if (width > maxWidth) {
            const scale = width / maxWidth;
            width = maxWidth;
            height = height / scale;
        }
        if (height > maxHeight) {
            const scale = height / maxHeight;
            height = maxHeight;
            width = width / scale;
        }
        return [width, height];
    }

    function transformFromImageToCanvasCoords(position: Position, cWidth: number, cHeight: number) {
        const imageContWidth = cWidth - paddingSize;
        const imageContHeight = cHeight - paddingSize;

        const [displayWidth, displayHeight] = scaleContain(
            imageEl.naturalWidth, imageEl.naturalHeight,
            imageContWidth, imageContHeight
        );

        const leftOffset = (imageContWidth - displayWidth) / 2 - 4;
        const topOffset = (imageContHeight - displayHeight) / 2 - 4;
        const scaleX = imageEl.naturalWidth / displayWidth;
        const scaleY = imageEl.naturalHeight / displayHeight;

        return {
            x: leftOffset + position.x / scaleX,
            y: topOffset + position.y / scaleY
        };
    }

    function transformFromCanvasToImageCoords(position: Position, cWidth: number, cHeight: number) {
        const imageContWidth = cWidth - paddingSize;
        const imageContHeight = cHeight - paddingSize;

        const [displayWidth, displayHeight] = scaleContain(
            imageEl.naturalWidth, imageEl.naturalHeight,
            imageContWidth, imageContHeight
        );

        const leftOffset = (imageContWidth - displayWidth) / 2 - 4;
        const topOffset = (imageContHeight - displayHeight) / 2 - 4;
        const scaleX = imageEl.naturalWidth / displayWidth;
        const scaleY = imageEl.naturalHeight / displayHeight;

        return {
            x: (position.x - leftOffset) * scaleX,
            y: (position.y - topOffset) * scaleY
        };
    }

    function scan() {
        const topLeft = transformFromCanvasToImageCoords(position1, containerWidth, containerHeight);
        const topRight = transformFromCanvasToImageCoords(position2, containerWidth, containerHeight);
        const bottomRight = transformFromCanvasToImageCoords(position3, containerWidth, containerHeight);
        const bottomLeft = transformFromCanvasToImageCoords(position4, containerWidth, containerHeight);

        console.log(topLeft, topRight, bottomRight, bottomLeft);
    }

    function resetBorder() {
        // image coords
        const topLeft = {x: 0, y: 0};
        const topRight = {x: imageEl.naturalWidth, y: 0};
        const bottomLeft = {x: 0, y: imageEl.naturalHeight};
        const bottomRight = {x: imageEl.naturalWidth, y: imageEl.naturalHeight};

        position1 = transformFromImageToCanvasCoords(topLeft, containerWidth, containerHeight);
        position2 = transformFromImageToCanvasCoords(topRight, containerWidth, containerHeight);
        position3 = transformFromImageToCanvasCoords(bottomRight, containerWidth, containerHeight);
        position4 = transformFromImageToCanvasCoords(bottomLeft, containerWidth, containerHeight);
    }

    $: {
        if (ready && imageEl && containerWidth > 0 && containerHeight > 0) {

            position1 = transformFromImageToCanvasCoords(
                transformFromCanvasToImageCoords(position1, oldContainerWidth, oldContainerHeight),
                containerWidth, containerHeight
            );
            position2 = transformFromImageToCanvasCoords(
                transformFromCanvasToImageCoords(position2, oldContainerWidth, oldContainerHeight),
                containerWidth, containerHeight
            );
            position3 = transformFromImageToCanvasCoords(
                transformFromCanvasToImageCoords(position3, oldContainerWidth, oldContainerHeight),
                containerWidth, containerHeight
            );
            position4 = transformFromImageToCanvasCoords(
                transformFromCanvasToImageCoords(position4, oldContainerWidth, oldContainerHeight),
                containerWidth, containerHeight
            );
            oldContainerWidth = containerWidth;
            oldContainerHeight = containerHeight;
        }
    }
</script>


<div class="flex-grow flex flex-col w-full p-2 space-y-2">
    <div>
        {containerWidth} {containerHeight}
    </div>
    <div bind:clientWidth={containerWidth}
         bind:clientHeight={containerHeight}
         class="flex-grow flex w-full bg-card min-w-0 min-h-0 overflow-hidden rounded"
    >
        {#if ready}
            <BorderHandle bind:position={position1} width={containerWidth} height={containerHeight}/>
            <BorderHandle bind:position={position2} width={containerWidth} height={containerHeight}/>
            <BorderHandle bind:position={position3} width={containerWidth} height={containerHeight}/>
            <BorderHandle bind:position={position4} width={containerWidth} height={containerHeight}/>

            <BorderLine width={containerWidth} height={containerHeight}
                        pos1={position1} pos2={position2} pos3={position3} pos4={position4}/>
        {/if}

        <img src='/images/example-note.jpg'
             bind:this={imageEl}
             on:load={onImageLoad}
             class="flex-1 object-contain p-6" alt="note">
    </div>
    <div class="flex justify-between items-center">
        <Button on:click={resetBorder} variant="secondary">
            <RotateCwIcon class="size-5 mr-2"/>
            Reset
        </Button>
        <Button on:click={scan}>
            <ScanLineIcon class="size-5 mr-2"/>
            Scan
        </Button>
        <Button>
            <CogIcon class="size-5 mr-2" variant="outline"/>
            Settings
        </Button>
    </div>
</div>
