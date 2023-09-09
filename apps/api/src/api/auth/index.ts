import { Elysia } from 'elysia';
import { cookie } from '@elysiajs/cookie';
import { eq } from 'drizzle-orm';
import { lucia } from '@/lib/lucia';
import { db } from '@/lib/db/drizzle';
import { user } from '@/lib/db/schema/users';
import { authSchema } from './schema';

export const AuthModule = new Elysia().group('/auth', app =>
  app
    .use(cookie())

    // Sign up
    .post(
      '/sign-up',
      async ({ body: { username, password } }) =>
        lucia.createUser({
          key: {
            password,
            providerId: 'username',
            providerUserId: username,
          },
          attributes: {
            username,
          },
        }),
      {
        body: authSchema,
        detail: {
          description: 'Create a new user',
          tags: ['Auth'],
        },
      },
    )

    // Sign in
    .post(
      '/sign-in',
      async ({ set, setCookie, body: { username, password } }) => {
        try {
          const key = await lucia.useKey('username', username, password);

          const session = await lucia.createSession({
            userId: key.userId,
            attributes: {},
          });

          setCookie('session', session.sessionId);

          return `Sign in as ${username}`;
        } catch {
          set.status = 401;

          return 'Invalid username or password';
        }
      },
      {
        body: authSchema,
        detail: {
          description:
            'Sign in - this will create a session cookie and set it to the client',
          tags: ['Auth'],
        },
      },
    )

    // Handle routes guard
    .onBeforeHandle(ctx => {
      lucia.sessionGuard(ctx as any);
    })

    // Sign out
    .get(
      '/sign-out',
      async ({ cookie: { session }, removeCookie }) => {
        await lucia.invalidateSession(session);

        removeCookie('session');

        return session;
      },
      {
        detail: {
          description: 'Sign out',
          tags: ['Auth'],
          security: [{ cookieAuth: [] }],
        },
      },
    )

    // Get userId
    .derive(async ({ cookie: { session } }) => {
      const currentSession = await lucia.getSession(session);

      return {
        userId: currentSession.user.userId,
      };
    })

    // Get user profile
    .get(
      '/profile',
      async ({ userId }) => {
        return await db.select().from(user).where(eq(user.id, userId));
      },
      {
        detail: {
          description: 'Get user profile',
          tags: ['Auth'],
          security: [{ cookieAuth: [] }],
        },
      },
    )

    // Delete user
    .delete(
      '/user',
      async ({ userId, cookie: { session } }) => {
        await lucia.deleteDeadUserSessions(session);
        await lucia.deleteUser(userId);

        return userId;
      },
      {
        detail: {
          description: 'Delete user',
          tags: ['Auth'],
          security: [{ cookieAuth: [] }],
        },
      },
    ),
);
