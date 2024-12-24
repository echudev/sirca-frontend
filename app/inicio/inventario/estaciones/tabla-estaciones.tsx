// Este componente toma la tabla desde data-table.tsx, le agrega los datos fetcheados y lo exporta para ser usado en page.tsx

import { columns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";
import { taskSchema } from "./schema";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "/app/inicio/inventario/estaciones/tasks.json")
  );

  const tasks = JSON.parse(data.toString());

  return z.array(taskSchema).parse(tasks);
}

export default async function TablaEstaciones() {
  const data = await getTasks();

  return <DataTable columns={columns} data={data} />;
}
