import { superValidate } from 'sveltekit-superforms/client';
import { signupSchema } from './schema';

export const load = () => ({
  form: superValidate(signupSchema),
});
