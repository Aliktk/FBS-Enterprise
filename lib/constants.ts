/**
 * Brand + domain constants. The live values for contact info come from the
 * `settings` table (editable in admin); these are the seed defaults and the
 * fixed service/area/urgency enums used across the booking flow and admin.
 *
 * Business renamed from "Al Farhan Technical Solutions" -> "Nexvolt Technical Services".
 */

/** Public site origin (set NEXT_PUBLIC_SITE_URL in production / Vercel). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://alfarhantechnical.com";

export const BRAND = {
  name: "Nexvolt Technical Services",
  short: "NEXVOLT",
  city: "PESHAWAR",
  tagline: "Whatever breaks, we fix it.",
  // Defaults — owner edits these in /admin/settings (persisted to the `settings` row).
  primaryPhone: "0311-3183186",
  whatsappNumber: "0311-3183186",
  email: "owner@nexvolt.pk",
  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
} as const;

/** Turn a local PK number (03XX-XXXXXXX) into a wa.me target (92XXXXXXXXXX). */
export function waNumber(local: string): string {
  const digits = local.replace(/[^\d]/g, "");
  const national = digits.startsWith("0") ? digits.slice(1) : digits;
  return "92" + national;
}

/** Turn a local number into a tel: href value. */
export function telNumber(local: string): string {
  return local.replace(/[^\d+]/g, "");
}

// Service catalogue keys (stable ids) shared by services table + booking + chapters.
export type ServiceKey =
  | "ac" | "solar" | "ups" | "elec" | "cctv" | "plumb" | "weld" | "civil";

/** Booking-form service options (icon + label + sub). Mirrors booking.jsx SERVICES. */
export const BOOKING_SERVICES: { id: ServiceKey; em: string; t: string; s: string }[] = [
  { id: "ac", em: "❄", t: "AC service", s: "install · gas · repair" },
  { id: "solar", em: "☀", t: "Solar", s: "on/off-grid · hybrid" },
  { id: "ups", em: "⚡", t: "Inverter/UPS", s: "install · maintenance" },
  { id: "elec", em: "🔌", t: "Electrical", s: "wiring · DB · faults" },
  { id: "cctv", em: "📹", t: "CCTV", s: "cameras · NVR · app" },
  { id: "plumb", em: "🔧", t: "Plumbing", s: "pipes · leaks · fix" },
  { id: "weld", em: "🔥", t: "Welding", s: "grills · gates · fab" },
  { id: "civil", em: "🏗", t: "Civil work", s: "repairs · finishes" },
];

export const AREAS = [
  "Hayatabad", "University Town", "Warsak Road", "Saddar", "Tehkal", "Gulberg",
] as const;

export const COMING_SOON_AREAS = ["Charsadda", "Mardan"] as const;

export const URGENCY = [
  { id: "normal", t: "Normal", s: "within 2 days", label: "Normal" },
  { id: "urgent", t: "Urgent", s: "today", label: "Urgent" },
  { id: "emerg", t: "Emergency", s: "right now", label: "Emergency" },
] as const;

export type UrgencyId = (typeof URGENCY)[number]["id"];
export type UrgencyLabel = "Normal" | "Urgent" | "Emergency";

export const URGENCY_LABEL: Record<UrgencyId, UrgencyLabel> = {
  normal: "Normal",
  urgent: "Urgent",
  emerg: "Emergency",
};

// Lead status lifecycle (admin cycles in this order).
export const LEAD_STATUSES = ["new", "contacted", "scheduled", "done"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export function nextLeadStatus(current: LeadStatus): LeadStatus {
  const i = LEAD_STATUSES.indexOf(current);
  return LEAD_STATUSES[(i + 1) % LEAD_STATUSES.length];
}

export const GALLERY_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_GALLERY_BUCKET || "gallery";
