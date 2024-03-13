<script lang="ts">
    import {ApertureIcon, FolderIcon, ScanTextIcon} from 'lucide-svelte';
    import ItemPreviewContent from '$lib/components/item-preview/ItemPreviewContent.svelte';
    import {Separator} from '$lib/components/ui/separator';
    import * as Tabs from '$lib/components/ui/tabs';
    import {page} from "$app/stores";
    import {onDestroy} from "svelte";
    import {loadEditorItem} from "$lib/store/project";
    import ImageScannerContent from "$lib/components/image-scanner/ImageScannerContent.svelte";

    let itemId: string | undefined;

    async function loadItem(itemId: string) {
        await loadEditorItem(itemId);
    }

    const unsub = page.subscribe(value => {
        const id = value.url.searchParams.get('item');
        if (id && itemId !== id) {
            itemId = id;
            loadItem(id);
        }
    });

    onDestroy(unsub);
</script>
<div class="flex flex-col w-full h-full overflow-hidden">
    <div class="shrink-0 h-12 bg-red-500">

    </div>
    <Tabs.Root value="scanner" class="flex-1 flex flex-col w-full justify-center overflow-hidden">
        <Tabs.Content value="files"
                      class="w-full h-full mt-0 overflow-hidden">
            <ItemPreviewContent/>
        </Tabs.Content>
        <Tabs.Content value="scanner"
                      class="h-full bg-green-500 mt-0">
            <ImageScannerContent itemId={itemId}/>
        </Tabs.Content>
        <Tabs.Content value="output"
                      class="h-full bg-green-500 mt-0">
            Output
        </Tabs.Content>

        <Separator/>
        <div class="shrink-0 flex justify-center py-2">
            <Tabs.List>
                <Tabs.Trigger value="files">
                    <FolderIcon class="size-5 mr-2"/>
                    Files
                </Tabs.Trigger>
                <Tabs.Trigger value="scanner">
                    <ApertureIcon class="size-5 mr-2"/>
                    Scanner
                </Tabs.Trigger>
                <Tabs.Trigger value="output">
                    <ScanTextIcon class="size-5 mr-2"/>
                    Output
                </Tabs.Trigger>
            </Tabs.List>
        </div>
    </Tabs.Root>
</div>
