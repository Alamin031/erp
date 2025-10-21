import { authOptions } from "./auth-config";
import type { Session } from "@/types/auth";

// Dual getSession helper that works on both client and server.
export async function getSession(): Promise<Session | null> {
  // If we're running in a browser, use the client-side helper from next-auth/react
  if (typeof window !== "undefined") {
    // Dynamically import to avoid bundling server-only code into the client
    const { getSession: getClientSession } = await import("next-auth/react");
    return (await getClientSession()) as Session | null;
  }

  // Server-side: use getServerSession to read session during SSR/SSR-like contexts
  const { getServerSession } = await import("next-auth");
  return (await getServerSession(authOptions)) as Session | null;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}
