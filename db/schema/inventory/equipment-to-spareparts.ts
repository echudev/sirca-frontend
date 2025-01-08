import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { itemTable } from "./item";
import { relations, sql } from "drizzle-orm";

export const equipmentToSpareparts = table(
  "equipment_to_spareparts",
  {
    equipmentID: t
      .integer("equipment_id")
      .notNull()
      .references(() => itemTable.id, { onDelete: "cascade" }),
    sparepartID: t
      .integer("sparepart_id")
      .notNull()
      .references(() => itemTable.id, { onDelete: "cascade" }),
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
    repuesto: one(itemTable, {
      fields: [equipmentToSpareparts.sparepartID],
      references: [itemTable.id],
    }),
    analizador: one(itemTable, {
      fields: [equipmentToSpareparts.equipmentID],
      references: [itemTable.id],
    }),
  })
);
