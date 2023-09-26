import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

export const socials = pgTable('socials', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 15 }),
  telegram: varchar('telegram'),
  instagram: varchar('instagram'),
  facebook: varchar('facebook'),
});

export const socialsRelations = relations(socials, ({ one }) => ({
  user: one(users, {
    fields: [socials.userId],
    references: [users.id],
  }),
}));
