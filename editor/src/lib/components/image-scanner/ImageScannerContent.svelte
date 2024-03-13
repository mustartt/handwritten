<script lang="ts">
    import {editor} from '$lib/store/project.js';
    import ImageCropper from '$lib/components/image-scanner/ImageCropper.svelte';
    import ScanPreview from '$lib/components/image-scanner/ScanPreview.svelte';
    import {httpsCallable} from "firebase/functions";
    import {functions} from "$lib/firebase.client";

    export let itemId: string | undefined;

    async function handleScan(event: CustomEvent) {
        if (itemId === undefined) return;

        console.log('scanning start');
        const scanFunction = httpsCallable(functions, 'scanItem');
        await scanFunction({
            itemId: itemId,
            scanBorder: event.detail,
            settings: {
                documentType: 'scan_notes'
            }
        });
        console.log('scanning done');
        editor.update(store => {
            store.previewGeneration += 1;
            store.scannerTab = 'result';
            return store;
        });
    }
</script>

{#if $editor.item && $editor.item.type === 'image'}
    {#if $editor.scannerTab === 'scanner'}
        <ImageCropper on:scan={handleScan}
                      image={$editor.item.image.imageUri}
                      border={$editor.item.image.scanBorder}/>
    {:else}
        <ScanPreview preview={$editor.item.image.scanUri}
                     generation={$editor.previewGeneration.toString()}/>
    {/if}
{/if}
