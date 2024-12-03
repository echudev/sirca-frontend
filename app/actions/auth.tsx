"use server";

import {
  LoginFormSchema,
  LoginFormState,
  RegisterFormState,
  RegisterFormSchema,
} from "@/lib/definitions";
import { db } from "@/db/connection";
import { UserInsert, usersTable } from "@/db/schema";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function login(state: LoginFormState, formData: FormData) {
  // 1- Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    name: formData.get("name"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  //2. Check if the user exists in the database and if the password is correct
  const db_user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.name, validatedFields.data?.name ?? ""));
  const usuario = db_user.length > 0 ? db_user[0] : null;

  // If the user doesn't exist or the password is incorrect, return an error
  if (
    !usuario ||
    !(await bcrypt.compare(
      validatedFields.data?.password ?? "",
      usuario.passwordHash
    ))
  ) {
    return {
      success: false,
      message: "Usuario o contraseña incorrectos",
    };
  }

  // 4. Create user session
  await createSession(usuario.id.toString());
  // 5. Redirect user
  redirect("/dashboard");
}

export async function logout() {
  deleteSession();
  redirect("/");
}

export async function register(state: RegisterFormState, formData: FormData) {
  // 1- Validate form fields
  const validatedFields = RegisterFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const name = validatedFields.data.name;
  const email = validatedFields.data.email;
  const password = validatedFields.data.password;
  const role = validatedFields.data.role;
  const passwordHash = await bcrypt.hash(password, 10);

  const newUser: UserInsert = { name, email, passwordHash, role };

  try {
    const id = await db
      .insert(usersTable)
      .values(newUser)
      .returning({ id: usersTable.id });

    return {
      success: true,
      data: { user_id: id, name: newUser.name, email: newUser.email },
    };
  } catch (error: unknown) {
    const pgError = error as {
      code?: string;
      detail?: string;
      message?: string;
    };
    // Manejar errores específicos de PostgreSQL
    if (pgError.code) {
      switch (pgError.code) {
        case "23505": // Unique violation
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

        case "23502": // Not null violation
          return {
            success: false,
            message: "Faltan campos requeridos",
          };

        case "23503": // Foreign key violation
          return {
            success: false,
            message: "Error de referencia en la base de datos",
          };

        case "42P01": // Undefined table
          return {
            success: false,
            message: "Error interno del servidor: tabla no encontrada",
          };

        case "28P01": // Invalid password
          return {
            success: false,
            message: "Error de autenticación con la base de datos",
          };
      }
    }

    // Manejar errores de conexión
    if (pgError.message?.includes("connect")) {
      return {
        success: false,
        message: "Error de conexión con la base de datos",
      };
    }

    // Manejar errores de timeout
    if (pgError.message?.includes("timeout")) {
      return {
        success: false,
        message: "La operación tardó demasiado tiempo",
      };
    }

    // Error genérico para cualquier otro caso
    return {
      success: false,
      message: "Error al registrar el usuario. Por favor, intente nuevamente",
      debug:
        process.env.NODE_ENV === "development" ? pgError.message : undefined,
    };
  }
}
