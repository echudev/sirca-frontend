// @vitest-environment node
//
// jose firma/verifica JWT con crypto. Bajo el entorno jsdom, jose resuelve su
// build de Web Crypto y el Uint8Array de jsdom falla el chequeo `instanceof`
// (distinto realm). Corriendo este archivo en el entorno `node`, jose usa su
// build de Node y el round-trip funciona. next/headers está mockeado igual.
import { describe, it, expect, vi, beforeEach } from "vitest";

// Cookie store falso. Se crea con vi.hoisted para poder referenciarlo dentro
// del factory de vi.mock (que se eleva al tope del archivo).
const { cookieStore } = vi.hoisted(() => ({
  cookieStore: {
    set: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
  },
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => cookieStore),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import {
  encrypt,
  decrypt,
  createSession,
  deleteSession,
} from "@/lib/auth-session";

const samplePayload = {
  userId: "1",
  userName: "Juan",
  role: "ADMIN",
  email: "juan@example.com",
  expiresAt: new Date("2030-01-01T00:00:00.000Z"),
};

describe("auth-session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("encrypt / decrypt", () => {
    it("hace round-trip y conserva los datos del payload", async () => {
      const token = await encrypt(samplePayload);
      expect(typeof token).toBe("string");

      const decoded = await decrypt(token);
      expect(decoded).toMatchObject({
        userId: "1",
        userName: "Juan",
        role: "ADMIN",
        email: "juan@example.com",
      });
    });

    it("devuelve undefined ante un token inválido", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const decoded = await decrypt("esto.no.es.un.jwt");

      expect(decoded).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("devuelve undefined cuando no se pasa token", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const decoded = await decrypt();

      expect(decoded).toBeUndefined();
      consoleSpy.mockRestore();
    });
  });

  describe("createSession", () => {
    it("guarda la cookie 'session' con las opciones de seguridad correctas", async () => {
      await createSession("42", "Ana", "EDITOR", "ana@example.com");

      expect(cookieStore.set).toHaveBeenCalledTimes(1);
      const [name, token, options] = cookieStore.set.mock.calls[0];

      expect(name).toBe("session");
      expect(typeof token).toBe("string");
      expect(options).toMatchObject({
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });
      expect(options.expires).toBeInstanceOf(Date);
    });

    it("guarda un token que decripta de vuelta al payload del usuario", async () => {
      await createSession("42", "Ana", "EDITOR", "ana@example.com");

      const token = cookieStore.set.mock.calls[0][1] as string;
      const decoded = await decrypt(token);

      expect(decoded).toMatchObject({
        userId: "42",
        userName: "Ana",
        role: "EDITOR",
        email: "ana@example.com",
      });
    });
  });

  describe("deleteSession", () => {
    it("elimina la cookie 'session'", async () => {
      await deleteSession();

      expect(cookieStore.delete).toHaveBeenCalledWith("session");
    });
  });
});
