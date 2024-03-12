<script>
    import {Carta, CartaEditor} from 'carta-md';
    import 'carta-md/default.css'; /* Default theme */
    import 'carta-md/light.css'; /* Markdown input theme */
    import 'katex/dist/katex.css';
    import '@cartamd/plugin-code/default.css';
    import {math} from '@cartamd/plugin-math';
    import {code} from '@cartamd/plugin-code';

    const carta = new Carta({
        // Remember to use a sanitizer to prevent XSS attacks!
        // More on that below
        // sanitizer: ...
        extensions: [math(), code()],
    });

    let value =
        `
# Heading 1

Hello world

| A | B |
|---|---|
| r | c |

\`\`\`js
function add(a: number, b: number) {
    return a + b;
}
\`\`\`

`;
</script>

<style global>

</style>

<div class="h-full w-64 bg-teal-500"></div>
<div class="flex flex-1 bg-cyan-500">
    <div class="flex h-full w-full flex-col">
        <div class="h-16 w-full bg-green-500"></div>
        <div class="min-h-0 flex-1 flex-col overflow-y-scroll">
            <div class="h-[200vh] w-full bg-red-500"></div>
        </div>
    </div>
</div>
