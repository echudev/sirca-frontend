import { Metadata } from "next";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

export const metadata: Metadata = {
  title: "SIRCA - Inventario",
  description: "App de inventario de la red",
};

async function getData(): Promise<Payment[]> {
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "fastrak@gmail.com",
    },
    {
      id: "a8e9d4f",
      amount: 100,
      status: "pending",
      email: "macroni@example.com",
    },
    {
      id: "dji8d4f",
      amount: 200,
      status: "processing",
      email: "donizeit@buenosaires.com",
    },
    {
      id: "851d4f",
      amount: 300,
      status: "success",
      email: "m@example.com",
    },
  ];
}

export default async function Estaciones() {
  const data = await getData();

  return (
    <main className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </main>
  );
}
