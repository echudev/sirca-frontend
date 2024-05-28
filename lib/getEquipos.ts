import equiposData from './equipos.json';
import { EquiposData } from './types';

export default async function GetEquipos() {
  const allEquipos: EquiposData[] = [];

  equiposData?.forEach((equipo: EquiposData) => {
    const newEquipo: EquiposData = {
      ...equipo
    };
    allEquipos.push(newEquipo);
  });

  return { allEquipos };
}
