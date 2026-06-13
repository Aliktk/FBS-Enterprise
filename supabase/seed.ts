/**
 * Seed script — populates content tables and provisions the owner admin user.
 * Run AFTER applying supabase/migrations/0001_init.sql.
 *
 *   pnpm db:seed
 *
 * Requires in .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 * ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME.
 *
 * Self-contained (no path-alias imports) so it runs cleanly under tsx.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local. " +
      "Add the Supabase secret (service_role) key, then re-run `pnpm db:seed`.",
  );
  process.exit(1);
}

const db = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const U = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const services = [
  { key: "ac", emoji: "❄", title: "AC Installation & Repair", description: "All brands · gas · servicing", is_new: false, enabled: true, sort_order: 0 },
  { key: "solar", emoji: "☀", title: "Solar Systems", description: "On/off-grid · hybrid · net metering", is_new: false, enabled: true, sort_order: 1 },
  { key: "ups", emoji: "⚡", title: "Inverter & UPS", description: "Install · repair · maintenance", is_new: false, enabled: true, sort_order: 2 },
  { key: "elec", emoji: "🔌", title: "Electrical Work", description: "Wiring · DB · fault finding", is_new: false, enabled: true, sort_order: 3 },
  { key: "cctv", emoji: "📹", title: "CCTV & Surveillance", description: "Cameras · NVR · app setup", is_new: false, enabled: true, sort_order: 4 },
  { key: "plumb", emoji: "🔧", title: "Plumbing", description: "Pipes · fixtures · leaks", is_new: true, enabled: true, sort_order: 5 },
  { key: "weld", emoji: "🔥", title: "Welding", description: "Grills · gates · fabrication", is_new: true, enabled: true, sort_order: 6 },
  { key: "civil", emoji: "🏗", title: "Civil Work", description: "Small builds · repairs · finishes", is_new: true, enabled: false, sort_order: 7 },
];

const projects = [
  { title: "5kW On-grid Solar", service: "Solar", area: "Hayatabad", done_on: "May 2026", image_url: U("1559302504-64aae6ca6b6d"), published: true },
  { title: "8-Camera CCTV Setup", service: "CCTV", area: "Warsak Rd", done_on: "Apr 2026", image_url: U("1557597774-9d273605dfa9"), published: true },
  { title: "Full House Rewiring", service: "Electrical", area: "Saddar", done_on: "Apr 2026", image_url: U("1621905251189-08b45d6a269e"), published: true },
  { title: "Inverter AC Install ×3", service: "AC", area: "University Town", done_on: "Mar 2026", image_url: U("1617103996702-96ff29b1c467"), published: false },
  { title: "Custom Steel Gate", service: "Welding", area: "Tehkal", done_on: "Mar 2026", image_url: U("1504917595217-d4dc5ebe6122"), published: true },
];

const testimonials = [
  { name: "Ahmed K.", meta: "Hayatabad · AC repair", stars: 5, quote: "AC fixed within 3 hours of my call. Professional and fair price.", published: true },
  { name: "Sana M.", meta: "University Town · Solar", stars: 5, quote: "Got a 5kW system installed. Power bill dropped 80%. Handled net metering too.", published: true },
  { name: "Bilal R.", meta: "Saddar · CCTV", stars: 5, quote: "Installed 6 cameras around our shop. Mobile app works great. Recommended.", published: true },
  { name: "Nida F.", meta: "Warsak Road · Electrical", stars: 4, quote: "Whole-house rewiring, on time and on budget. Felt like craftsmanship.", published: false },
];

const leads = [
  { name: "Ahmed Khan", phone: "0312-1145566", service: "ac", area: "Hayatabad", urgency: "Urgent", status: "new", note: "AC not cooling since yesterday, makes a clicking sound." },
  { name: "Sana Malik", phone: "0301-7788991", service: "solar", area: "University Town", urgency: "Normal", status: "new", note: "Want a quote for ~5kW on-grid system. 2-storey house." },
  { name: "Bilal Raza", phone: "0345-2010102", service: "cctv", area: "Saddar", urgency: "Normal", status: "contacted", note: "6 cameras for a shop, need mobile viewing." },
  { name: "Nida Farooq", phone: "0333-9087612", service: "elec", area: "Warsak Road", urgency: "Urgent", status: "scheduled", note: "DB tripping repeatedly after rain." },
  { name: "Imran S.", phone: "0307-4451200", service: "plumb", area: "Tehkal", urgency: "Emergency", status: "new", note: "Major leak under kitchen sink, water everywhere." },
  { name: "Rabia A.", phone: "0321-6677001", service: "weld", area: "Gulberg", urgency: "Normal", status: "done", note: "Custom gate fabrication, ~8ft." },
];

const settings = {
  id: "singleton",
  business_name: "Nexvolt Technical Services",
  primary_phone: "0311-3183186",
  whatsapp_number: "0311-3183186",
  email: process.env.ADMIN_EMAIL || "owner@nexvolt.pk",
  service_areas: ["Hayatabad", "University Town", "Warsak Road", "Saddar", "Tehkal", "Gulberg"],
  coming_soon_areas: ["Charsadda", "Mardan"],
  emergency_24_7: true,
  facebook_url: "",
  instagram_url: "",
  youtube_url: "",
};

async function main() {
  console.log("Seeding services…");
  await db.from("services").upsert(services, { onConflict: "key" }).throwOnError();

  console.log("Seeding settings…");
  await db.from("settings").upsert(settings, { onConflict: "id" }).throwOnError();

  // Insert content only if empty (avoid duplicates on re-run).
  const { count: projCount } = await db.from("projects").select("*", { count: "exact", head: true });
  if (!projCount) {
    console.log("Seeding projects…");
    await db.from("projects").insert(projects).throwOnError();
  }
  const { count: tCount } = await db.from("testimonials").select("*", { count: "exact", head: true });
  if (!tCount) {
    console.log("Seeding testimonials…");
    await db.from("testimonials").insert(testimonials).throwOnError();
  }
  const { count: lCount } = await db.from("leads").select("*", { count: "exact", head: true });
  if (!lCount) {
    console.log("Seeding demo leads…");
    await db.from("leads").insert(leads).throwOnError();
  }

  // Provision the owner admin user (no public signup).
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    console.log(`Provisioning admin user ${email}…`);
    const { error } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: process.env.ADMIN_NAME || "Owner", role: "owner" },
    });
    if (error && !/already.*registered|exists/i.test(error.message)) {
      throw error;
    }
    console.log(error ? "  (admin user already exists — skipped)" : "  admin user created.");
  }

  console.log("✅ Seed complete.");
}

main().catch((e) => {
  console.error("Seed failed:", e?.message || e);
  process.exit(1);
});
