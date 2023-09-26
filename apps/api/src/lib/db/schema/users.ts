import { relations } from 'drizzle-orm';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { categories } from './categories';
import { subcategories } from './subcategories';
import { products } from './products';
import { keys } from './keys';
import { sessions } from './sessions';
import { socials } from './socials';
import { addresses } from './addresses';

export const users = pgTable('users', {
  id: varchar('id', {
    // Change this when using custom user ids
    length: 15,
  }).primaryKey(),
  username: varchar('username').unique(),
  email: varchar('email').unique(),
  avatar: varchar('avatar'),
  phoneNumber: varchar('phone_number'),
  description: varchar('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many, one }) => ({
  keys: many(keys),
  session: many(sessions),
  categories: many(categories),
  subcategories: many(subcategories),
  products: many(products),
  social: one(socials, {
    fields: [users.id],
    references: [socials.userId],
  }),
  addresses: one(addresses, {
    fields: [users.id],
    references: [addresses.userId],
  }),
}));
