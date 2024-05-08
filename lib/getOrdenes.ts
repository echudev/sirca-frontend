import ordenesData from './ordenes.json';
import { OrdenesData } from './types';

export default async function GetOrdenes() {
  const ordenes: OrdenesData[] = [];
  const allOrdenes: OrdenesData[] = [];

  ordenesData?.forEach((order: OrdenesData) => {
    const newOrder: OrdenesData = {
      ...order
    };
    allOrdenes.push(newOrder);
  });

  return { allOrdenes };
}
