"use client";

import { useState, useEffect, useCallback } from "react";
import {
    UserPlus, Edit2, Trash2, X, Save, Loader2, Users,
    Mail, Lock, User, GraduationCap, Shield, Search, ChevronDown
} from "lucide-react";

interface UserRow {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "LEARNER";
    createdAt: string;
    _count: { enrollments: number };
}

interface FormState { name: string; email: string; password: string; role: "LEARNER" | "ADMIN"; }
const emptyForm: FormState = { name: "", email: "", password: "", role: "LEARNER" };

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState<"add" | "edit" | null>(null);
    const [editUser, setEditUser] = useState<UserRow | null>(null);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const openAdd = () => { setForm(emptyForm); setError(""); setShowModal("add"); };
    const openEdit = (u: UserRow) => {
        setEditUser(u);
        setForm({ name: u.name, email: u.email, password: "", role: u.role });
        setError("");
        setShowModal("edit");
    };
    const closeModal = () => { setShowModal(null); setEditUser(null); setError(""); };

    const handleSave = async () => {
        if (!form.name || !form.email) { setError("Name and email are required."); return; }
        if (showModal === "add" && !form.password) { setError("Password is required to create a user."); return; }
        setSaving(true); setError("");

        const url = showModal === "edit" ? `/api/users/${editUser!.id}` : "/api/users";
        const method = showModal === "edit" ? "PATCH" : "POST";
        const body: Partial<FormState> = { name: form.name, email: form.email, role: form.role };
        if (form.password) body.password = form.password;

        const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Something went wrong."); setSaving(false); return; }

        setSuccess(showModal === "add" ? "User created successfully!" : "User updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
        closeModal();
        fetchUsers();
        setSaving(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete user "${name}"? This will also remove all their enrollments.`)) return;
        setDeleting(id);
        const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (!res.ok) {
            const data = await res.json();
            alert(data.error || "Failed to delete user.");
        } else {
            setSuccess("User deleted.");
            setTimeout(() => setSuccess(""), 3000);
            fetchUsers();
        }
        setDeleting(null);
    };

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }} className="animate-fade-in">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">User Management</h1>
                    <p className="page-subtitle">Add, edit, and manage learner accounts in your organization.</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd} id="btn-add-user">
                    <UserPlus style={{ width: "1rem", height: "1rem" }} />
                    Add User
                </button>
            </div>

            {success && <div className="alert-success"><span>{success}</span></div>}

            {/* Search + stats row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: "1 1 20rem", maxWidth: "24rem" }}>
                    <Search style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", width: "1rem", height: "1rem", color: "#475569", pointerEvents: "none" }} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or email…"
                        className="input-field"
                        style={{ paddingLeft: "2.5rem" }}
                    />
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
                    <div style={{ padding: "0.5rem 1rem", borderRadius: "0.75rem", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8", fontSize: "0.8125rem", fontWeight: 600 }}>
                        {users.filter(u => u.role === "LEARNER").length} Learners
                    </div>
                    <div style={{ padding: "0.5rem 1rem", borderRadius: "0.75rem", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#a78bfa", fontSize: "0.8125rem", fontWeight: 600 }}>
                        {users.filter(u => u.role === "ADMIN").length} Admins
                    </div>
                </div>
            </div>

            {/* Table */}
            <div style={{
                background: "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.7) 100%)",
                border: "1px solid rgba(99,102,241,0.12)",
                borderRadius: "1.125rem", overflow: "hidden",
            }}>
                {loading ? (
                    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                        {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: "3.5rem" }} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: "4rem", textAlign: "center" }}>
                        <Users style={{ width: "2.5rem", height: "2.5rem", color: "#334155", margin: "0 auto 0.75rem" }} />
                        <p style={{ color: "#64748b" }}>{search ? "No users match your search." : "No users found."}</p>
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Enrollments</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(u => (
                                    <tr key={u.id}>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                                                <div style={{
                                                    width: "2.25rem", height: "2.25rem", borderRadius: "9999px", flexShrink: 0,
                                                    background: u.role === "ADMIN" ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "linear-gradient(135deg,#10b981,#059669)",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontSize: "0.7rem", fontWeight: 800, color: "#fff",
                                                }}>
                                                    {u.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: "#f1f5f9", fontSize: "0.875rem" }}>{u.name}</div>
                                                    <div style={{ color: "#475569", fontSize: "0.75rem" }}>{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={u.role === "ADMIN" ? "badge badge-admin" : "badge badge-learner"}>
                                                {u.role === "ADMIN" ? <Shield style={{ width: "0.625rem", height: "0.625rem", marginRight: "0.25rem" }} /> : <GraduationCap style={{ width: "0.625rem", height: "0.625rem", marginRight: "0.25rem" }} />}
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={{ color: "#94a3b8" }}>{u._count.enrollments}</td>
                                        <td style={{ color: "#64748b", fontSize: "0.8125rem" }}>
                                            {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.375rem" }}>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => openEdit(u)}
                                                    title="Edit user"
                                                >
                                                    <Edit2 style={{ width: "0.875rem", height: "0.875rem" }} />
                                                </button>
                                                <button
                                                    className="btn btn-sm"
                                                    onClick={() => handleDelete(u.id, u.name)}
                                                    disabled={deleting === u.id}
                                                    title="Delete user"
                                                    style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                                                >
                                                    {deleting === u.id ? <Loader2 style={{ width: "0.875rem", height: "0.875rem" }} className="animate-spin" /> : <Trash2 style={{ width: "0.875rem", height: "0.875rem" }} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div className="modal-box">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
                            <h2 className="modal-title" style={{ margin: 0 }}>
                                {showModal === "add" ? "Add New User" : `Edit ${editUser?.name}`}
                            </h2>
                            <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: "0.25rem" }}>
                                <X style={{ width: "1.25rem", height: "1.25rem" }} />
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
                            {/* Name */}
                            <div className="input-group">
                                <label className="input-label">
                                    <User style={{ display: "inline", width: "0.75rem", height: "0.75rem", marginRight: "0.375rem", verticalAlign: "middle" }} />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Jane Doe"
                                    id="modal-name"
                                />
                            </div>
                            {/* Email */}
                            <div className="input-group">
                                <label className="input-label">
                                    <Mail style={{ display: "inline", width: "0.75rem", height: "0.75rem", marginRight: "0.375rem", verticalAlign: "middle" }} />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    placeholder="jane@company.com"
                                    id="modal-email"
                                />
                            </div>
                            {/* Password */}
                            <div className="input-group">
                                <label className="input-label">
                                    <Lock style={{ display: "inline", width: "0.75rem", height: "0.75rem", marginRight: "0.375rem", verticalAlign: "middle" }} />
                                    {showModal === "edit" ? "New Password (leave blank to keep)" : "Password"}
                                </label>
                                <input
                                    type="password"
                                    className="input-field"
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    placeholder={showModal === "edit" ? "••••••••" : "Min. 6 characters"}
                                    id="modal-password"
                                />
                            </div>
                            {/* Role */}
                            <div className="input-group">
                                <label className="input-label">
                                    <ChevronDown style={{ display: "inline", width: "0.75rem", height: "0.75rem", marginRight: "0.375rem", verticalAlign: "middle" }} />
                                    Role
                                </label>
                                <div style={{ position: "relative" }}>
                                    <select
                                        className="input-field"
                                        value={form.role}
                                        onChange={e => setForm(f => ({ ...f, role: e.target.value as "LEARNER" | "ADMIN" }))}
                                        id="modal-role"
                                        style={{ appearance: "none", cursor: "pointer" }}
                                    >
                                        <option value="LEARNER">Learner</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                    <ChevronDown style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", width: "1rem", height: "1rem", color: "#475569", pointerEvents: "none" }} />
                                </div>
                            </div>

                            {error && <div className="alert-error"><span>{error}</span></div>}

                            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                                <button className="btn btn-secondary" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1 }} id="modal-save">
                                    {saving ? <Loader2 style={{ width: "1rem", height: "1rem" }} className="animate-spin" /> : <Save style={{ width: "1rem", height: "1rem" }} />}
                                    {saving ? "Saving…" : "Save User"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
