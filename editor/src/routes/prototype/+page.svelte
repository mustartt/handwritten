<script lang="ts">

    import {Root, Content, Item, Trigger, Value} from "$lib/components/ui/select";

    import {Button} from "$lib/components/ui/button";
    import {onMount} from "svelte";
    import {ScanTextIcon} from "lucide-svelte";

    let canvasEl: HTMLCanvasElement;
    let videoSource: HTMLVideoElement;
    let stream: MediaStream | undefined;
    let selectedValue: string;

    onMount(async () => {
        await constructStream();
    })

    async function capture() {
        const width = videoSource.videoWidth;
        const height = videoSource.videoHeight;

        canvasEl.width = width;
        canvasEl.height = height;

        const context = canvasEl.getContext('2d');
        context.drawImage(videoSource, 0, 0, width, height);

        const link = document.createElement('a');
        link.download = 'capture.png';
        link.href = canvasEl.toDataURL()
        link.click();
    }

    async function constructStream(deviceId?: string) {
        const videoSelector = deviceId === undefined ? true : {deviceId};
        stream = await navigator.mediaDevices.getUserMedia({
            video: videoSelector,
            audio: false,
        });
        videoSource.srcObject = stream;
        await videoSource.play();
    }

    function changeCaptureDevice(event) {
        const {value} = event;
        constructStream(value);
    }
</script>

<canvas class="hidden" bind:this={canvasEl}></canvas>

<div class="relative flex flex-col justify-center items-center w-full h-full">
    <video class="bg-card" playsinline
           bind:this={videoSource}>
    </video>
    <div class="absolute bottom-4 z-10 space-x-2 flex justify-center items-center">
        <Button on:click={capture}>
            <ScanTextIcon class="size-5"/>
        </Button>
        <Root bind:selected={selectedValue} onSelectedChange={changeCaptureDevice}>
            <Trigger class="w-48">
                <Value></Value>
            </Trigger>
            <Content>
                {#await navigator.mediaDevices.enumerateDevices()}
                {:then devices}
                    {#each devices as device}
                        {#if device.kind === 'videoinput'}
                            <Item value={device.deviceId}>{device.label}</Item>
                        {/if}
                    {/each}
                {/await}
            </Content>
        </Root>
    </div>
</div>
