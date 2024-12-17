import {
  integer,
  pgTable,
  timestamp,
  serial,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { items } from "./items";
import { stations } from "./stations";

export const traslados = pgTable(
  "traslados",
  {
    id: serial("traslado_id").primaryKey(),
    itemId: integer("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    fromStationId: integer("station_id_origen")
      .notNull()
      .references(() => stations.id, { onDelete: "cascade" }),
    toStationId: integer("station_id_destino")
      .notNull()
      .references(() => stations.id, { onDelete: "cascade" }),
    quantity: integer("cantidad").notNull(),
    createdAt: timestamp("fecha_traslado").defaultNow().notNull(),
  },
  (table) => [
    check("station_check", sql`${table.fromStationId} <> ${table.toStationId}`),
    check("cantidad_check", sql`${table.quantity} > 0`),
  ]
);
