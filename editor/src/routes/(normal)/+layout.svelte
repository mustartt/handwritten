<script lang="ts">
    import Navbar from "$lib/layout/Navbar.svelte";
</script>

<Navbar/>

<div class="flex-auto flex w-full overflow-y-auto">
    <slot/>
</div>
