import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
  
 // Verificamos si DATABASE_URL está definida antes de conectarse
 if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no está definida en las variables de entorno.");
  }

  // Inicializamos la conexión con drizzle
  export const db = drizzle(process.env.DATABASE_URL);