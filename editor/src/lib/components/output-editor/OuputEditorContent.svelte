<script lang="ts">
    import {Carta, CartaEditor} from "carta-md";
    import './editor-styles.scss';
    import {math} from "@cartamd/plugin-math";
    import {code} from "@cartamd/plugin-code";
    import 'carta-md/light.css';

    import '@cartamd/plugin-code/default.css';
    import 'katex/dist/katex.css';

    const carta = new Carta({
        extensions: [
            math(),
            code({lineNumbering: true})
        ]
    });

    let value = ``;

</script>

<div class="flex flex-col w-full h-full">
    <CartaEditor {carta} theme="github" mode="split" bind:value/>
</div>
