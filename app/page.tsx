"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, GraduationCap, Eye, EyeOff, Loader2, BookOpen, Zap, Users } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<"admin" | "learner" | null>(null);
  const [error, setError] = useState("");

  const doSignIn = async (em: string, pw: string, target: "admin" | "learner" | null = null) => {
    if (target) setQuickLoading(target);
    else setLoading(true);
    setError("");
    const res = await signIn("credentials", { email: em, password: pw, redirect: false });
    if (res?.ok) {
      router.push(target === "admin" || em === "admin@corp.com" ? "/admin" : "/learner");
    } else {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      setQuickLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    await doSignIn(email, password);
  };

  const stats = [
    { icon: BookOpen, label: "Curated Roadmaps", value: "50+" },
    { icon: Users, label: "Active Learners", value: "2,400+" },
    { icon: Zap, label: "Completion Rate", value: "87%" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#020617" }}>
      {/* ── Left hero panel ── */}
      <div style={{
        display: "none",
        flexDirection: "column",
        width: "48%",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 65%, #0f172a 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "3rem",
      }} className="hero-panel">
        {/* Glow orbs */}
        <div style={{
          position: "absolute", top: "10%", left: "20%",
          width: "20rem", height: "20rem", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", right: "10%",
          width: "16rem", height: "16rem", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
          filter: "blur(50px)", pointerEvents: "none",
        }} />
        {/* Grid pattern overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", position: "relative", zIndex: 1 }}>
          <div style={{
            width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
          }}>
            <BookOpen style={{ width: "1.25rem", height: "1.25rem", color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.125rem", color: "#fff", letterSpacing: "-0.02em" }}>LearnPath</div>
            <div style={{ fontSize: "0.7rem", color: "#818cf8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Enterprise</div>
          </div>
        </div>

        {/* Main copy */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.375rem 0.875rem", borderRadius: "9999px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", marginBottom: "1.75rem", width: "fit-content" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#818cf8", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "0.75rem", color: "#818cf8", fontWeight: 600 }}>Enterprise Learning Platform</span>
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, color: "#fff",
            letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "1.25rem",
          }}>
            Empower your team with{" "}
            <span style={{ background: "linear-gradient(135deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              structured learning
            </span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: 1.7, maxWidth: "26rem" }}>
            Create, assign, and track learning roadmaps across your entire organization with precision and clarity.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.875rem", position: "relative", zIndex: 1 }}>
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} style={{
              background: "rgba(15,23,42,0.5)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(99,102,241,0.2)", borderRadius: "0.875rem",
              padding: "1rem 0.875rem", textAlign: "center",
            }}>
              <div style={{ fontWeight: 800, fontSize: "1.375rem", color: "#818cf8", letterSpacing: "-0.03em" }}>{value}</div>
              <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "0.25rem", fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        minHeight: "100vh",
      }}>
        <div style={{ width: "100%", maxWidth: "26rem" }} className="animate-fade-in">
          {/* Mobile logo only */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "2.5rem" }}>
            <div style={{
              width: "2.25rem", height: "2.25rem", borderRadius: "0.625rem",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BookOpen style={{ width: "1.125rem", height: "1.125rem", color: "#fff" }} />
            </div>
            <div>
              <span style={{ fontWeight: 800, color: "#fff", fontSize: "1.0625rem", letterSpacing: "-0.02em" }}>LearnPath </span>
              <span style={{ fontSize: "0.65rem", color: "#818cf8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", verticalAlign: "super" }}>Enterprise</span>
            </div>
          </div>

          <h2 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", marginBottom: "0.5rem" }}>Welcome back</h2>
          <p style={{ color: "#64748b", marginBottom: "2rem", fontSize: "0.9rem" }}>Sign in to your enterprise account</p>

          {/* Quick access */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.75rem" }}>
            <button
              id="btn-quick-admin"
              onClick={() => doSignIn("admin@corp.com", "admin123", "admin")}
              disabled={!!quickLoading}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.875rem 1rem", borderRadius: "0.875rem",
                background: "rgba(99,102,241,0.08)", border: "1.5px solid rgba(99,102,241,0.2)",
                cursor: "pointer", transition: "all 0.2s", textAlign: "left",
                opacity: quickLoading ? 0.6 : 1,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.45)"; e.currentTarget.style.background = "rgba(99,102,241,0.14)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}
            >
              {quickLoading === "admin" ? <Loader2 style={{ width: "1.25rem", height: "1.25rem", color: "#818cf8", flexShrink: 0 }} className="animate-spin" /> : <Shield style={{ width: "1.25rem", height: "1.25rem", color: "#818cf8", flexShrink: 0 }} />}
              <div>
                <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: "0.8125rem", lineHeight: 1.3 }}>Admin Demo</div>
                <div style={{ color: "#64748b", fontSize: "0.7rem", marginTop: "0.125rem" }}>admin@corp.com</div>
              </div>
            </button>

            <button
              id="btn-quick-learner"
              onClick={() => doSignIn("learner@corp.com", "learner123", "learner")}
              disabled={!!quickLoading}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.875rem 1rem", borderRadius: "0.875rem",
                background: "rgba(16,185,129,0.08)", border: "1.5px solid rgba(16,185,129,0.2)",
                cursor: "pointer", transition: "all 0.2s", textAlign: "left",
                opacity: quickLoading ? 0.6 : 1,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.45)"; e.currentTarget.style.background = "rgba(16,185,129,0.14)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.2)"; e.currentTarget.style.background = "rgba(16,185,129,0.08)"; }}
            >
              {quickLoading === "learner" ? <Loader2 style={{ width: "1.25rem", height: "1.25rem", color: "#34d399", flexShrink: 0 }} className="animate-spin" /> : <GraduationCap style={{ width: "1.25rem", height: "1.25rem", color: "#34d399", flexShrink: 0 }} />}
              <div>
                <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: "0.8125rem", lineHeight: 1.3 }}>Learner Demo</div>
                <div style={{ color: "#64748b", fontSize: "0.7rem", marginTop: "0.125rem" }}>learner@corp.com</div>
              </div>
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(51,65,85,0.6)" }} />
            <span style={{ color: "#475569", fontSize: "0.75rem", fontWeight: 500 }}>or sign in manually</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(51,65,85,0.6)" }} />
          </div>

          {/* Manual form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
            <div className="input-group">
              <label className="input-label">Email address</label>
              <input
                id="input-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input-field input-field-lg"
                autoComplete="email"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="input-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field input-field-lg"
                  style={{ paddingRight: "3rem" }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#475569", padding: "0.25rem" }}
                >
                  {showPass ? <EyeOff style={{ width: "1rem", height: "1rem" }} /> : <Eye style={{ width: "1rem", height: "1rem" }} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert-error">
                <span>{error}</span>
              </div>
            )}

            <button
              id="btn-signin"
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: "0.25rem" }}
            >
              {loading ? <Loader2 style={{ width: "1.125rem", height: "1.125rem" }} className="animate-spin" /> : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#334155", fontSize: "0.75rem", marginTop: "2rem" }}>
            Secured by NextAuth · Enterprise Edition
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .hero-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
