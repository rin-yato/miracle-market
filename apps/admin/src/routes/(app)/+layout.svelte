<script>
  import Header from '$lib/components/header.svelte';
  import Sidebar from '$lib/components/sidebar.svelte';
</script>

<Sidebar />
<div class="flex flex-1 flex-col">
  <Header />
  <slot />
</div>
