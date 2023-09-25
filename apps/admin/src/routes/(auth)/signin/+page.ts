import { superValidate } from 'sveltekit-superforms/client';
import { loginSchema } from './schema';

export const load = () => ({
  form: superValidate(loginSchema),
});
