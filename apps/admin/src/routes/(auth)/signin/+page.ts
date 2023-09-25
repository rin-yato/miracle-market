import { superValidate } from 'sveltekit-superforms/client';
import { loginSchema } from './schema';

export const load = () => {
  return {
    form: superValidate(loginSchema),
  };
};
