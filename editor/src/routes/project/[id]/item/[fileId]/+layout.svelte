<script lang="ts">
    import * as Breadcrumb from "$lib/components/ui/breadcrumb";

    import {createEditorState, defaultScanSettings, type EditorState, type EditorStore} from "$lib/store/image-editor";
    import Loader from "$lib/components/ui/loader/Loader.svelte";
    import {onDestroy, onMount, setContext} from "svelte";
    import {page} from "$app/stores";
    import {firestore} from "$lib/firebase.client";
    import {collection, doc, getDoc} from "firebase/firestore";
    import {projectFileSchema} from "$lib/schemas/project-file";
    import {toast} from "svelte-sonner";

    let state: EditorState;

    async function loadFile(editor: EditorStore, projId: string, id: string) {
        try {
            editor.set({
                isLoading: true,
                name: '',
                id: id, projectId: projId
            });

            const fileRef = doc(collection(firestore, 'projects'), `${projId}/files/${id}`);
            const fileDoc = await getDoc(fileRef);
            const data = projectFileSchema.parse(fileDoc.data());

            editor.set({
                id: data.id,
                projectId: data.parentProject,
                name: data.name,
                isLoading: false,
                isScanning: false,
                isSaving: false,
                isExtracting: false,
                scanBorder: data.image?.scanBorder || null,
                preview: data.image?.imageUrl || '',
                scan: data.scan?.scanUrl || '',
                settings: {...defaultScanSettings}
            });
        } catch (err) {
            toast.error('Unexpected Error');
            console.error(err);
        }
    }

    const editor = createEditorState($page.params.fileId, $page.params.id, '');
    setContext('editor', editor);

    const unsub = editor.subscribe(store => (state = store));
    onDestroy(unsub);

    $: fileId = $page.params.fileId;
    $: projId = $page.params.id;

    $: {
        console.log('changed', fileId);

        // load new state
        loadFile(editor, projId, fileId);
    }

    $: homeHref = `/project/${state.projectId}/item/${state.id}`;
    $: cropHref = `/project/${state.projectId}/item/${state.id}/crop`;
    $: scanHref = `/project/${state.projectId}/item/${state.id}/scan`;

    $: renderExtract = $page.url.href.endsWith('extract');
    $: renderScan = renderExtract || $page.url.href.endsWith('scan');
    $: renderCrop = renderScan || $page.url.href.endsWith('crop');
</script>

<div class="w-full h-full flex flex-col">
    {#if state.isLoading}
        <div class="w-full h-full flex justify-center items-center">
            <Loader/>
        </div>
    {:else}
        <Breadcrumb.Root class="shrink-0 p-4">
            <Breadcrumb.List class="shrink-0">
                <Breadcrumb.Item class="shrink-0">
                    <Breadcrumb.Link href={homeHref} class="shrink-0 font-semibold">
                        {state.name}
                    </Breadcrumb.Link>
                </Breadcrumb.Item>
                {#if renderCrop}
                    <Breadcrumb.Separator/>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href={cropHref}>Crop</Breadcrumb.Link>
                    </Breadcrumb.Item>
                {/if}
                {#if renderScan}
                    <Breadcrumb.Separator/>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href={scanHref}>Scan</Breadcrumb.Link>
                    </Breadcrumb.Item>
                {/if}
                {#if renderExtract}
                    <Breadcrumb.Separator/>
                    <Breadcrumb.Item>
                        <Breadcrumb.Page>Extract</Breadcrumb.Page>
                    </Breadcrumb.Item>
                {/if}
            </Breadcrumb.List>
        </Breadcrumb.Root>
        <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
            <slot/>
        </div>
    {/if}
</div>
