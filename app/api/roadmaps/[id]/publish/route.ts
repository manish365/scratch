import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/roadmaps/[id]/publish — Toggle published status
export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const roadmap = await prisma.roadmap.findUnique({ where: { id } });
    if (!roadmap) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.roadmap.update({
        where: { id },
        data: { published: !roadmap.published },
        select: { id: true, published: true },
    });

    return NextResponse.json(updated);
}
