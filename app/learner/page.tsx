"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, BookOpen, Clock, Users, ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import type { Roadmap } from "@/lib/types";

const LEVEL_STYLES: Record<string, { bg: string; color: string; border: string }> = {
    BEGINNER: { bg: "rgba(16,185,129,0.1)", color: "#34d399", border: "rgba(16,185,129,0.25)" },
    INTERMEDIATE: { bg: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "rgba(245,158,11,0.25)" },
    ADVANCED: { bg: "rgba(239,68,68,0.1)", color: "#f87171", border: "rgba(239,68,68,0.25)" },
};

export default function LearnerCatalogPage() {
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [enrollments, setEnrollments] = useState<Record<string, { completed: number; total: number }>>({});
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [levelFilter, setLevelFilter] = useState("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (levelFilter) params.set("level", levelFilter);
        const res = await fetch(`/api/roadmaps?${params}`);
        const data: Roadmap[] = await res.json();
        setRoadmaps(data);

        const enrollmentData: Record<string, { completed: number; total: number }> = {};
        await Promise.all(
            data.map(async (r) => {
                const er = await fetch(`/api/enrollments/${r.id}`);
                const enrollment = await er.json();
                if (enrollment) {
                    const total = r.steps.reduce((acc, s) => acc + s.todos.length, 0);
                    const completed = enrollment.progress.filter((p: { completed: boolean }) => p.completed).length;
                    enrollmentData[r.id] = { completed, total };
                }
            })
        );
        setEnrollments(enrollmentData);
        setLoading(false);
    }, [search, levelFilter]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const enroll = async (roadmapId: string) => {
        setEnrolling(roadmapId);
        await fetch("/api/enrollments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roadmapId }),
        });
        await fetchData();
        setEnrolling(null);
    };

    const totalHours = (r: Roadmap) => r.steps.reduce((acc, s) => acc + s.estimatedHours, 0);

    return (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {/* Header */}
            <div>
                <h1 className="page-title">Learning Catalog</h1>
                <p className="page-subtitle">Explore and enroll in roadmaps curated for your growth.</p>
            </div>

            {/* Search & Filter */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ position: "relative", flex: 1 }}>
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
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    {["", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((l) => (
                        <button
                            key={l}
                            id={`select-level-${l || "all"}`}
                            onClick={() => setLevelFilter(l)}
                            style={{
                                padding: "0.4rem 1rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 500,
                                cursor: "pointer", border: "1px solid", transition: "all 0.15s",
                                background: levelFilter === l ? "rgba(99,102,241,0.2)" : "rgba(15,23,42,0.8)",
                                borderColor: levelFilter === l ? "rgba(99,102,241,0.5)" : "rgba(51,65,85,0.8)",
                                color: levelFilter === l ? "#818cf8" : "#94a3b8",
                            }}
                        >
                            {l === "" ? "All Levels" : l.charAt(0) + l.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards Grid */}
            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: "14rem", borderRadius: "1rem" }} />
                    ))}
                </div>
            ) : roadmaps.length === 0 ? (
                <div style={{ textAlign: "center", padding: "5rem 0" }}>
                    <BookOpen style={{ width: "3rem", height: "3rem", color: "#475569", margin: "0 auto 0.75rem" }} />
                    <p style={{ color: "#94a3b8" }}>No roadmaps found.</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                    {roadmaps.map((r) => {
                        const enrollment = enrollments[r.id];
                        const isEnrolled = !!enrollment;
                        const progress = enrollment ? Math.round((enrollment.completed / enrollment.total) * 100) || 0 : 0;
                        const ls = LEVEL_STYLES[r.level] ?? LEVEL_STYLES.BEGINNER;
                        return (
                            <div key={r.id} className="roadmap-card">
                                {/* Level + category */}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                                    <span style={{
                                        display: "inline-flex", padding: "0.15rem 0.55rem", borderRadius: "9999px",
                                        fontSize: "0.7rem", fontWeight: 600,
                                        background: ls.bg, color: ls.color, border: `1px solid ${ls.border}`
                                    }}>{r.level}</span>
                                    <span style={{
                                        display: "inline-flex", padding: "0.15rem 0.55rem", borderRadius: "9999px",
                                        fontSize: "0.7rem", color: "#94a3b8",
                                        border: "1px solid rgba(51,65,85,0.7)", background: "rgba(30,41,59,0.5)"
                                    }}>{r.category}</span>
                                </div>

                                {/* Title + description */}
                                <div>
                                    <h3 style={{ fontWeight: 600, color: "#fff", fontSize: "0.9375rem", lineHeight: 1.3 }}>{r.title}</h3>
                                    <p style={{
                                        fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.35rem",
                                        display: "-webkit-box", WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical", overflow: "hidden"
                                    }}>{r.description}</p>
                                </div>

                                {/* Meta */}
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.75rem", color: "#64748b" }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                        <BookOpen style={{ width: "0.875rem", height: "0.875rem" }} />{r.steps.length} steps
                                    </span>
                                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                        <Clock style={{ width: "0.875rem", height: "0.875rem" }} />{totalHours(r)}h
                                    </span>
                                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                        <Users style={{ width: "0.875rem", height: "0.875rem" }} />{r._count?.enrollments ?? 0}
                                    </span>
                                </div>

                                {/* Tags */}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                                    {r.tags.slice(0, 3).map((tag) => (
                                        <span key={tag} style={{
                                            fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: "0.375rem",
                                            background: "rgba(30,41,59,0.8)", color: "#94a3b8"
                                        }}>{tag}</span>
                                    ))}
                                </div>

                                {/* Progress bar */}
                                {isEnrolled && (
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                                            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Progress</span>
                                            <span style={{ fontSize: "0.75rem", color: "#818cf8", fontWeight: 500 }}>{progress}%</span>
                                        </div>
                                        <div style={{ height: "0.375rem", borderRadius: "9999px", background: "rgba(30,41,59,1)", overflow: "hidden" }}>
                                            <div style={{
                                                height: "100%", borderRadius: "9999px",
                                                background: "linear-gradient(to right, #6366f1, #8b5cf6)",
                                                width: `${progress}%`, transition: "width 0.5s"
                                            }} />
                                        </div>
                                    </div>
                                )}

                                {/* Action */}
                                <div style={{ marginTop: "auto" }}>
                                    {isEnrolled ? (
                                        <Link
                                            href={`/learner/roadmap/${r.id}`}
                                            style={{
                                                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                                                padding: "0.625rem", borderRadius: "0.75rem",
                                                background: "rgba(99,102,241,0.1)", color: "#818cf8",
                                                border: "1px solid rgba(99,102,241,0.3)", fontSize: "0.875rem", fontWeight: 500,
                                            }}
                                        >
                                            {progress === 100 ? <CheckCircle style={{ width: "1rem", height: "1rem" }} /> : <ChevronRight style={{ width: "1rem", height: "1rem" }} />}
                                            {progress === 100 ? "Completed!" : "Continue Learning"}
                                        </Link>
                                    ) : (
                                        <button
                                            id={`btn-enroll-${r.id}`}
                                            onClick={() => enroll(r.id)}
                                            disabled={enrolling === r.id}
                                            className="btn-gradient"
                                            style={{
                                                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                                                padding: "0.625rem", borderRadius: "0.75rem",
                                                color: "#fff", fontSize: "0.875rem", fontWeight: 500,
                                                border: "none", cursor: "pointer", opacity: enrolling === r.id ? 0.6 : 1,
                                            }}
                                        >
                                            {enrolling === r.id ? <Loader2 style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} /> : "Enroll Now"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
