<script lang="ts">
    import {Carta, CartaEditor} from "carta-md";
    import './editor-styles.scss';
    import {math} from "@cartamd/plugin-math";
    import {code} from "@cartamd/plugin-code";
    import 'carta-md/light.css';

    import '@cartamd/plugin-code/default.css';
    import 'katex/dist/katex.css';
    import {editor} from "$lib/store/project";
    import {onDestroy} from "svelte";

    export let itemId: string | undefined;

    let value = '';

    const carta = new Carta({
        extensions: [
            math(),
            code({lineNumbering: true})
        ]
    });

    const unsub = editor.subscribe(store => {
        value = store.item?.output.extractedText || '';
    });

    $: {

    }

    onDestroy(unsub);
</script>

<CartaEditor {carta} theme="github" mode="auto" scroll="sync" textarea={{autocomplete: "off"}} bind:value/>
