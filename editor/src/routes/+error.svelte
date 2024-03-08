<script lang="ts">
    import {page} from '$app/stores';
</script>

<div class="flex justify-center items-center w-full h-screen">
    <div>
        <h1 class="text-4xl font-bold">{$page.error?.message}</h1>
    </div>
</div>
