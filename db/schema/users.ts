import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 40 }).notNull().unique(),
  email: varchar({ length: 40 }).notNull().unique(),
  password: text("password_hash").notNull(),
  role: varchar({ length: 10 }).default("VIEWER").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type User = InferSelectModel<typeof usersTable>;
export type NewUser = InferInsertModel<typeof usersTable>;
