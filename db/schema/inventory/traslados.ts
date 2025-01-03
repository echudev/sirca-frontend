import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { item } from "./item";
import { station } from "./station";
import { commonColumns } from "../common-columns";

export const traslados = table(
  "traslados",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    itemId: t
      .integer("item_id")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    fromStationId: t
      .integer("station_id_origen")
      .notNull()
      .references(() => station.id, { onDelete: "cascade" }),
    toStationId: t
      .integer("station_id_destino")
      .notNull()
      .references(() => station.id, { onDelete: "cascade" }),
    quantity: t.integer("cantidad").notNull(),
    updatedAt: commonColumns.updatedAt,
  },
  (table) => [
    t.check(
      "station_check",
      sql`${table.fromStationId} <> ${table.toStationId}`
    ),
    t.check("cantidad_check", sql`${table.quantity} > 0`),
  ]
);

export const trasladosRelations = relations(traslados, ({ one }) => ({
  item: one(item, {
    fields: [traslados.itemId],
    references: [item.id],
  }),
  fromStation: one(station, {
    fields: [traslados.fromStationId],
    references: [station.id],
  }),
  toStation: one(station, {
    fields: [traslados.toStationId],
    references: [station.id],
  }),
}));
