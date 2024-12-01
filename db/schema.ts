import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 40 }).notNull().unique(),
  email: varchar({ length: 40 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar({ length: 10 }).default("USER").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Infiriendo el tipo User
export type UserSelect = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;
