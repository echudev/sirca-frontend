import bcrypt from "bcryptjs";
import type { UserInsert, UserSelect } from "@/db/schema/user";
import { createSession } from "@/lib/auth-session";
import { getUserByEmail, insertUser } from "./repository";

export interface AuthResponse {
  success: boolean;
  data?: {
    id: number;
    name: string;
    email: string;
  };
  message?: string;
}

export async function loginUser(data: UserSelect): Promise<AuthResponse> {
  // Obtener el usuario desde la base de datos
  const usuario = await getUserByEmail(data.email);
  if (!usuario) {
    return { success: false, message: "Usuario no encontrado" };
  }

  // Validar la contraseña
  const isPasswordValid = await bcrypt.compare(data.password, usuario.password);
  if (!isPasswordValid) {
    return { success: false, message: "Contraseña incorrecta" };
  }

  // Crear la sesión del usuario
  await createSession(
    usuario.id.toString(),
    usuario.name,
    usuario.role,
    usuario.email,
  );

  // Retornar el nombre del usuario para posibles personalizaciones
  return {
    success: true,
    data: { id: usuario.id, name: usuario.name, email: usuario.email },
  };
}

export async function registerUser(data: UserInsert): Promise<AuthResponse> {
  // Hashear la contraseña
  const password = await bcrypt.hash(data.password, 10);

  try {
    // Insertar al usuario en la base de datos
    const result = await insertUser({
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      password,
      role: data.role,
    });

    // Preparar la respuesta
    return {
      success: true,
      data: {
        id: result.id,
        name: data.name,
        email: data.email,
      },
    };
  } catch (error: unknown) {
    const pgError = error as {
      code?: string;
      detail?: string;
      message?: string;
    };

    // Manejo de errores específicos de PostgreSQL
    if (pgError.code === "23505") {
      if (pgError.detail?.includes("name")) {
        return {
          success: false,
          message: "El nombre de usuario ya está en uso",
        };
      }
      if (pgError.detail?.includes("email")) {
        return {
          success: false,
          message: "El correo electrónico ya está registrado",
        };
      }
      return {
        success: false,
        message: "Ya existe un registro con estos datos",
      };
    }

    // Otros errores genéricos
    return {
      success: false,
      message: "Error al registrar el usuario. Por favor, intente nuevamente",
    };
  }
}
