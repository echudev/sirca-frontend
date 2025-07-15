import { db } from "@/db/connection";
import { userTable, UserSelect, UserInsert } from "@/db/schema/user";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email: string): Promise<UserSelect | null> {
  const db_user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));
  return db_user.length > 0 ? db_user[0] : null;
}

export async function insertUser(newUser: UserInsert): Promise<{ id: number }> {
  const result = await db
    .insert(userTable)
    .values(newUser)
    .returning({ id: userTable.id });
  return result[0];
}
