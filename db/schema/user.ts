import { integer, pgTable, varchar, text } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { commonColumns } from "./common-columns";

export const user = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 40 }).notNull().unique(),
  email: varchar({ length: 40 }).notNull().unique(),
  password: text("password_hash").notNull(),
  role: varchar({ length: 10 }).default("VIEWER").notNull(),
  ...commonColumns,
});
export type UserModel = InferSelectModel<typeof user>;
export type NewUserModel = InferInsertModel<typeof user>;
