"use server";

import type { UserInsert } from "@/db/schema/user";
import {
  RegisterFormSchema,
  type RegisterFormState,
} from "@/lib/auth/form-validations";
import { registerUser } from "@/lib/auth/service";
import { getSession } from "@/lib/auth-session";

export async function register(_state: RegisterFormState, formData: FormData) {
  // 0. Autorizo. Toda Server Action es un endpoint HTTP invocable de forma directa:
  // que app/admin/page.tsx sólo muestre el formulario a un ADMIN no autoriza nada,
  // y el campo "role" llega del cliente. La autorización va acá, no en la UI.
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return { success: false, message: "No autorizado" };
  }

  // 1. Valido campos del formulario
  const validatedFields = RegisterFormSchema.safeParse({
    name: formData.get("name"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  // 2. Llamo al servicio registro
  const result = await registerUser(validatedFields.data as UserInsert);

  if (!result.success) {
    return { success: false, message: result.message };
  }

  // 3. Retorno los datos y mensaje
  return {
    success: true,
    data: result.data,
  };
}
