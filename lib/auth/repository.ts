import { db } from "@/db/connection";
import { user, UserModel, NewUserModel } from "@/db/schema/user";
import { eq } from "drizzle-orm";

export async function getUserByName(name: string): Promise<UserModel | null> {
  const db_user = await db.select().from(user).where(eq(user.name, name));
  return db_user.length > 0 ? db_user[0] : null;
}

export async function insertUser(
  newUser: NewUserModel
): Promise<{ id: number }> {
  const result = await db
    .insert(user)
    .values(newUser)
    .returning({ id: user.id });
  return result[0];
}
