import { Filters } from './filters';
import { Table } from './table';
import { Metadata } from 'next';
import GetTasks from '../../../lib/getTasks';
import { Header } from './header';

export const metadata: Metadata = {
  title: 'SIRCA - Mantenimiento',
  description: 'App de mantenimiento de la red'
};

export default async function Historial() {
  const { allTasks } = await GetTasks();

  return (
    <main className="flex flex-col p-4">
      <Header
        title="Activos de la red"
        path="Mantenimiento"
        subpath="Historial"
      />
      <Filters />
      <Table data={allTasks} />
    </main>
  );
}
