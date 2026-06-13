import type { Metadata } from "next";
import "./admin.css";
import { requireAdmin } from "@/lib/auth/guard";
import { AdminShell } from "@/components/admin/AdminShell";
import { listLeads } from "@/lib/db/repositories/leads";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  let newLeads = 0;
  try {
    const leads = await listLeads();
    newLeads = leads.filter((l) => l.status === "new").length;
  } catch {
    newLeads = 0;
  }

  const name =
    (user.user_metadata?.name as string | undefined) || user.email?.split("@")[0] || "Admin";

  return (
    <AdminShell user={{ name, email: user.email ?? "" }} newLeads={newLeads}>
      {children}
    </AdminShell>
  );
}
