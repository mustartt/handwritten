<script lang="ts">
    import * as Sheet from "$lib/components/ui/sheet";

    import {Button} from '$lib/components/ui/button/index.js';
    import {AlignRightIcon} from 'lucide-svelte';
    import HeaderIcon from "$lib/layout/HeaderIcon.svelte";
    import {goto} from "$app/navigation";

    const navLinks = [
        {
            text: "Products",
            variant: "ghost" as const,
            path: "/products",
        },
        {
            text: "Pricing",
            variant: "ghost" as const,
            path: "/plans",
        },
        {
            text: "Blog",
            variant: "ghost" as const,
            path: "/blog",
        }
    ];
</script>

<nav class="flex flex-row z-10 w-full justify-center items-center h-16 px-6">
    <div class="flex flex-row w-full justify-between items-center max-w-2xl lg:max-w-4xl 2xl:max-w-7xl">
        <HeaderIcon/>
        <div class="hidden md:flex flex-row justify-center items-center space-x-2">
            {#each navLinks as link}
                <Button variant={link.variant} on:click={() => goto(link.path)}>{link.text}</Button>
            {/each}
        </div>
        <Button class="hidden md:inline-flex">Get Started</Button>
        <div class="md:hidden">
            <Sheet.Root>
                <Sheet.Trigger asChild let:builder>
                    <Button variant="ghost" size="icon" builders={[builder]}>
                        <AlignRightIcon class="w-6 h-6"/>
                    </Button>
                </Sheet.Trigger>
                <Sheet.Content side="top" class="space-y-4">
                    <Sheet.Title>
                        <HeaderIcon/>
                    </Sheet.Title>

                    {#each navLinks as link}
                        <Button variant={link.variant} on:click={() => goto(link.path)}>{link.text}</Button>
                    {/each}

                    <Sheet.Footer>
                        <Button>Get Started</Button>
                    </Sheet.Footer>
                </Sheet.Content>
            </Sheet.Root>
        </div>
    </div>
</nav>

