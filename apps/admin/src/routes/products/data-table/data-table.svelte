<script lang="ts">
  import {
    createRender,
    createTable,
    Render,
    Subscribe
  } from 'svelte-headless-table';
  import { readable } from 'svelte/store';
  import * as Table from '$lib/components/ui/table';
  import Action from './action.svelte';
  import Image from '$lib/components/image.svelte';
  import CellContainer from '$lib/components/ui/table/cell-container.svelte';
  import {
    addSortBy,
    addTableFilter
  } from 'svelte-headless-table/plugins';
  import { Button } from '$lib/components/ui/button';
  import { IconArrowsUpDown } from '@tabler/icons-svelte';
  import { Input } from '$lib/components/ui/input';

  type Product = {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
  };

  export let data: Product[];

  const table = createTable(readable(data), {
    sort: addSortBy(),
    filter: addTableFilter({
      fn: ({ filterValue, value }) =>
        value.toLowerCase().includes(filterValue.toLowerCase())
    })
  });

  const columns = table.createColumns([
    table.column({
      accessor: 'id',
      header: 'ID',
      cell: (id) => {
        return createRender(CellContainer, {
          class: 'pl-2',
          text: id.value
        });
      },
      plugins: {
        sort: {
          disable: true
        }
      }
    }),
    table.column({
      accessor: 'thumbnail',
      header: '',
      cell: (item) => {
        return createRender(Image, {
          src: item.value,
          alt: item.value,
          class: 'w-14 h-14 object-cover rounded'
        });
      },
      plugins: {
        sort: {
          disable: true
        }
      }
    }),
    table.column({
      accessor: 'title',
      header: 'Title'
    }),
    table.column({
      accessor: 'category',
      header: 'Category'
    }),
    table.column({
      accessor: 'brand',
      header: 'Brand'
    }),
    table.column({
      accessor: 'price',
      header: 'Price'
    }),
    table.column({
      accessor: 'stock',
      header: 'Stock'
    }),
    table.column({
      accessor: ({ id }) => id,
      header: '',
      cell: (item) => {
        return createRender(Action, { id: item.id });
      }
    })
  ]);

  const {
    headerRows,
    pageRows,
    tableAttrs,
    tableBodyAttrs,
    pluginStates
  } = table.createViewModel(columns);

  const { filterValue } = pluginStates.filter;
</script>

<div class="flex items-center py-4">
  <Input
    class="max-w-sm"
    placeholder="Filter emails..."
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
                  <Button variant="ghost" on:click={props.sort.toggle}>
                    <Render of={cell.render()} />
                    <IconArrowsUpDown class={'ml-2 h-4 w-4'} />
                  </Button>
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
                  <Render of={cell.render()} />
                </Table.Cell>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
