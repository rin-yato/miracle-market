<script lang="ts">
  import * as Form from '$lib/components/ui/form';
  import { Button } from '$lib/components/ui/button';
  import { Separator } from '$lib/components/ui/separator';
  import { cn, handleFormSubmit, parseError } from '$lib/utils';
  import { eden } from 'libs';
  import toast from 'svelte-french-toast';

  import { signupSchema } from './schema';
  import { Icons } from '$lib/components/icons';
  import { IconLoader2, IconUserCheck } from '@tabler/icons-svelte';
  import { appConfigs } from '$lib/constants';
  import CheckMail from './check-mail.svelte';

  export let data;

  const form = data.form;

  let isSubmitting = false;

  let checkMailProps = {
    open: false,
    email: '',
  };

  const handleSubmit = handleFormSubmit(form, async (event) => {
    if (isSubmitting) return;

    isSubmitting = true;

    const toastId = toast.loading('Signing up...');

    const { email, password } = event.form.data;

    const { error } = await eden.auth['sign-up'].post({
      email,
      password,
      redirectUrl: `${appConfigs.url}/products`,
    });

    if (error) {
      const err = parseError(error.value);

      toast.error(err.message, { id: toastId });
      isSubmitting = false;
      return;
    }

    toast.success('Signed up successfully! Please verify your email.', {
      id: toastId,
    });

    checkMailProps = {
      open: true,
      email,
    };
  });
</script>

<CheckMail {...checkMailProps} />

<main class="flex flex-1 flex-col items-center justify-center">
  <Button
    disabled={isSubmitting}
    variant="outline"
    href="/signin"
    class="fixed right-5 top-5"
  >
    <IconUserCheck size={16} class="mr-2" />
    Mean account hz?
  </Button>
  <section class="rounded-2xl border bg-white px-16 pb-16 [&>*]:max-w-xs">
    <div class="mb-6 mt-10">
      <h1>Sign Up</h1>
      <p class="text-muted-foreground">
        Welcome to Miracle Market. Let's get you started with creating an
        account.
      </p>
    </div>

    <Form.Root
      {form}
      schema={signupSchema}
      options={{
        onUpdate: (event) => {
          handleSubmit(event);
        },
        SPA: true,
      }}
      let:config
      class=" space-y-4"
    >
      <Form.Field {config} name="email">
        <Form.Item>
          <Form.Label>Email</Form.Label>
          <Form.Input />
          <Form.Validation />
        </Form.Item>
      </Form.Field>
      <Form.Field {config} name="password">
        <Form.Item>
          <Form.Label>Password</Form.Label>
          <Form.Input />
          <Form.Validation />
        </Form.Item>
      </Form.Field>
      <Button
        disabled={isSubmitting}
        variant="link"
        class={cn(
          '!my-0 px-0',
          isSubmitting && 'pointer-events-none opacity-50',
        )}
        href="/forgot-password"
      >
        Forgot Password?
      </Button>
      <Form.Button disabled={isSubmitting} class="w-full">
        {#if isSubmitting}
          <IconLoader2 size={16} class={cn('mr-2 animate-spin')} />
        {/if}
        Sign Up
      </Form.Button>
    </Form.Root>

    <div class="my-5 flex items-center">
      <Separator class="flex-1" />
      <span class="text-muted-foreground mx-4">or sign up with</span>
      <Separator class="flex-1" />
    </div>

    <div>
      <Button
        variant="outline"
        class={cn(
          'w-full',
          isSubmitting && 'pointer-events-none opacity-50',
        )}
        disabled={isSubmitting}
        href={appConfigs.api.googleAuth}
      >
        <Icons.Google size="20" class="mr-3" />
        Sign up with Google
      </Button>
    </div>
  </section>
</main>
