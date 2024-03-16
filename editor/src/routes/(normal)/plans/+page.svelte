<script lang="ts">
    import {Button} from "$lib/components/ui/button/index.js";
    import {auth, firestore, getCurrentUser} from "$lib/firebase.client";
    import SubscriptionCard, {type SubscriptionPlan} from "./(components)/SubscriptionCard.svelte";


    async function test() {
        // const url = await createCheckoutSession('price_1Ouldt07NC6H9Ex49FutrwDP');
        // console.log(url);

        // const result = await getActiveSubscriptions();
        // console.log(result);

        console.log(await auth.currentUser?.getIdToken());
    }

    const plans: SubscriptionPlan[] = [
        {
            type: 'personal',
            name: 'Free',
            available: false,
            priceId: '',
            price: 'CA$0 / month',
            features: [
                'Forever free',
                '3 projects',
                '25 project files / project',
                '25 document scans / month',
                '15 basic OCR operations / month'
            ]
        },
        {
            type: 'personal',
            name: 'Basic',
            available: true,
            priceId: 'price_1OuldP07NC6H9Ex4v7hwD4G7',
            price: 'CA$10 / month',
            features: [
                '10 projects',
                '100 project files / project',
                '200 document scans / month',
                '100 advanced OCR operations / month',
                'access to advanced features'
            ]
        },
        {
            type: 'personal',
            name: 'Premium',
            available: true,
            priceId: 'price_1Ouldt07NC6H9Ex49FutrwDP',
            price: 'CA$25 / month',
            features: [
                '100 projects',
                'unlimited project files / project',
                'unlimited document scans / month',
                '1000 advanced OCR operations / month',
                'access to advanced features',
                'advanced AI Tooling'
            ]
        }
    ];

</script>

<style>
    .custom-grid-auto {
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
</style>


<div class="flex flex-col w-full">
    <div class="flex flex-col my-16 mx-6 space-y-4 items-center justify-center">
        <h1 class="font-bold text-2xl">
            Available Plans
        </h1>
        <p class="max-w-2xl text-center">
            Explore the full capability of Handwritten and get access to advanced feature not available on the free
            plans.
        </p>
        <Button on:click={test}>
            Test
        </Button>
    </div>
    <div class="w-full flex justify-center">
        <div class="max-w-6xl flex flex-col w-full items-center md:items-start p-4 space-y-4 md:space-y-0 md:grid md:gap-4 custom-grid-auto">
            {#each plans as plan}
                <div class="flex w-full justify-center">
                    <SubscriptionCard card={plan}/>
                </div>
            {/each}
        </div>
    </div>
</div>
