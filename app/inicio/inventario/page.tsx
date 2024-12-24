import { PageUnderConstruction } from '@/components/page-under-construction';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SIRCA - Inventario',
  description: 'App de inventario de la red'
};

export default async function Inventario() {
  return (
    <PageUnderConstruction />
  );
}
