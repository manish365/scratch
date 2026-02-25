import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/enrollments — Learner enrolls in a roadmap
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "LEARNER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { roadmapId } = await req.json();
    if (!roadmapId) return NextResponse.json({ error: "roadmapId required" }, { status: 400 });

    // Check roadmap exists and is published
    const roadmap = await prisma.roadmap.findUnique({
        where: { id: roadmapId, published: true },
        include: { steps: { include: { todos: true } } },
    });
    if (!roadmap) return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });

    // Check existing enrollment
    const existing = await prisma.enrollment.findUnique({
        where: { userId_roadmapId: { userId: session.user.id, roadmapId } },
    });
    if (existing) return NextResponse.json({ error: "Already enrolled" }, { status: 409 });

    // Create enrollment + initialize all todo progress entries
    const allTodos = roadmap.steps.flatMap((s) => s.todos);

    const enrollment = await prisma.enrollment.create({
        data: {
            userId: session.user.id,
            roadmapId,
            progress: {
                create: allTodos.map((todo) => ({ todoId: todo.id, completed: false })),
            },
        },
        include: { progress: true },
    });

    return NextResponse.json(enrollment, { status: 201 });
}
