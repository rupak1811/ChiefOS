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
    async session({ session, user }) {
      if (session.user && user?.id) {
        // Only expose user ID and kill switch status
        // Never expose access_token or refresh_token
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { killSwitch: true },
        });
        (session.user as any).killSwitch = dbUser?.killSwitch || false;
      }
      return session;
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
