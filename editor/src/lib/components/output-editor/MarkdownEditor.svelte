<script lang="ts">
    import {Carta, CartaEditor} from "carta-md";
    import './editor-styles.scss';
    import {math} from "@cartamd/plugin-math";
    import {code} from "@cartamd/plugin-code";
    import 'carta-md/light.css';

    import '@cartamd/plugin-code/default.css';
    import 'katex/dist/katex.css';

    export let onValueChange = (value: string) => {
    };

    export let initialValue: string;

    let value: string = initialValue;

    const carta = new Carta({
        extensions: [
            math(),
            code({lineNumbering: true})
        ]
    });

    let debounceTimeout: NodeJS.Timeout;
    $: {
        value;
        clearTimeout(debounceTimeout);
        setTimeout(() => {
            onValueChange(value);
        }, 500);
    }
</script>

<CartaEditor {carta} theme="github" mode="auto" scroll="sync" textarea={{autocomplete: "off"}} bind:value/>
