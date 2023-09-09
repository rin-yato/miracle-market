import { pgTable, varchar } from "drizzle-orm/pg-core";

export const user = pgTable('users', {
  id: varchar('id', {
    // change this when using custom user ids
    length: 15,
  }).primaryKey(),
  username: varchar('username').unique(),
});
