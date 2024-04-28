'use client';
import { useEffect } from 'react';
import { SearchIcon } from '../../../components/icons';

export default function Historial() {
  useEffect(() => {
    document.title = 'SIRCA - Mantenimiento';
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex flex-col items-center border border-red-400">
        <h1 className="font-semibold text-blue-900/90 text-2xl text-center w-full">
          Historial de tareas realizadas
        </h1>
        <div
          aria-label="filters"
          className="flex items-center justify-center gap-2 border border-red-400 w-full"
        >
          <div className="flex items-center  flex-col gap-2 p-2">
            <label htmlFor="filtro">Marca</label>
            <select
              onChange={(e) => console.log(e.target.value)}
              className="rounded"
            >
              <option value="">Todas</option>
              <option value="thermo">Thermo</option>
              <option value="ecotech">Ecotech</option>
              <option value="acoem">Acoem</option>
              <option value="teledyne">Teledyne</option>
              <option value="environnement">Environnement</option>
              <option value="environnement">Davis</option>
              <option value="environnement">Thomas</option>
            </select>
          </div>
          <div className="flex items-center  flex-col gap-2 p-2">
            <label htmlFor="contaminante">Contaminante</label>
            <select
              onChange={(e) => console.log(e.target.value)}
              className="rounded"
            >
              <option value="">Todos</option>
              <option value="co">Monóxido de Carbono</option>
              <option value="nox">Óxidos de Nitrógeno</option>
              <option value="so2">Dióxido de Azufre</option>
              <option value="o3">Ozono</option>
              <option value="particulado">Particulado</option>
              <option value="meteo">Meteorológica</option>
            </select>
          </div>
          <div className="flex items-center  flex-col gap-2 p-2">
            <label htmlFor="estado">Estado</label>
            <select
              onChange={(e) => console.log(e.target.value)}
              className="rounded"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="enproceso">En proceso</option>
              <option value="completado">Completado</option>
            </select>
          </div>
        </div>
        <div className="flex border-2 has-[:focus]:outline-blue-600 rounded border-neutral-800/80 m-1 outline outline-transparent outline-offset-1 transition-all">
          <SearchIcon />
          <input
            className="px-3 outline-none"
            type="search"
            placeholder="busca por id, nombre, marca, modelo"
          ></input>
        </div>
      </div>
    </main>
  );
}
