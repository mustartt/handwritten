<script lang="ts">
    import {getContext} from "svelte";
    import type {EditorStore} from "$lib/store/image-editor";

    const editor: EditorStore = getContext('editor');
</script>

<pre class="w-72">
    {JSON.stringify($editor, undefined, 2)}
</pre>
