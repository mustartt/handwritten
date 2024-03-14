<script lang="ts">
    import {editor, queueSaveItem} from '$lib/store/project.js';
    import ImageCropper from '$lib/components/image-scanner/ImageCropper.svelte';
    import ScanPreview from '$lib/components/image-scanner/ScanPreview.svelte';
    import {httpsCallable} from "firebase/functions";
    import {functions} from "$lib/firebase.client";
    import {toast} from "svelte-sonner";

    export let itemId: string | undefined;

    async function handleScan(event: CustomEvent) {
        if (itemId === undefined) return;

        editor.update(store => {
            store.isScanning = true;
            return store;
        });
        try {
            console.log('scanning start', event.detail);
            const scanFunction = httpsCallable(functions, 'scanItem');
            const result = await scanFunction({
                itemId: itemId,
                ...(event.detail ? {scanBorder: event.detail} : {}),
                settings: {
                    documentType: 'scan_notes'
                }
            });
            console.log('scanning done', result);
            editor.update(store => {
                store.previewGeneration += 1;
                if (store.item && store.item.type === 'image') {
                    store.item.image.scanUri = (result.data as any).scanUri;
                    store.item.image.scanBorder = (result.data as any).scanBorder;
                }
                store.scannerTab = 'result';
                return store;
            });
        } catch (err) {
            toast.error('Failed to scan');
            console.error(err);
        } finally {
            editor.update(store => {
                store.isScanning = false;
                return store;
            });
        }

        handleChanged();
    }

    async function handleExtract() {
        if (!itemId) {
            return;
        }
        console.log('extracting text');
        const extractFunction = httpsCallable(functions, 'extractText');
        const result = await extractFunction({itemId});
        console.log('finished extracing text:', result);
        editor.update(store => {
            if (store.item) {
                store.item.output.extractedText = (result.data as any).result;
            }
            return store;
        });
    }

    function handleChanged() {
        if (itemId) {
            console.log('here 3');
            queueSaveItem(itemId);
        }
    }
</script>

{#if $editor.item && $editor.item.type === 'image'}
    {#if $editor.scannerTab === 'scanner'}
        <ImageCropper on:scan={handleScan}
                      on:changed={handleChanged}
                      image={$editor.item.image.imageUri}
                      border={$editor.item.image.scanBorder}/>
    {:else}
        <ScanPreview on:extract={handleExtract}
                     preview={$editor.item.image.scanUri}
                     generation={$editor.previewGeneration.toString()}/>
    {/if}
{/if}
