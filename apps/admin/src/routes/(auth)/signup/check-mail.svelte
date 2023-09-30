<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import { IconMailFast, IconMailForward } from '@tabler/icons-svelte';

  export let email: string;
  export let open: boolean;
</script>

<Dialog.Root {open} closeOnEscape={false} closeOnOutsideClick={false}>
  <Dialog.Content class="sm:max-w-[425px]" closeButton={false}>
    <Dialog.Header class="!text-center">
      <Dialog.Title>Verify your email</Dialog.Title>
      <Dialog.Description class="px-5">
        We've sent an email to <strong>{email}</strong>. Click the link in
        the email to verify your account.
      </Dialog.Description>
    </Dialog.Header>

    <IconMailFast class="mx-auto text-gray-200" size={124} />

    <Dialog.Footer>
      <Button
        class="w-full"
        href="https://mail.google.com/mail/u/0/#inbox"
      >
        <IconMailForward class="mr-2" size={18} />
        Go to mail
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
