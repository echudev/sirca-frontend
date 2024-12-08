import { usersTable } from "@/db/schema";

export interface LoginUserDTO {
  name: string;
  password: string;
}

export interface LoginUserResponseDTO {
  success: boolean;
  data?: {
    id: number;
    name: string;
  };
  message?: string;
}

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  role: string;
}

type RegisterUserResponseData = {
  id: number;
  name: string;
  email: string;
};

export interface RegisterUserResponseDTO {
  success: boolean;
  data?: RegisterUserResponseData;
  message?: string;
}

export type GetUserResponseDTO = typeof usersTable.$inferSelect | null;

export interface CookiePayload {
  userId: string;
  userName: string;
  role: string;
}

export interface GetCookieResponseDTO {
  isAuth: boolean;
  data: CookiePayload;
}
