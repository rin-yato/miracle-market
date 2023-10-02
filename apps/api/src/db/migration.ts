import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './drizzle';

await migrate(db, { migrationsFolder: `${__dirname}/migrations` });
