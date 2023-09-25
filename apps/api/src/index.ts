import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { AuthModule } from './api/auth';
import { db } from './lib/db/drizzle';
import cors from '@elysiajs/cors';

const app = new Elysia()
  .use(
    cors({
      credentials: true,
      origin: 'http://localhost:5173',
      allowedHeaders: ['Content-Type', 'Cookie'],
    }),
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Miracle Market API',
          version: '0.0.1',
          contact: {
            name: 'RinYato',
            email: 'chearithorn@gmail.com',
            url: 'https://rinyato.com',
          },
        },
        components: {
          securitySchemes: {
            cookieAuth: {
              type: 'apiKey',
              in: 'cookie',
              name: 'session',
              description:
                'Authentication is handle via session cookie, just go to sign-in after that you can access all API. **Note** No need to set this manually, just go to `/auth/sign-in`!',
            },
          },
        },
      },
    }),
  )
  .use(AuthModule)
  .get('/', async () => db.query.user.findMany())
  .listen(3005);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
