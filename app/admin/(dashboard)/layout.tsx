import type { Metadata } from "next";
import QueryProvider from "@/components/admin/QueryProvider";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: "Dasanda Admin" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AdminShell>{children}</AdminShell>
    </QueryProvider>
  );
}