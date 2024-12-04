"use server";

import {
  LoginFormSchema,
  LoginFormState,
  RegisterFormState,
  RegisterFormSchema,
} from "@/lib/definitions";
import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/session";
import { loginUser, registerUser } from "@/domain/user/service";
import { LoginDTO, RegisterDTO } from "@/domain/user/dto";

export async function login(state: LoginFormState, formData: FormData) {
  // 1. Validar los campos del formulario
  const validatedFields = LoginFormSchema.safeParse({
    name: formData.get("name"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  // 2. Llamar al servicio de login
  const result = await loginUser(validatedFields.data as LoginDTO);

  if (!result.success) {
    return { success: false, message: result.message };
  }
  // 3. Redirigir al usuario o retornar datos necesarios
  redirect("/dashboard");
}

export async function logout() {
  deleteSession();
  redirect("/");
}

export async function register(state: RegisterFormState, formData: FormData) {
  // 1. Validar los campos del formulario
  const validatedFields = RegisterFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Llamar al servicio de registro
  const result = await registerUser(validatedFields.data as RegisterDTO);

  if (!result.success) {
    return { success: false, message: result.message };
  }

  // 3. Retornar los datos del usuario registrado
  return {
    success: true,
    data: result.data,
  };
}
