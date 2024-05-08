import { Filters } from './filters';
import { Table } from './table';
import { Metadata } from 'next';
import GetOrdenes from '../../../lib/getOrdenes';
import { Header } from './header';

export const metadata: Metadata = {
  title: 'SIRCA - Mantenimiento',
  description: 'App de mantenimiento de la red'
};

export default async function Ordenes() {
  const { allOrdenes } = await GetOrdenes();

  return (
    <main className="flex flex-col p-4">
      <Header
        title="Ordenes de Trabajo"
        path="Mantenimiento"
        subpath="Ordenes"
      />
      <Filters />
      <Table data={allOrdenes} />
    </main>
  );
}
