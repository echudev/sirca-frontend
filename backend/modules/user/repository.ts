import { db } from "@/db/connection";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserByName(name: string) {
  const db_user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.name, name));
  return db_user.length > 0 ? db_user[0] : null;
}

export async function insertUser(newUser: {
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}): Promise<{ id: number }> {
  const result = await db
    .insert(usersTable)
    .values(newUser)
    .returning({ id: usersTable.id });
  return result[0];
}
