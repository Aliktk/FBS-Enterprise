import { createClient } from "@/lib/supabase/server";
import type { Lead, NewLeadInput } from "@/lib/types";
import type { LeadStatus } from "@/lib/constants";

type Row = {
  id: string; name: string; phone: string; service: string; area: string;
  urgency: string; status: string; note: string | null; internal_note: string | null;
  source: string; created_at: string; updated_at: string | null;
};

function map(r: Row): Lead {
  return {
    id: r.id, name: r.name, phone: r.phone, service: r.service, area: r.area,
    urgency: r.urgency as Lead["urgency"], status: r.status as LeadStatus,
    note: r.note, internalNote: r.internal_note, source: r.source,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

/**
 * Public insert. RLS allows anonymous INSERT but not SELECT on leads, so we do
 * NOT read the row back — a returning select would trip the security policy.
 */
export async function createLead(input: NewLeadInput): Promise<void> {
  const s = await createClient();
  const base = {
    name: input.name,
    phone: input.phone,
    service: input.service,
    area: input.area,
    urgency: input.urgency,
    note: input.note ?? null,
    status: "new",
    source: "website",
  };
  let { error } = await s.from("leads").insert({ ...base, tracking_token: input.trackingToken ?? null });
  // Resilience: if the tracking_token migration (0004) isn't applied yet, insert without it.
  if (error && /tracking_token|column/i.test(error.message)) {
    ({ error } = await s.from("leads").insert(base));
  }
  if (error) throw new Error(error.message);
}

export async function listLeads(): Promise<Lead[]> {
  const s = await createClient();
  const { data, error } = await s.from("leads").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Row[]).map(map);
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const s = await createClient();
  const { error } = await s.from("leads").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateLeadInternalNote(id: string, note: string): Promise<void> {
  const s = await createClient();
  const { error } = await s.from("leads").update({ internal_note: note, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}
