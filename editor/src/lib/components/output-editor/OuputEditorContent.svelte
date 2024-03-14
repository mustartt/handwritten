<script lang="ts">
    import {Carta, CartaEditor} from "carta-md";
    import './editor-styles.scss';
    import {math} from "@cartamd/plugin-math";
    import {code} from "@cartamd/plugin-code";
    import 'carta-md/light.css';

    import '@cartamd/plugin-code/default.css';
    import 'katex/dist/katex.css';
    import {editor, queueSaveItem} from "$lib/store/project";
    import {get} from "svelte/store";
    import {onDestroy} from "svelte";

    export let itemId: string | undefined;

    let value = '';
    let writeDebounceTimeout: NodeJS.Timeout;

    const carta = new Carta({
        extensions: [
            math(),
            code({lineNumbering: true})
        ]
    });

    const unsub = editor.subscribe(store => {
        if (store.item) {
            value = store.item.output.extractedText;
        } else {
            value = '';
        }
    });

    onDestroy(unsub);

    $: {
        if (itemId !== undefined) {
            console.log('reactive on value change');
            clearTimeout(writeDebounceTimeout);
            writeDebounceTimeout = setTimeout(() => {
                editor.update(store => {
                    if (store.item && store.item.id === itemId) {
                        store.item.output.extractedText = value;
                    }
                    return store;
                });
                if (itemId) {
                    console.log('calling save item');
                    queueSaveItem(itemId);
                }
            }, 1000);
        }
    }
</script>

<CartaEditor {carta} theme="github" mode="auto" scroll="sync" textarea={{autocomplete: "off"}} bind:value/>
