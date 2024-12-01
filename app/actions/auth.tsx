"use server";

import {
  LoginFormSchema,
  LoginFormState,
  RegisterFormState,
  RegisterFormSchema,
} from "@/lib/definitions";
import { db } from "@/db/connection";
import { usersTable } from "@/db/schema";
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
      message: "El usuario no existe o la contraseña es incorrecta",
    };
  }

  //3. If the user exists and the password is correct, return a success message
  return {
    success: true,
    data: { name: usuario.name },
  };
}

export async function register(state: RegisterFormState, formData: FormData) {
  // 1- Validate form fields
  const validatedFields = RegisterFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
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
      message: "El usuario no existe o la contraseña es incorrecta",
    };
  }

  //3. If the user exists and the password is correct, return a success message
  return {
    success: true,
    data: { name: usuario.name, email: usuario.email },
  };
}
