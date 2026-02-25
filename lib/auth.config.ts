import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config.
 * NO imports of Prisma, bcrypt, or any Node.js-only module here.
 * This file is used by middleware (Edge Runtime) and by the full auth.ts.
 */
export const authConfig: NextAuthConfig = {
    providers: [], // providers are added in auth.ts (Node.js runtime only)
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as { role: string }).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        },
        authorized({ auth }) {
            // Returning true here; route protection is handled in middleware logic
            return true;
        },
    },
    pages: {
        signIn: "/",
    },
    session: { strategy: "jwt" },
};
