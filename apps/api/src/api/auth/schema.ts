import { t } from 'elysia';

export const authSchema = t.Object({
  username: t.String(),
  password: t.String({
    minLength: 8,
  }),
});
