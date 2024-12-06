import { db } from "@/db/connection";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { RegisterUserDTO, GetUserResponseDTO } from "./dto";

export async function getUserByName(name: string): Promise<GetUserResponseDTO> {
  const db_user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.name, name));
  return db_user.length > 0 ? db_user[0] : null;
}

export async function insertUser(
  newUser: RegisterUserDTO
): Promise<{ id: number }> {
  const result = await db
    .insert(usersTable)
    .values(newUser)
    .returning({ id: usersTable.id });
  return result[0];
}
