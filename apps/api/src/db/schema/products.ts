import { relations } from 'drizzle-orm'
import {
  json,
  pgTable,
  real,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { categories } from './categories'
import { users } from './users'
import { subcategories } from './subcategories'

interface Media {
  thumbnail: string
  images: string[]
}

export const products = pgTable('products', {
  id: uuid('id').primaryKey(),
  userId: varchar('user_id', { length: 15 }),
  categoryId: uuid('category_id'),
  subcategoryId: uuid('subcategory_id'),
  name: varchar('name').notNull().default(''),
  description: varchar('description'),
  media: json('media').$type<Media>().default({
    thumbnail: '',
    images: [],
  }),
  price: real('price').notNull(),
  discount: real('discount'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
}))
