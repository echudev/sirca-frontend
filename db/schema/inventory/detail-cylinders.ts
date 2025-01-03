import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { item } from "./item";

export const detailCylinder = table("detail_cylinder", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  itemId: t
    .integer("item_id")
    .notNull()
    .references(() => item.id, { onDelete: "cascade" }),
  number: t.varchar("cylinder_number", { length: 30 }).notNull(),
  concentration: t.decimal("cylinder_concentration", {
    precision: 10,
    scale: 2,
  }),
  connector: t.varchar("cylinder_connector", { length: 20 }).notNull(),
  expirationDate: t.date("cylinder_expiration_date").notNull(),
  certificate: t.text("cylinder_certificate"),
});

export const DetailCylinderRelations = relations(detailCylinder, ({ one }) => ({
  item: one(item, {
    fields: [detailCylinder.itemId],
    references: [item.id],
  }),
}));
