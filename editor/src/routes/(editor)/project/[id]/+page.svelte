<script>
    import {Carta, CartaEditor, CartaViewer} from 'carta-md';
    import 'carta-md/default.css'; /* Default theme */
    import 'carta-md/light.css'; /* Markdown input theme */
    import 'katex/dist/katex.css';
    import '@cartamd/plugin-code/default.css';
    import {math} from "@cartamd/plugin-math";
    import {code} from "@cartamd/plugin-code";

    const carta = new Carta({
        // Remember to use a sanitizer to prevent XSS attacks!
        // More on that below
        // sanitizer: ...
        extensions: [math(), code()],
        mode: 'tabs',
    });

    let value = '123';
</script>

<div class="flex-auto flex prose prose-zinc dark:prose-invert">
    <CartaEditor {carta} bind:value/>
</div>

