import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SIRCA - Mantenimiento',
  description: 'App de mantenimiento de la red'
};

export default async function Mantenimiento() {
  return (
    <main className="flex flex-1 flex-col gap-2 m-4">
      <div className="flex items-center">
        <h1 className="font-semibold text-2xl">Mantenimiento</h1>
      </div>
    </main>
  );
}
