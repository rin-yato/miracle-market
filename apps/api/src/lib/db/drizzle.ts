import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import postgres from 'pg';
import { createClient } from 'redis';
import * as schema from './schema';

export const connectionPool = new postgres.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(connectionPool, {
  schema,
  logger: true,
});

await migrate(db, { migrationsFolder: __dirname + '/migrations' });

export const redisClient = createClient();

await redisClient.connect();
