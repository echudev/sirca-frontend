import { integer, pgTable, varchar, text } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { commonColumns } from "./common-columns";

export const userTable = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 40 }).notNull(),
  lastName: varchar({ length: 40 }).notNull(),
  email: varchar({ length: 40 }).notNull().unique(),
  password: text("password_hash").notNull(),
  role: varchar({ length: 10 }).default("VIEWER").notNull(),
  ...commonColumns,
});
export type UserSelect = InferSelectModel<typeof userTable>;
export type UserInsert = InferInsertModel<typeof userTable>;
