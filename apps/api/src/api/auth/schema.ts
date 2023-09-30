import { t } from 'elysia';

export const authSchema = t.Object({
  email: t.String({
    format: 'email', // 'email' is a built-in format
    error: 'Invalid email address',
  }),
  password: t.String({
    minLength: 8,
  }),
});

export const signupSchema = t.Object({
  email: t.String({
    format: 'email',
    error: 'Invalid email address',
  }),
  password: t.String({
    minLength: 8,
  }),
  redirectUrl: t.String({ error: 'Invalid Redirect Url' }),
});
