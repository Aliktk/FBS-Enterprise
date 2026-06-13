import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";
import { SEED_SERVICES } from "../seed-data";

type Row = {
  id: string; key: string; emoji: string; title: string; description: string;
  is_new: boolean; enabled: boolean; sort_order: number;
};

function map(r: Row): Service {
  return {
    id: r.id, key: r.key, emoji: r.emoji, title: r.title,
    description: r.description, isNew: r.is_new, enabled: r.enabled, sortOrder: r.sort_order,
  };
}

export async function listEnabledServices(): Promise<Service[]> {
  try {
    const s = await createClient();
    const { data, error } = await s.from("services").select("*").eq("enabled", true).order("sort_order");
    if (error || !data || data.length === 0) return SEED_SERVICES.filter((x) => x.enabled);
    return data.map(map as (r: Row) => Service);
  } catch {
    return SEED_SERVICES.filter((x) => x.enabled);
  }
}

export async function listAllServices(): Promise<Service[]> {
  try {
    const s = await createClient();
    const { data, error } = await s.from("services").select("*").order("sort_order");
    if (error || !data || data.length === 0) return SEED_SERVICES;
    return data.map(map as (r: Row) => Service);
  } catch {
    return SEED_SERVICES;
  }
}

export async function setServiceEnabled(id: string, enabled: boolean): Promise<void> {
  const s = await createClient();
  const { error } = await s.from("services").update({ enabled, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}

/** Persist a new ordering: sort_order becomes the array index. */
export async function reorderServices(orderedIds: string[]): Promise<void> {
  const s = await createClient();
  const now = new Date().toISOString();
  const results = await Promise.all(
    orderedIds.map((id, i) => s.from("services").update({ sort_order: i, updated_at: now }).eq("id", id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);
}
