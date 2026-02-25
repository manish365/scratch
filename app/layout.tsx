import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LearnPath — Enterprise Learning Roadmap Manager",
  description: "Manage and track learning roadmaps across your enterprise. Admin tools for roadmap creation and learner tools for progress tracking.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-100 min-h-screen`}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
