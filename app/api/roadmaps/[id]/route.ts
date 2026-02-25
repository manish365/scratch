import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/roadmaps/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const roadmap = await prisma.roadmap.findUnique({
        where: { id },
        include: {
            createdBy: { select: { name: true, email: true } },
            steps: { include: { todos: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } },
            _count: { select: { enrollments: true } },
        },
    });

    if (!roadmap) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!roadmap.published && session.user.role === "LEARNER") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(roadmap);
}

// PATCH /api/roadmaps/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, description, category, level, tags, steps } = body;

    // Delete old steps (cascade deletes todos)
    if (steps !== undefined) {
        await prisma.step.deleteMany({ where: { roadmapId: id } });
    }

    const roadmap = await prisma.roadmap.update({
        where: { id },
        data: {
            ...(title && { title }),
            ...(description && { description }),
            ...(category && { category }),
            ...(level && { level }),
            ...(tags && { tags }),
            ...(steps !== undefined && {
                steps: {
                    create: steps.map((step: { title: string; description: string; resources: string[]; estimatedHours: number; todos: { label: string }[] }, index: number) => ({
                        title: step.title,
                        description: step.description,
                        resources: step.resources || [],
                        estimatedHours: step.estimatedHours || 1,
                        order: index + 1,
                        todos: {
                            create: (step.todos || []).map((todo: { label: string }, tIdx: number) => ({
                                label: todo.label,
                                order: tIdx + 1,
                            })),
                        },
                    })),
                },
            }),
        },
        include: {
            steps: { include: { todos: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } },
            createdBy: { select: { name: true, email: true } },
            _count: { select: { enrollments: true } },
        },
    });

    return NextResponse.json(roadmap);
}

// DELETE /api/roadmaps/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.roadmap.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
