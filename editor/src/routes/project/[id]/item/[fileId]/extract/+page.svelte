<script lang="ts">
    import {getContext, onDestroy} from "svelte";
    import type {EditorState, EditorStore} from "$lib/store/image-editor";
    import Loader from "$lib/components/ui/loader/Loader.svelte";
    import NavigationHeader from "$lib/components/layout/NavigationHeader.svelte";
    import MarkdownEditor from "$lib/components/output-editor/MarkdownEditor.svelte";

    const editor: EditorStore = getContext('editor');

    let state: EditorState;
    const unsub = editor.subscribe(store => (state = store));
    onDestroy(unsub);

    function updateStoreText(value: string) {
        console.log(value);
        editor.update(store => {
            if (!store.isLoading) {
                store.text = value;
            }
            return store;
        });
    }
</script>

<div class="w-full h-full flex flex-col">
    {#if !state.isLoading}
        <div class="px-4">
            <NavigationHeader backHref={`/project/${state.projectId}/item/${state.id}/scan`}>
                Extracted Text
            </NavigationHeader>
        </div>
        <div class="flex-1 flex flex-col pt-2 min-h-0 overflow-hidden">
            <MarkdownEditor initialValue={state.text || ''} onValueChange={updateStoreText}/>
        </div>
    {:else }
        <div class="w-full h-full flex justify-between items-center">
            <Loader/>
        </div>
    {/if}
</div>
