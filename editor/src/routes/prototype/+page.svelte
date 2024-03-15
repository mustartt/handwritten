<script>
    import Camera from '$lib/components/camera/Camera.svelte';
</script>

<Camera onCapture={async (data) => {
    console.log('new image')
    return new Promise((resolve) => setTimeout(resolve, 0));
}}/>
