import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.passwordHash) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role, dealerId: user.dealerId } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as any).id ?? token.sub;
        (token as any).id = (user as any).id; // opcional, por compatibilidad
        (token as any).role = (user as any).role;
        (token as any).dealerId = (user as any).dealerId ?? null;
      }
      return token as any;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).sub || (token as any).id || null;
        (session.user as any).role = (token as any).role;
        (session.user as any).dealerId = (token as any).dealerId ?? null;
      }
      return session;
    },
  },
};
