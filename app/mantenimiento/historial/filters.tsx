'use client';

import { SearchIcon } from '../../../components/icons';

export const Filters = () => {
  return (
    <div
      aria-label="filter&searchbar container"
      className="flex flex-col lg:flex-row :flex-col gap-2 w-full justify-center"
    >
      <div aria-label="filters" className="flex gap-2 items-center">
        <div className="border-2 border-slate-300 shadow shadow-slate-300 px-2 py-1 rounded">
          <label className="ml-auto mr-2" htmlFor="filtro">
            Marca:
          </label>
          <select
            onChange={(e) => console.log(e.target.value)}
            className="rounded inline"
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
        <div className="border-2 border-slate-300 shadow shadow-slate-300 px-2 py-1  rounded">
          <label className="ml-auto mr-2" htmlFor="contaminante">
            Contaminante:
          </label>
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
        <div className="border-2 border-slate-300 shadow shadow-slate-300 px-2 py-1 rounded">
          <label className="ml-auto mr-2" htmlFor="estado">
            Estado:
          </label>
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
      <div
        aria-label="searchbar"
        className="flex min-w-[300px] border-2 px-2 py-1 has-[:focus]:outline-blue-300 rounded border-slate-300 shadow shadow-slate-300 my-1 outline outline-transparent outline-offset-1 transition-all"
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
