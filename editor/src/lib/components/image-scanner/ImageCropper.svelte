<script lang="ts">
    import BorderHandle, {type Position} from "$lib/components/image-scanner/BorderHandle.svelte";
    import BorderLine from "$lib/components/image-scanner/BorderLine.svelte";
    import {onMount} from "svelte";
    import {CogIcon, RotateCwIcon, ScanLineIcon} from "lucide-svelte";
    import {Button} from "$lib/components/ui/button";
    import {Separator} from "$lib/components/ui/separator";
    import type {ScanBorder} from "$lib/schemas/project";

    export let image: string;
    export let border: ScanBorder | undefined = undefined;

    let oldContainerWidth: number;
    let oldContainerHeight: number;

    let containerWidth: number;
    let containerHeight: number;
    let imageEl: HTMLImageElement;

    const paddingSize = 48;
    const heightOffset = -54;

    export let position1 = {x: 0, y: 0};
    export let position2 = {x: 0, y: 0};
    export let position3 = {x: 0, y: 0};
    export let position4 = {x: 0, y: 0};

    let ready = false;

    onMount(() => {
        oldContainerWidth = containerWidth;
        oldContainerHeight = containerHeight;

        resetBorder(border);
        ready = true;
    });

    function onImageLoad() {
    }

    function scaleContain(width: number, height: number, maxWidth: number, maxHeight: number) {
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
        const topLeft = transformFromCanvasToImageCoords(position1, containerWidth, containerHeight + heightOffset);
        const topRight = transformFromCanvasToImageCoords(position2, containerWidth, containerHeight + heightOffset);
        const bottomRight = transformFromCanvasToImageCoords(position3, containerWidth, containerHeight + heightOffset);
        const bottomLeft = transformFromCanvasToImageCoords(position4, containerWidth, containerHeight + heightOffset);

        console.log(topLeft, topRight, bottomRight, bottomLeft);
    }

    function resetBorder(scanBorder?: ScanBorder) {
        // image coords
        let topLeft = {x: 0, y: 0};
        let topRight = {x: imageEl.naturalWidth, y: 0};
        let bottomLeft = {x: 0, y: imageEl.naturalHeight};
        let bottomRight = {x: imageEl.naturalWidth, y: imageEl.naturalHeight};
        if (scanBorder) {
            topLeft = scanBorder.topLeft;
            topRight = scanBorder.topRight;
            bottomLeft = scanBorder.bottomLeft;
            bottomRight = scanBorder.bottomRight;
        }

        position1 = transformFromImageToCanvasCoords(topLeft, containerWidth, containerHeight + heightOffset);
        position2 = transformFromImageToCanvasCoords(topRight, containerWidth, containerHeight + heightOffset);
        position3 = transformFromImageToCanvasCoords(bottomRight, containerWidth, containerHeight + heightOffset);
        position4 = transformFromImageToCanvasCoords(bottomLeft, containerWidth, containerHeight + heightOffset);
    }

    $: {
        if (ready && imageEl && containerWidth > 0 && containerHeight > 0) {

            position1 = transformFromImageToCanvasCoords(
                transformFromCanvasToImageCoords(position1, oldContainerWidth, oldContainerHeight + heightOffset),
                containerWidth, containerHeight + heightOffset
            );
            position2 = transformFromImageToCanvasCoords(
                transformFromCanvasToImageCoords(position2, oldContainerWidth, oldContainerHeight + heightOffset),
                containerWidth, containerHeight + heightOffset
            );
            position3 = transformFromImageToCanvasCoords(
                transformFromCanvasToImageCoords(position3, oldContainerWidth, oldContainerHeight + heightOffset),
                containerWidth, containerHeight + heightOffset
            );
            position4 = transformFromImageToCanvasCoords(
                transformFromCanvasToImageCoords(position4, oldContainerWidth, oldContainerHeight + heightOffset),
                containerWidth, containerHeight + heightOffset
            );
            oldContainerWidth = containerWidth;
            oldContainerHeight = containerHeight;
        }
    }
</script>

<div class="flex flex-col w-full h-full overflow-hidden">
    <div bind:clientWidth={containerWidth}
         bind:clientHeight={containerHeight}
         class="relative flex-grow flex flex-col w-full bg-card min-w-0 min-h-0 overflow-hidden rounded">
        {#if ready}
            <BorderHandle bind:position={position1} width={containerWidth} height={containerHeight + heightOffset}/>
            <BorderHandle bind:position={position2} width={containerWidth} height={containerHeight + heightOffset}/>
            <BorderHandle bind:position={position3} width={containerWidth} height={containerHeight + heightOffset}/>
            <BorderHandle bind:position={position4} width={containerWidth} height={containerHeight + heightOffset}/>
            <BorderLine width={containerWidth} height={containerHeight}
                        pos1={position1} pos2={position2} pos3={position3} pos4={position4}/>
        {/if}

        <div style={`width: ${containerWidth}px; height: ${containerHeight + heightOffset}px;`}>
            <img src={image}
                 bind:this={imageEl}
                 on:load={onImageLoad}
                 class="w-full h-full object-contain p-6" alt="note">
        </div>
        <Separator/>
        <div class="z-10 flex justify-evenly items-center p-2">
            <Button on:click={() => resetBorder()} variant="secondary" size="icon">
                <RotateCwIcon class="size-5"/>
            </Button>
            <Button on:click={scan}>
                <ScanLineIcon class="size-5"/>
            </Button>
            <Button variant="outline" size="icon">
                <CogIcon class="size-5"/>
            </Button>
        </div>
    </div>
</div>
