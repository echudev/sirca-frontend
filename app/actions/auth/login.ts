"use server";

import { LoginFormSchema, LoginFormState } from "@/lib/auth/validations";
import { redirect } from "next/navigation";
import { loginUser } from "@/lib/auth/service";
import { LoginUserDTO } from "@/lib/auth/dto";

export async function login(state: LoginFormState, formData: FormData) {
  // 1. Valido campos del formulario
  const validatedFields = LoginFormSchema.safeParse({
    name: formData.get("name"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  // 2. Llamo al servicio login
  const result = await loginUser(validatedFields.data as LoginUserDTO);

  if (!result.success) {
    return { success: false, message: result.message };
  }

  // 3. Redirigir al usuario o retornar datos necesarios
  redirect("/inicio");
}
