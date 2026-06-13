import { createClient } from "@/lib/supabase/server";
import type { Settings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "../seed-data";

const SINGLETON_ID = "singleton";

type Row = {
  id: string; business_name: string; primary_phone: string; whatsapp_number: string;
  email: string; service_areas: string[]; coming_soon_areas: string[];
  emergency_24_7: boolean; facebook_url: string; instagram_url: string; youtube_url: string;
};

function map(r: Row): Settings {
  return {
    businessName: r.business_name, primaryPhone: r.primary_phone, whatsappNumber: r.whatsapp_number,
    email: r.email, serviceAreas: r.service_areas ?? [], comingSoonAreas: r.coming_soon_areas ?? [],
    emergency247: r.emergency_24_7, facebookUrl: r.facebook_url ?? "",
    instagramUrl: r.instagram_url ?? "", youtubeUrl: r.youtube_url ?? "",
  };
}

export async function getSettings(): Promise<Settings> {
  try {
    const s = await createClient();
    const { data, error } = await s.from("settings").select("*").eq("id", SINGLETON_ID).maybeSingle();
    if (error || !data) return DEFAULT_SETTINGS;
    return map(data as Row);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(input: Settings): Promise<void> {
  const s = await createClient();
  const { error } = await s.from("settings").upsert({
    id: SINGLETON_ID,
    business_name: input.businessName,
    primary_phone: input.primaryPhone,
    whatsapp_number: input.whatsappNumber,
    email: input.email,
    service_areas: input.serviceAreas,
    coming_soon_areas: input.comingSoonAreas,
    emergency_24_7: input.emergency247,
    facebook_url: input.facebookUrl,
    instagram_url: input.instagramUrl,
    youtube_url: input.youtubeUrl,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}
