import { getCoDiario } from "./repository";
import { verifySession } from "../auth-session";
import { redirect } from "next/navigation";

export async function handleGetCoDiario() {
  // Verificar sesión
  const session = await verifySession();

  if (!session.isAuth) {
    // No hay sesión => No autorizado
    redirect("/login");
  }

  try {
    // Si el usuario está autenticado, traigo la data
    const co_diario = await getCoDiario();
    return co_diario;
  } catch (error) {
    console.error(error);
  }
}