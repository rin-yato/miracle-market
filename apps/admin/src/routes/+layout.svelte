<script>
  import { Toaster } from 'svelte-french-toast';
  import '../app.postcss';
</script>

<Toaster />
<div class="flex min-h-screen max-w-[100vw] overflow-x-hidden antialiased">
  <slot />
</div>
