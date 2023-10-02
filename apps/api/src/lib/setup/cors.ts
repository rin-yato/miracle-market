import { cors as corsPlugin } from '@elysiajs/cors';

export const cors = corsPlugin({
  credentials: true,
  origin: 'http://localhost:5173',
  allowedHeaders: ['Content-Type', 'Cookie'],
});
