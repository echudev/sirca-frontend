import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { inventory } from "./inventory";
import { traslados } from "./traslados";

export const station = table("station", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar("station_name", { length: 100 }).notNull(),
  imageUrl: t.text("station_image_url"),
  latitude: t.decimal("station_latitude", { precision: 9, scale: 6 }),
  longitude: t.decimal("station_longitude", { precision: 9, scale: 6 }),
  address: t.text("station_address"),
  description: t.text("station_description"),
  operationalSince: t.date("operational_since"),
});

export const stationsRelations = relations(station, ({ many }) => ({
  inventory: many(inventory),
  traslados: many(traslados),
}));
