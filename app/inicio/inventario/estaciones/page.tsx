import { Metadata } from "next";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";
import { taskSchema } from "./schema";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

export const metadata: Metadata = {
  title: "SIRCA - Inventario",
  description: "App de inventario de la red",
};

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "/app/inicio/inventario/estaciones/tasks.json")
  );

  const tasks = JSON.parse(data.toString());

  return z.array(taskSchema).parse(tasks);
}

export default async function Estaciones() {
  const data = await getTasks();

  return (
    <main className="container mx-auto">
      <div className="flex items-center justify-between space-y-2 my-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            Estaciones de monitoreo
          </h2>
          <p className="text-muted-foreground">
            Listado con las estaciones que se encuentran en la red de calidad
            del aire
          </p>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </main>
  );
}
