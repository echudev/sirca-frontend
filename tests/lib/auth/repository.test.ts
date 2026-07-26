// @vitest-environment node
//
// Dos funciones cortas contra Postgres, pero son las que buscan al usuario en
// el login y las que lo dan de alta. Lo que importa acá no es la query en sí
// sino el contrato con el service: qué devuelve cuando no hay usuario, y qué
// columnas se traen de vuelta al insertar.
import { beforeEach, describe, expect, it, vi } from "vitest";

const { db, spies, state } = vi.hoisted(() => {
  const state = {
    filasSelect: [] as unknown[],
    filasInsert: [] as unknown[],
  };

  const spies = {
    selectWhere: vi.fn(),
    insertValues: vi.fn(),
    returning: vi.fn(),
  };

  const db = {
    select: () => ({
      from: () => ({
        where: (condicion: unknown) => {
          spies.selectWhere(condicion);
          return Promise.resolve(state.filasSelect);
        },
      }),
    }),
    insert: () => ({
      values: (valores: unknown) => {
        spies.insertValues(valores);
        return {
          returning: (columnas: unknown) => {
            spies.returning(columnas);
            return Promise.resolve(state.filasInsert);
          },
        };
      },
    }),
  };

  return { db, spies, state };
});

vi.mock("@/db/drizzle", () => ({ db }));

// El objeto SQL que arma drizzle es opaco: para verificar por qué email se
// filtró hay que mirar con qué se llamó a eq(), conservando la implementación.
vi.mock("drizzle-orm", async (importOriginal) => {
  const actual = await importOriginal<typeof import("drizzle-orm")>();
  return { ...actual, eq: vi.fn(actual.eq) };
});

import { eq } from "drizzle-orm";
import { getUserByEmail, insertUser } from "@/lib/auth/repository";

const USUARIO = {
  id: 1,
  name: "Juan",
  lastName: "Pérez",
  email: "juan@example.com",
  password: "$2b$10$hashfalso",
  role: "VIEWER",
};

describe("repositorio de autenticación", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.filasSelect = [];
    state.filasInsert = [];
  });

  describe("getUserByEmail", () => {
    it("devuelve el usuario encontrado", async () => {
      state.filasSelect = [USUARIO];

      expect(await getUserByEmail("juan@example.com")).toEqual(USUARIO);
    });

    // null y no undefined: loginUser hace `if (!user)` pero además el service
    // compara contra un hash dummy en esa rama, y el contrato explícito evita
    // que un cambio de forma pase inadvertido.
    it("devuelve null cuando no existe el usuario", async () => {
      state.filasSelect = [];

      expect(await getUserByEmail("nadie@example.com")).toBeNull();
    });

    it("filtra por el email recibido", async () => {
      await getUserByEmail("juan@example.com");

      expect(vi.mocked(eq).mock.calls[0][1]).toBe("juan@example.com");
    });

    it("devuelve un solo usuario aunque la consulta traiga varias filas", async () => {
      state.filasSelect = [USUARIO, { ...USUARIO, id: 2 }];

      const usuario = await getUserByEmail("juan@example.com");

      expect(usuario).toEqual(USUARIO);
    });
  });

  describe("insertUser", () => {
    it("devuelve el id generado", async () => {
      state.filasInsert = [{ id: 42 }];

      expect(await insertUser(USUARIO as never)).toEqual({ id: 42 });
    });

    it("inserta los datos recibidos", async () => {
      state.filasInsert = [{ id: 42 }];

      await insertUser(USUARIO as never);

      expect(spies.insertValues).toHaveBeenCalledWith(USUARIO);
    });

    // Se pide de vuelta sólo el id. Un `returning()` sin argumentos trae la
    // fila entera, y con ella el hash de la contraseña, que después circula por
    // logs y respuestas sin que nadie lo haya decidido.
    it("sólo trae de vuelta el id, no la fila completa", async () => {
      state.filasInsert = [{ id: 42 }];

      await insertUser(USUARIO as never);

      const columnas = spies.returning.mock.calls[0][0] as Record<
        string,
        unknown
      >;
      expect(Object.keys(columnas)).toEqual(["id"]);
    });
  });
});
