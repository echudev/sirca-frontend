import { Metadata } from 'next';
import { handleGetCoDiario, CoDiarioData } from '@/lib/datos/service';

export const metadata: Metadata = {
  title: 'SIRCA - Datos',
  description: 'App de datos de la red'
};

export const revalidate = 60

export default async function Diario() {
  const co_diario: CoDiarioData[] = await handleGetCoDiario();
  return (
    <div className="flex flex-col h-full px-4 overflow-auto">
      {co_diario.map((item, index) => (
        <div key={index}>
          <p>{item.date}</p>
          <p>{item.time}</p>
          <p>{item.co}</p>
          <p>{item.minuteCount}</p>
          <p>{item.status}</p>
          <p>{item.location}</p>
        </div>
      ))}
    </div>
  );
}