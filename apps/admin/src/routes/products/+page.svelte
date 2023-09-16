<script>
  import { DataTable } from './data-table';

  export let data;
</script>

<main class="flex-1 py-10 px-20">
  <DataTable data={data.products.products} />
</main>
