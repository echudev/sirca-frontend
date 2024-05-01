import data from './equipos.json';
import { EquipoData } from './types';

export default async function GetEquipos() {
  const allEquipos: EquipoData[] = [];

  data?.forEach((doc: EquipoData) => {
    const newTask: EquipoData = {
      ...doc
    };
    allEquipos.push(newTask);
  });

  return { allEquipos };
}
