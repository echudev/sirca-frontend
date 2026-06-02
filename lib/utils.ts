import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitPathName(pathName: string): string[] {
  // Eliminamos posibles espacios en blanco y verificamos si el pathName es vacío.
  const cleanedPath = pathName.trim();

  // Dividimos la cadena por "/", y filtramos los resultados vacíos para evitar
  // obtener cadenas vacías en caso de que el path empiece o termine con "/".
  const parts = cleanedPath.split("/").filter(Boolean);

  return parts;
}
