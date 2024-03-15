<script lang="ts">

    import {Root, Content, Item, Trigger, Value} from "$lib/components/ui/select";

    import {Button} from "$lib/components/ui/button";
    import {onMount} from "svelte";
    import {ArrowLeftIcon, Loader2Icon, ScanTextIcon, XIcon} from "lucide-svelte";
    import {toast} from "svelte-sonner";
    import {quintOut} from "svelte/easing";
    import {slide} from 'svelte/transition';

    export let onCapture: ((dataUrl: string[]) => Promise<void>) | undefined = undefined;
    export let onBack: (() => Promise<void>) | undefined = undefined;

    let canvasEl: HTMLCanvasElement;
    let videoSource: HTMLVideoElement;
    let stream: MediaStream | undefined;
    let isCapturing = false;

    let captures: string[] = [];
    let preview = false;

    onMount(async () => {
        await constructStream();
    });

    async function capture() {
        const width = videoSource.videoWidth;
        const height = videoSource.videoHeight;

        canvasEl.width = width;
        canvasEl.height = height;

        const context = canvasEl.getContext('2d');
        if (!context) {
            toast.error("Unexpected error");
            console.error('Unsupported canvas context');
            return;
        }
        try {
            isCapturing = true;
            context.drawImage(videoSource, 0, 0, width, height);
            const data = canvasEl.toDataURL('image/jpeg', 85);
            captures = [...captures, data];
        } catch (err) {
            toast.error('Unexpected error');
            console.error(err);
        } finally {
            setTimeout(() => {
                isCapturing = false;
            }, 250);
        }
    }

    async function constructStream(deviceId?: string) {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: deviceId,
                width: {ideal: 4096},
                height: {ideal: 2160},
            },
            audio: false,
        });
        videoSource.srcObject = stream;
        await videoSource.play();
    }

    function changeCaptureDevice(event: any) {
        const {value} = event;
        constructStream(value);
    }

    async function handleSave() {
        if (onCapture) await onCapture(captures);
        if (onBack) await onBack();
    }
</script>

<style>
    .custom-grid-auto {
        grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    }
</style>

<canvas class="hidden" bind:this={canvasEl}></canvas>

{#if preview}
    <div class="fixed z-20 pt-8 px-6 w-full h-full bg-background flex flex-col space-y-4 items-center"
         transition:slide={{ delay: 0, duration: 300, easing: quintOut, axis: 'x' }}>
        <div class="flex w-full justify-between items-center">
            <h1 class="font-bold text-2xl text-nowrap">Scanned Images</h1>
            <Button on:click={() => (preview = false)}>Close</Button>
        </div>
        <div class="grid gap-2 w-full custom-grid-auto">
            {#each captures as capture, index}
                <div class="relative w-full max-w-52 rounded overflow-hidden">
                    <img class="object-contain" src={capture} alt="preview"/>
                    <Button on:click={() => {captures = captures.filter((_, idx) => idx !== index)}}
                            class="absolute right-2 top-2" variant="outline" size="icon">
                        <XIcon class="size-4"/>
                    </Button>
                </div>
            {/each}
        </div>
    </div>
{/if}

<div class="relative flex flex-col bg-background justify-center items-center w-full h-svh overflow-hidden overscroll-none">
    <video class="bg-card z-0" playsinline bind:this={videoSource}></video>

    <div class="absolute w-full px-10 top-8 z-10 flex justify-between items-center">
        <Button on:click={onBack} variant="secondary">
            <ArrowLeftIcon class="size-5 mr-2"/>
            Back
        </Button>
        <Root onSelectedChange={changeCaptureDevice}>
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

    <div class="absolute bottom-12 px-6 z-10 w-full grid grid-cols-3 items-center justify-center">
        <div class="flex justify-center items-center">
            <button class="size-12 bg-card rounded border-foreground border-2 overflow-hidden"
                    on:click={() => (preview = true)}>
                {#if captures.length > 0}
                    <img src={captures[0]}
                         class="object-cover size-12"
                         alt="preview">
                {/if}
            </button>
        </div>
        <div class="flex justify-center items-center">
            <div class="border-2 border-foreground rounded-full p-0.5">
                <button class="bg-foreground p-4 rounded-full disabled:bg-muted-foreground hover:bg-muted-foreground"
                        disabled={isCapturing}
                        on:click={capture}>
                    {#if !isCapturing}
                        <ScanTextIcon class="size-6 text-background"/>
                    {:else}
                        <Loader2Icon class="size-6 text-background animate-spin"/>
                    {/if}
                </button>
            </div>
        </div>
        <div class="flex justify-center items-center">
            <Button on:click={handleSave}>
                Save {captures.length > 0 ? `(${captures.length})` : '' }
            </Button>
        </div>
    </div>
</div>
