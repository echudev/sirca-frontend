import { Filters } from './filters';
import { Table } from './table';
import { Metadata } from 'next';
import GetOrdenes from '../../../lib/getOrdenes';
import { Header } from '../../../components/header';

export const metadata: Metadata = {
  title: 'SIRCA - Mantenimiento',
  description: 'App de mantenimiento de la red'
};

export default async function Equipos() {
  const { allOrdenes } = await GetOrdenes();

  return (
    <main className="flex flex-col p-4">
      <Header title="Equipos de la Red" path="Inventario" subpath="Equipos" />
      <Filters />
      <Table data={allOrdenes} />
    </main>
  );
}
