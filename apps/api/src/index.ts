import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { AuthModule } from '@/api/auth';

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Miracle Market API',
          version: '0.0.0',
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
  .get('/', () => 'Hellfaefa Elysia')
  .listen(3005);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
