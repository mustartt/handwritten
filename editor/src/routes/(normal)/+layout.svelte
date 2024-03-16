<script>
    import Navbar from '$lib/components/navbar/Navbar.svelte';
</script>

<Navbar/>

<div class="flex-1 overflow-x-hidden overflow-y-auto min-h-0">
    <slot/>
</div>
