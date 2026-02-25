import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/enrollments/[roadmapId]/todos/[todoId] — Toggle a todo completion
export async function PATCH(
    _req: NextRequest,
    { params }: { params: Promise<{ roadmapId: string; todoId: string }> }
) {
    const session = await auth();
    if (!session || session.user.role !== "LEARNER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { roadmapId, todoId } = await params;

    const enrollment = await prisma.enrollment.findUnique({
        where: { userId_roadmapId: { userId: session.user.id, roadmapId } },
    });
    if (!enrollment) return NextResponse.json({ error: "Not enrolled" }, { status: 404 });

    const existing = await prisma.todoProgress.findUnique({
        where: { enrollmentId_todoId: { enrollmentId: enrollment.id, todoId } },
    });

    if (!existing) {
        const created = await prisma.todoProgress.create({
            data: {
                enrollmentId: enrollment.id,
                todoId,
                completed: true,
                completedAt: new Date(),
            },
        });
        return NextResponse.json(created);
    }

    const updated = await prisma.todoProgress.update({
        where: { enrollmentId_todoId: { enrollmentId: enrollment.id, todoId } },
        data: {
            completed: !existing.completed,
            completedAt: !existing.completed ? new Date() : null,
        },
    });

    return NextResponse.json(updated);
}
