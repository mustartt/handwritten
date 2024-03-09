<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import HeaderIcon from "$lib/layout/HeaderIcon.svelte";
    import {Loader2Icon} from "lucide-svelte";
    import GoogleIcon from "$lib/components/ui/icons/GoogleIcon.svelte";
    import {GoogleAuthProvider, signInAnonymously, signInWithPopup} from "firebase/auth";
    import {auth} from "$lib/firebase.client";
    import {toast} from "svelte-sonner";

    const bgImage = 'https://images.unsplash.com/photo-1620275765334-4ed948bb4502?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    let isLoading = false;

    const loginProviders = [
        {
            icon: GoogleIcon,
            text: 'Google',
            handler: async () => {
                const googleAuthProvider = new GoogleAuthProvider();
                try {
                    isLoading = true;
                    await signInWithPopup(auth, googleAuthProvider);
                    isLoading = false;
                } catch (err) {
                    toast.error('Failed to login');
                    console.error(err);
                }
            }
        },
        {
            icon: null,
            text: 'Continue as Guest',
            handler: async () => {
                try {
                    isLoading = true;
                    await signInAnonymously(auth);
                    isLoading = false;
                } catch (err) {
                    toast.error('Failed to login');
                    console.error(err);
                }
            }
        },
    ];
</script>

<main class="bg-background w-screen h-screen flex flex-row">
    <div class="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Button variant="ghost"
                class="absolute right-4 top-4 md:right-8 md:top-8">
            Login
        </Button>
        <div class="relative hidden lg:flex h-full flex-col bg-muted p-10 text-white dark:border-r">
            <div
                    class="absolute inset-0 bg-cover bg-center"
                    style={`background-image: url(${bgImage});`}
            />
            <div class="relative z-20 flex items-center">
                <HeaderIcon/>
            </div>
            <div class="relative z-20 mt-auto">
                <blockquote class="space-y-2">
                    <p class="text-lg">
                        &ldquo;This library has saved me countless hours of work and helped me deliver
                        stunning designs to my clients faster than ever before. Highly
                        recommended!&rdquo;
                    </p>
                    <footer class="text-sm">Sofia Davis</footer>
                </blockquote>
            </div>
        </div>
        <div class="p-8">
            <div class="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[350px]">
                <slot/>

                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <span class="w-full border-t"/>
                    </div>
                    <div class="relative flex justify-center text-xs">
                        <span class="bg-background px-2 text-muted-foreground"> Or continue with </span>
                    </div>
                </div>
                <div class="flex flex-col space-y-2">
                    {#each loginProviders as provider}
                        <Button variant="outline"
                                type="button"
                                disabled={isLoading}
                                on:click={provider.handler}>
                            {#if isLoading}
                                <Loader2Icon class="mr-2 h-4 w-4 animate-spin"/>
                            {:else}
                                <svelte:component this={provider.icon} class="mr-2 h-4 w-4"/>
                            {/if}
                            {provider.text}
                        </Button>
                    {/each}
                </div>

                <p class="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <a href="/terms" class="underline underline-offset-4 hover:text-primary">
                        Terms of Service
                    </a>
                    and
                    <a href="/privacy" class="underline underline-offset-4 hover:text-primary">
                        Privacy Policy
                    </a>
                    .
                </p>
            </div>
        </div>
    </div>
</main>
