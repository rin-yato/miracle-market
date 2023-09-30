import { drizzle } from 'drizzle-orm/node-postgres';
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

export const redisClient = createClient();

await redisClient.connect();
