<script lang="ts">
    import * as Avatar from '$lib/components/ui/avatar';
    import {user} from "$lib/store/session";
</script>

{#if $user}
    <div class="flex items-center">
        <Avatar.Root>
            <Avatar.Image src={$user.picture} alt="@user"/>
            <Avatar.Fallback>CN</Avatar.Fallback>
        </Avatar.Root>
        <div class="hidden ml-2 sm:flex flex-col -space-y-1">
            <h3 class="font-semibold text-nowrap">{$user.name}</h3>
            <p class="font-light text-muted-foreground">{$user.email}</p>
        </div>
    </div>
{/if}
