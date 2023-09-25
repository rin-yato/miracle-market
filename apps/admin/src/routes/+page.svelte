<script>
  import { buttonVariants } from '$lib/components/ui/button';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
</script>

<main
  class="flex min-h-screen flex-col items-center justify-center gap-10"
>
  <div class="flex gap-5">
    <Button variant="default">Click me</Button>
    <Button variant="secondary">Click me</Button>
    <Button variant="outline">Login</Button>
  </div>

  <Dialog.Root>
    <Dialog.Trigger class={buttonVariants({ variant: 'outline' })}
      >Open dialog</Dialog.Trigger
    >
    <Dialog.Content>
      <p>Dialog content</p>
    </Dialog.Content>
  </Dialog.Root>
</main>
