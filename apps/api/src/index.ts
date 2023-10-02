import { Elysia } from 'elysia';
import { AuthModule } from './api/auth';
import { db } from './db/drizzle';
import { cors, errorHandler, setup, swagger } from './lib/setup';

const app = new Elysia()
  .use(setup)
  .use(cors)
  .use(swagger)
  .onError(errorHandler)
  .use(AuthModule)
  .get('/', async ctx => {
    return await db.query.users.findMany();
  })
  .listen(3005);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
