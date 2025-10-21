import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "@/types/auth";

// Mock user database - in production, query your actual database
const mockUsers: Record<string, User & { password: string }> = {
  "super@orionhotel.com": {
    id: "1",
    email: "super@orionhotel.com",
    name: "Super Admin",
    role: "super_admin",
    password: "demo123",
  },
  "gm@orionhotel.com": {
    id: "2",
    email: "gm@orionhotel.com",
    name: "John Manager",
    role: "general_manager",
    password: "demo123",
  },
  "fdm@orionhotel.com": {
    id: "3",
    email: "fdm@orionhotel.com",
    name: "Jane Front",
    role: "front_desk_manager",
    password: "demo123",
  },
  "fda@orionhotel.com": {
    id: "4",
    email: "fda@orionhotel.com",
    name: "Tom Agent",
    role: "front_desk_agent",
    password: "demo123",
  },
  "hk@orionhotel.com": {
    id: "5",
    email: "hk@orionhotel.com",
    name: "Mary Housekeeping",
    role: "housekeeping_manager",
    password: "demo123",
  },
  "hks@orionhotel.com": {
    id: "6",
    email: "hks@orionhotel.com",
    name: "Linda Staff",
    role: "housekeeping_staff",
    password: "demo123",
  },
  "finance@orionhotel.com": {
    id: "7",
    email: "finance@orionhotel.com",
    name: "Robert Finance",
    role: "finance_manager",
    password: "demo123",
  },
  "sales@orionhotel.com": {
    id: "8",
    email: "sales@orionhotel.com",
    name: "Sarah Sales",
    role: "sales_marketing",
    password: "demo123",
  },
  "concierge@orionhotel.com": {
    id: "9",
    email: "concierge@orionhotel.com",
    name: "Alex Concierge",
    role: "concierge",
    password: "demo123",
  },
  "maintenance@orionhotel.com": {
    id: "10",
    email: "maintenance@orionhotel.com",
    name: "David Maintenance",
    role: "maintenance_manager",
    password: "demo123",
  },
};

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = mockUsers[credentials.email];

        if (!user || user.password !== credentials.password) {
          return null;
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "demo-secret-key",
};
