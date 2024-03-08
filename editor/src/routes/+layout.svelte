<script lang="ts">
    import './styles.css';
    import Navbar from "$lib/layout/Navbar.svelte";
    import {Separator} from "$lib/components/ui/separator";
    import HomeSidebar from "$lib/layout/HomeSidebar.svelte";
</script>

<Navbar/>

<div class="flex-auto flex w-full overflow-y-auto">
    <slot/>
</div>

