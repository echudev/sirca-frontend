"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/auth-session";

export async function logout() {
  await deleteSession();
  redirect("/");
}
