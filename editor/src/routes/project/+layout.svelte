<script lang="ts">
    import {onMount} from "svelte";
    import {getCurrentUser} from "$lib/firebase.client";
    import {goto} from "$app/navigation";

    onMount(async () => {
        const user = await getCurrentUser();
        if (!user) {
            await goto('/auth/login');
        }
    });
</script>

<slot/>
