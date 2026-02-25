import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// PATCH /api/users/[id] — update name, email, or password
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    if (body.name) updateData.name = body.name;
    if (body.email) updateData.email = body.email;
    if (body.password) updateData.password = await bcrypt.hash(body.password, 12);
    if (body.role) updateData.role = body.role;

    const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { enrollments: true } } },
    });
    return NextResponse.json(user);
}

// DELETE /api/users/[id]
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    // Don't allow deleting yourself
    if (session.user.id === id) return NextResponse.json({ error: "Cannot delete your own account." }, { status: 400 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
