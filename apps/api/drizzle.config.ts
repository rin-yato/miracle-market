import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/lib/db/schema/*',
  out: './src/lib/db/migrations',
  strict: true,
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? '',
  },
} satisfies Config;
