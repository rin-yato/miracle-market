import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { subcategories } from './subcategories';
import { products } from './products';
import { users } from './users';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: varchar('user_id', { length: 15 }),
  name: varchar('name').notNull().default(''),
  imagee: varchar('imagee'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  subcategories: many(subcategories),
  products: many(products),
  user: one(users, {
    fields: [categories.id],
    references: [users.id],
  }),
}));
