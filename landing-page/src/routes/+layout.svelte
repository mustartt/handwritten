<script lang="ts">
    import './styles.css';
    import Navbar from "$lib/navbar/Navbar.svelte";
    import {Separator} from "$lib/components/ui/separator";
</script>

<Navbar/>

<div class="flex flex-col w-full space-y-2 overflow-y-auto">
    <slot/>
    <div class="flex bg-card w-full justify-center items-center h-16">
        <div class="container flex justify-between">
            <div>
                Some Text
            </div>
            <div>
                Copyright &copy 2024, Handwritten
            </div>
        </div>
    </div>
</div>

