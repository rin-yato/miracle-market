<script lang="ts">
  import {
    createRender,
    createTable,
    Render,
    Subscribe,
  } from 'svelte-headless-table';
  import * as Table from '$lib/components/ui/table';
  import * as HoverCard from '$lib/components/ui/hover-card';
  import Action from './action.svelte';
  import { addTableFilter } from 'svelte-headless-table/plugins';
  import { Input } from '$lib/components/ui/input';
  import { getColumnValue, type Product } from '.';
  import { IconSearch } from '@tabler/icons-svelte';
  import Pagination from '$lib/components/ui/table/pagination.svelte';
  import { readable, writable } from 'svelte/store';

  export let data: {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
  };

  const products = writable<Product[]>(data.products);

  $: products.set(data.products);

  const table = createTable(products, {
    filter: addTableFilter({
      fn: ({ filterValue, value }) =>
        value.toLowerCase().includes(filterValue.toLowerCase()),
    }),
  });

  const columns = table.createColumns([
    table.column({
      accessor: 'thumbnail',
      header: '',
      cell: () => '',
    }),
    table.column({
      accessor: 'title',
      header: 'Name',
    }),
    table.column({
      accessor: 'category',
      header: 'Category',
    }),
    table.column({
      accessor: 'brand',
      header: 'Brand',
    }),
    table.column({
      accessor: 'price',
      header: 'Price',
      cell: (price) => {
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        });

        return formatter.format(price.value);
      },
    }),
    table.column({
      accessor: 'stock',
      header: 'Stock',
      cell: (stock) => `${stock.value} in stock`,
    }),
    table.column({
      accessor: ({ id }) => id,
      header: '',
      cell: (item) => createRender(Action, { id: item.id }),
    }),
  ]);

  const {
    headerRows,
    pageRows,
    tableAttrs,
    tableBodyAttrs,
    pluginStates,
  } = table.createViewModel(columns);

  const { filterValue } = pluginStates.filter;
</script>

<div class="relative my-4 flex items-center">
  <IconSearch class="absolute left-2.5 text-muted-foreground" size={16} />
  <Input
    class="max-w-xs pl-9"
    placeholder="Search products..."
    type="text"
    bind:value={$filterValue}
  />
</div>
<div class="rounded-md border bg-white">
  <Table.Root {...$tableAttrs}>
    <Table.Header>
      {#each $headerRows as headerRow}
        <Subscribe rowAttrs={headerRow.attrs()}>
          <Table.Row>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe
                attrs={cell.attrs()}
                let:attrs
                props={cell.props()}
                let:props
              >
                <Table.Head {...attrs}>
                  <Render of={cell.render()} />
                </Table.Head>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Header>
    <Table.Body {...$tableBodyAttrs}>
      {#each $pageRows as row (row.id)}
        <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
          <Table.Row {...rowAttrs}>
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                <Table.Cell {...attrs}>
                  {#if cell.id === 'title'}
                    <div class="flex items-center gap-3">
                      <HoverCard.Root
                        openDelay={175}
                        closeDelay={200}
                        positioning={{
                          placement: 'left',
                        }}
                      >
                        <HoverCard.Trigger>
                          <img
                            src={getColumnValue(row, 'thumbnail')}
                            alt="product"
                            class="h-12 w-10 rounded bg-gray-200 object-cover"
                          />
                        </HoverCard.Trigger>
                        <HoverCard.Content class="p-0">
                          <img
                            src={getColumnValue(row, 'thumbnail')}
                            alt="product"
                            class="h-full w-full rounded bg-gray-200 object-cover"
                          />
                        </HoverCard.Content>
                      </HoverCard.Root>

                      <p class="w-[20ch] truncate">
                        <Render of={cell.render()} />
                      </p>
                    </div>
                  {:else if cell.id === 'brand'}
                    <p class="w-[15ch] truncate">
                      <Render of={cell.render()} />
                    </p>
                  {:else}
                    <Render of={cell.render()} />
                  {/if}
                </Table.Cell>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
<div class="flex justify-end py-5">
  <Pagination totalItems={data.total} perPage={data.limit} />
</div>
