import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SIRCA - Inventario',
  description: 'App de inventario de la red'
};

export default async function Inventario() {
  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="font-semibold text-lg text-primary md:text-2xl">
        Página en construcción
      </h1>
    </div>
  );
}
