<script lang="ts">
    import BorderHandle, {type Position} from "$lib/components/image-scanner/BorderHandle.svelte";
    import BorderLine from "$lib/components/image-scanner/BorderLine.svelte";
    import {createEventDispatcher, onMount} from "svelte";
    import {CogIcon, RotateCwIcon, ScanLineIcon} from "lucide-svelte";
    import {Button} from "$lib/components/ui/button";
    import {Separator} from "$lib/components/ui/separator";
    import type {ScanBorder} from "$lib/schemas/project";

    export let image: string;
    export let border: ScanBorder | undefined = undefined;

    const dispatch = createEventDispatcher();

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
    });

    function onImageLoad() {
        resetBorder(border);
        ready = true;
    }

    function handleDragged() {
        dispatch('changed');
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

    function floorPosition(position: Position): Position {
        return {
            x: Math.floor(position.x),
            y: Math.floor(position.y),
        };
    }

    function scan() {
        const topLeft = floorPosition(transformFromCanvasToImageCoords(position1, containerWidth, containerHeight));
        const topRight = floorPosition(transformFromCanvasToImageCoords(position2, containerWidth, containerHeight));
        const bottomRight = floorPosition(transformFromCanvasToImageCoords(position3, containerWidth, containerHeight));
        const bottomLeft = floorPosition(transformFromCanvasToImageCoords(position4, containerWidth, containerHeight));

        dispatch('scan', {
            topLeft, topRight, bottomRight, bottomLeft
        });
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

        position1 = transformFromImageToCanvasCoords(topLeft, containerWidth, containerHeight);
        position2 = transformFromImageToCanvasCoords(topRight, containerWidth, containerHeight);
        position3 = transformFromImageToCanvasCoords(bottomRight, containerWidth, containerHeight);
        position4 = transformFromImageToCanvasCoords(bottomLeft, containerWidth, containerHeight);

        dispatch('changed');
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

<div class="flex flex-col w-full h-full overflow-hidden bg-card">
    <div bind:clientWidth={containerWidth}
         bind:clientHeight={containerHeight}
         class="relative flex-1 flex flex-col w-full min-w-0 min-h-0 overflow-hidden rounded">
        <div class="absolute"
             style={`width: ${containerWidth}px; height: ${containerHeight}px;`}>
            {#if ready}
                <BorderHandle on:moved={handleDragged}
                              bind:position={position1}
                              width={containerWidth}
                              height={containerHeight}/>
                <BorderHandle on:moved={handleDragged}
                              bind:position={position2}
                              width={containerWidth}
                              height={containerHeight}/>
                <BorderHandle on:moved={handleDragged}
                              bind:position={position3}
                              width={containerWidth}
                              height={containerHeight}/>
                <BorderHandle on:moved={handleDragged}
                              bind:position={position4}
                              width={containerWidth}
                              height={containerHeight}/>
                <BorderLine width={containerWidth} height={containerHeight}
                            pos1={position1} pos2={position2} pos3={position3} pos4={position4}/>
            {/if}
            <img src={image}
                 bind:this={imageEl}
                 on:load={onImageLoad}
                 class="w-full h-full object-contain p-6" alt="note">
        </div>
    </div>
    <div class="flex flex-col">
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
