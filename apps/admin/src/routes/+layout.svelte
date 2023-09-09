<script>
  import Header from '$lib/components/header.svelte';
  import Sidebar from '$lib/components/sidebar.svelte';
  import '../app.postcss';
</script>

<div class="flex min-h-screen">
  <Sidebar />
  <div class="flex-1">
    <Header />
    <slot />
  </div>
</div>
