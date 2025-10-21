import { getServerSession } from "next-auth";
import { authOptions } from "./auth-config";
import type { Session } from "@/types/auth";

export async function getSession(): Promise<Session | null> {
  return getServerSession(authOptions) as Promise<Session | null>;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}
