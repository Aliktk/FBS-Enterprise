"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import * as leadsRepo from "@/lib/db/repositories/leads";
import * as projectsRepo from "@/lib/db/repositories/projects";
import * as testiRepo from "@/lib/db/repositories/testimonials";
import * as servicesRepo from "@/lib/db/repositories/services";
import * as settingsRepo from "@/lib/db/repositories/settings";
import { nextLeadStatus, type LeadStatus } from "@/lib/constants";
import { projectSchema, testimonialSchema, settingsSchema } from "@/lib/validation/schemas";

export type ActionResult = { ok: true } | { ok: false; error: string };

function fail(e: unknown): ActionResult {
  return { ok: false, error: e instanceof Error ? e.message : "Something went wrong." };
}

/** Revalidate an admin path plus the public site (content changes are reflected live). */
function revalidate(path: string) {
  revalidatePath(path);
  revalidatePath("/");
}

// ---------- leads ----------
export async function cycleLeadStatusAction(id: string, current: LeadStatus): Promise<ActionResult> {
  await requireAdmin();
  try {
    await leadsRepo.updateLeadStatus(id, nextLeadStatus(current));
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function saveLeadNoteAction(id: string, note: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await leadsRepo.updateLeadInternalNote(id, note);
    revalidatePath("/admin/leads");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ---------- projects / gallery ----------
export async function createProjectAction(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid project." };
  try {
    await projectsRepo.createProject(parsed.data);
    revalidate("/admin/gallery");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function toggleProjectPublishedAction(id: string, published: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await projectsRepo.setProjectPublished(id, published);
    revalidate("/admin/gallery");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await projectsRepo.deleteProject(id);
    revalidate("/admin/gallery");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ---------- testimonials ----------
export async function createTestimonialAction(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid testimonial." };
  try {
    await testiRepo.createTestimonial(parsed.data);
    revalidate("/admin/testimonials");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function toggleTestimonialPublishedAction(id: string, published: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await testiRepo.setTestimonialPublished(id, published);
    revalidate("/admin/testimonials");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteTestimonialAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await testiRepo.deleteTestimonial(id);
    revalidate("/admin/testimonials");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ---------- services ----------
export async function toggleServiceAction(id: string, enabled: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await servicesRepo.setServiceEnabled(id, enabled);
    revalidate("/admin/services");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function reorderServicesAction(orderedIds: string[]): Promise<ActionResult> {
  await requireAdmin();
  try {
    await servicesRepo.reorderServices(orderedIds);
    revalidate("/admin/services");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ---------- settings ----------
export async function saveSettingsAction(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid settings." };
  try {
    await settingsRepo.updateSettings(parsed.data);
    revalidate("/admin/settings");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
