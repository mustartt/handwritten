<script lang="ts">
    import {createPortalLink, getActiveSubscriptions} from "$lib/stripe.client";
    import Loader from "$lib/components/ui/loader/Loader.svelte";
    import SubscriptionItem from "./(components)/SubscriptionItem.svelte";
    import {Button} from "$lib/components/ui/button";
    import {toast} from "svelte-sonner";

    let promise = getActiveSubscriptions();

    let isPortalLoading = false;

    async function gotoPortal() {
        isPortalLoading = true;
        try {
            window.location.href = await createPortalLink();
        } catch (err) {
            toast.error('Unexpected error');
            console.error(err);
        } finally {
            isPortalLoading = false;
        }
    }
</script>

<svelte:head>
    <title>Dashboard: Subscriptions</title>
</svelte:head>

<h2 class="font-semibold text-xl">Subscriptions</h2>
<p class="text-muted-foreground text-sm max-w-lg">
    Manage and keep track of your subscription plans.
    For more detailed information or to make changes to your plans,
    use the following
</p>

<main class="flex flex-col mt-4">
    <Button on:click={gotoPortal} class="max-w-[275px]">
        {#if isPortalLoading}
            <Loader/>
        {:else}
            Manage Payments and Subscriptions
        {/if}
    </Button>

    <h2 class="font-semibold text-lg mt-8 mb-2">Current Subscriptions</h2>
    {#await promise}
        <Loader/>
    {:then subs}
        <div class="flex flex-col space-y-2">
            {#each subs as sub}
                <SubscriptionItem item={sub}/>
            {/each}
        </div>
    {:catch error}
        {@debug error}
        Failed to load active subscriptions
    {/await}

</main>

