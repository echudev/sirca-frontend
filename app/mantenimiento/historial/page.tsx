import { Filters } from './filters';
import { Table } from './table';
import { Metadata } from 'next';
import GetTasks from '../../../lib/getTasks';

export const metadata: Metadata = {
  title: 'SIRCA - Mantenimiento',
  description: 'App de mantenimiento de la red'
};

export default async function Historial() {
  const { allTasks } = await GetTasks();
  console.log(allTasks);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex flex-col items-center">
        <h1 className="font-semibold text-blue-900/90 text-2xl text-center w-full mb-6">
          Historial de tareas realizadas
        </h1>
        <Filters />
        <Table />
      </div>
    </main>
  );
}
