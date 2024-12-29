// Este componente toma la tabla desde data-table.tsx, le agrega los datos fetcheados y lo exporta para ser usado en page.tsx
"use server";

import { columns } from "./table-columns";
import { DataTable } from "@/app/inicio/inventario/repuestos/components/data-table-client";
import { taskSchema } from "../schema";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "/app/inicio/inventario/repuestos/tasks.json")
  );

  const tasks = JSON.parse(data.toString());

  return z.array(taskSchema).parse(tasks);
}

export default async function TablaPartes() {
  const data = await getTasks();

  return <DataTable columns={columns} data={data} />;
}
