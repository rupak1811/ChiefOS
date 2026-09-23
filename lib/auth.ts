import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Require verified email from Google
      if (account?.provider === "google") {
        const googleProfile = profile as { email_verified?: boolean };
        if (!googleProfile.email_verified) {
          return false;
        }
      }
      return true;
    },
    async session({ session, user, token }) {
      if (!session.user) {
        return session;
      }

      // With database sessions, user should always be provided
      // But if somehow it's not, look up by email as fallback
      let userId: string | undefined = user?.id;
      
      if (!userId && session.user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, killSwitch: true },
        });
        if (dbUser) {
          userId = dbUser.id;
          session.user.id = dbUser.id;
          (session.user as any).killSwitch = dbUser.killSwitch || false;
          return session;
        }
      }

      if (userId) {
        // Normal path: user.id is available
        session.user.id = userId;
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { killSwitch: true },
        });
        (session.user as any).killSwitch = dbUser?.killSwitch || false;
        return session;
      }

      // No user ID available - invalidate session to force re-auth
      // Return session without user to trigger layout redirect
      return { ...session, user: undefined as any };
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Security: leave allowDangerousEmailAccountLinking off (default false)
  // This prevents account takeover via unverified email providers
  secret: process.env.NEXTAUTH_SECRET,
};
