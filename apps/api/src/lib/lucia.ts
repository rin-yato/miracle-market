import { lucia as initLucia } from 'lucia';
import { elysia } from 'lucia/middleware';
import { pg } from '@lucia-auth/adapter-postgresql';
import { redis } from '@lucia-auth/adapter-session-redis';
import { google } from '@lucia-auth/oauth/providers';
import { connectionPool, redisClient } from '@/lib/db/drizzle';
import { secrets } from '@/constant/secrets';
import { Handler } from 'elysia';

export const luciaClient = initLucia({
  adapter: {
    user: pg(connectionPool, {
      user: 'users',
      session: 'sessions',
      key: 'keys',
    }),
    session: redis(redisClient),
  },

  middleware: elysia(),

  env:
    (process.env.ENV ?? process.env.NODE_ENV) === 'production' ? 'PROD' : 'DEV',

  experimental: {
    debugMode: true,
  },

  sessionCookie: {
    expires: false,
  },

  csrfProtection: {
    host: '*',
    allowedSubDomains: '*',
    hostHeader: '*',
  },

  getUserAttributes(data) {
    return {
      username: data.username,
      email: data.email,
      emailVerified: data.emailVerified,
    };
  },
});

const googleAuth = google(luciaClient, {
  clientId: secrets.google.clientId,
  clientSecret: secrets.google.clientSecret,
  redirectUri: secrets.google.redirectUrl,
});

export type Auth = typeof luciaClient & {
  sessionGuard: typeof sessionGuard;
  google: typeof googleAuth;
};

export const sessionGuard: Handler = async ({ set, cookie: { session } }) => {
  if (!session.value) {
    set.status = 'Unauthorized';
    return 'Unauthorized';
  }

  try {
    await luciaClient.validateSession(session.value);
  } catch (error) {
    set.status = 'Unauthorized';

    return 'Unauthorized';
  }
};

export const lucia = {
  ...luciaClient,
  sessionGuard,
  google: googleAuth,
} as Auth;
