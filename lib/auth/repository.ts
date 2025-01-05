import { db } from "@/db/connection";
import { user } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { RegisterUserDTO, GetUserResponseDTO } from "./dto";

export async function getUserByName(name: string): Promise<GetUserResponseDTO> {
  const db_user = await db.select().from(user).where(eq(user.name, name));
  return db_user.length > 0 ? db_user[0] : null;
}

export async function insertUser(
  newUser: RegisterUserDTO
): Promise<{ id: number }> {
  const result = await db
    .insert(user)
    .values(newUser)
    .returning({ id: user.id });
  return result[0];
}
