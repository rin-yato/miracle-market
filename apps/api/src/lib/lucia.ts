import { lucia as Lucia } from 'lucia';
import { elysia } from 'lucia/middleware';
import { pg } from '@lucia-auth/adapter-postgresql';
import {
  connectionPool,
  redisClient,
} from '../lib/db/drizzle';
import { redis } from '@lucia-auth/adapter-session-redis';
import { Handler } from 'elysia';

const luciaClient = Lucia({
  adapter: {
    user: pg(connectionPool, {
      user: 'users',
      session: 'sessions',
      key: 'keys',
    }),
    // @ts-ignore
    session: redis(redisClient),
  },

  middleware: elysia(),

  env:
    (process.env.ENV ?? process.env.NODE_ENV) ===
    'production'
      ? 'PROD'
      : 'DEV',

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

  getUserAttributes: data => {
    return {
      username: data.username,
    };
  },
});

const sessionGuard: Handler = async ({
  set,
  cookie: { session },
}) => {
  if (!session.value) {
    set.status = 'Unauthorized';
    return `Unauthorized`;
  }

  try {
    await luciaClient.validateSession(
      session.value,
    );
  } catch (error) {
    set.status = 'Unauthorized';

    return `Unauthorized`;
  }
};

export const lucia = {
  ...luciaClient,
  sessionGuard,
};

export type Auth = typeof luciaClient & {
  sessionGuard: typeof lucia.sessionGuard;
};
