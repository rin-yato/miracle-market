import { Context, Elysia, t } from 'elysia';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { Value } from '@sinclair/typebox/value';
import { userSchema } from '../../db/schema/users';
import { setup } from '../../lib/setup';
import { authSchema, signupSchema } from './schema';
import {
  generateEmailVerificationToken,
  validateEmailVerificationToken,
} from './util';
import { sendVerificationEmail } from './email';
import { betterTryCatch } from '@/lib/util/flow';

export const AuthModule = new Elysia({
  prefix: 'auth',
  seed: 'auth',
  name: 'auth',
})
  .use(setup)

  // Sign up with email and password
  .post(
    '/sign-up',
    async ({ body: { email, password, redirectUrl }, lucia, set }) => {
      const createUser = lucia.createUser({
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

      const [user, error] = await betterTryCatch(createUser);

      if (error) {
        set.status = 400;
        throw new Error('An account with this email already exist.', {
          cause: error,
        });
      }

      const token = await generateEmailVerificationToken(user.userId);
      await sendVerificationEmail(email, token, redirectUrl)();

      set.status = 'OK';
      return 'OK';
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
    async ({ set, cookie: { session }, lucia, body }) => {
      const { email, password } = body;

      try {
        const key = await lucia.useKey('email', email, password);
        const user = await lucia.getUser(key.userId);

        if (!user.emailVerified) {
          set.status = 401;
          return 'Please verify your email first';
        }

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
  .get('/google', async ({ cookie, set, lucia }) => {
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
    async ({ params: { token }, query, lucia, set, cookie: { session } }) => {
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
  .get('/google/callback', async ({ cookie, query, lucia, set }) => {
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
            emailVerified: true,
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

  // ---- Protected Routes ---- //
  .derive(async ({ lucia }) => await lucia.protectedHandler())

  // Sign out
  .get(
    '/sign-out',
    async ({ cookie: { session }, set, lucia }) => {
      await lucia.protectedHandler();

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
  .derive(async ({ cookie: { session }, lucia }) => {
    // await lucia.protectedHandler();
    console.log('here');
    const currentSession = await lucia.getSession(session.value);

    return {
      userId: currentSession.user.userId,
    };
  })

  // Get user profile
  .get(
    '/profile',
    async ({ set, db, userId }) => {
      const userFound = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, userId),
      });

      if (!userFound) {
        set.status = 'Bad Request';
        throw new Error('User not found');
      }

      const isValidUser = Value.Check(userSchema, userFound);

      if (!isValidUser) {
        set.status = 'Internal Server Error';
        throw new Error('Internal Server Error');
      }

      set.status = 'OK';
      return userFound;
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
    async ({ userId, cookie: { session }, lucia }) => {
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
