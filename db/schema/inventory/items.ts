import {
  pgTable,
  varchar,
  text,
  timestamp,
  serial,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { ItemType } from "./types";
import { analyzers } from "./analyzers";
import { cylinders } from "./cylinders";
import { parts } from "./parts";
import { inventory } from "./inventory";

export const items = pgTable("items", {
  id: serial("item_id").primaryKey(),
  itemType: varchar("item_type", { length: 20 }).notNull().$type<ItemType>(),
  name: varchar("item_name", { length: 100 }).notNull(),
  code: varchar("item_code", { length: 40 }).notNull().unique(),
  description: text("item_description"),
  adquisitionDate: date("item_adquisition_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const itemsRelations = relations(items, ({ one }) => ({
  analyzers: one(analyzers),
  cylinders: one(cylinders),
  parts: one(parts),
  inventory: one(inventory),
}));
