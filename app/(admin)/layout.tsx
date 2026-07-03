import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminHeader from "@/components/layout/AdminHeader";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/store/features/dashboard/sidebarContext";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | CloudAnalogy Admin",
  },
  description: "CloudAnalogy administration portal for managing partners, forms, and platform settings.",
  robots: { index: false, follow: false },
};

export default function AdminGroupLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
  <div className="min-h-screen bg-slate-100 text-slate-900">
    <AdminHeader />
    <Sidebar />

    <main
      className="
        w-full
        px-4
        sm:px-6
        pb-8
        transition-all
        duration-200
        md:pl-[calc(var(--sidebar-width)+16px)]
      "
      style={{
        paddingTop: "calc(var(--navbar-height) + 24px)",
        minHeight: "100vh",
      }}
    >
      {children}
    </main>
  </div>
</SidebarProvider>
  );
}
