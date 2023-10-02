import Elysia from 'elysia';

import { lucia } from '../lucia';
import { swagger } from './swagger';
import { cors } from './cors';
import { errorHandler } from './error-handler';
import { db } from '@/db/drizzle';
import { logger } from '@bogeychan/elysia-logger';
import { StreamLoggerOptions } from '@bogeychan/elysia-logger/src/types';
import pretty from 'pino-pretty';

export { swagger, cors, errorHandler };

const stream = pretty({
  colorize: true,
});

const loggerConfig: StreamLoggerOptions = {
  level: 'info',
  stream,
};

export const setup = new Elysia({ name: 'setup' })
  .use(logger(loggerConfig))

  .decorate({
    db,
  })

  // Auth
  .derive(async ctx => {
    const now = performance.now();
    const authRequest = lucia.handleRequest(ctx);

    console.log('Auth Time:', performance.now() - now, 'ms');

    const protectedHandler = async () => {
      try {
        const session = await authRequest.validate();
        if (!session) throw new Error('Unauthorized');
      } catch (error) {
        throw new Error('Unauthorized');
      }
    };

    return { lucia: { ...lucia, protectedHandler } };
  })

  // Logger
  .onStart(({ log }) => log && log.info('Server Started'))
  .onStop(({ log }) => log && log.info('Server Stopped'))
  .onRequest(
    ({ log, request }) =>
      log &&
      log.debug(
        `Request received: ${request.method} ${request.url.toString()}`,
      ),
  )
  .onResponse(
    ({ log, request }) =>
      log &&
      log.debug(`Response sent: ${request.method} ${request.url.toString()}`),
  )
  .onError(({ log, error }) => log && log.error(error));
