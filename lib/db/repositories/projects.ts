import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import { SEED_PROJECTS } from "../seed-data";

type Row = {
  id: string; title: string; service: string; area: string;
  done_on: string | null; image_url: string | null; published: boolean; created_at: string;
};

function map(r: Row): Project {
  return {
    id: r.id, title: r.title, service: r.service, area: r.area,
    doneOn: r.done_on, imageUrl: r.image_url, published: r.published, createdAt: r.created_at,
  };
}

export async function listPublishedProjects(): Promise<Project[]> {
  try {
    const s = await createClient();
    const { data, error } = await s.from("projects").select("*").eq("published", true).order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return SEED_PROJECTS.filter((p) => p.published);
    return data.map(map as (r: Row) => Project);
  } catch {
    return SEED_PROJECTS.filter((p) => p.published);
  }
}

export async function listAllProjects(): Promise<Project[]> {
  try {
    const s = await createClient();
    const { data, error } = await s.from("projects").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return SEED_PROJECTS;
    return data.map(map as (r: Row) => Project);
  } catch {
    return SEED_PROJECTS;
  }
}

export interface NewProject {
  title: string; service: string; area: string; doneOn: string; imageUrl: string | null; published: boolean;
}

export async function createProject(input: NewProject): Promise<void> {
  const s = await createClient();
  const { error } = await s.from("projects").insert({
    title: input.title, service: input.service, area: input.area,
    done_on: input.doneOn, image_url: input.imageUrl, published: input.published,
  });
  if (error) throw new Error(error.message);
}

export async function setProjectPublished(id: string, published: boolean): Promise<void> {
  const s = await createClient();
  const { error } = await s.from("projects").update({ published, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteProject(id: string): Promise<void> {
  const s = await createClient();
  const { error } = await s.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
