import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { getUserByName, insertUser } from "@/domain/user/dal";
import { LoginDTO, RegisterDTO, UserResponseDTO } from "./dto";

export async function loginUser(data: LoginDTO) {
  // Obtener el usuario desde la base de datos
  const usuario = await getUserByName(data.name);
  if (!usuario) {
    return { success: false, message: "Usuario no encontrado" };
  }

  // Validar la contraseña
  const isPasswordValid = await bcrypt.compare(
    data.password,
    usuario.passwordHash
  );
  if (!isPasswordValid) {
    return { success: false, message: "Contraseña incorrecta" };
  }

  // Crear la sesión del usuario
  await createSession(usuario.id.toString());

  // Retornar el nombre del usuario para posibles personalizaciones
  return { success: true, data: { id: usuario.id, name: usuario.name } };
}

export async function registerUser(
  data: RegisterDTO
): Promise<{ success: boolean; data?: UserResponseDTO; message?: string }> {
  // Hashear la contraseña
  const passwordHash = await bcrypt.hash(data.password, 10);

  try {
    // Insertar al usuario en la base de datos
    const result = await insertUser({
      name: data.name,
      email: data.email,
      passwordHash,
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
