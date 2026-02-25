"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, BookOpen, Edit2, Trash2, Eye, EyeOff, Users } from "lucide-react";
import type { Roadmap } from "@/lib/types";

const LEVEL_COLORS: Record<string, { bg: string; color: string; border: string }> = {
    BEGINNER: { bg: "rgba(16,185,129,0.1)", color: "#34d399", border: "rgba(16,185,129,0.25)" },
    INTERMEDIATE: { bg: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "rgba(245,158,11,0.25)" },
    ADVANCED: { bg: "rgba(239,68,68,0.1)", color: "#f87171", border: "rgba(239,68,68,0.25)" },
};

export default function AdminRoadmapsPage() {
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchRoadmaps = useCallback(async () => {
        setLoading(true);
        const res = await fetch(`/api/roadmaps${search ? `?search=${search}` : ""}`);
        const data = await res.json();
        setRoadmaps(data);
        setLoading(false);
    }, [search]);

    useEffect(() => { fetchRoadmaps(); }, [fetchRoadmaps]);

    const togglePublish = async (id: string) => {
        await fetch(`/api/roadmaps/${id}/publish`, { method: "PATCH" });
        fetchRoadmaps();
    };

    const deleteRoadmap = async (id: string) => {
        if (!confirm("Are you sure you want to delete this roadmap?")) return;
        setDeleting(id);
        await fetch(`/api/roadmaps/${id}`, { method: "DELETE" });
        fetchRoadmaps();
        setDeleting(null);
    };

    return (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Roadmaps</h1>
                    <p className="page-subtitle">Create and manage learning roadmaps for your organization.</p>
                </div>
                <Link
                    href="/admin/roadmaps/new"
                    id="btn-new-roadmap"
                    className="btn-gradient"
                    style={{
                        display: "inline-flex", alignItems: "center", gap: "0.5rem",
                        padding: "0.625rem 1.25rem", borderRadius: "0.75rem",
                        color: "#fff", fontWeight: 600, fontSize: "0.875rem", whiteSpace: "nowrap",
                    }}
                >
                    <Plus style={{ width: "1rem", height: "1rem" }} />
                    New Roadmap
                </Link>
            </div>

            {/* Search */}
            <div style={{ position: "relative", maxWidth: "28rem" }}>
                <Search style={{
                    position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)",
                    width: "1rem", height: "1rem", color: "#64748b", pointerEvents: "none"
                }} />
                <input
                    id="input-search"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search roadmaps..."
                    style={{
                        width: "100%", paddingLeft: "2.5rem", paddingRight: "1rem",
                        paddingTop: "0.625rem", paddingBottom: "0.625rem",
                        borderRadius: "0.75rem", background: "rgba(15,23,42,0.8)",
                        border: "1px solid rgba(51,65,85,0.8)", color: "#fff",
                        fontSize: "0.875rem", outline: "none",
                    }}
                />
            </div>

            {/* Table */}
            <div className="card-panel">
                {loading ? (
                    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: "3.5rem", borderRadius: "0.75rem" }} />
                        ))}
                    </div>
                ) : roadmaps.length === 0 ? (
                    <div style={{ padding: "3rem", textAlign: "center" }}>
                        <BookOpen style={{ width: "2.5rem", height: "2.5rem", color: "#475569", margin: "0 auto 0.75rem" }} />
                        <p style={{ color: "#94a3b8" }}>No roadmaps found.</p>
                        <Link href="/admin/roadmaps/new" style={{ color: "#818cf8", fontSize: "0.875rem", marginTop: "0.5rem", display: "inline-block" }}>
                            Create your first roadmap →
                        </Link>
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid rgba(30,41,59,1)" }}>
                                    {["Roadmap", "Level", "Steps", "Enrolled", "Status", "Actions"].map((h, i) => (
                                        <th key={h} style={{
                                            padding: "0.875rem 1rem", textAlign: i === 5 ? "right" : "left",
                                            fontSize: "0.7rem", fontWeight: 600, color: "#64748b",
                                            textTransform: "uppercase", letterSpacing: "0.07em",
                                            display: i === 1 ? undefined : i === 2 || i === 3 ? undefined : undefined,
                                        }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {roadmaps.map((r) => {
                                    const lc = LEVEL_COLORS[r.level] ?? LEVEL_COLORS.BEGINNER;
                                    return (
                                        <tr key={r.id} style={{ borderBottom: "1px solid rgba(30,41,59,0.6)", transition: "background 0.15s" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(30,41,59,0.4)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <td style={{ padding: "0.875rem 1rem" }}>
                                                <div style={{ fontWeight: 500, color: "#fff", fontSize: "0.875rem" }}>{r.title}</div>
                                                <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.125rem" }}>{r.category}</div>
                                            </td>
                                            <td style={{ padding: "0.875rem 1rem" }}>
                                                <span style={{
                                                    display: "inline-flex", padding: "0.2rem 0.6rem", borderRadius: "9999px",
                                                    fontSize: "0.7rem", fontWeight: 600,
                                                    background: lc.bg, color: lc.color, border: `1px solid ${lc.border}`
                                                }}>
                                                    {r.level}
                                                </span>
                                            </td>
                                            <td style={{ padding: "0.875rem 1rem", color: "#94a3b8", fontSize: "0.875rem" }}>{r.steps.length}</td>
                                            <td style={{ padding: "0.875rem 1rem" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#94a3b8", fontSize: "0.875rem" }}>
                                                    <Users style={{ width: "0.875rem", height: "0.875rem" }} />
                                                    {r._count?.enrollments ?? 0}
                                                </div>
                                            </td>
                                            <td style={{ padding: "0.875rem 1rem" }}>
                                                <span className={r.published ? "badge-published" : "badge-draft"}>
                                                    {r.published ? "Published" : "Draft"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "0.875rem 1rem" }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.25rem" }}>
                                                    <button
                                                        onClick={() => togglePublish(r.id)}
                                                        title={r.published ? "Unpublish" : "Publish"}
                                                        style={{ padding: "0.5rem", borderRadius: "0.5rem", color: "#94a3b8", background: "transparent", border: "none", cursor: "pointer", transition: "all 0.15s" }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(30,41,59,0.8)"; e.currentTarget.style.color = "#fff"; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
                                                    >
                                                        {r.published ? <EyeOff style={{ width: "1rem", height: "1rem" }} /> : <Eye style={{ width: "1rem", height: "1rem" }} />}
                                                    </button>
                                                    <Link
                                                        href={`/admin/roadmaps/${r.id}/edit`}
                                                        style={{ padding: "0.5rem", borderRadius: "0.5rem", color: "#94a3b8", display: "flex", transition: "all 0.15s" }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(30,41,59,0.8)"; e.currentTarget.style.color = "#fff"; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
                                                    >
                                                        <Edit2 style={{ width: "1rem", height: "1rem" }} />
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteRoadmap(r.id)}
                                                        disabled={deleting === r.id}
                                                        style={{ padding: "0.5rem", borderRadius: "0.5rem", color: "#94a3b8", background: "transparent", border: "none", cursor: "pointer", opacity: deleting === r.id ? 0.5 : 1 }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#f87171"; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
                                                    >
                                                        <Trash2 style={{ width: "1rem", height: "1rem" }} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
