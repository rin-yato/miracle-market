import { lucia as initLucia } from 'lucia';
import { elysia } from 'lucia/middleware';
import { pg } from '@lucia-auth/adapter-postgresql';
import { redis } from '@lucia-auth/adapter-session-redis';
import { google } from '@lucia-auth/oauth/providers';
import { connectionPool, redisClient } from '@/db/drizzle';
import { secrets } from '@/lib/constant/secrets';

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

// @ts-expect-error lib types are not up to date
const googleAuth = google(luciaClient, {
  clientId: secrets.google.clientId,
  clientSecret: secrets.google.clientSecret,
  redirectUri: secrets.google.redirectUrl,
});

export type Auth = typeof luciaClient & {
  google: typeof googleAuth;
};

export const lucia = {
  ...luciaClient,
  google: googleAuth,
} as Auth;
