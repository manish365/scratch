import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/roadmaps/[id]/stats — Admin only enrollment stats
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const enrollments = await prisma.enrollment.findMany({
        where: { roadmapId: id },
        include: {
            progress: { where: { completed: true } },
            roadmap: {
                include: {
                    steps: { include: { todos: true } },
                },
            },
        },
    });

    const totalTodos = enrollments[0]?.roadmap.steps.reduce(
        (acc, step) => acc + step.todos.length,
        0
    ) ?? 0;

    const completionRates = enrollments.map((e) => {
        if (totalTodos === 0) return 0;
        return (e.progress.length / totalTodos) * 100;
    });

    const avgProgress =
        completionRates.length > 0
            ? completionRates.reduce((a, b) => a + b, 0) / completionRates.length
            : 0;

    const fullyCompleted = completionRates.filter((r) => r === 100).length;

    return NextResponse.json({
        totalEnrollments: enrollments.length,
        completionRate: enrollments.length > 0 ? (fullyCompleted / enrollments.length) * 100 : 0,
        averageProgress: avgProgress,
    });
}
