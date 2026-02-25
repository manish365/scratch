import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { type NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
    const { pathname } = req.nextUrl;
    const session = req.auth;
    const role = session?.user?.role;

    // Protect admin routes
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
        if (!session) return NextResponse.redirect(new URL("/", req.url));
        return NextResponse.redirect(new URL("/learner", req.url));
    }

    // Protect learner routes
    if (pathname.startsWith("/learner") && role !== "LEARNER") {
        if (!session) return NextResponse.redirect(new URL("/", req.url));
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    // If logged in and visiting root, redirect to their dashboard
    if (pathname === "/" && session) {
        if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
        if (role === "LEARNER") return NextResponse.redirect(new URL("/learner", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*", "/learner/:path*", "/"],
};
