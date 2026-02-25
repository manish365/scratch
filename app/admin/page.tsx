import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Users, TrendingUp, CheckCircle, Plus, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
    const session = await auth();
    const userId = session?.user?.id!;

    const [totalRoadmaps, publishedRoadmaps, totalEnrollments, roadmaps] = await Promise.all([
        prisma.roadmap.count({ where: { createdById: userId } }),
        prisma.roadmap.count({ where: { createdById: userId, published: true } }),
        prisma.enrollment.count({ where: { roadmap: { createdById: userId } } }),
        prisma.roadmap.findMany({
            where: { createdById: userId },
            include: { _count: { select: { enrollments: true } }, steps: { include: { todos: true } } },
            orderBy: { updatedAt: "desc" },
            take: 5,
        }),
    ]);

    const stats = [
        { label: "Total Roadmaps", value: totalRoadmaps, icon: BookOpen, iconClass: "stat-icon-indigo", suffix: "" },
        { label: "Published", value: publishedRoadmaps, icon: CheckCircle, iconClass: "stat-icon-emerald", suffix: "" },
        { label: "Total Enrollments", value: totalEnrollments, icon: Users, iconClass: "stat-icon-violet", suffix: "" },
        { label: "Draft", value: totalRoadmaps - publishedRoadmaps, icon: TrendingUp, iconClass: "stat-icon-amber", suffix: "" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }} className="animate-fade-in">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Welcome back, <span className="gradient-text">{session?.user?.name}</span>
                    </h1>
                    <p className="page-subtitle">Manage your learning roadmaps and track learner progress.</p>
                </div>
                <Link href="/admin/roadmaps/new" id="btn-create-roadmap" className="btn btn-primary">
                    <Plus style={{ width: "1rem", height: "1rem" }} />
                    New Roadmap
                </Link>
            </div>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem" }}>
                {stats.map((stat) => (
                    <div key={stat.label} className="stat-card">
                        <div className="stat-card-top">
                            <span className="stat-card-label">{stat.label}</span>
                            <div className={`stat-card-icon ${stat.iconClass}`}>
                                <stat.icon style={{ width: "1.125rem", height: "1.125rem" }} />
                            </div>
                        </div>
                        <div className="stat-card-value">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Recent Roadmaps */}
            <div style={{
                background: "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.7) 100%)",
                border: "1px solid rgba(99,102,241,0.12)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                borderRadius: "1.125rem",
                overflow: "hidden",
            }}>
                <div className="card-panel-header">
                    <span className="card-panel-title">Recent Roadmaps</span>
                    <Link href="/admin/roadmaps" style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "#818cf8", textDecoration: "none" }}>
                        View all <ArrowRight style={{ width: "0.875rem", height: "0.875rem" }} />
                    </Link>
                </div>

                {roadmaps.length === 0 ? (
                    <div style={{ padding: "3.5rem", textAlign: "center" }}>
                        <div style={{
                            width: "3rem", height: "3rem", borderRadius: "0.875rem",
                            background: "rgba(30,41,59,0.6)", border: "1px solid rgba(51,65,85,0.5)",
                            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem",
                        }}>
                            <BookOpen style={{ width: "1.375rem", height: "1.375rem", color: "#475569" }} />
                        </div>
                        <p style={{ color: "#64748b", marginBottom: "0.75rem" }}>No roadmaps yet.</p>
                        <Link href="/admin/roadmaps/new" style={{ color: "#818cf8", fontSize: "0.875rem" }}>Create your first roadmap →</Link>
                    </div>
                ) : (
                    <div>
                        {roadmaps.map((r, idx) => {
                            const totalTodos = r.steps.reduce((acc, s) => acc + s.todos.length, 0);
                            return (
                                <div key={r.id} className="roadmap-row" style={{ borderBottom: idx < roadmaps.length - 1 ? "1px solid rgba(15,23,42,0.8)" : "none" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", minWidth: 0, flex: 1 }}>
                                        <div style={{
                                            width: "2.25rem", height: "2.25rem", borderRadius: "0.625rem",
                                            background: "rgba(30,41,59,0.8)", border: "1px solid rgba(51,65,85,0.5)",
                                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                        }}>
                                            <BookOpen style={{ width: "0.875rem", height: "0.875rem", color: "#64748b" }} />
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, color: "#f1f5f9", fontSize: "0.875rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div>
                                            <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.2rem" }}>
                                                {r.steps.length} steps · {totalTodos} todos · {r._count.enrollments} enrolled
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flexShrink: 0 }}>
                                        <span className={r.published ? "badge badge-published" : "badge badge-draft"}>
                                            {r.published ? "Published" : "Draft"}
                                        </span>
                                        <Link href={`/admin/roadmaps/${r.id}/edit`} style={{ fontSize: "0.8rem", color: "#64748b", textDecoration: "none" }}>
                                            Edit →
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
