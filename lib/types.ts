/**
 * App-facing domain types (camelCase). The repository layer maps these to/from
 * the snake_case Postgres rows so the rest of the app never sees DB casing.
 */
import type { LeadStatus, ServiceKey, UrgencyLabel } from "./constants";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  service: ServiceKey | string;
  area: string;
  urgency: UrgencyLabel;
  status: LeadStatus;
  note: string | null;
  internalNote: string | null;
  source: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface Project {
  id: string;
  title: string;
  service: string;
  area: string;
  doneOn: string | null;
  imageUrl: string | null;
  published: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  meta: string | null;
  stars: number;
  quote: string;
  published: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  key: ServiceKey | string;
  emoji: string;
  title: string;
  description: string;
  isNew: boolean;
  enabled: boolean;
  sortOrder: number;
}

export interface Settings {
  businessName: string;
  primaryPhone: string;
  whatsappNumber: string;
  email: string;
  serviceAreas: string[];
  comingSoonAreas: string[];
  emergency247: boolean;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
}

/** Payload accepted by the public booking form -> createLead action. */
export interface NewLeadInput {
  name: string;
  phone: string;
  service: string;
  area: string;
  urgency: UrgencyLabel;
  note?: string | null;
  trackingToken?: string | null;
}
