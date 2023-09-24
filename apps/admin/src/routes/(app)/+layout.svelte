<script>
  import Header from '$lib/components/header.svelte';
  import Sidebar from '$lib/components/sidebar.svelte';
</script>

<Sidebar />
<div class="flex-1 flex flex-col">
  <Header />
  <slot />
</div>
