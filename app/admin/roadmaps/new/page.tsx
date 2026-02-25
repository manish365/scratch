"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Plus, Trash2, ChevronDown, ChevronUp, Save, Eye, Loader2, ArrowLeft,
    BookOpen, Tag, Layers, Clock, Link2, ListChecks, GripVertical
} from "lucide-react";
import Link from "next/link";

interface TodoDraft { label: string }
interface StepDraft {
    title: string;
    description: string;
    resources: string;
    estimatedHours: number;
    todos: TodoDraft[];
    open: boolean;
}

const emptyStep = (): StepDraft => ({
    title: "", description: "", resources: "", estimatedHours: 2, todos: [{ label: "" }], open: true,
});

const LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
const CATEGORIES = ["Engineering", "Design", "DevOps", "Data Science", "Leadership", "Product", "Security", "Other"];

const LEVEL_COLORS: Record<string, { bg: string; color: string; border: string }> = {
    BEGINNER: { bg: "rgba(16,185,129,0.1)", color: "#34d399", border: "rgba(16,185,129,0.3)" },
    INTERMEDIATE: { bg: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "rgba(245,158,11,0.3)" },
    ADVANCED: { bg: "rgba(239,68,68,0.1)", color: "#f87171", border: "rgba(239,68,68,0.3)" },
};

export default function RoadmapFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEdit = !!params?.id && params.id !== "new";

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [level, setLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">("BEGINNER");
    const [tags, setTags] = useState("");
    const [steps, setSteps] = useState<StepDraft[]>([emptyStep()]);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(isEdit);

    useEffect(() => {
        if (!isEdit) return;
        fetch(`/api/roadmaps/${params.id}`)
            .then((r) => r.json())
            .then((data) => {
                setTitle(data.title);
                setDescription(data.description);
                setCategory(data.category);
                setLevel(data.level);
                setTags(data.tags.join(", "));
                setSteps(
                    data.steps.map((s: { title: string; description: string; resources: string[]; estimatedHours: number; todos: { label: string }[] }) => ({
                        title: s.title,
                        description: s.description,
                        resources: s.resources.join("\n"),
                        estimatedHours: s.estimatedHours,
                        todos: s.todos.map((t: { label: string }) => ({ label: t.label })),
                        open: false,
                    }))
                );
                setLoading(false);
            });
    }, [isEdit, params?.id]);

    const addStep = () => setSteps((prev) => [...prev, emptyStep()]);
    const removeStep = (i: number) => setSteps((prev) => prev.filter((_, idx) => idx !== i));
    const updateStep = (i: number, field: keyof StepDraft, val: unknown) =>
        setSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
    const addTodo = (si: number) =>
        setSteps((prev) => prev.map((s, i) => i === si ? { ...s, todos: [...s.todos, { label: "" }] } : s));
    const removeTodo = (si: number, ti: number) =>
        setSteps((prev) => prev.map((s, i) => i === si ? { ...s, todos: s.todos.filter((_, j) => j !== ti) } : s));
    const updateTodo = (si: number, ti: number, val: string) =>
        setSteps((prev) => prev.map((s, i) => i === si ? { ...s, todos: s.todos.map((t, j) => j === ti ? { label: val } : t) } : s));

    const buildPayload = () => ({
        title, description, category, level,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        steps: steps.map((s) => ({
            title: s.title, description: s.description,
            resources: s.resources.split("\n").map((r) => r.trim()).filter(Boolean),
            estimatedHours: s.estimatedHours,
            todos: s.todos.filter((t) => t.label.trim()),
        })),
    });

    const handleSave = async (publish = false) => {
        setError("");
        if (!title.trim()) { setError("Roadmap title is required."); return; }
        if (steps.some(s => !s.title.trim())) { setError("All steps must have a title."); return; }
        if (publish) setPublishing(true); else setSaving(true);
        const payload = buildPayload();
        const url = isEdit ? `/api/roadmaps/${params.id}` : "/api/roadmaps";
        const method = isEdit ? "PATCH" : "POST";
        const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) { setError("Failed to save. Please check all fields."); setSaving(false); setPublishing(false); return; }
        const data = await res.json();
        if (publish && !isEdit) {
            await fetch(`/api/roadmaps/${data.id}/publish`, { method: "PATCH" });
        } else if (publish && isEdit) {
            await fetch(`/api/roadmaps/${params.id}/publish`, { method: "PATCH" });
        }
        router.push("/admin/roadmaps");
    };

    const lc = LEVEL_COLORS[level] ?? LEVEL_COLORS.BEGINNER;

    if (loading) return (
        <div style={{ maxWidth: "50rem", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }} className="animate-fade-in">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: "4rem", borderRadius: "1rem" }} />)}
        </div>
    );

    return (
        <div style={{ maxWidth: "50rem", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.75rem", paddingBottom: "3rem" }} className="animate-fade-in">

            {/* ── Header ── */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <Link
                    href="/admin/roadmaps"
                    style={{
                        width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", flexShrink: 0,
                        background: "rgba(15,23,42,0.8)", border: "1px solid rgba(51,65,85,0.6)",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b",
                        transition: "all 0.15s", textDecoration: "none", marginTop: "0.25rem",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; e.currentTarget.style.background = "rgba(30,41,59,0.8)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(51,65,85,0.6)"; e.currentTarget.style.background = "rgba(15,23,42,0.8)"; }}
                >
                    <ArrowLeft style={{ width: "1.125rem", height: "1.125rem" }} />
                </Link>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
                        {isEdit ? "Edit Roadmap" : "Create Roadmap"}
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.3rem" }}>
                        {isEdit ? "Update details, steps, and todos." : "Define the title, steps, and todo tasks for your learners."}
                    </p>
                </div>
            </div>

            {error && <div className="alert-error"><span>{error}</span></div>}

            {/* ── Details Card ── */}
            <div style={{
                background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.8))",
                border: "1px solid rgba(99,102,241,0.15)", borderRadius: "1.25rem",
                overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
            }}>
                {/* Card header */}
                <div style={{ padding: "1.125rem 1.5rem", borderBottom: "1px solid rgba(30,41,59,0.8)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "2rem", height: "2rem", borderRadius: "0.625rem", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <BookOpen style={{ width: "1rem", height: "1rem", color: "#818cf8" }} />
                    </div>
                    <span style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.9375rem" }}>Roadmap Details</span>
                </div>

                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {/* Title */}
                    <div className="input-group">
                        <label className="input-label">Title *</label>
                        <input
                            id="input-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Full-Stack Web Development"
                            className="input-field input-field-lg"
                        />
                    </div>

                    {/* Description */}
                    <div className="input-group">
                        <label className="input-label">Description *</label>
                        <textarea
                            id="input-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Describe what learners will achieve by completing this roadmap…"
                            style={{
                                width: "100%", padding: "0.875rem 1rem", borderRadius: "0.75rem",
                                background: "rgba(15,23,42,0.9)", border: "1.5px solid rgba(51,65,85,0.8)",
                                color: "#f1f5f9", fontSize: "0.9rem", fontFamily: "inherit",
                                resize: "none", outline: "none", lineHeight: 1.6, transition: "border-color 0.2s",
                            }}
                            onFocus={e => { e.currentTarget.style.borderColor = "#6366f1"; }}
                            onBlur={e => { e.currentTarget.style.borderColor = "rgba(51,65,85,0.8)"; }}
                        />
                    </div>

                    {/* Category + Level row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="input-group">
                            <label className="input-label">
                                <Layers style={{ display: "inline", width: "0.75rem", height: "0.75rem", marginRight: "0.375rem", verticalAlign: "middle" }} />
                                Category
                            </label>
                            <div style={{ position: "relative" }}>
                                <select
                                    id="select-category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="input-field"
                                    style={{ appearance: "none", cursor: "pointer" }}
                                >
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <ChevronDown style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", width: "1rem", height: "1rem", color: "#475569", pointerEvents: "none" }} />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Level</label>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                {LEVELS.map(l => {
                                    const lclr = LEVEL_COLORS[l];
                                    const active = level === l;
                                    return (
                                        <button
                                            key={l}
                                            type="button"
                                            onClick={() => setLevel(l)}
                                            style={{
                                                flex: 1, height: "2.875rem", borderRadius: "0.75rem",
                                                fontSize: "0.7rem", fontWeight: 700, cursor: "pointer",
                                                border: `1.5px solid ${active ? lclr.border : "rgba(51,65,85,0.5)"}`,
                                                background: active ? lclr.bg : "rgba(15,23,42,0.6)",
                                                color: active ? lclr.color : "#475569",
                                                transition: "all 0.2s",
                                            }}
                                        >
                                            {l.slice(0, 3)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="input-group">
                        <label className="input-label">
                            <Tag style={{ display: "inline", width: "0.75rem", height: "0.75rem", marginRight: "0.375rem", verticalAlign: "middle" }} />
                            Tags <span style={{ color: "#475569", fontWeight: 400, textTransform: "none", fontSize: "0.7rem" }}>(comma-separated)</span>
                        </label>
                        <div className="input-with-icon">
                            <Tag className="input-icon" />
                            <input
                                id="input-tags"
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="React, Node.js, PostgreSQL, Docker"
                                className="input-field"
                            />
                        </div>

                        {/* Tag preview */}
                        {tags.trim() && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.5rem" }}>
                                {tags.split(",").map(t => t.trim()).filter(Boolean).map(t => (
                                    <span key={t} style={{ fontSize: "0.7rem", padding: "0.2rem 0.625rem", borderRadius: "0.375rem", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8" }}>{t}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Steps Section ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Section header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <div style={{ width: "2rem", height: "2rem", borderRadius: "0.625rem", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Layers style={{ width: "1rem", height: "1rem", color: "#a78bfa" }} />
                        </div>
                        <div>
                            <span style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.9375rem" }}>Steps & Todos</span>
                            <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "#64748b" }}>{steps.length} step{steps.length !== 1 ? "s" : ""}</span>
                        </div>
                    </div>
                    <button type="button" onClick={addStep} className="btn btn-secondary btn-sm">
                        <Plus style={{ width: "0.875rem", height: "0.875rem" }} /> Add Step
                    </button>
                </div>

                {steps.map((step, si) => (
                    <div key={si} style={{
                        background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.8))",
                        border: `1px solid ${step.open ? "rgba(99,102,241,0.2)" : "rgba(51,65,85,0.4)"}`,
                        borderRadius: "1.125rem", overflow: "hidden",
                        boxShadow: step.open ? "0 4px 20px rgba(0,0,0,0.2)" : "none",
                        transition: "all 0.2s",
                    }}>
                        {/* Step header bar */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "1rem 1.25rem" }}>
                            {/* Drag handle visual */}
                            <GripVertical style={{ width: "1rem", height: "1rem", color: "#334155", flexShrink: 0 }} />

                            {/* Step number */}
                            <div style={{
                                width: "2rem", height: "2rem", borderRadius: "0.625rem", flexShrink: 0,
                                background: step.open ? "rgba(99,102,241,0.15)" : "rgba(30,41,59,0.8)",
                                border: `1.5px solid ${step.open ? "rgba(99,102,241,0.35)" : "rgba(51,65,85,0.5)"}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "0.75rem", fontWeight: 800, color: step.open ? "#818cf8" : "#64748b",
                                transition: "all 0.2s",
                            }}>
                                {si + 1}
                            </div>

                            {/* Title (inline editable in collapsed, label in expanded) */}
                            {!step.open ? (
                                <span style={{ flex: 1, fontWeight: 600, color: step.title ? "#f1f5f9" : "#475569", fontSize: "0.9rem" }}>
                                    {step.title || `Step ${si + 1} — (untitled)`}
                                </span>
                            ) : (
                                <input
                                    value={step.title}
                                    onChange={(e) => updateStep(si, "title", e.target.value)}
                                    placeholder={`Step ${si + 1} title…`}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        flex: 1, background: "transparent", border: "none", outline: "none",
                                        color: "#f1f5f9", fontSize: "0.9rem", fontWeight: 600,
                                        borderBottom: "1px dashed rgba(99,102,241,0.3)",
                                        paddingBottom: "2px",
                                    }}
                                />
                            )}

                            {/* Step meta */}
                            {!step.open && step.todos.length > 0 && (
                                <span style={{ fontSize: "0.7rem", color: "#475569", flexShrink: 0 }}>
                                    {step.todos.filter(t => t.label).length} todos · {step.estimatedHours}h
                                </span>
                            )}

                            {/* Actions */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexShrink: 0 }}>
                                {steps.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeStep(si)}
                                        style={{ width: "1.875rem", height: "1.875rem", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#475569", cursor: "pointer", transition: "all 0.15s" }}
                                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#f87171"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
                                    >
                                        <Trash2 style={{ width: "0.875rem", height: "0.875rem" }} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => updateStep(si, "open", !step.open)}
                                    style={{ width: "1.875rem", height: "1.875rem", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#64748b", cursor: "pointer", transition: "all 0.15s" }}
                                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(30,41,59,0.6)"; e.currentTarget.style.color = "#e2e8f0"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
                                >
                                    {step.open ? <ChevronUp style={{ width: "1rem", height: "1rem" }} /> : <ChevronDown style={{ width: "1rem", height: "1rem" }} />}
                                </button>
                            </div>
                        </div>

                        {/* Expanded content */}
                        {step.open && (
                            <div style={{ borderTop: "1px solid rgba(30,41,59,0.8)", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.125rem" }}>

                                {/* Description */}
                                <div className="input-group">
                                    <label className="input-label">Description</label>
                                    <textarea
                                        value={step.description}
                                        onChange={(e) => updateStep(si, "description", e.target.value)}
                                        rows={2}
                                        placeholder="What will learners learn or accomplish in this step?"
                                        style={{
                                            width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem",
                                            background: "rgba(15,23,42,0.9)", border: "1.5px solid rgba(51,65,85,0.7)",
                                            color: "#f1f5f9", fontSize: "0.875rem", fontFamily: "inherit",
                                            resize: "none", outline: "none", lineHeight: 1.6, transition: "border-color 0.2s",
                                        }}
                                        onFocus={e => { e.currentTarget.style.borderColor = "#6366f1"; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = "rgba(51,65,85,0.7)"; }}
                                    />
                                </div>

                                {/* Hours + Resources side-by-side */}
                                <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "1rem" }}>
                                    <div className="input-group">
                                        <label className="input-label">
                                            <Clock style={{ display: "inline", width: "0.75rem", height: "0.75rem", marginRight: "0.3rem", verticalAlign: "middle" }} />
                                            Est. Hours
                                        </label>
                                        <input
                                            type="number"
                                            min="0.5"
                                            step="0.5"
                                            value={step.estimatedHours}
                                            onChange={(e) => updateStep(si, "estimatedHours", parseFloat(e.target.value))}
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">
                                            <Link2 style={{ display: "inline", width: "0.75rem", height: "0.75rem", marginRight: "0.3rem", verticalAlign: "middle" }} />
                                            Resources <span style={{ color: "#475569", fontWeight: 400, textTransform: "none", fontSize: "0.7rem" }}>(one URL per line)</span>
                                        </label>
                                        <textarea
                                            value={step.resources}
                                            onChange={(e) => updateStep(si, "resources", e.target.value)}
                                            rows={2}
                                            placeholder={"https://docs.example.com\nhttps://tutorial.example.com"}
                                            style={{
                                                width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem",
                                                background: "rgba(15,23,42,0.9)", border: "1.5px solid rgba(51,65,85,0.7)",
                                                color: "#f1f5f9", fontSize: "0.875rem", fontFamily: "monospace",
                                                resize: "none", outline: "none", lineHeight: 1.6, transition: "border-color 0.2s",
                                            }}
                                            onFocus={e => { e.currentTarget.style.borderColor = "#6366f1"; }}
                                            onBlur={e => { e.currentTarget.style.borderColor = "rgba(51,65,85,0.7)"; }}
                                        />
                                    </div>
                                </div>

                                {/* Todos */}
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                                        <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                            <ListChecks style={{ width: "0.875rem", height: "0.875rem" }} />
                                            Todo Tasks
                                        </label>
                                        <button type="button" onClick={() => addTodo(si)}
                                            style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontWeight: 600, transition: "color 0.15s" }}
                                            onMouseEnter={e => (e.currentTarget.style.color = "#818cf8")}
                                            onMouseLeave={e => (e.currentTarget.style.color = "#6366f1")}
                                        >
                                            <Plus style={{ width: "0.875rem", height: "0.875rem" }} /> Add task
                                        </button>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        {step.todos.map((todo, ti) => (
                                            <div key={ti} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                                                {/* Checkbox mock */}
                                                <div style={{ width: "1.25rem", height: "1.25rem", borderRadius: "9999px", border: "2px solid rgba(51,65,85,0.7)", flexShrink: 0 }} />
                                                <input
                                                    value={todo.label}
                                                    onChange={(e) => updateTodo(si, ti, e.target.value)}
                                                    placeholder={`Task ${ti + 1}…`}
                                                    style={{
                                                        flex: 1, height: "2.375rem", padding: "0 0.875rem", borderRadius: "0.625rem",
                                                        background: "rgba(15,23,42,0.7)", border: "1.5px solid rgba(51,65,85,0.5)",
                                                        color: "#e2e8f0", fontSize: "0.875rem", outline: "none", transition: "border-color 0.2s",
                                                    }}
                                                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)")}
                                                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(51,65,85,0.5)")}
                                                />
                                                {step.todos.length > 1 && (
                                                    <button type="button" onClick={() => removeTodo(si, ti)}
                                                        style={{ width: "1.875rem", height: "1.875rem", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#475569", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#f87171"; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
                                                    >
                                                        <Trash2 style={{ width: "0.875rem", height: "0.875rem" }} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Add Step dashed button */}
                <button
                    type="button"
                    onClick={addStep}
                    style={{
                        width: "100%", padding: "0.875rem", borderRadius: "1rem",
                        border: "2px dashed rgba(99,102,241,0.2)", background: "transparent",
                        color: "#475569", fontSize: "0.875rem", fontWeight: 600,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                        cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.color = "#818cf8"; e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; e.currentTarget.style.color = "#475569"; e.currentTarget.style.background = "transparent"; }}
                >
                    <Plus style={{ width: "1.125rem", height: "1.125rem" }} />
                    Add Another Step
                </button>
            </div>

            {/* ── Actions footer ── */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap",
                padding: "1.25rem 1.5rem",
                background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.8))",
                border: "1px solid rgba(99,102,241,0.12)", borderRadius: "1rem",
                position: "sticky", bottom: "1rem",
                backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 -4px 24px rgba(0,0,0,0.3)",
            }}>
                {/* Summary */}
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "0.25rem 0.7rem", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 700, background: lc.bg, color: lc.color, border: `1px solid ${lc.border}` }}>{level}</span>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                        {steps.length} step{steps.length !== 1 ? "s" : ""} · {steps.reduce((a, s) => a + s.todos.filter(t => t.label).length, 0)} tasks · {steps.reduce((a, s) => a + s.estimatedHours, 0)}h
                    </span>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
                    <Link href="/admin/roadmaps" className="btn btn-ghost">Cancel</Link>
                    <button
                        id="btn-save-draft"
                        onClick={() => handleSave(false)}
                        disabled={saving || publishing}
                        className="btn btn-secondary"
                    >
                        {saving ? <Loader2 style={{ width: "1rem", height: "1rem" }} className="animate-spin" /> : <Save style={{ width: "1rem", height: "1rem" }} />}
                        Save Draft
                    </button>
                    <button
                        id="btn-save-publish"
                        onClick={() => handleSave(true)}
                        disabled={saving || publishing}
                        className="btn btn-primary"
                    >
                        {publishing ? <Loader2 style={{ width: "1rem", height: "1rem" }} className="animate-spin" /> : <Eye style={{ width: "1rem", height: "1rem" }} />}
                        Save & Publish
                    </button>
                </div>
            </div>
        </div>
    );
}
