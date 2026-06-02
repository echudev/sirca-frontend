import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL no está definida en las variables de entorno.");
}

export default defineConfig({
  out: "./drizzle",
  schema: ["./db/schema/**/*.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
