import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import { lucia } from '@/lib/lucia';
import { db } from '@/lib/db/drizzle';
import { user } from '@/lib/db/schema/users';
import { authSchema } from './schema';

export const AuthModule = new Elysia().group('/auth', (app) =>
  app
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
      async ({ set, cookie: { session }, body }) => {
        const { username, password } = body;

        try {
          const key = await lucia.useKey('username', username, password);

          const createdSession = await lucia.createSession({
            userId: key.userId,
            attributes: {},
          });

          session.set({
            value: createdSession.sessionId,
            path: '/',
          });

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
    .onBeforeHandle((ctx) => lucia.sessionGuard(ctx))

    // Validate session
    .post(
      '/validate',
      async ({ cookie: { session } }) => {
        return lucia.validateSession(session.value);
      },
      {
        detail: {
          tags: ['Auth'],
        },
      },
    )

    // Sign out
    .get(
      '/sign-out',
      async ({ cookie: { session } }) => {
        console.log('here');
        await lucia.invalidateSession(session.value);
        console.log('here2');

        // Clear session cookie
        session.remove();

        return session.value;
      },
      {
        detail: {
          description: 'Sign out',
          tags: ['Auth'],
          security: [{ cookieAuth: [] }],
        },
        cookie: t.Cookie({
          session: t.String(),
        }),
      },
    )

    // Get userId
    .derive(async ({ cookie: { session } }) => {
      const currentSession = await lucia.getSession(session.value);

      return {
        userId: currentSession.user.userId,
      };
    })

    // Get user profile
    .get(
      '/profile',
      async ({ userId }) => {
        const userFound = (
          await db.select().from(user).where(eq(user.id, userId))
        )[0];
        return userFound;
      },
      {
        detail: {
          description: 'Get user profile',
          tags: ['Auth'],
          security: [{ cookieAuth: [] }],
        },
        response: {
          200: t.Object({
            username: t.Union([t.String(), t.Null()]),
            id: t.String(),
          }),
        },
      },
    )

    // Delete user
    .delete(
      '/user',
      async ({ userId, cookie: { session } }) => {
        await lucia.deleteDeadUserSessions(session.value);
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
