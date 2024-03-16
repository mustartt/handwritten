<script lang="ts" context="module">
    export interface SubscriptionPlan {
        type: 'personal' | 'business',
        name: string;
        available: boolean;
        priceId: string;
        price: string;
        features: string[];
    }
</script>

<script lang="ts">
    import {BriefcaseIcon, CheckIcon, UserIcon} from 'lucide-svelte';
    import {Button} from '$lib/components/ui/button';
    import * as Card from "$lib/components/ui/card";

    import {createCheckoutSession} from "$lib/stripe.client";
    import {toast} from "svelte-sonner";
    import Loader from "$lib/components/ui/loader/Loader.svelte";

    export let card: SubscriptionPlan;

    let isLoading: boolean;

    async function redirectToStripe() {
        try {
            isLoading = true;
            window.location.href = await createCheckoutSession(
                card.priceId,
                `${window.location.origin}/dashboard`,
                window.location.href
            );
        } catch (err) {
            toast.error('Unexpected Error');
            console.error(err);
        } finally {
            isLoading = false;
        }
    }
</script>

<Card.Root class="w-full max-w-[350px]">
    <Card.Header>
        <Card.Title class="flex items-center">
            {#if card.type === 'personal'}
                <UserIcon class="size-5 mr-2"/>
                Personal
            {:else}
                <BriefcaseIcon class="size-5 mr-2"/>
                Business
            {/if}
        </Card.Title>
    </Card.Header>
    <Card.Content class="flex flex-col">
        <h1 class="font-bold text-2xl">{card.name}</h1>
        <span class="mb-2">{card.price}</span>

        {#if card.available}
            <Button on:click={redirectToStripe}>
                {#if !isLoading}
                    Select Plan
                {:else}
                    <Loader/>
                {/if}
            </Button>
        {/if}

        <h3 class="font-semibold text-lg mt-4 mb-2">Features</h3>
        <div class="prose dark:prose-invert prose-li:m-0">
            <ul>
                {#each card.features as feature}
                    <li class="flex items-center">
                        <CheckIcon class="size-4 mr-2"/>
                        {feature}
                    </li>
                {/each}
            </ul>
        </div>
    </Card.Content>
</Card.Root>
