import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { itemTable } from "@/db/schema/inventory/item";
import { itemSubcategory } from "@/db/schema/inventory/item-subcategory";
import { itemCategory } from "@/db/schema/inventory/item-category";
import { brand } from "@/db/schema/inventory/brand";
import { model } from "@/db/schema/inventory/model";

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
      modelo: model.name,
      marca: brand.name,
    })
    .from(itemTable)
    .innerJoin(itemSubcategory, eq(itemTable.subcategoryID, itemSubcategory.id))
    .innerJoin(itemCategory, eq(itemSubcategory.categoryId, itemCategory.id))
    .where(eq(itemCategory.name, "EQUIPOS"))
    .innerJoin(model, eq(itemTable.itemModel, model.id))
    .innerJoin(brand, eq(model.brandId, brand.id));

  return result;
}
