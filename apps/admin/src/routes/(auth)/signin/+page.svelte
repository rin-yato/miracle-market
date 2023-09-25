<script lang="ts">
  import * as Form from '$lib/components/ui/form';
  import { Button } from '$lib/components/ui/button';
  import { Separator } from '$lib/components/ui/separator';
  import { handleFormSubmit } from '$lib/utils';
  import { eden } from 'libs';

  import { loginSchema } from './schema';
  import { Icons } from '$lib/components/icons';
  import { IconUserPlus } from '@tabler/icons-svelte';
  import { redirect } from '@sveltejs/kit';
  import { goto } from '$app/navigation';

  export let data;

  const form = data.form;

  const handleSubmit = handleFormSubmit(form, async (event) => {
    const { email, password } = event.form.data;
    try {
      await eden.auth['sign-in'].post({
        username: email,
        password,
        $fetch: {
          credentials: 'include',
        },
      });

      goto('/products', {
        replaceState: true,
      });
    } catch (error) {
      console.log(error);
    }
  });
</script>

<main class="flex flex-1 flex-col items-center justify-center">
  <Button variant="outline" href="/signup" class="fixed right-5 top-5">
    <IconUserPlus size={16} class="mr-2" />
    Create an Account
  </Button>
  <section class="rounded-2xl border bg-white px-16 pb-16 [&>*]:max-w-xs">
    <div class="my-10">
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
      <Button variant="link" class="!my-0 px-0" href="/forgot-password">
        Forgot Password?
      </Button>
      <Form.Button class="w-full">Sign In</Form.Button>
    </Form.Root>

    <div class="my-5 flex items-center">
      <Separator class="flex-1" />
      <span class="mx-4 text-muted-foreground">or sign in with</span>
      <Separator class="flex-1" />
    </div>

    <div>
      <Button variant="outline" class="w-full">
        <Icons.Google size="20" class="mr-3" />
        Sign In with Google
      </Button>
    </div>
  </section>
</main>
