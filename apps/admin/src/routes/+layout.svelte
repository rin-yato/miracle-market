<script>
  import Header from '$lib/components/header.svelte';
  import Sidebar from '$lib/components/sidebar.svelte';
  import '../app.postcss';
</script>

<div class="flex min-h-screen w-screen overflow-x-hidden">
  <Sidebar />
  <div class="flex-1 flex flex-col">
    <Header />
    <slot />
  </div>
</div>
