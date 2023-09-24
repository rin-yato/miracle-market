<script lang="ts">
  import * as Form from '$lib/components/ui/form';
  import { handleFormSubmit } from '$lib/utils';

  import { loginSchema } from './schema';

  export let data;

  const form = data.form;

  const handleSubmit = handleFormSubmit(form, (event) => {});
</script>

<main class="flex flex-1 flex-col items-center justify-center">
  <div class="w-full max-w-xs my-10">
    <h1>Login</h1>
    <p>
      Welcome back to Miracle Market. Please login to your account to
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
    class="w-full max-w-xs space-y-7"
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
    <Form.Button>Submit</Form.Button>
  </Form.Root>
</main>
