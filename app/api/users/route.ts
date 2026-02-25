import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/users — admin only, list all users
export async function GET() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: { select: { enrollments: true } },
        },
    });
    return NextResponse.json(users);
}

// POST /api/users — admin only, create a learner
export async function POST(req: Request) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { name, email, password, role = "LEARNER" } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
        select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { enrollments: true } } },
    });
    return NextResponse.json(user, { status: 201 });
}
