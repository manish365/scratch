"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { LogOut, BookOpen, LayoutDashboard, Map, Users, Menu, X, GraduationCap } from "lucide-react";

const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/roadmaps", label: "Roadmaps", icon: Map },
    { href: "/admin/users", label: "Users", icon: Users },
];
const learnerLinks = [
    { href: "/learner", label: "My Learning", icon: GraduationCap },
];

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (!session) return null;
    const isAdmin = session.user?.role === "ADMIN";
    const links = isAdmin ? adminLinks : learnerLinks;
    const userName = session.user?.name ?? session.user?.email ?? "User";
    const initials = userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

    return (
        <header className="navbar">
            <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "3.75rem" }}>
                    {/* Logo */}
                    <Link
                        href={isAdmin ? "/admin" : "/learner"}
                        style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}
                    >
                        <div style={{
                            width: "2rem", height: "2rem", borderRadius: "0.5rem",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(99,102,241,0.4)",
                        }}>
                            <BookOpen style={{ width: "1rem", height: "1rem", color: "#fff" }} />
                        </div>
                        <div>
                            <span style={{ fontWeight: 800, color: "#f1f5f9", fontSize: "0.9375rem", letterSpacing: "-0.02em" }}>LearnPath</span>
                            <span style={{ fontSize: "0.6rem", color: "#6366f1", fontWeight: 700, marginLeft: "0.4rem", textTransform: "uppercase", letterSpacing: "0.07em", verticalAlign: "1px" }}>Pro</span>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        {links.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`nav-link ${pathname === href || (href !== "/" && pathname?.startsWith(href) && href.split("/").length <= pathname.split("/").length) ? "active" : ""}`}
                            >
                                <Icon style={{ width: "0.9375rem", height: "0.9375rem" }} />
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {/* Avatar + name */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                            <div style={{
                                width: "2rem", height: "2rem", borderRadius: "9999px",
                                background: isAdmin ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "linear-gradient(135deg, #10b981, #059669)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "0.7rem", fontWeight: 800, color: "#fff",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                flexShrink: 0,
                            }}>{initials}</div>
                            <div style={{ display: "none" }} className="user-name-desktop">
                                <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#e2e8f0", lineHeight: 1.2 }}>{session.user?.name}</div>
                                <div style={{ fontSize: "0.7rem", color: "#475569" }}>{isAdmin ? "Administrator" : "Learner"}</div>
                            </div>
                        </div>

                        {/* Sign out */}
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            style={{
                                display: "flex", alignItems: "center", gap: "0.4rem",
                                padding: "0.4rem 0.75rem", borderRadius: "0.625rem",
                                background: "transparent", border: "1px solid rgba(51,65,85,0.6)",
                                color: "#64748b", cursor: "pointer", fontSize: "0.8rem", fontWeight: 500,
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(51,65,85,0.6)"; }}
                        >
                            <LogOut style={{ width: "0.875rem", height: "0.875rem" }} />
                            <span className="sign-out-text">Sign out</span>
                        </button>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="mobile-menu-btn"
                            style={{
                                display: "none", padding: "0.4rem", borderRadius: "0.5rem",
                                background: "none", border: "1px solid rgba(51,65,85,0.5)",
                                color: "#64748b", cursor: "pointer",
                            }}
                        >
                            {mobileOpen ? <X style={{ width: "1.25rem", height: "1.25rem" }} /> : <Menu style={{ width: "1.25rem", height: "1.25rem" }} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div style={{
                    borderTop: "1px solid rgba(30,41,59,0.7)",
                    background: "rgba(2,6,23,0.95)",
                    padding: "1rem 1.5rem",
                    display: "flex", flexDirection: "column", gap: "0.375rem",
                }}>
                    {links.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`nav-link ${pathname === href ? "active" : ""}`}
                            onClick={() => setMobileOpen(false)}
                            style={{ padding: "0.75rem 1rem" }}
                        >
                            <Icon style={{ width: "1rem", height: "1rem" }} />
                            {label}
                        </Link>
                    ))}
                    <div style={{ marginTop: "0.5rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(30,41,59,0.5)" }}>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            style={{
                                display: "flex", alignItems: "center", gap: "0.625rem",
                                width: "100%", padding: "0.75rem 1rem", borderRadius: "0.625rem",
                                background: "transparent", border: "none", color: "#f87171",
                                cursor: "pointer", fontSize: "0.875rem", fontWeight: 500,
                            }}
                        >
                            <LogOut style={{ width: "1rem", height: "1rem" }} />
                            Sign out
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @media (min-width: 768px) {
                    .user-name-desktop { display: block !important; }
                }
                @media (max-width: 640px) {
                    .mobile-menu-btn { display: flex !important; }
                    .sign-out-text { display: none; }
                }
            `}</style>
        </header>
    );
}
