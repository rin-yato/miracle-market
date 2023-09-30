import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { products } from './products';
import { categories } from './categories';
import { users } from './users';

export const subcategories = pgTable('subcategories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 15 }),
  categoryId: uuid('category_id'),
  name: varchar('name').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const subcategoriesRelations = relations(
  subcategories,
  ({ many, one }) => ({
    products: many(products),
    category: one(categories, {
      fields: [subcategories.categoryId],
      references: [categories.id],
    }),
    user: one(users, {
      fields: [subcategories.userId],
      references: [users.id],
    }),
  }),
);
