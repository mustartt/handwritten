<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import {Separator} from "$lib/components/ui/separator";
    // @ts-ignore
    import Youtube from "svelte-youtube-embed";
    import {onMount} from "svelte";
    import * as Card from "$lib/components/ui/card";
    import {ScanIcon, SearchIcon, SparklesIcon} from "lucide-svelte";
    import {CompareImage} from "svelte-compare-image";

    import ScannerBefore from '$lib/images/docscanner-before.jpg';
    import ScannerAfter from '$lib/images/docscanner-after.jpg';

    onMount(() => {
    });

    const EXAMPLE_EXTRACTED_TEXT = `
                    # Gene Expression
                    - process of copying DNA to produce protein.
                    - A stretch of DNA that codes for a protein is a **gene**
                    - An RNA copy is made (*transcription*)
                    - The RNA is made into protein (*translation*) at ribosome.

                    DNA —> transcription —> RNA —> translation —> protein

                    # RNA Types
                    - **mRNA** - messenger *from DNA sent to the ribosome*.
                    - **tRNA** - *Transfer RNA* (ribozomes are made out of RNA & protein)
                    - **rRNA** - transfer amino acid to ribosome to build the protein.

                    # Transcription
                    - DNA -> RNA
                    - A segment of DNA serves as a template for RNA.
                    - RNA produced is mRNA
                    - 3 steps: **Initiation** Elongation Termination

                    **Initiation**: RNA polymerase binds to a promoter site (start of the gene)
                    DNA Helix is opened by RNA polymerase
                    **Elongation**: complementary base binding occurs
                    Free RNA nucleotides bind to one of 2
                    unzipped DNA strands 5' end.
                    **Termination**: RNA polymerase reaches the termination sequence.
                    No more nucleotides are added.

                    - Processing of RNA *posttranscription*
                    - Primary mRNA become mRNA
                    - Primary RNA has Introns and Exons
                    - Intron - *useless*
                    - Exon - *protein or gene expressed*
                    - Intron are *removed*.
                    - Ribozyme splices Exon segments together.
                    - mRNA to be translated into protein.`
        .replace(/  +/g, '');
</script>

<style>
    .background:before {
        content: ' ';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        opacity: 0.5;
        background: top right no-repeat url('$lib/images/background-blur.svg');
        background-size: 1000px;
    }
</style>

<svelte:head>
    <title>Home</title>
</svelte:head>

<div class="background flex flex-col md:flex-row justify-center items-center w-full min-h-[400px] lg:min-h-[550px] lg:space-x-8">
    <div class="flex flex-col justify-center items-center md:items-start px-4 space-y-4 lg:space-y-8">
        <h1 class="font-extrabold text-4xl lg:text-5xl">
            Handwritten
        </h1>
        <p class="text-pretty text-center md:text-left max-w-[400px] md:max-w-72 lg:max-w-96">
            Digitizes handwritten notes, documents, blackboards, and videos into editable
            text in seconds. Streamline your workflow, enhance productivity, and never miss a detail again.
        </p>
        <div class="flex space-x-4">
            <Button size="lg" variant="outline" class="hidden sm:inline-flex">
                Pricing
            </Button>
            <Button size="lg">
                Get Started
            </Button>
        </div>
    </div>
    <div class="hidden md:flex bg-card h-52 lg:h-64 rounded">
        <Youtube id="Ay0oet5PJG8" animations={false}/>
    </div>
</div>

<Separator/>

<div class="container">
    <h1 class="text-3xl font-bold text-center mb-2">Features</h1>
    <section
            class="flex flex-col items-center md:flex-row md:items-start space-y-2 md:space-y-0 space-x-0 md:space-x-4">
        <Card.Root class="flex-1 max-w-[450px]">
            <Card.Header>
                <Card.Title>
                    <div class="flex items-center">
                        <ScanIcon class="size-5 mr-1.5"/>
                        <h3 class="text-xl -mt-0.5">Document Scanner</h3>
                    </div>
                </Card.Title>
                <Card.Description>
                    Uses Computer Vision to automatically correct perspective
                    and get high quality scans from photos.
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <CompareImage
                        imageLeftSrc={ScannerBefore}
                        imageLeftAlt="left"
                        imageRightSrc={ScannerAfter}
                        imageRightAlt="right"
                        --handle-size="1.5rem"
                        --handle-background-color="rgba(0, 0, 0, 0.6)"
                        --handle-border-width="0.125rem"
                        --slider-color="#ffffff"
                        --slider-width="0.125rem"
                ></CompareImage>
            </Card.Content>
            <Card.Footer>
                <p>Before and after Scanning</p>
            </Card.Footer>
        </Card.Root>
        <Card.Root class="flex-1 max-w-[450px]">
            <Card.Header>
                <Card.Title>
                    <div class="flex items-center">
                        <SparklesIcon class="size-5 mr-1.5"/>
                        <h3 class="text-xl -mt-0.5">Extract Text</h3>
                    </div>
                </Card.Title>
                <Card.Description>
                    Uses AI and OCR to extract text while preserving document structure.
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <pre class="prose px-2 bg-muted rounded-lg max-h-96 overflow-y-auto overflow-x-hidden text-wrap">
                    {EXAMPLE_EXTRACTED_TEXT}
                </pre>
            </Card.Content>
            <Card.Footer>
                <p>Extracted Text</p>
            </Card.Footer>
        </Card.Root>
        <Card.Root class="flex-1 max-w-[450px]">
            <Card.Header>
                <Card.Title>
                    <div class="flex items-center">
                        <SearchIcon class="size-5 mr-1.5"/>
                        <h3 class="text-xl -mt-0.5">Search</h3>
                    </div>
                    <Card.Description>
                        Uses LLMs to answer your questions on your handwritten notes and documents.
                    </Card.Description>
                </Card.Title>
            </Card.Header>
            <Card.Content>
                <p>Card Content</p>
            </Card.Content>
            <Card.Footer>
                <p>Card Footer</p>
            </Card.Footer>
        </Card.Root>
    </section>
</div>
<div class="h-64"></div>

