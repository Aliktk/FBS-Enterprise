import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/types";
import { SEED_TESTIMONIALS } from "../seed-data";

type Row = {
  id: string; name: string; meta: string | null; stars: number;
  quote: string; published: boolean; created_at: string;
};

function map(r: Row): Testimonial {
  return {
    id: r.id, name: r.name, meta: r.meta, stars: r.stars,
    quote: r.quote, published: r.published, createdAt: r.created_at,
  };
}

export async function listPublishedTestimonials(): Promise<Testimonial[]> {
  try {
    const s = await createClient();
    const { data, error } = await s.from("testimonials").select("*").eq("published", true).order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return SEED_TESTIMONIALS.filter((t) => t.published);
    return data.map(map as (r: Row) => Testimonial);
  } catch {
    return SEED_TESTIMONIALS.filter((t) => t.published);
  }
}

export async function listAllTestimonials(): Promise<Testimonial[]> {
  try {
    const s = await createClient();
    const { data, error } = await s.from("testimonials").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return SEED_TESTIMONIALS;
    return data.map(map as (r: Row) => Testimonial);
  } catch {
    return SEED_TESTIMONIALS;
  }
}

export interface NewTestimonial {
  name: string; meta: string; stars: number; quote: string; published: boolean;
}

export async function createTestimonial(input: NewTestimonial): Promise<void> {
  const s = await createClient();
  const { error } = await s.from("testimonials").insert(input);
  if (error) throw new Error(error.message);
}

export async function setTestimonialPublished(id: string, published: boolean): Promise<void> {
  const s = await createClient();
  const { error } = await s.from("testimonials").update({ published, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteTestimonial(id: string): Promise<void> {
  const s = await createClient();
  const { error } = await s.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
