import { Metadata } from 'next';
import { Header } from './header';

export const metadata: Metadata = {
  title: 'SIRCA - Mantenimiento',
  description: 'App de mantenimiento de la red'
};

export default async function Calibraciones() {
  return (
    <main className="flex flex-col p-4">
      <Header
        title="Calibraciones"
        path="Mantenimiento"
        subpath="Calibraciones"
      />
    </main>
  );
}
