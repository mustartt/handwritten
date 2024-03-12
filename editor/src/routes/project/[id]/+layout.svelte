<script lang="ts">
    import {ApertureIcon, FolderIcon, ScanTextIcon} from "lucide-svelte";
    import {Separator} from "$lib/components/ui/separator";
    import {page} from "$app/stores";
    import {onDestroy, onMount} from "svelte";
    import {editor, subscribeToProjectUpdates} from "$lib/store/project";
    import type {Unsubscribe} from "firebase/firestore";
    import ItemPreviewContent from "$lib/components/item-preview/ItemPreviewContent.svelte";
    import ImageCropper from "$lib/components/image-scanner/ImageCropper.svelte";

    let unsub: Unsubscribe | undefined;
    onMount(async () => {
        const projectId = $page.params.id;
        editor.update((value) => {
            value.isProjectLoading = true;
            return value;
        });
        unsub = await subscribeToProjectUpdates(projectId, (data) => {
            editor.update((value) => {
                value.isProjectLoading = false;
                value.project = data;
                return value;
            });
        });
    });

    onDestroy(() => {
        if (unsub) {
            unsub();
        }
        editor.update((value) => {
            value.isProjectLoading = true;
            value.project = null;
            return value;
        });
    });
</script>

<slot/>
