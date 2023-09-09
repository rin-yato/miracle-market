import { bigint, boolean, pgTable, varchar } from 'drizzle-orm/pg-core';
import { user } from './users';

export const key = pgTable('keys', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  primaryKey: boolean('primary_key'),
  hashedPassword: varchar('hashed_password', {
    length: 255,
  }),
  expires: bigint('expires', {
    mode: 'number',
  }),
});
