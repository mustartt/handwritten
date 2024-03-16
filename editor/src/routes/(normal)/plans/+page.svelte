<script lang="ts">
    import {Button} from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import {UserIcon} from "lucide-svelte";
    import {onMount} from "svelte";
    import {collection, onSnapshot, addDoc} from "firebase/firestore";
    import {auth, firestore, getCurrentUser} from "$lib/firebase.client";
    import {createCheckoutSession, getActiveSubscriptions} from "$lib/stripe.client";

    onMount(async () => {

    });

    async function test() {
        // const url = await createCheckoutSession('price_1Ouldt07NC6H9Ex49FutrwDP');
        // console.log(url);

        // const result = await getActiveSubscriptions();
        // console.log(result);

        console.log(await auth.currentUser?.getIdToken());
    }

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
            <div class="flex w-full justify-center">
                <Card.Root class="w-full max-w-[350px]">
                    <Card.Header>
                        <Card.Title class="flex items-center">
                            <UserIcon class="size-5 mr-2"/>
                            Personal
                        </Card.Title>
                    </Card.Header>
                    <Card.Content class="flex flex-col">
                        <h1 class="font-bold text-2xl">Free</h1>
                        <span class="mb-2">CA$0 / month</span>

                        <h3 class="font-semibold text-lg mt-4 mb-2">Features</h3>
                        <div class="prose prose-invert prose-li:m-0">
                            <ul>
                                <li>Forever free</li>
                                <li>3 projects</li>
                                <li>25 project files / project</li>
                                <li>25 document scans / month</li>
                                <li>15 basic OCR operations / month</li>
                            </ul>
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
            <div class="flex w-full justify-center">
                <Card.Root class="w-full max-w-[350px]">
                    <Card.Header>
                        <Card.Title class="flex items-center">
                            <UserIcon class="size-5 mr-2"/>
                            Personal
                        </Card.Title>
                    </Card.Header>
                    <Card.Content class="flex flex-col">
                        <h1 class="font-bold text-2xl">Basic</h1>
                        <span class="mb-2">CA$10 / month</span>

                        <Button>
                            Upgrade now!
                        </Button>

                        <h3 class="font-semibold text-lg mt-4 mb-2">Features</h3>
                        <div class="prose prose-invert prose-li:m-0">
                            <ul>
                                <li>10 projects</li>
                                <li>100 project files / project</li>
                                <li>200 document scans / month</li>
                                <li>100 advanced OCR operations / month</li>
                                <li>access to advanced features</li>
                            </ul>
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
            <div class="flex w-full justify-center">
                <Card.Root class="w-full max-w-[350px]">
                    <Card.Header>
                        <Card.Title class="flex items-center">
                            <UserIcon class="size-5 mr-2"/>
                            Personal
                        </Card.Title>
                    </Card.Header>
                    <Card.Content class="flex flex-col">
                        <h1 class="font-bold text-2xl">Premium</h1>
                        <span class="mb-2">CA$25 / month</span>

                        <Button>
                            Upgrade now!
                        </Button>

                        <h3 class="font-semibold text-lg mt-4 mb-2">Features</h3>
                        <div class="prose prose-invert prose-li:m-0">
                            <ul>
                                <li>100 projects</li>
                                <li>unlimited project files / project</li>
                                <li>unlimited document scans / month</li>
                                <li>1000 advanced OCR operations / month</li>
                                <li>access to advanced features</li>
                                <li>advanced AI Tooling</li>
                            </ul>
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
        </div>
    </div>
</div>
