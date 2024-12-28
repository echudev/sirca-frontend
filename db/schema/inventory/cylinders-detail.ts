import {
  integer,
  pgTable,
  varchar,
  text,
  serial,
  decimal,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { items } from "./items";

export const cylindersDetail = pgTable("cylinders_detail", {
  id: serial("cylinder_id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  number: varchar("cylinder_number", { length: 30 }).notNull(),
  concentration: decimal("cylinder_concentration", { precision: 10, scale: 2 }),
  connector: varchar("cylinder_connector", { length: 20 }).notNull(),
  expirationDate: date("cylinder_expiration_date").notNull(),
  certificate: text("cylinder_certificate"),
});

export const cylindersRelations = relations(cylindersDetail, ({ one }) => ({
  item: one(items, {
    fields: [cylindersDetail.itemId],
    references: [items.id],
  }),
}));
