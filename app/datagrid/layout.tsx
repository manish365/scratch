import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Invoice Data Grid — Enterprise",
    description: "Advanced enterprise data grid with filtering, sorting, and aggregations.",
};

/**
 * Standalone layout for the /datagrid route.
 * Uses a light theme — overrides the dark root <html> class.
 */
export default function DataGridLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body style={{ margin: 0, fontFamily: "'Inter', system-ui, sans-serif", background: "#f0f2f8", minHeight: "100vh" }}>
                {children}
            </body>
        </html>
    );
}
