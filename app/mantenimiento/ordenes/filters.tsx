'use client';

import { SearchIcon } from '../../../components/icons';

export const Filters = () => {
  return (
    <div
      aria-label="filter&searchbar container"
      className="flex flex-col lg:flex-row :flex-col gap-2 w-full"
    >
      <div aria-label="filters" className="flex gap-2 items-center">
        <div className="border-2 border-slate-300 shadow shadow-slate-300 px-2 py-1  rounded">
          <label className="ml-auto mr-2" htmlFor="estacion">
            Estación
          </label>
          <select
            onChange={(e) => console.log(e.target.value)}
            className="rounded"
          >
            <option value="">Todas</option>
            <option value="co">Centenario</option>
            <option value="o3">CIFA</option>
            <option value="particulado">La Boca</option>
            <option value="meteo">Córdoba</option>
          </select>
        </div>
        <div className="border-2 border-slate-300 shadow shadow-slate-300 px-2 py-1 rounded">
          <label className="ml-auto mr-2" htmlFor="estado">
            Estado
          </label>
          <select
            onChange={(e) => console.log(e.target.value)}
            className="rounded"
          >
            <option value="">Todos</option>
            <option value="pendiente">Abierto</option>
            <option value="enproceso">Asignado</option>
            <option value="completado">En Proceso</option>
            <option value="completado">Cerrado</option>
          </select>
        </div>
        <div className="border-2 border-slate-300 shadow shadow-slate-300 px-2 py-1 rounded">
          <label className="ml-auto mr-2" htmlFor="tipo">
            Tipo
          </label>
          <select
            onChange={(e) => console.log(e.target.value)}
            className="rounded"
          >
            <option value="">Todos</option>
            <option value="pendiente">Calibración</option>
            <option value="enproceso">Preventivo</option>
            <option value="completado">Correctivo</option>
            <option value="completado">Otro</option>
          </select>
        </div>
      </div>
      <div
        aria-label="searchbar"
        className="flex items-center w-full border-2 px-2 py-1 has-[:focus]:outline-blue-300 rounded border-slate-300 shadow shadow-slate-300 my-1 outline outline-transparent outline-offset-1 transition-all"
      >
        <SearchIcon />
        <input
          className="px-3 outline-none w-full placeholder-shown:overflow-ellipsis"
          type="search"
          placeholder="busca por id, nombre, marca, modelo"
        ></input>
      </div>
    </div>
  );
};
