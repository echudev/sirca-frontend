import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SIRCA - Inventario',
  description: 'App de inventario de la red'
};

export default async function Estaciones() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Estaciones</h1>
      </div>
    </main>
  );
}
