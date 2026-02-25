"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, CheckCircle, Circle, ChevronDown, ChevronUp,
    Clock, BookOpen, Users, ExternalLink, Loader2, FileText, Link2, Save, X
} from "lucide-react";
import type { Roadmap, TodoProgress } from "@/lib/types";

interface EnrollmentData {
    id: string;
    progress: TodoProgress[];
    googleDocUrl?: string | null;
}

const LEVEL_STYLES: Record<string, { bg: string; color: string; border: string }> = {
    BEGINNER: { bg: "rgba(16,185,129,0.1)", color: "#34d399", border: "rgba(16,185,129,0.25)" },
    INTERMEDIATE: { bg: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "rgba(245,158,11,0.25)" },
    ADVANCED: { bg: "rgba(239,68,68,0.1)", color: "#f87171", border: "rgba(239,68,68,0.25)" },
};

export default function LearnerRoadmapDetail() {
    const params = useParams();
    const roadmapId = params?.id as string;

    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState<string | null>(null);
    const [openSteps, setOpenSteps] = useState<Record<number, boolean>>({});

    // Google Doc state
    const [docUrl, setDocUrl] = useState("");
    const [editingDoc, setEditingDoc] = useState(false);
    const [savingDoc, setSavingDoc] = useState(false);
    const [docSaved, setDocSaved] = useState(false);

    const fetchAll = useCallback(async () => {
        const [rmRes, enRes] = await Promise.all([
            fetch(`/api/roadmaps/${roadmapId}`),
            fetch(`/api/enrollments/${roadmapId}`),
        ]);
        const rm: Roadmap = await rmRes.json();
        const en: EnrollmentData | null = await enRes.json();
        setRoadmap(rm);
        setEnrollment(en);
        setDocUrl(en?.googleDocUrl ?? "");
        const firstIncomplete = rm.steps.findIndex((s) => {
            const todoIds = s.todos.map((t) => t.id);
            return todoIds.some((id) => !en?.progress.find((p) => p.todoId === id && p.completed));
        });
        setOpenSteps({ [firstIncomplete === -1 ? 0 : firstIncomplete]: true });
        setLoading(false);
    }, [roadmapId]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const toggleTodo = async (todoId: string) => {
        setToggling(todoId);
        await fetch(`/api/enrollments/${roadmapId}/todos/${todoId}`, { method: "PATCH" });
        await fetchAll();
        setToggling(null);
    };

    const toggleStep = (idx: number) =>
        setOpenSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));

    const saveDocUrl = async () => {
        setSavingDoc(true);
        await fetch(`/api/enrollments/${roadmapId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ googleDocUrl: docUrl.trim() || null }),
        });
        setEnrollment(e => e ? { ...e, googleDocUrl: docUrl.trim() || null } : e);
        setSavingDoc(false);
        setEditingDoc(false);
        setDocSaved(true);
        setTimeout(() => setDocSaved(false), 2500);
    };

    if (loading || !roadmap || !enrollment) {
        return (
            <div style={{ maxWidth: "48rem", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }} className="animate-fade-in">
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: "5rem", borderRadius: "1rem" }} />)}
            </div>
        );
    }

    const allTodos = roadmap.steps.flatMap((s) => s.todos);
    const completedCount = enrollment.progress.filter((p) => p.completed).length;
    const totalCount = allTodos.length;
    const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const totalHours = roadmap.steps.reduce((acc, s) => acc + s.estimatedHours, 0);
    const isTodoDone = (todoId: string) => !!enrollment.progress.find((p) => p.todoId === todoId && p.completed);
    const isStepDone = (step: Roadmap["steps"][0]) => step.todos.every((t) => isTodoDone(t.id));
    const ls = LEVEL_STYLES[roadmap.level] ?? LEVEL_STYLES.BEGINNER;
    const savedDoc = enrollment.googleDocUrl;

    return (
        <div style={{ maxWidth: "48rem", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-fade-in">
            {/* Back link */}
            <Link href="/learner" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#64748b", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.15s", width: "fit-content" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")}
                onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
            >
                <ArrowLeft style={{ width: "1rem", height: "1rem" }} /> Back to Catalog
            </Link>

            {/* Hero card */}
            <div style={{
                background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.8))",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: "1.25rem",
                padding: "1.75rem",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                position: "relative", overflow: "hidden",
            }}>
                {/* Top glow */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #6366f1, #8b5cf6, transparent)" }} />

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                    <span style={{ display: "inline-flex", padding: "0.25rem 0.7rem", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 700, background: ls.bg, color: ls.color, border: `1px solid ${ls.border}` }}>{roadmap.level}</span>
                    <span style={{ display: "inline-flex", padding: "0.25rem 0.7rem", borderRadius: "9999px", fontSize: "0.7rem", color: "#64748b", border: "1px solid rgba(51,65,85,0.6)", background: "rgba(30,41,59,0.5)" }}>{roadmap.category}</span>
                </div>

                <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", marginBottom: "0.625rem" }}>{roadmap.title}</h1>
                <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>{roadmap.description}</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", marginBottom: "1.25rem" }}>
                    {[
                        { icon: BookOpen, text: `${roadmap.steps.length} steps` },
                        { icon: Clock, text: `${totalHours}h estimated` },
                        { icon: Users, text: `${roadmap._count?.enrollments ?? 0} enrolled` },
                    ].map(({ icon: Icon, text }) => (
                        <span key={text} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8rem", color: "#64748b" }}>
                            <Icon style={{ width: "0.875rem", height: "0.875rem" }} />{text}
                        </span>
                    ))}
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "1.375rem" }}>
                    {roadmap.tags.map(tag => (
                        <span key={tag} style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "0.375rem", background: "rgba(30,41,59,0.8)", color: "#64748b", border: "1px solid rgba(51,65,85,0.4)" }}>{tag}</span>
                    ))}
                </div>

                {/* Progress */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.8125rem", color: "#94a3b8", fontWeight: 500 }}>Overall Progress</span>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#818cf8" }}>{completedCount}/{totalCount} · {progressPct}%</span>
                    </div>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                    </div>
                    {progressPct === 100 && (
                        <div style={{ marginTop: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#34d399", fontSize: "0.875rem", fontWeight: 600 }}>
                            <CheckCircle style={{ width: "1rem", height: "1rem" }} /> Roadmap Complete! 🎉
                        </div>
                    )}
                </div>
            </div>

            {/* ── Google Doc Integration ── */}
            <div className="doc-link-field">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.625rem", background: "rgba(66,133,244,0.15)", border: "1px solid rgba(66,133,244,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <FileText style={{ width: "1.125rem", height: "1.125rem", color: "#60a5fa" }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.9rem" }}>Google Doc</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Attach your personal study notes document</div>
                    </div>
                </div>

                {savedDoc && !editingDoc ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                        <a href={savedDoc} target="_blank" rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.125rem", borderRadius: "0.75rem", background: "rgba(66,133,244,0.1)", border: "1px solid rgba(66,133,244,0.25)", color: "#60a5fa", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(66,133,244,0.2)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(66,133,244,0.1)"; }}
                        >
                            <ExternalLink style={{ width: "0.9rem", height: "0.9rem" }} /> Open in Google Docs
                        </a>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setDocUrl(savedDoc); setEditingDoc(true); }}>
                            <Link2 style={{ width: "0.875rem", height: "0.875rem" }} /> Change URL
                        </button>
                        <button className="btn btn-sm" onClick={() => { setDocUrl(""); saveDocUrl(); }}
                            style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                            <X style={{ width: "0.875rem", height: "0.875rem" }} /> Remove
                        </button>
                    </div>
                ) : editingDoc || !savedDoc ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <div className="input-with-icon">
                            <Link2 className="input-icon" />
                            <input
                                type="url"
                                className="input-field"
                                value={docUrl}
                                onChange={e => setDocUrl(e.target.value)}
                                placeholder="https://docs.google.com/document/d/..."
                                id="input-google-doc-url"
                            />
                        </div>
                        <div style={{ display: "flex", gap: "0.625rem" }}>
                            <button className="btn btn-primary btn-sm" onClick={saveDocUrl} disabled={savingDoc} id="btn-save-doc">
                                {savingDoc ? <Loader2 style={{ width: "0.875rem", height: "0.875rem" }} className="animate-spin" /> : <Save style={{ width: "0.875rem", height: "0.875rem" }} />}
                                {savingDoc ? "Saving…" : "Save Link"}
                            </button>
                            {editingDoc && (
                                <button className="btn btn-ghost btn-sm" onClick={() => setEditingDoc(false)}>Cancel</button>
                            )}
                        </div>
                        {docSaved && <div className="alert-success" style={{ padding: "0.625rem 0.875rem" }}><span>Google Doc URL saved!</span></div>}
                    </div>
                ) : null}
            </div>

            {/* Steps accordion */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {roadmap.steps.map((step, si) => {
                    const done = isStepDone(step);
                    const stepCompleted = step.todos.filter((t) => isTodoDone(t.id)).length;
                    return (
                        <div key={step.id} className={`step-card ${done ? "completed" : ""}`}>
                            <button type="button" onClick={() => toggleStep(si)} className="step-card-trigger">
                                <div style={{
                                    width: "2.25rem", height: "2.25rem", borderRadius: "0.75rem", flexShrink: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    background: done ? "rgba(16,185,129,0.15)" : "rgba(30,41,59,0.8)",
                                    border: `1.5px solid ${done ? "rgba(16,185,129,0.4)" : "rgba(51,65,85,0.6)"}`,
                                    transition: "all 0.2s",
                                }}>
                                    {done
                                        ? <CheckCircle style={{ width: "1rem", height: "1rem", color: "#34d399" }} />
                                        : <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b" }}>{si + 1}</span>
                                    }
                                </div>
                                <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, color: done ? "#34d399" : "#f1f5f9", fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{step.title}</div>
                                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.2rem" }}>
                                        {stepCompleted}/{step.todos.length} completed · {step.estimatedHours}h
                                    </div>
                                </div>
                                {openSteps[si]
                                    ? <ChevronUp style={{ width: "1rem", height: "1rem", color: "#475569", flexShrink: 0 }} />
                                    : <ChevronDown style={{ width: "1rem", height: "1rem", color: "#475569", flexShrink: 0 }} />
                                }
                            </button>

                            {openSteps[si] && (
                                <div style={{ borderTop: "1px solid rgba(30,41,59,0.8)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                    {step.description && (
                                        <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.7 }}>{step.description}</p>
                                    )}

                                    {/* Resources */}
                                    {step.resources.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.625rem" }}>Resources</div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                                                {step.resources.map((url, i) => (
                                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "#818cf8", textDecoration: "none", transition: "color 0.15s" }}
                                                        onMouseEnter={e => (e.currentTarget.style.color = "#a78bfa")}
                                                        onMouseLeave={e => (e.currentTarget.style.color = "#818cf8")}
                                                    >
                                                        <ExternalLink style={{ width: "0.875rem", height: "0.875rem", flexShrink: 0 }} />
                                                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Todos */}
                                    <div>
                                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.625rem" }}>Tasks</div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                            {step.todos.map((todo) => {
                                                const isDone = isTodoDone(todo.id);
                                                const isToggling = toggling === todo.id;
                                                return (
                                                    <button
                                                        key={todo.id}
                                                        id={`todo-${todo.id}`}
                                                        onClick={() => toggleTodo(todo.id)}
                                                        disabled={isToggling}
                                                        className={`todo-item ${isDone ? "done" : ""}`}
                                                    >
                                                        <div style={{
                                                            flexShrink: 0, width: "1.375rem", height: "1.375rem",
                                                            borderRadius: "9999px", border: "2px solid",
                                                            borderColor: isDone ? "#34d399" : "#334155",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            background: isDone ? "#34d399" : "transparent",
                                                            transition: "all 0.2s",
                                                        }}>
                                                            {isToggling
                                                                ? <Loader2 style={{ width: "0.75rem", height: "0.75rem", color: isDone ? "#fff" : "#64748b" }} className="animate-spin" />
                                                                : isDone ? <CheckCircle style={{ width: "0.75rem", height: "0.75rem", color: "#fff" }} /> : <Circle style={{ width: "0.75rem", height: "0.75rem", color: "transparent" }} />
                                                            }
                                                        </div>
                                                        <span style={{ fontSize: "0.875rem", color: isDone ? "#64748b" : "#e2e8f0", textDecoration: isDone ? "line-through" : "none", transition: "all 0.2s" }}>
                                                            {todo.label}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
