import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/enrollments/[roadmapId] — Get learner's enrollment + progress for a roadmap
export async function GET(_req: NextRequest, { params }: { params: Promise<{ roadmapId: string }> }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { roadmapId } = await params;

    const enrollment = await prisma.enrollment.findUnique({
        where: { userId_roadmapId: { userId: session.user.id, roadmapId } },
        include: { progress: true },
    });

    if (!enrollment) return NextResponse.json(null);
    return NextResponse.json(enrollment);
}

// PATCH /api/enrollments/[roadmapId] — Save Google Doc URL
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ roadmapId: string }> }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { roadmapId } = await params;
    const { googleDocUrl } = await req.json();

    const enrollment = await prisma.enrollment.update({
        where: { userId_roadmapId: { userId: session.user.id, roadmapId } },
        data: { googleDocUrl: googleDocUrl || null },
        include: { progress: true },
    });

    return NextResponse.json(enrollment);
}
