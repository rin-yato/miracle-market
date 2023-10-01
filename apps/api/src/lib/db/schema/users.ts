import { relations } from 'drizzle-orm';
import { boolean, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { categories } from './categories';
import { subcategories } from './subcategories';
import { products } from './products';
import { keys } from './keys';
import { sessions } from './sessions';
import { socials } from './socials';
import { addresses } from './addresses';
import { emailVerifications } from './email-verifications';
import { createSelectSchema } from 'drizzle-typebox';
import { Static } from '@sinclair/typebox';

export const users = pgTable('users', {
  id: varchar('id', {
    // Change this when using custom user ids
    length: 15,
  }).primaryKey(),
  username: varchar('username').unique(),
  email: varchar('email').unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  avatar: varchar('avatar'),
  phoneNumber: varchar('phone_number'),
  description: varchar('description'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many, one }) => ({
  keys: many(keys),
  session: many(sessions),
  emailVerifications: many(emailVerifications),
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

export const userSchema = createSelectSchema(users);

export type User = Static<typeof userSchema>;
