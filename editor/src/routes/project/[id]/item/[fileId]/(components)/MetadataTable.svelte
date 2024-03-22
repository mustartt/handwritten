<script lang="ts">
    import * as Table from "$lib/components/ui/table";

    export let items: { name: string, value: string }[] = [];
</script>

<h3 class="ml-2 text-lg font-semibold">File Metadata</h3>

<Table.Root>
    <Table.Caption>File Metadata</Table.Caption>
    <Table.Header>
        <Table.Row>
            <Table.Head class="w-[100px]">Name</Table.Head>
            <Table.Head>Value</Table.Head>
        </Table.Row>
    </Table.Header>
    <Table.Body>
        {#each items as item}
            <Table.Row>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.value}</Table.Cell>
            </Table.Row>
        {/each}
    </Table.Body>
</Table.Root>
