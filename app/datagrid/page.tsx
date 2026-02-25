"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { INVOICE_DATA, DEFAULT_FILTERS, type Invoice, type Filters } from "./data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(d: Date) {
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function progColor(p: number) {
    if (p >= 75) return "#16a34a";
    if (p >= 40) return "#d97706";
    return "#dc2626";
}

const PRIORITY_STYLE: Record<string, { bg: string; color: string }> = {
    Critical: { bg: "#fdf4ff", color: "#7e22ce" },
    High: { bg: "#fff1f1", color: "#b91c1c" },
    Medium: { bg: "#fff7ed", color: "#c2410c" },
    Low: { bg: "#f0fdf4", color: "#15803d" },
};
const PRIORITY_DOT: Record<string, string> = {
    Critical: "#a855f7", High: "#ef4444", Medium: "#f97316", Low: "#22c55e",
};
const STATUS_STYLE: Record<string, { bg: string; color: string; border: string }> = {
    Approved: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
    Pending: { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
    Review: { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe" },
    Blocked: { bg: "#fff1f2", color: "#9f1239", border: "#fecdd3" },
    Completed: { bg: "#f5f3ff", color: "#5b21b6", border: "#ddd6fe" },
};

// ─── Sub components ───────────────────────────────────────────────────────────

function Sparkline({ vals }: { vals: number[] }) {
    const max = Math.max(...vals);
    return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 22 }}>
            {vals.map((v, i) => {
                const h = Math.round((v / max) * 20) + 2;
                return (
                    <div key={i} style={{
                        width: 4, height: h, borderRadius: "2px 2px 0 0",
                        background: "#3b82f6", opacity: 0.45,
                    }} />
                );
            })}
        </div>
    );
}

function PriBadge({ p }: { p: string }) {
    const s = PRIORITY_STYLE[p] ?? PRIORITY_STYLE.Low;
    const dot = PRIORITY_DOT[p] ?? "#22c55e";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px",
            borderRadius: 99, fontSize: ".68rem", fontWeight: 700,
            background: s.bg, color: s.color,
        }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot, flexShrink: 0, display: "inline-block" }} />
            {p}
        </span>
    );
}

function StatusPill({ s }: { s: string }) {
    const st = STATUS_STYLE[s] ?? STATUS_STYLE.Pending;
    const icons: Record<string, string> = {
        Approved: "✓", Pending: "⏱", Review: "◉", Blocked: "⚠", Completed: "✔",
    };
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px",
            borderRadius: 99, fontSize: ".7rem", fontWeight: 600,
            background: st.bg, color: st.color, border: `1px solid ${st.border}`,
        }}>
            <span style={{ fontSize: ".65rem" }}>{icons[s] ?? "·"}</span>{s}
        </span>
    );
}

function ProgressCell({ pct }: { pct: number }) {
    const c = progColor(pct);
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 110 }}>
            <div style={{ flex: 1, height: 6, borderRadius: 99, background: "#e5e7eb", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: c }} />
            </div>
            <span style={{ fontSize: ".7rem", fontWeight: 700, color: c, width: 32, textAlign: "right" }}>{pct}%</span>
        </div>
    );
}

// ─── Sort icon ────────────────────────────────────────────────────────────────
function SortIcon({ col, sortCol, sortDir }: { col: string; sortCol: string; sortDir: number }) {
    const active = col === sortCol;
    return (
        <span style={{ display: "flex", flexDirection: "column", gap: 1, opacity: active ? 1 : 0.3 }}>
            <svg width="7" height="7" viewBox="0 0 24 24" fill={active && sortDir === 1 ? "#2563eb" : "currentColor"}>
                <path d="M12 5l7 7H5z" />
            </svg>
            <svg width="7" height="7" viewBox="0 0 24 24" fill={active && sortDir === -1 ? "#2563eb" : "currentColor"}>
                <path d="M12 19l7-7H5z" />
            </svg>
        </span>
    );
}

// ─── Active Filter Chip ───────────────────────────────────────────────────────
function Chip({ label, value, color, onRemove }: { label: string; value: string; color?: string; onRemove: () => void }) {
    const bg = color === "green" ? "#f0fdf4" : color === "orange" ? "#fff7ed" : "#f0f0ff";
    const border = color === "green" ? "#bbf7d0" : color === "orange" ? "#fed7aa" : "#c7c7fd";
    const text = color === "green" ? "#16a34a" : color === "orange" ? "#ea580c" : "#6366f1";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 8px", borderRadius: 99, fontSize: ".7rem", fontWeight: 600,
            background: bg, border: `1px solid ${border}`, color: text, cursor: "default",
        }}>
            <span style={{ color: "#9ca3af", fontWeight: 500 }}>{label}:</span> {value}
            <span
                style={{ cursor: "pointer", marginLeft: 2, opacity: 0.6, fontWeight: 700, lineHeight: 1 }}
                onClick={onRemove}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}
            >×</span>
        </span>
    );
}

// ─── Th helper ────────────────────────────────────────────────────────────────
function Th({
    col, label, sortCol, sortDir, onSort, filterActive, children, minWidth = 100,
}: {
    col: string; label: string; sortCol: string; sortDir: number;
    onSort: (c: string) => void; filterActive?: boolean; children?: React.ReactNode; minWidth?: number;
}) {
    const [hov, setHov] = useState(false);
    return (
        <th style={{ minWidth, position: "relative", border: "none", padding: 0 }}>
            <div
                onClick={() => onSort(col)}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0 10px", height: 42, cursor: "pointer", userSelect: "none",
                    background: hov ? "rgba(0,0,0,.03)" : "transparent", gap: 4,
                }}
            >
                <span style={{ fontSize: ".7rem", fontWeight: 700, color: filterActive ? "#6366f1" : "#4b5775", textTransform: "uppercase", letterSpacing: ".04em", flex: 1, whiteSpace: "nowrap" }}>
                    {label}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                    <SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />
                    <span style={{ fontSize: 10, color: filterActive ? "#6366f1" : "#9ca3af" }}>▼</span>
                    <span style={{ fontSize: ".7rem", color: "#c0c4d0" }}>···</span>
                </div>
            </div>
            {/* resize handle */}
            <div style={{ position: "absolute", right: 0, top: "10%", bottom: "10%", width: 3, cursor: "col-resize", borderRadius: 2 }} />
            {children && (
                <div style={{ padding: "3px 6px", background: "#eef1fb", borderTop: "1px solid #dde1ec" }}>
                    {children}
                </div>
            )}
        </th>
    );
}

// Input styles
const ffInput: React.CSSProperties = {
    width: "100%", height: 26, border: "1px solid #c8cedf", borderRadius: 4,
    padding: "0 6px", fontSize: ".72rem", fontFamily: "inherit", outline: "none",
    background: "#fff", color: "#1e2a45", transition: "border-color .15s",
};
const ffSelect: React.CSSProperties = {
    ...ffInput, padding: "0 18px 0 6px", cursor: "pointer",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='9' viewBox='0 0 24 24' fill='none' stroke='%238b93ac' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat", backgroundPosition: "right 5px center", appearance: "none" as const,
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DataGridPage() {
    const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
    const [sortCol, setSortCol] = useState("index");
    const [sortDir, setSortDir] = useState(1);
    const [page, setPage] = useState(1);
    const [rpp, setRpp] = useState(12);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const debounce = useRef<ReturnType<typeof setTimeout>>();

    // Filtering
    const filtered = useMemo(() => {
        return INVOICE_DATA.filter(r => {
            if (filters.id && !r.id.toLowerCase().includes(filters.id.toLowerCase())) return false;
            if (filters.company && !r.company.toLowerCase().includes(filters.company.toLowerCase())) return false;
            if (filters.project && !r.project.toLowerCase().includes(filters.project.toLowerCase())) return false;
            if (filters.team && r.team !== filters.team) return false;
            if (filters.status && r.status !== filters.status) return false;
            if (filters.priority && r.priority !== filters.priority) return false;
            if (filters.bmin && r.budget < +filters.bmin) return false;
            if (filters.bmax && r.budget > +filters.bmax) return false;
            if (filters.hmin && r.hours < +filters.hmin) return false;
            if (filters.hmax && r.hours > +filters.hmax) return false;
            if (filters.pmin && r.pct < +filters.pmin) return false;
            if (filters.pmax && r.pct > +filters.pmax) return false;
            if (filters.startAfter && r.start < new Date(filters.startAfter)) return false;
            if (filters.deadlineBefore && r.deadline > new Date(filters.deadlineBefore)) return false;
            return true;
        });
    }, [filters]);

    // Sorting
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            let va: string | number = a[sortCol as keyof Invoice] as string | number;
            let vb: string | number = b[sortCol as keyof Invoice] as string | number;
            if (va instanceof Date) va = (va as Date).getTime();
            if (vb instanceof Date) vb = (vb as Date).getTime();
            if (typeof va === "string") return (va as string).localeCompare(vb as string) * sortDir;
            return ((va as number) - (vb as number)) * sortDir;
        });
    }, [filtered, sortCol, sortDir]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / rpp));
    const safePage = Math.min(page, totalPages);
    const pageRows = sorted.slice((safePage - 1) * rpp, safePage * rpp);

    const onSort = useCallback((col: string) => {
        setSortCol(prev => { if (prev === col) { setSortDir(d => d * -1); return col; } setSortDir(1); return col; });
        setPage(1);
    }, []);

    const setF = (key: keyof Filters, val: string) => {
        clearTimeout(debounce.current);
        debounce.current = setTimeout(() => {
            setFilters(prev => ({ ...prev, [key]: val }));
            setPage(1);
        }, 150);
    };
    const setFImmediate = (key: keyof Filters, val: string) => {
        setFilters(prev => ({ ...prev, [key]: val }));
        setPage(1);
    };

    const clearAll = () => { setFilters({ ...DEFAULT_FILTERS, status: "", bmin: "", bmax: "", deadlineBefore: "" }); setPage(1); };

    const toggleSel = (id: string) => setSelected(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
    });
    const toggleAll = (checked: boolean) => {
        setSelected(() => {
            const next = new Set<string>();
            if (checked) pageRows.forEach(r => next.add(r.id));
            return next;
        });
    };

    const hasActiveFilters = Object.entries(filters).some(([, v]) => v !== "");
    const aggregBudget = filtered.reduce((s, r) => s + r.budget, 0);
    const aggregHours = filtered.reduce((s, r) => s + r.hours, 0);
    const aggregPct = filtered.length ? Math.round(filtered.reduce((s, r) => s + r.pct, 0) / filtered.length) : 0;
    const highCount = filtered.filter(r => r.priority === "High" || r.priority === "Critical").length;
    const blockedCount = filtered.filter(r => r.status === "Blocked").length;

    const allOnPage = pageRows.length > 0 && pageRows.every(r => selected.has(r.id));
    const someOnPage = pageRows.some(r => selected.has(r.id));

    // css helpers
    const S = {
        shell: { background: "#fff", borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,.07),0 4px 16px rgba(0,0,0,.05)", border: "1px solid #dde1ec", overflow: "hidden" } as React.CSSProperties,
        toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid #dde1ec", gap: 10, flexWrap: "wrap" } as React.CSSProperties,
        btn: { height: 32, padding: "0 12px", display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 6, fontSize: ".775rem", fontWeight: 500, fontFamily: "inherit", cursor: "pointer", border: "1px solid #c8cdde", background: "#fff", color: "#4b5775", transition: "all .15s" } as React.CSSProperties,
        hdrRow: { background: "#f4f6fb", borderBottom: "2px solid #c8cdde" } as React.CSSProperties,
        ffRow: { background: "#eef1fb", borderBottom: "2px solid #dde1ec" } as React.CSSProperties,
        td: { height: 48, padding: "0 10px", verticalAlign: "middle", borderRight: "1px solid #dde1ec", borderBottom: "1px solid #dde1ec", color: "#1e2a45" } as React.CSSProperties,
        footer: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderTop: "1px solid #dde1ec", background: "#f4f6fb", flexWrap: "wrap", gap: 8 } as React.CSSProperties,
    } as const;

    // Pagination
    const pgs: (number | "…")[] = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - safePage) <= 1) pgs.push(i);
        else if (i === 2 || i === totalPages - 1) pgs.push("…");
    }
    const dedupedPgs = pgs.filter((v, i, a) => !(v === "…" && a[i - 1] === "…"));

    return (
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", padding: "24px 20px 40px", background: "#f0f2f8", minHeight: "100vh" }}>
            {/* Page header */}
            <div style={{ maxWidth: 1380, margin: "0 auto 18px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                    <h1 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e2a45", display: "flex", alignItems: "center", gap: 8 }}>
                        Project Invoice Management
                        <span style={{ fontSize: ".68rem", padding: "3px 8px", borderRadius: 99, background: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd", fontWeight: 600 }}>
                            AG Enterprise
                        </span>
                    </h1>
                    <p style={{ fontSize: ".78rem", color: "#8b93ac", marginTop: 2 }}>
                        Advanced filtering · Column grouping · Row selection · Multi-sort · Aggregations
                    </p>
                </div>
                <div style={{ fontSize: ".775rem", color: "#8b93ac", display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "#4b5775" }}>{selected.size} selected</span>
                    <span style={{ color: "#dde1ec" }}>|</span>
                    <span>Last updated: <strong style={{ color: "#1e2a45" }}>26 Feb 2026, 09:14</strong></span>
                </div>
            </div>

            <div style={{ ...S.shell, maxWidth: 1380, margin: "0 auto" }}>

                {/* Toolbar */}
                <div style={S.toolbar}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: ".9375rem", fontWeight: 700, color: "#1e2a45", display: "flex", alignItems: "center", gap: 8 }}>
                            Invoices
                            <span style={{ fontSize: ".7rem", background: "#eff4ff", color: "#2563eb", border: "1px solid #c7d7fd", padding: "2px 8px", borderRadius: 99, fontWeight: 700 }}>
                                {filtered.length} records
                            </span>
                        </span>
                        <div style={{ width: 1, height: 20, background: "#dde1ec", margin: "0 2px" }} />
                        <button style={{ ...S.btn, ...(hasActiveFilters ? { background: "#f0f0ff", borderColor: "#a5b4fc", color: "#6366f1" } : {}) }} onClick={clearAll}>
                            ✕ Clear Filters
                        </button>
                        <button style={S.btn}>⊞ Group By</button>
                        <button style={S.btn}>↗ Aggregations</button>
                        <button style={S.btn}>💾 Save View</button>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button style={S.btn}>↓ Export CSV</button>
                        <button style={S.btn}>📄 Export Excel</button>
                        <button style={{ ...S.btn, background: "#2563eb", color: "#fff", borderColor: "#2563eb" }}>+ New Invoice</button>
                    </div>
                </div>

                {/* Active filter chips */}
                {hasActiveFilters && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderBottom: "1px solid #dde1ec", background: "#fafbff", flexWrap: "wrap" }}>
                        <span style={{ fontSize: ".7rem", color: "#8b93ac", fontWeight: 500 }}>Filtered by:</span>
                        {filters.status && (
                            <Chip label="Status" value={filters.status} onRemove={() => setFImmediate("status", "")} />
                        )}
                        {(filters.bmin || filters.bmax) && (
                            <Chip label="Budget" value={`$${(+filters.bmin || 0).toLocaleString()} – $${(+filters.bmax || 0).toLocaleString()}`} color="orange" onRemove={() => { setFImmediate("bmin", ""); setFImmediate("bmax", ""); }} />
                        )}
                        {filters.deadlineBefore && (
                            <Chip label="Deadline before" value={filters.deadlineBefore} color="green" onRemove={() => setFImmediate("deadlineBefore", "")} />
                        )}
                        {filters.team && <Chip label="Team" value={filters.team} onRemove={() => setFImmediate("team", "")} />}
                        {filters.priority && <Chip label="Priority" value={filters.priority} onRemove={() => setFImmediate("priority", "")} />}
                        {filters.id && <Chip label="ID" value={filters.id} onRemove={() => setFImmediate("id", "")} />}
                        {filters.company && <Chip label="Company" value={filters.company} onRemove={() => setFImmediate("company", "")} />}
                    </div>
                )}

                {/* Aggregation bar */}
                <div style={{ display: "flex", gap: 12, padding: "7px 16px", borderBottom: "1px solid #dde1ec", background: "linear-gradient(90deg,#f8f9ff,#fff)", flexWrap: "wrap" }}>
                    {[
                        { label: "Total Budget", val: `$${aggregBudget.toLocaleString()}` },
                        { label: "Total Hours", val: aggregHours.toLocaleString() + "h" },
                        { label: "Avg Completion", val: `${aggregPct}%` },
                        { label: "High Priority", val: String(highCount) },
                        { label: "Blocked", val: String(blockedCount), red: true },
                    ].map(({ label, val, red }) => (
                        <span key={label} style={{ fontSize: ".72rem", color: "#4b5775" }}>
                            {label}: <strong style={{ color: red ? "#dc2626" : "#1e2a45" }}>{val}</strong>
                        </span>
                    ))}
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100, fontSize: ".8rem" }}>
                        <thead>
                            {/* Column groups */}
                            <tr style={{ background: "linear-gradient(180deg,#e8edf8,#dde3f0)" }}>
                                <td colSpan={2} style={{ borderRight: "2px solid #c8cdde" }} />
                                <td colSpan={3} style={{ textAlign: "center", fontSize: ".65rem", fontWeight: 700, color: "#4b5775", textTransform: "uppercase", letterSpacing: ".05em", padding: "0 8px", height: 28, borderRight: "2px solid #c8cdde" }}>Project Information</td>
                                <td colSpan={2} style={{ textAlign: "center", fontSize: ".65rem", fontWeight: 700, color: "#4b5775", textTransform: "uppercase", letterSpacing: ".05em", padding: "0 8px", borderRight: "2px solid #c8cdde" }}>Financials</td>
                                <td colSpan={2} style={{ textAlign: "center", fontSize: ".65rem", fontWeight: 700, color: "#4b5775", textTransform: "uppercase", letterSpacing: ".05em", padding: "0 8px", borderRight: "2px solid #c8cdde" }}>Timeline</td>
                                <td colSpan={3} style={{ textAlign: "center", fontSize: ".65rem", fontWeight: 700, color: "#4b5775", textTransform: "uppercase", letterSpacing: ".05em", padding: "0 8px" }}>Tracking</td>
                            </tr>
                            {/* Headers */}
                            <tr style={S.hdrRow}>
                                <th style={{ width: 44, padding: 0, borderRight: "1px solid #dde1ec" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 42 }}>
                                        <input
                                            type="checkbox"
                                            checked={allOnPage}
                                            ref={el => { if (el) el.indeterminate = someOnPage && !allOnPage; }}
                                            onChange={e => toggleAll(e.target.checked)}
                                            style={{ width: 14, height: 14, accentColor: "#2563eb", cursor: "pointer" }}
                                        />
                                    </div>
                                    <div style={{ height: 36, background: "#eef1fb", borderTop: "1px solid #dde1ec" }} />
                                </th>
                                {[
                                    { col: "id", label: "Invoice ID", fa: !!filters.id, mw: 110 },
                                    { col: "company", label: "Client Company", fa: !!filters.company, mw: 180 },
                                    { col: "project", label: "Project Name", fa: false, mw: 150 },
                                    { col: "team", label: "Assigned Team", fa: !!filters.team, mw: 120 },
                                    { col: "budget", label: "Budget ($)", fa: !!(filters.bmin || filters.bmax), mw: 110 },
                                    { col: "hours", label: "Hours Logged", fa: !!(filters.hmin || filters.hmax), mw: 120 },
                                    { col: "start", label: "Start Date", fa: !!filters.startAfter, mw: 110 },
                                    { col: "deadline", label: "Deadline", fa: !!filters.deadlineBefore, mw: 110 },
                                    { col: "pct", label: "Completion %", fa: !!(filters.pmin || filters.pmax), mw: 130 },
                                    { col: "priority", label: "Priority", fa: !!filters.priority, mw: 100 },
                                    { col: "status", label: "Status", fa: !!filters.status, mw: 120 },
                                ].map(({ col, label, fa, mw }) => (
                                    <Th key={col} col={col} label={label} sortCol={sortCol} sortDir={sortDir} onSort={onSort} filterActive={fa} minWidth={mw}>
                                        {/* Floating filter */}
                                        {col === "id" && (
                                            <input style={ffInput} defaultValue={filters.id} placeholder="Search ID…" onChange={e => setF("id", e.target.value)} />
                                        )}
                                        {col === "company" && (
                                            <input style={ffInput} defaultValue={filters.company} placeholder="Contains…" onChange={e => setF("company", e.target.value)} />
                                        )}
                                        {col === "project" && (
                                            <input style={ffInput} defaultValue={filters.project} placeholder="Contains…" onChange={e => setF("project", e.target.value)} />
                                        )}
                                        {col === "team" && (
                                            <select style={ffSelect} value={filters.team} onChange={e => setFImmediate("team", e.target.value)}>
                                                <option value="">All Teams</option>
                                                {["Alpha", "Beta", "Gamma", "Delta", "Epsilon"].map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        )}
                                        {col === "budget" && (
                                            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                                <input type="number" style={{ ...ffInput, width: 62, padding: "0 4px", textAlign: "center" }} defaultValue={filters.bmin} placeholder="Min" onChange={e => setF("bmin", e.target.value)} />
                                                <span style={{ color: "#8b93ac", fontSize: ".65rem" }}>–</span>
                                                <input type="number" style={{ ...ffInput, width: 62, padding: "0 4px", textAlign: "center" }} defaultValue={filters.bmax} placeholder="Max" onChange={e => setF("bmax", e.target.value)} />
                                            </div>
                                        )}
                                        {col === "hours" && (
                                            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                                <input type="number" style={{ ...ffInput, width: 56, padding: "0 4px", textAlign: "center" }} placeholder="≥" onChange={e => setF("hmin", e.target.value)} />
                                                <span style={{ color: "#8b93ac", fontSize: ".65rem" }}>–</span>
                                                <input type="number" style={{ ...ffInput, width: 56, padding: "0 4px", textAlign: "center" }} placeholder="≤" onChange={e => setF("hmax", e.target.value)} />
                                            </div>
                                        )}
                                        {col === "start" && (
                                            <input type="date" style={ffInput} onChange={e => setFImmediate("startAfter", e.target.value)} />
                                        )}
                                        {col === "deadline" && (
                                            <input type="date" style={{ ...ffInput, borderColor: filters.deadlineBefore ? "#6366f1" : "#c8cedf" }} defaultValue={filters.deadlineBefore} onChange={e => setFImmediate("deadlineBefore", e.target.value)} />
                                        )}
                                        {col === "pct" && (
                                            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                                <input type="number" style={{ ...ffInput, width: 52, padding: "0 4px", textAlign: "center" }} placeholder="≥%" onChange={e => setF("pmin", e.target.value)} />
                                                <span style={{ color: "#8b93ac", fontSize: ".65rem" }}>–</span>
                                                <input type="number" style={{ ...ffInput, width: 52, padding: "0 4px", textAlign: "center" }} placeholder="≤%" onChange={e => setF("pmax", e.target.value)} />
                                            </div>
                                        )}
                                        {col === "priority" && (
                                            <select style={ffSelect} value={filters.priority} onChange={e => setFImmediate("priority", e.target.value)}>
                                                <option value="">All</option>
                                                {["Critical", "High", "Medium", "Low"].map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        )}
                                        {col === "status" && (
                                            <select style={{ ...ffSelect, borderColor: filters.status ? "#6366f1" : "#c8cedf" }} value={filters.status} onChange={e => setFImmediate("status", e.target.value)}>
                                                <option value="">All</option>
                                                {["Approved", "Pending", "Review", "Blocked", "Completed"].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        )}
                                    </Th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pageRows.length === 0 ? (
                                <tr>
                                    <td colSpan={12} style={{ textAlign: "center", padding: "3rem", color: "#8b93ac" }}>
                                        No records match the current filters.{" "}
                                        <button onClick={clearAll} style={{ color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Clear filters</button>
                                    </td>
                                </tr>
                            ) : pageRows.map((row, ri) => {
                                const sel = selected.has(row.id);
                                const pastDue = row.deadline < new Date("2026-03-01");
                                const evenRow = ri % 2 !== 0;
                                return (
                                    <tr
                                        key={row.id}
                                        onClick={() => toggleSel(row.id)}
                                        style={{
                                            background: sel ? "#e8effe" : row.pinned ? "#fffbeb" : evenRow ? "#f9fafd" : "#fff",
                                            borderLeft: sel ? "3px solid #3b82f6" : row.pinned ? "3px solid #f97316" : "3px solid transparent",
                                            cursor: "pointer", transition: "background .12s",
                                        }}
                                        onMouseEnter={e => { if (!sel) e.currentTarget.style.background = "#eef2fd"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = sel ? "#e8effe" : row.pinned ? "#fffbeb" : evenRow ? "#f9fafd" : "#fff"; }}
                                    >
                                        <td style={{ ...S.td, width: 44, padding: 0 }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 48 }}>
                                                <input
                                                    type="checkbox"
                                                    checked={sel}
                                                    onChange={() => toggleSel(row.id)}
                                                    onClick={e => e.stopPropagation()}
                                                    style={{ width: 14, height: 14, accentColor: "#2563eb", cursor: "pointer" }}
                                                />
                                            </div>
                                        </td>
                                        <td style={S.td}>
                                            <span style={{ fontFamily: "'SF Mono','Fira Code',monospace", fontSize: ".74rem", color: "#2563eb", fontWeight: 700 }}>{row.id}</span>
                                        </td>
                                        <td style={S.td}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <div style={{ width: 26, height: 26, borderRadius: 6, background: row.avatarColor, fontSize: ".6rem", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{row.initials}</div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: ".8rem" }}>{row.company}</div>
                                                    <div style={{ fontSize: ".66rem", color: "#8b93ac" }}>{row.team} Team</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={S.td}><span style={{ fontWeight: 500 }}>{row.project}</span></td>
                                        <td style={S.td}>
                                            <span style={{ fontSize: ".75rem", padding: "2px 8px", borderRadius: 4, background: "#f1f3f9", color: "#4b5775", fontWeight: 600 }}>{row.team}</span>
                                        </td>
                                        <td style={S.td}><span style={{ fontWeight: 600 }}>${row.budget.toLocaleString()}</span></td>
                                        <td style={S.td}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <span style={{ color: "#4b5775", fontWeight: 500 }}>{row.hours.toLocaleString()}h</span>
                                                <Sparkline vals={row.spark} />
                                            </div>
                                        </td>
                                        <td style={S.td}><span style={{ color: "#4b5775", fontSize: ".775rem" }}>{fmt(row.start)}</span></td>
                                        <td style={S.td}><span style={{ color: pastDue ? "#dc2626" : "#4b5775", fontWeight: pastDue ? 600 : 400, fontSize: ".775rem" }}>{fmt(row.deadline)}</span></td>
                                        <td style={S.td}><ProgressCell pct={row.pct} /></td>
                                        <td style={S.td}><PriBadge p={row.priority} /></td>
                                        <td style={{ ...S.td, borderRight: "none" }}><StatusPill s={row.status} /></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div style={S.footer}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                        <span style={{ fontSize: ".775rem", color: "#4b5775" }}>
                            Showing <strong style={{ color: "#1e2a45" }}>{sorted.length === 0 ? 0 : (safePage - 1) * rpp + 1}–{Math.min(safePage * rpp, sorted.length)}</strong> of <strong style={{ color: "#1e2a45" }}>{sorted.length}</strong> records
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".775rem", color: "#4b5775" }}>
                            Rows per page:
                            <select
                                style={{ height: 28, padding: "0 20px 0 8px", border: "1px solid #c8cdde", borderRadius: 5, fontSize: ".765rem", fontFamily: "inherit", appearance: "none", background: "#fff", color: "#1e2a45", outline: "none", cursor: "pointer" }}
                                value={rpp}
                                onChange={e => { setRpp(+e.target.value); setPage(1); }}
                            >
                                {[12, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 3 }}>
                        {[
                            { label: "‹", pg: safePage - 1, disabled: safePage <= 1 },
                            ...dedupedPgs.map(p => ({ label: String(p), pg: typeof p === "number" ? p : -1, disabled: p === "…" })),
                            { label: "›", pg: safePage + 1, disabled: safePage >= totalPages },
                        ].map(({ label, pg: p, disabled }, i) => (
                            disabled && label !== "‹" && label !== "›" ? (
                                <span key={i} style={{ width: 28, textAlign: "center", color: "#8b93ac" }}>…</span>
                            ) : (
                                <button
                                    key={i}
                                    disabled={disabled}
                                    onClick={() => !disabled && setPage(p)}
                                    style={{
                                        width: 28, height: 28, borderRadius: 5, border: "1px solid #c8cdde",
                                        background: p === safePage ? "#2563eb" : "#fff",
                                        color: p === safePage ? "#fff" : "#4b5775",
                                        fontWeight: p === safePage ? 700 : 500, fontSize: ".755rem",
                                        cursor: disabled ? "default" : "pointer", fontFamily: "inherit",
                                        opacity: disabled ? .35 : 1, transition: "all .15s",
                                    }}
                                >{label}</button>
                            )
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
