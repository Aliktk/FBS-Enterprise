import { z } from "zod";

/** PK mobile: 10–11 digits, optional leading 0 (spaces/hyphens stripped before test). */
export const PHONE_RE = /^0?\d{10,11}$/;

export const leadSchema = z.object({
  name: z.string().trim().min(1, "Tell us your name."),
  phone: z
    .string()
    .trim()
    .refine((v) => PHONE_RE.test(v.replace(/[\s-]/g, "")), "Enter a valid phone number."),
  service: z.string().min(1, "Pick a service to continue."),
  area: z.string().min(1, "Choose your area."),
  urgency: z.enum(["Normal", "Urgent", "Emergency"]),
  note: z.string().trim().max(2000).optional().nullable(),
  trackingToken: z.string().uuid().optional().nullable(),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Add a project title."),
  service: z.string().trim().default(""),
  area: z.string().trim().default(""),
  doneOn: z.string().trim().default(""),
  imageUrl: z.string().trim().nullable().default(null),
  published: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  meta: z.string().trim().default(""),
  stars: z.number().int().min(1).max(5).default(5),
  quote: z.string().trim().min(1, "Review text is required."),
  published: z.boolean().default(true),
});

export const settingsSchema = z.object({
  businessName: z.string().trim().min(1),
  primaryPhone: z.string().trim().default(""),
  whatsappNumber: z.string().trim().default(""),
  email: z.string().trim().default(""),
  serviceAreas: z.array(z.string().trim()).default([]),
  comingSoonAreas: z.array(z.string().trim()).default([]),
  emergency247: z.boolean().default(true),
  facebookUrl: z.string().trim().default(""),
  instagramUrl: z.string().trim().default(""),
  youtubeUrl: z.string().trim().default(""),
});
