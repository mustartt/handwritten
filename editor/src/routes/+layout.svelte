<script lang="ts">
    import './styles.css';

    import {onDestroy, onMount} from 'svelte';
    import {session} from '$lib/store/session';
    import {goto} from '$app/navigation';
    import {onAuthStateChanged} from 'firebase/auth';
    import {auth} from '$lib/firebase.client';
    import {Toaster} from "$lib/components/ui/sonner";
    import {toast} from "svelte-sonner";
    import {ModeWatcher} from "mode-watcher";

    // let authUnsub: any;
    let displayLogoutTimeoutID: NodeJS.Timeout;

    onMount(async () => {
        setTimeout(() => {
            const warning = document.getElementsByClassName("firebase-emulator-warning");
            for (const element of warning) {
                (element as HTMLElement).style.display = "none";
                toast.info("Disabled firebase emulator warnings");
            }
        }, 3000);

        onAuthStateChanged(auth, user => {
            console.log("auth:changed", user);
            session.update((value) => {
                value.isLoading = true;
                return value;
            });
            session.update((value) => {
                if (user) {
                    const name = user.displayName || "Guest User";
                    const defaultProfile = new URL("https://ui-avatars.com/api");
                    defaultProfile.searchParams.append("name", name);
                    defaultProfile.searchParams.append("background", "random");
                    value = {
                        isLoading: false,
                        user: {
                            name: name,
                            picture: user.photoURL || defaultProfile.toString(),
                            userID: user.uid,
                            email: user.email || user.uid,
                        }
                    };
                } else {
                    if (value.user) {
                        displayLogoutTimeoutID = setTimeout(() => {
                            clearTimeout(displayLogoutTimeoutID);
                            toast.info("You are now signed out!");
                        }, 500);
                        session.set({
                            isLoading: false,
                            user: null
                        });
                    }
                }
                return value;
            });
        });
    });

    // onDestroy(authUnsub);
</script>

<Toaster closeButton={true} expand={true}/>
<ModeWatcher/>

<slot/>
