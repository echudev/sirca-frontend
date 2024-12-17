import {
  pgTable,
  varchar,
  text,
  serial,
  decimal,
  date,
} from "drizzle-orm/pg-core";

export const stations = pgTable("stations", {
  id: serial("station_id").primaryKey(),
  name: varchar("station_name", { length: 100 }).notNull(),
  imageUrl: text("station_image_url"),
  latitude: decimal("station_latitude", { precision: 9, scale: 6 }),
  longitude: decimal("station_longitude", { precision: 9, scale: 6 }),
  address: text("station_address"),
  description: text("station_description"),
  operationalSince: date("operational_since"),
});
