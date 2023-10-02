import { swagger as swaggerPlugin } from '@elysiajs/swagger';

export const swagger = swaggerPlugin({
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
  path: '/swagger',
});
