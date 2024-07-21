import { pgTable, text } from "drizzle-orm/pg-core";
import {createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export const accounts = pgTable("account", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});

export const postAccountSchema = createInsertSchema(accounts, {
    name: ({ name }) =>
      name.trim().min(1, {
        message: "Name is required",
      }),
  }).pick({
    name: true,
  });

  export type PostAccount = z.infer<typeof postAccountSchema>;


  export const categories = pgTable("categories", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});

export const postCategoriesSchema = createInsertSchema(categories, {
  name: ({ name }) =>
    name.trim().min(1, {
      message: "Name is required",
    }),
}).pick({
  name: true,
});

export type PostCategories = z.infer<typeof postCategoriesSchema>;