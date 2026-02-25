import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/roadmaps — Admin gets all, Learner gets only published
export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (session.user.role === "LEARNER") where.published = true;
    if (category) where.category = category;
    if (level) where.level = level;
    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { tags: { has: search } },
        ];
    }

    const roadmaps = await prisma.roadmap.findMany({
        where,
        include: {
            createdBy: { select: { name: true, email: true } },
            steps: { include: { todos: true }, orderBy: { order: "asc" } },
            _count: { select: { enrollments: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(roadmaps);
}

// POST /api/roadmaps — Admin only
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, category, level, tags, steps } = body;

    if (!title || !description || !category) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const roadmap = await prisma.roadmap.create({
        data: {
            title,
            description,
            category,
            level: level || "BEGINNER",
            tags: tags || [],
            createdById: session.user.id,
            steps: {
                create: (steps || []).map((step: { title: string; description: string; resources: string[]; estimatedHours: number; todos: { label: string }[] }, index: number) => ({
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
        },
        include: {
            steps: { include: { todos: true }, orderBy: { order: "asc" } },
            createdBy: { select: { name: true, email: true } },
            _count: { select: { enrollments: true } },
        },
    });

    return NextResponse.json(roadmap, { status: 201 });
}
