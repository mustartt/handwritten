<script lang="ts">
    import {Button} from '$lib/components/ui/button/index.js';
    import {AlignRightIcon} from 'lucide-svelte';

    import * as Sheet from "$lib/components/ui/sheet";
    import * as Accordion from "$lib/components/ui/accordion";
</script>
<nav class="flex flex-row fixed w-full h-16 bg-gradient-to-b from-background/50 from-10% to-transparent justify-center items-center px-6">
    <div class="flex flex-row w-full justify-between items-center max-w-2xl lg:max-w-4xl 2xl:max-w-7xl">
        <h1 class="font-bold text-xl">
            Handwritten
        </h1>
        <div class="hidden md:flex flex-row justify-center items-center space-x-2">
            <Button variant="ghost">Products</Button>
            <Button variant="ghost">About</Button>
            <Button variant="default">Get Started</Button>
        </div>
        <div class="md:hidden">
            <Sheet.Root>
                <Sheet.Trigger asChild let:builder>
                    <Button variant="ghost" size="icon" builders={[builder]}>
                        <AlignRightIcon class="w-6 h-6"/>
                    </Button>
                </Sheet.Trigger>
                <Sheet.Content side="top" class="space-y-4">
                    <Sheet.Title>
                        <h1 class="font-bold text-xl">
                            Handwritten
                        </h1>
                    </Sheet.Title>
                    <Accordion.Root class="w-full">
                        <Accordion.Item value="item-1">
                            <Accordion.Trigger>Products</Accordion.Trigger>
                            <Accordion.Content>
                                Yes. It adheres to the WAI-ARIA design pattern.
                            </Accordion.Content>
                        </Accordion.Item>
                        <Accordion.Item value="item-2">
                            <Accordion.Trigger>About</Accordion.Trigger>
                            <Accordion.Content>
                                Yes. It comes with default styles that matches the other components'
                                aesthetic.
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion.Root>
                    <Sheet.Footer>
                        <Button>Get Started</Button>
                    </Sheet.Footer>
                </Sheet.Content>
            </Sheet.Root>
        </div>
    </div>
</nav>
