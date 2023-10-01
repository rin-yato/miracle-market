<script lang="ts">
  import * as Form from '$lib/components/ui/form';
  import { Button } from '$lib/components/ui/button';
  import { Separator } from '$lib/components/ui/separator';
  import { cn, handleFormSubmit, parseError } from '$lib/utils';
  import { eden } from 'libs';

  import { loginSchema } from './schema';
  import { Icons } from '$lib/components/icons';
  import { IconLoader2, IconUserPlus } from '@tabler/icons-svelte';
  import { goto } from '$app/navigation';
  import { appConfigs } from '$lib/constants';
  import toast from 'svelte-french-toast';

  export let data;

  const form = data.form;

  let isSubmitting = false;

  const handleSubmit = handleFormSubmit(form, async (event) => {
    if (isSubmitting) return;

    isSubmitting = true;

    const test = await eden.auth.profile.get()

    const toastId = toast.loading('Signing in...');

    const { email, password } = event.form.data;

    const res = await eden.auth['sign-in'].post({
      email,
      password,
    });

    if (res.error) {
      const err = parseError(res.error.value);
      toast.error(err.message, {
        id: toastId,
      });
      isSubmitting = false;

      return;
    }

    toast.success('Signed in successfully!', {
      id: toastId,
    });

    goto('/products', {
      replaceState: true,
    });
  });
</script>

<main class="flex flex-1 flex-col items-center justify-center">
  <Button
    disabled={isSubmitting}
    variant="outline"
    href="/signup"
    class="fixed right-5 top-5"
  >
    <IconUserPlus size={16} class="mr-2" />
    Create an Account
  </Button>
  <section class="rounded-2xl border bg-white px-16 pb-16 [&>*]:max-w-xs">
    <div class="mb-6 mt-10">
      <h1>Sign In</h1>
      <p class="text-muted-foreground">
        Welcome back to Miracle Market. Please sign in to your account to
        continue.
      </p>
    </div>

    <Form.Root
      {form}
      schema={loginSchema}
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
      <Form.Button class="w-full" disabled={isSubmitting}>
        {#if isSubmitting}
          <IconLoader2 size={16} class={cn('mr-2 animate-spin')} />
        {/if}
        Sign In
      </Form.Button>
    </Form.Root>

    <div class="my-5 flex items-center">
      <Separator class="flex-1" />
      <span class="text-muted-foreground mx-4">or sign in with</span>
      <Separator class="flex-1" />
    </div>

    <div>
      <Button
        disabled={isSubmitting}
        variant="outline"
        class={cn(
          'w-full',
          isSubmitting && 'pointer-events-none opacity-50',
        )}
        href={appConfigs.api.googleAuth}
      >
        <Icons.Google size="20" class="mr-3" />
        Sign In with Google
      </Button>
    </div>
  </section>
</main>
