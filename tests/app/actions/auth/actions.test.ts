import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, logout, register } from "@/app/actions/auth/";
import { loginUser, registerUser } from "@/lib/auth/service";
import {
  LoginFormSchema,
  RegisterFormSchema,
} from "@/lib/auth/form-validations";
import { deleteSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

vi.mock("@/lib/auth/service", () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

vi.mock("@/lib/auth-session", () => ({
  deleteSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("actions.ts", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("login", () => {
    it("should return validation errors if form data is invalid", async () => {
      const formData = new FormData();
      formData.set("email", ""); // Invalid data
      formData.set("password", "");

      const state = {};
      const result = await login(state, formData);

      expect(result).toMatchObject({
        errors: expect.any(Object),
      });
    });

    it("should call loginUser and redirect on successful login", async () => {
      const formData = new FormData();
      formData.set("email", "testuser");
      formData.set("password", "password123");

      vi.spyOn(LoginFormSchema, "safeParse").mockReturnValue({
        success: true,
        data: { email: "testuser", password: "password123" },
      });

      vi.mocked(loginUser).mockResolvedValue({
        success: true,
      });

      const state = {};
      await login(state, formData);

      expect(loginUser).toHaveBeenCalledWith({
        email: "testuser",
        password: "password123",
      });
      expect(redirect).toHaveBeenCalledWith("/estaciones/centenario");
    });

    it("should return an error if loginUser fails", async () => {
      const formData = new FormData();
      formData.set("email", "testuser");
      formData.set("password", "password123");

      vi.spyOn(LoginFormSchema, "safeParse").mockReturnValue({
        success: true,
        data: { email: "testuser", password: "password123" },
      });

      vi.mocked(loginUser).mockResolvedValue({
        success: false,
        message: "Invalid credentials",
      });

      const state = {};
      const result = await login(state, formData);

      expect(loginUser).toHaveBeenCalledWith({
        email: "testuser",
        password: "password123",
      });
      expect(result).toMatchObject({
        success: false,
        message: "Invalid credentials",
      });
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should call deleteSession and redirect to homepage", async () => {
      await logout();

      expect(deleteSession).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith("/");
    });
  });

  describe("register", () => {
    it("should return validation errors if form data is invalid", async () => {
      const formData = new FormData();
      formData.set("name", ""); // Invalid data
      formData.set("email", "");
      formData.set("password", "");
      formData.set("role", "");

      const state = {};
      const result = await register(state, formData);

      expect(result).toMatchObject({
        errors: expect.any(Object),
      });
    });

    it("should call registerUser and return user data on successful registration", async () => {
      const formData = new FormData();
      formData.set("name", "testuser");
      formData.set("email", "testuser@example.com");
      formData.set("password", "password123");
      formData.set("role", "EDITOR");

      vi.spyOn(RegisterFormSchema, "safeParse").mockReturnValue({
        success: true,
        data: {
          name: "testuser",
          lastName: "testuser",
          email: "testuser@example.com",
          password: "password123",
          role: "EDITOR",
        },
      });

      vi.mocked(registerUser).mockResolvedValue({
        success: true,
        data: {
          id: 1,
          name: "testuser",
          email: "testuser@example.com",
        },
      });

      const state = {};
      const result = await register(state, formData);

      expect(registerUser).toHaveBeenCalledWith({
        name: "testuser",
        lastName: "testuser",
        email: "testuser@example.com",
        password: "password123",
        role: "EDITOR",
      });
      expect(result).toMatchObject({
        success: true,
        data: {
          id: 1,
          name: "testuser",
          email: "testuser@example.com",
        },
      });
    });

    it("should return an error if registerUser fails", async () => {
      const formData = new FormData();
      formData.set("name", "testuser");
      formData.set("email", "testuser@example.com");
      formData.set("password", "password123");
      formData.set("role", "ADMIN");

      vi.spyOn(RegisterFormSchema, "safeParse").mockReturnValue({
        success: true,
        data: {
          name: "testuser",
          lastName: "testuser",
          email: "testuser@example.com",
          password: "password123",
          role: "ADMIN",
        },
      });

      vi.mocked(registerUser).mockResolvedValue({
        success: false,
        message: "El correo electrónico ya está registrado",
      });

      const state = {};
      const result = await register(state, formData);

      expect(registerUser).toHaveBeenCalledWith({
        name: "testuser",
        lastName: "testuser",
        email: "testuser@example.com",
        password: "password123",
        role: "ADMIN",
      });
      expect(result).toMatchObject({
        success: false,
        message: "El correo electrónico ya está registrado",
      });
    });
  });
});
