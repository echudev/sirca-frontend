"use server";

import { redirect } from "next/navigation";
import type { UserSelect } from "@/db/schema/user";
import {
  LoginFormSchema,
  type LoginFormState,
} from "@/lib/auth/form-validations";
import { loginUser } from "@/lib/auth/service";

export async function login(_state: LoginFormState, formData: FormData) {
  // 1. Valido campos del formulario
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  // 2. Llamo al servicio login
  const result = await loginUser(validatedFields.data as UserSelect);

  if (!result.success) {
    return { success: false, message: result.message };
  }

  // 3. Redirigir al usuario o retornar datos necesarios
  redirect("/estaciones/centenario");
}
