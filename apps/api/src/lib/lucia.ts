import { lucia as Lucia, User } from 'lucia';
import { elysia } from 'lucia/middleware';
import { pg } from '@lucia-auth/adapter-postgresql';
import { connectionPool, redisClient } from '../lib/db/drizzle';
import { redis } from '@lucia-auth/adapter-session-redis';
import { HookHandler } from 'elysia';

const luciaClient = Lucia({
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
  getUserAttributes: data => {
    return {
      username: data.username,
    };
  },
});

export const lucia = {
  ...luciaClient,
  async sessionGuard({
    cookie: { session },
    set,
  }: Parameters<HookHandler>[0] & {
    cookie: Record<string, string>;
  }) {
    if (!session) {
      set.status = 401;

      return `Unauthorized`;
    }

    try {
      await luciaClient.validateSession(session);
    } catch (error) {
      set.status = 401;

      return `Unauthorized`;
    }
  },
};

export type Auth = typeof luciaClient & {
  sessionGuard: typeof lucia.sessionGuard;
};
