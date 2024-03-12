<script>
    import ImageCropper from '$lib/components/image-scanner/ImageCropper.svelte';
    import {ApertureIcon, FolderIcon, ScanTextIcon} from 'lucide-svelte';
    import ItemPreviewContent from '$lib/components/item-preview/ItemPreviewContent.svelte';
    import {Separator} from '$lib/components/ui/separator';
    import * as Tabs from '$lib/components/ui/tabs';

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
            <ImageCropper image="/images/example-note.jpg"/>
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
