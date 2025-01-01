import {
  integer,
  pgTable,
  varchar,
  text,
  decimal,
  date,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { items } from "./items";

export const cylinderDetail = pgTable("cylinders_detail", {
  id: integer("cylinder_id")
    .primaryKey()
    .default(sql`GENERATED ALLWAYS AS IDENTITY`),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  number: varchar("cylinder_number", { length: 30 }).notNull(),
  concentration: decimal("cylinder_concentration", { precision: 10, scale: 2 }),
  connector: varchar("cylinder_connector", { length: 20 }).notNull(),
  expirationDate: date("cylinder_expiration_date").notNull(),
  certificate: text("cylinder_certificate"),
});

export const CylinderDetailRelations = relations(cylinderDetail, ({ one }) => ({
  item: one(items, {
    fields: [cylinderDetail.itemId],
    references: [items.id],
  }),
}));
