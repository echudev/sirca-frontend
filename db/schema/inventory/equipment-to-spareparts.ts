import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { item } from "./item";
import { relations, sql } from "drizzle-orm";

export const equipmentToSpareparts = table(
  "equipment_to_spareparts",
  {
    equipmentID: t
      .integer("equipment_id")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    sparepartID: t
      .integer("sparepart_id")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
  },
  (table) => [
    t.primaryKey({ columns: [table.equipmentID, table.sparepartID] }),
    t.check(
      "no_self_reference",
      sql`${table.sparepartID} <> ${table.equipmentID}`
      // agregar chequeo de categoría y subcategoría desde lógica de la app
    ),
  ]
);

export const repuestoAnalyzadorRelations = relations(
  equipmentToSpareparts,
  ({ one }) => ({
    repuesto: one(item, {
      fields: [equipmentToSpareparts.sparepartID],
      references: [item.id],
    }),
    analizador: one(item, {
      fields: [equipmentToSpareparts.equipmentID],
      references: [item.id],
    }),
  })
);
