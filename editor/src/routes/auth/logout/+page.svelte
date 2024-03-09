<script lang="ts">
    import {onMount} from "svelte";
    import {auth} from '$lib/firebase.client';
    import {goto} from "$app/navigation";

    onMount(async () => {
        await auth.signOut();
        await goto('/auth/login');
    });
</script>
