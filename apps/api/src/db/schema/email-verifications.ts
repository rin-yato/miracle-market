import { relations } from 'drizzle-orm';
import { bigint, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

export const emailVerifications = pgTable('email_verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  expires: bigint('expires', { mode: 'number' }).notNull(),
  userId: varchar('user_id', { length: 15 }).notNull(),
});

export const emailVerificationsRelations = relations(
  emailVerifications,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerifications.userId],
      references: [users.id],
    }),
  }),
);
