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

// Tipo para representaciones seleccionadas desde la BD (ej. en queries)
export type User = InferSelectModel<typeof usersTable>;
// Tipo para inserciones (ej. datos para INSERT)
export type NewUser = InferInsertModel<typeof usersTable>;
