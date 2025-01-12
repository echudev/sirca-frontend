import { db } from "@/db/connection";
import { eq } from "drizzle-orm";
import { itemTable } from "@/db/schema/inventory/item";
import { itemSubcategory } from "@/db/schema/inventory/item-subcategory";
import { itemCategory } from "@/db/schema/inventory/item-category";

export async function getPartes() {
  // Unimos items -> subcategory -> category
  const result = await db
    .select({
      id: itemTable.id,
      code: itemTable.itemCode,
      name: itemTable.name,
      category: itemSubcategory.name,
    })
    .from(itemTable)
    .innerJoin(itemSubcategory, eq(itemTable.subcategoryID, itemSubcategory.id))
    .innerJoin(itemCategory, eq(itemSubcategory.categoryId, itemCategory.id))
    .where(eq(itemCategory.name, "PARTES")); // filtramos por categoría

  return result;
}

export async function getEquipos() {
  // Unimos items -> subcategory -> category
  const result = await db
    .select({
      id: itemTable.id,
      code: itemTable.itemCode,
      name: itemTable.name,
      category: itemSubcategory.name,
    })
    .from(itemTable)
    .innerJoin(itemSubcategory, eq(itemTable.subcategoryID, itemSubcategory.id))
    .innerJoin(itemCategory, eq(itemSubcategory.categoryId, itemCategory.id))
    .where(eq(itemCategory.name, "EQUIPOS")); // filtramos por categoría

  return result;
}
