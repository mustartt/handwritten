<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import {cn} from "$lib/utils";
    import {page} from "$app/stores";

    export let idx: number;
    export let id: string;
    export let name: string;
    export let meta: string;
    export let image: string = '/images/example-note-2.jpg';
</script>

<a class={cn(
        "list-group-item border-2 border-transparent relative flex flex-col w-full rounded bg-card justify-center items-center overflow-hidden",
        $page.url.searchParams.get('item') === id ? "border-primary" : ""
    )}
   tabindex="0"
   href={`?item=${id}`}
   role="button"
   on:click={() => console.log(id)}>
    <span class="absolute flex left-2 top-2 justify-center items-center bg-secondary size-8 rounded-full">
        {idx}
    </span>
    <img src={image}
         alt="preview"
         class="object-cover w-full h-48"/>
    <div class="flex-none h-10 px-4 w-full flex justify-between items-center">
        <div class="flex justify-center items-center space-x-2">
            <span class="font-semibold">{name}</span>
            <span class="mt-1 text-sm text-muted-foreground">{meta}</span>
        </div>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="lucide lucide-ellipsis-vertical size-5">
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="12" cy="5" r="1"/>
                    <circle cx="12" cy="19" r="1"/>
                </svg>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Group>
                    <DropdownMenu.Item>Rename</DropdownMenu.Item>
                    <DropdownMenu.Item>Delete</DropdownMenu.Item>
                </DropdownMenu.Group>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div>
</a>

