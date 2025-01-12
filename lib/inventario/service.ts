import { getEquipos, getPartes } from "./repository";
import { verifySession } from "../auth-session";
import { redirect } from "next/navigation";

export async function handleGetPartes() {
  // Verificar sesión
  const session = await verifySession();

  if (!session.isAuth) {
    // No hay sesión => No autorizado
    redirect("/login");
  }

  try {
    // Si el usuario está autenticado, traigo la data
    const partes = await getPartes();
    return partes;
  } catch (error) {
    console.error(error);
  }
}

export async function handleGetEquipos() {
  // Verificar sesión
  const session = await verifySession();

  if (!session.isAuth) {
    // No hay sesión => No autorizado
    redirect("/login");
  }

  try {
    // Si el usuario está autenticado, traigo la data
    const partes = await getEquipos();
    return partes;
  } catch (error) {
    console.error(error);
  }
}
