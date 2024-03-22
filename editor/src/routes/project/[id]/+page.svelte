<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import {ChevronLeftIcon, PlusIcon, UploadCloudIcon} from "lucide-svelte";
    import Dropzone from "svelte-file-dropzone";
    import {cn} from "$lib/utils";
    import {toast} from "svelte-sonner";

    function handleFilesSelect(e: CustomEvent) {
        const {acceptedFiles, fileRejections} = e.detail;
        console.log(acceptedFiles, fileRejections);
        toast.info('not implemented');
    }
</script>

<div class="flex w-full h-full justify-center items-center">
    <div class="flex flex-col items-center">
        <h1 class="font-hand font-bold text-4xl">handwritten</h1>
        <p class="-mt-2 max-w-md text-muted-foreground">
            Upload an image of your handwritten notes or dive right in with our quick tour.
            Discover how Handwritten simplifies your workflow, turning your physical notes into a dynamic digital
            format.
        </p>
        <div class="flex justify-between items-center mt-4 space-x-4">
            <Button variant="secondary" on:click={() => toast.info('not implemented')}>
                <ChevronLeftIcon class="size-5 -ml-1 mr-2"/>
                Quick Tour
            </Button>
            <Button on:click={() => toast.info('not implemented')}>
                <UploadCloudIcon class="size-5 mr-2"/>
                Upload
            </Button>
        </div>
        <div class="w-full h-48 mt-8">
            <Dropzone on:drop={handleFilesSelect} containerClasses="w-full h-full" disableDefaultStyles>
                <div class={cn(
                                "flex w-full h-full justify-center items-center rounded-lg transition-colors border-4 border-dashed",
                                "border-muted hover:bg-muted hover:border-muted-foreground"
                                )}>
                    <div class="flex flex-col items-center">
                        <PlusIcon class="size-8"/>
                        <h1 class="font-semibold text-md ">Drop Files Here</h1>
                    </div>
                </div>
            </Dropzone>
        </div>
    </div>
</div>
