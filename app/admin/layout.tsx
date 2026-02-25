import Navbar from "@/components/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <main className="page-container">
                {children}
            </main>
        </div>
    );
}
