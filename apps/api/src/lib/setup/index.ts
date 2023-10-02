import Elysia from 'elysia';

import { lucia } from '../lucia';
import { swagger } from './swagger';
import { cors } from './cors';
import { errorHandler } from './error-handler';
import { logger } from './logger';
import { db } from '@/db/drizzle';

export { swagger, cors, errorHandler };

export const setup = new Elysia({ name: 'setup' })

  .decorate({
    db,
    logger,
  })

  // Auth
  .derive(async ctx => {
    const authRequest = lucia.handleRequest(ctx);

    const protectedHandler = async () => {
      try {
        const session = await authRequest.validate();
        if (!session) {
          ctx.set.status = 'Unauthorized';
          throw new Error('Unauthorized');
        }
      } catch (error) {
        ctx.set.status = 'Unauthorized';
        throw new Error('Unauthorized');
      }
    };

    return { lucia: { ...lucia, protectedHandler } };
  })

  // Logger
  .onStart(({ logger }) => logger.info('Start', 'Server Started'))
  .onStop(({ logger }) => logger.info('Stop', 'Server Stopped'))
  .onRequest(({ logger, request }) =>
    logger.info(
      'Request',
      `${request.method} ${new URL(request.url).pathname}`,
    ),
  )
  // .onResponse(({ logger, request }) =>
  //   logger.debug(
  //     'Response',
  //     `${request.method} ${new URL(request.url).pathname}`,
  //   ),
  // )
  .onError(({ logger, error, request }) =>
    logger.error(
      'Error',
      `${request.method} ${new URL(request.url).pathname}`,
      error.message,
    ),
  );
