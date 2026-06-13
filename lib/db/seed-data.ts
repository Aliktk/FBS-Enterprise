/**
 * Canonical seed content (from the design prototype's admin-data.jsx), shaped as
 * app domain types. Used as (a) the DB seed source and (b) the runtime fallback
 * so the public site renders even before Supabase is populated.
 */
import type { Service, Project, Testimonial, Settings, Lead } from "@/lib/types";
import { BRAND, AREAS, COMING_SOON_AREAS } from "@/lib/constants";

export const SEED_SERVICES: Service[] = [
  { id: "ac", key: "ac", emoji: "❄", title: "AC Installation & Repair", description: "All brands · gas · servicing", isNew: false, enabled: true, sortOrder: 0 },
  { id: "solar", key: "solar", emoji: "☀", title: "Solar Systems", description: "On/off-grid · hybrid · net metering", isNew: false, enabled: true, sortOrder: 1 },
  { id: "ups", key: "ups", emoji: "⚡", title: "Inverter & UPS", description: "Install · repair · maintenance", isNew: false, enabled: true, sortOrder: 2 },
  { id: "elec", key: "elec", emoji: "🔌", title: "Electrical Work", description: "Wiring · DB · fault finding", isNew: false, enabled: true, sortOrder: 3 },
  { id: "cctv", key: "cctv", emoji: "📹", title: "CCTV & Surveillance", description: "Cameras · NVR · app setup", isNew: false, enabled: true, sortOrder: 4 },
  { id: "plumb", key: "plumb", emoji: "🔧", title: "Plumbing", description: "Pipes · fixtures · leaks", isNew: true, enabled: true, sortOrder: 5 },
  { id: "weld", key: "weld", emoji: "🔥", title: "Welding", description: "Grills · gates · fabrication", isNew: true, enabled: true, sortOrder: 6 },
  { id: "civil", key: "civil", emoji: "🏗", title: "Civil Work", description: "Small builds · repairs · finishes", isNew: true, enabled: false, sortOrder: 7 },
];

const U = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const SEED_PROJECTS: Project[] = [
  { id: "p1", title: "5kW On-grid Solar", service: "Solar", area: "Hayatabad", doneOn: "May 2026", imageUrl: U("1559302504-64aae6ca6b6d"), published: true, createdAt: "2026-05-01T00:00:00Z" },
  { id: "p2", title: "8-Camera CCTV Setup", service: "CCTV", area: "Warsak Rd", doneOn: "Apr 2026", imageUrl: U("1557597774-9d273605dfa9"), published: true, createdAt: "2026-04-15T00:00:00Z" },
  { id: "p3", title: "Full House Rewiring", service: "Electrical", area: "Saddar", doneOn: "Apr 2026", imageUrl: U("1621905251189-08b45d6a269e"), published: true, createdAt: "2026-04-02T00:00:00Z" },
  { id: "p4", title: "Inverter AC Install ×3", service: "AC", area: "University Town", doneOn: "Mar 2026", imageUrl: U("1617103996702-96ff29b1c467"), published: false, createdAt: "2026-03-20T00:00:00Z" },
  { id: "p5", title: "Custom Steel Gate", service: "Welding", area: "Tehkal", doneOn: "Mar 2026", imageUrl: U("1504917595217-d4dc5ebe6122"), published: true, createdAt: "2026-03-05T00:00:00Z" },
];

export const SEED_TESTIMONIALS: Testimonial[] = [
  { id: "t1", name: "Ahmed K.", meta: "Hayatabad · AC repair", stars: 5, quote: "AC fixed within 3 hours of my call. Professional and fair price.", published: true, createdAt: "2026-05-10T00:00:00Z" },
  { id: "t2", name: "Sana M.", meta: "University Town · Solar", stars: 5, quote: "Got a 5kW system installed. Power bill dropped 80%. Handled net metering too.", published: true, createdAt: "2026-05-08T00:00:00Z" },
  { id: "t3", name: "Bilal R.", meta: "Saddar · CCTV", stars: 5, quote: "Installed 6 cameras around our shop. Mobile app works great. Recommended.", published: true, createdAt: "2026-05-05T00:00:00Z" },
  { id: "t4", name: "Nida F.", meta: "Warsak Road · Electrical", stars: 4, quote: "Whole-house rewiring, on time and on budget. Felt like craftsmanship.", published: false, createdAt: "2026-05-01T00:00:00Z" },
];

export const DEFAULT_SETTINGS: Settings = {
  businessName: BRAND.name,
  primaryPhone: BRAND.primaryPhone,
  whatsappNumber: BRAND.whatsappNumber,
  email: BRAND.email,
  serviceAreas: [...AREAS],
  comingSoonAreas: [...COMING_SOON_AREAS],
  emergency247: true,
  facebookUrl: BRAND.facebookUrl,
  instagramUrl: BRAND.instagramUrl,
  youtubeUrl: BRAND.youtubeUrl,
};

/** Demo leads — seeded only into the DB so the admin Leads view is populated. */
export const SEED_LEADS: Omit<Lead, "id" | "createdAt" | "updatedAt">[] = [
  { name: "Ahmed Khan", phone: "0312-1145566", service: "ac", area: "Hayatabad", urgency: "Urgent", status: "new", note: "AC not cooling since yesterday, makes a clicking sound.", internalNote: null, source: "website" },
  { name: "Sana Malik", phone: "0301-7788991", service: "solar", area: "University Town", urgency: "Normal", status: "new", note: "Want a quote for ~5kW on-grid system. 2-storey house.", internalNote: null, source: "website" },
  { name: "Bilal Raza", phone: "0345-2010102", service: "cctv", area: "Saddar", urgency: "Normal", status: "contacted", note: "6 cameras for a shop, need mobile viewing.", internalNote: null, source: "website" },
  { name: "Nida Farooq", phone: "0333-9087612", service: "elec", area: "Warsak Road", urgency: "Urgent", status: "scheduled", note: "DB tripping repeatedly after rain.", internalNote: null, source: "website" },
  { name: "Imran S.", phone: "0307-4451200", service: "plumb", area: "Tehkal", urgency: "Emergency", status: "new", note: "Major leak under kitchen sink, water everywhere.", internalNote: null, source: "website" },
  { name: "Rabia A.", phone: "0321-6677001", service: "weld", area: "Gulberg", urgency: "Normal", status: "done", note: "Custom gate fabrication, ~8ft.", internalNote: null, source: "website" },
];
