export interface LoginDTO {
  name: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
}
