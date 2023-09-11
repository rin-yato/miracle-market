<script>
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
</script>

<main class="min-h-screen flex flex-col gap-10 justify-center items-center">
	<div class="flex gap-5">
		<Button variant="default">Click me</Button>
		<Button variant="secondary">Click me</Button>
		<Button variant="outline">Login</Button>
	</div>

	<Dialog.Root>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Open dialog</Dialog.Trigger>
		<Dialog.Content>
			<p>Dialog content</p>
		</Dialog.Content>
	</Dialog.Root>
</main>
