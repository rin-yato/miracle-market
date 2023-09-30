import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { authSchema, signupSchema } from './schema';
import {
  generateEmailVerificationToken,
  validateEmailVerificationToken,
} from './util';
import { sendVerificationEmail } from './email';
import { lucia } from '@/lib/lucia';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema/users';

export const AuthModule = new Elysia({ prefix: '/auth' })

  // Sign up with email and password
  .post(
    '/sign-up',
    async ({ body: { email, password, redirectUrl }, set }) => {
      try {
        const user = await lucia.createUser({
          key: {
            password,
            providerId: 'email',
            providerUserId: email.toLowerCase(),
          },

          attributes: {
            username: email.split('@')[0], // Use email as username
            email,
          },
        });

        const token = await generateEmailVerificationToken(user.userId);
        await sendVerificationEmail(email, token, redirectUrl)(); // higher order function

        set.status = 'OK';
        return 'OK';
      } catch (error) {
        set.status = 'Bad Request';
      }
    },
    {
      body: signupSchema,
      detail: {
        description: 'Create a new user',
        tags: ['Auth'],
      },
    },
  )

  // Sign in with email and password
  .post(
    '/sign-in',
    async ({ set, cookie: { session }, body }) => {
      const { email, password } = body;

      try {
        const key = await lucia.useKey('email', email, password);

        const createdSession = await lucia.createSession({
          userId: key.userId,
          attributes: {},
        });

        session.set({
          value: createdSession.sessionId,
          path: '/',
        });

        return `Sign in as ${email}`;
      } catch {
        set.status = 401;

        return 'Invalid Email or password';
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

  // Sign in with Google
  .get('/google', async ({ cookie, set }) => {
    const [url, state] = await lucia.google.getAuthorizationUrl();

    cookie['google-oauth-state'].set({
      value: state,
      path: '/',
      maxAge: 60 * 60 * 1000,
    });

    set.status = 302;
    set.redirect = url.toString();
  })

  // Handle Email verification
  .get(
    '/verify-email/:token',
    async ({ params: { token }, query, set, cookie: { session } }) => {
      try {
        const { redirectUrl } = query;
        if (!redirectUrl) {
          set.status = 400;
          return 'Invalid Redirect URL';
        }

        const userId = await validateEmailVerificationToken(token);
        const user = await lucia.getUser(userId);

        await lucia.invalidateAllUserSessions(user.userId);
        await lucia.updateUserAttributes(user.userId, {
          emailVerified: true,
        });

        const newSession = await lucia.createSession({
          userId: user.userId,
          attributes: {},
        });

        session.set({
          path: '/',
          value: newSession.sessionId,
        });

        set.status = 302;
        set.redirect = redirectUrl;
      } catch (error) {
        console.log('error', error);
        set.status = 400;
        return 'Invalid Email Verification Link';
      }
    },
  )

  // Handle Google callback
  .get('/google/callback', async ({ cookie, query, set }) => {
    const storedState = cookie['google-oauth-state'].value;
    const state = query.state;
    const code = query.code;

    if (!storedState || !state || storedState !== state || !code) {
      set.status = 'Unauthorized';
      return 'Unauthorized';
    }

    try {
      const { getExistingUser, googleUser, createUser } =
        await lucia.google.validateCallback(code);

      const getUser = async () => {
        const existingUser = await getExistingUser();

        if (existingUser) return existingUser;

        const user = await createUser({
          attributes: {
            username: googleUser.name,
            avatar: googleUser.picture,
          },
        });

        return user;
      };

      const user = await getUser();
      const session = await lucia.createSession({
        userId: user.userId,
        attributes: {},
      });

      cookie.session.set({
        value: session.sessionId,
        path: '/',
      });

      set.redirect = 'http://localhost:5173/products';
    } catch (error) {
      if (error instanceof OAuthRequestError) {
        set.status = 'Bad Request';
        return 'Bad Request';
      }

      set.status = 'Internal Server Error';
      return 'Internal Server Error';
    }
  })

  // Handle routes guard
  .onBeforeHandle(ctx => lucia.sessionGuard(ctx))

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
    async ({ cookie: { session }, set }) => {
      await lucia.invalidateSession(session.value);

      // Clear session cookie
      session.remove();

      set.status = 'OK';
      return true;
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
        await db.select().from(users).where(eq(users.id, userId))
      )[0];
      return userFound;
    },
    {
      detail: {
        description: 'Get user profile',
        tags: ['Auth'],
        security: [{ cookieAuth: [] }],
      },
      // response: {
      //   200: t.Object({
      //     username: t.Union([t.String(), t.Null()]),
      //     id: t.String(),
      //   }),
      // },
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
  );
