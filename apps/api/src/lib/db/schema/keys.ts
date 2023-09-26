import { bigint, boolean, pgTable, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
import { relations } from 'drizzle-orm';

export const keys = pgTable('keys', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => users.id),
  primaryKey: boolean('primary_key'),
  hashedPassword: varchar('hashed_password', {
    length: 255,
  }),
  expires: bigint('expires', {
    mode: 'number',
  }),
});

export const keysRelations = relations(keys, ({ one }) => ({
  user: one(users, {
    fields: [keys.userId],
    references: [users.id],
  }),
}));
