import { z } from "zod";

export const LoginFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Debe tener al menos 8 caracteres." })
    .regex(/[a-zA-Z]/, { message: "Debe contener al menos una letra." })
    .regex(/[0-9]/, { message: "Debe contener al menos un número." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Debe contener al menos un carácter especial.",
    })
    .trim(),
});

export const RegisterFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .trim(),
  email: z.string().email({ message: "Por favor, introduce un correo válido." }).trim(),
  password: z
    .string()
    .min(8, { message: "Debe tener al menos 8 caracteres." })
    .regex(/[a-zA-Z]/, { message: "Debe contener al menos una letra." })
    .regex(/[0-9]/, { message: "Debe contener al menos un número." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Debe contener al menos un carácter especial.",
    })
    .trim(),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"], {
    required_error: "Por favor, selecciona un rol.",
  }),
});

export type LoginFormState =
  | {
      errors?: {
        name?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type RegisterFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        role?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: string;
  userName: string;
  role: string;
  expiresAt: Date;
};
