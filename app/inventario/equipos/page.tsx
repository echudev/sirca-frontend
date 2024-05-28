import { Metadata } from 'next';
import { Filters } from './filters';
import { Table } from '../../../components/table';
import { Header } from '../../../components/header';
import GetEquipos from '../../../lib/getEquipos';

export const metadata: Metadata = {
  title: 'SIRCA - Mantenimiento',
  description: 'App de mantenimiento de la red'
};

export default async function Equipos() {
  const { allEquipos } = await GetEquipos();

  return (
    <main className="flex flex-col p-4">
      <Header title="Equipos de la Red" path="Inventario" subpath="Equipos" />
      <Filters />
      <Table data={allEquipos} />
    </main>
  );
}
