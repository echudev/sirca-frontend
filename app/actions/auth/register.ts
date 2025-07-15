"use server";

import {
  RegisterFormSchema,
  RegisterFormState,
} from "@/lib/auth/form-validations";
import { UserInsert } from "@/db/schema/user";
import { registerUser } from "@/lib/auth/service";

export async function register(state: RegisterFormState, formData: FormData) {
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
