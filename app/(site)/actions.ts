"use server";

import { leadSchema } from "@/lib/validation/schemas";
import { createLead } from "@/lib/db/repositories/leads";
import { notifyOwner } from "@/lib/notify";
import type { NewLeadInput } from "@/lib/types";

export type BookingResult = { ok: true } | { ok: false; error: string };

/** Public booking form -> insert a real lead (RLS allows anonymous insert). */
export async function createLeadAction(raw: unknown): Promise<BookingResult> {
  // Honeypot: real users never fill the hidden "company" field — bots do.
  if (raw && typeof raw === "object" && (raw as Record<string, unknown>).company) {
    return { ok: true }; // silently drop the bot submission
  }
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }
  const input: NewLeadInput = { ...parsed.data, note: parsed.data.note ?? null };
  try {
    await createLead(input);
    await notifyOwner(input);
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error
          ? "Could not submit your request. Please try again or call us directly."
          : "Could not submit your request.",
    };
  }
}
