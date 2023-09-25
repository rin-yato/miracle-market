<script>
  import { DataTable } from './data-table';

  export let data;
</script>

<main class="flex-1 px-20 py-10">
  <DataTable data={data.products} />
</main>
