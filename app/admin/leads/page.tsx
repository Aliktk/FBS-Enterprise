import { listLeads } from "@/lib/db/repositories/leads";
import { LeadsView } from "@/components/admin/LeadsView";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  let leads: Lead[] = [];
  try {
    leads = await listLeads();
  } catch {
    leads = [];
  }
  return <LeadsView initialLeads={leads} />;
}
