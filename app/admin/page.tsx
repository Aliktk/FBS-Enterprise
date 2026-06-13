import Link from "next/link";
import { Ico } from "@/components/admin/AdminIcon";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { listLeads } from "@/lib/db/repositories/leads";
import { listAllProjects } from "@/lib/db/repositories/projects";
import { listAllTestimonials } from "@/lib/db/repositories/testimonials";
import { BOOKING_SERVICES } from "@/lib/constants";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

function svc(key: string) {
  const found = BOOKING_SERVICES.find((s) => s.id === key);
  return { em: found?.em ?? "🛠", t: found?.t ?? key };
}

export default async function OverviewPage() {
  let leads: Lead[] = [];
  try {
    leads = await listLeads();
  } catch {
    leads = [];
  }
  const projects = await listAllProjects();
  const testi = await listAllTestimonials();

  const newLeads = leads.filter((l) => l.status === "new").length;
  const pubProjects = projects.filter((p) => p.published).length;
  const avg =
    testi.length > 0 ? (testi.reduce((a, t) => a + t.stars, 0) / testi.length).toFixed(1) : "—";

  const stats = [
    { v: newLeads, l: "New leads", d: "inbox", c: "var(--orange)", bg: "var(--orange-soft)" },
    { v: leads.length, l: "Total requests", d: "phone", c: "var(--info)", bg: "var(--info-soft)" },
    { v: pubProjects, l: "Published projects", d: "image", c: "var(--good)", bg: "var(--good-soft)", note: `${projects.length} total` },
    { v: avg, l: "Avg rating", d: "star", c: "var(--warn)", bg: "var(--warn-soft)", note: `${testi.length} reviews` },
  ];

  const quick = [
    { href: "/admin/gallery", ic: "image", t: "Publish a project photo", d: "Add a recent job to the gallery", c: "var(--good)", bg: "var(--good-soft)" },
    { href: "/admin/testimonials", ic: "star", t: "Add a testimonial", d: "Post a new customer review", c: "var(--warn)", bg: "var(--warn-soft)" },
    { href: "/admin/services", ic: "tools", t: "Edit services", d: "Turn services on/off", c: "var(--info)", bg: "var(--info-soft)" },
    { href: "/admin/settings", ic: "gear", t: "Business settings", d: "Phone, areas, hours, socials", c: "var(--orange)", bg: "var(--orange-soft)" },
  ];

  return (
    <div className="view">
      <div className="vhead">
        <div>
          <h2 className="vt">Welcome back 👋</h2>
          <div className="vd">Here&apos;s what&apos;s happening across your business today.</div>
        </div>
        <div className="toolbar">
          <a className="btn btn--ghost" href="/" target="_blank" rel="noopener noreferrer"><Ico d="ext" s={17} /> View live site</a>
          <Link className="btn btn--primary" href="/admin/leads"><Ico d="inbox" s={17} /> View leads</Link>
        </div>
      </div>

      <div className="stats">
        {stats.map((s, i) => (
          <div className="card stat" key={i}>
            <div className="si" style={{ background: s.bg, color: s.c }}><Ico d={s.d} s={21} /></div>
            <div className="sv">{s.v}</div>
            <div className="sl">{s.l}</div>
            {s.note && <div className="sc" style={{ color: "var(--muted)" }}>{s.note}</div>}
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card panel">
          <div className="ph"><h3>Latest booking requests</h3><Link className="btn btn--soft btn--sm" href="/admin/leads">See all</Link></div>
          {leads.length > 0 ? (
            <table className="tbl">
              <thead><tr><th>Customer</th><th>Service</th><th>Area</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {leads.slice(0, 5).map((l) => {
                  const s = svc(l.service);
                  return (
                    <tr key={l.id}>
                      <td><div className="who"><div className="av">{l.name.charAt(0)}</div><div><div className="nm">{l.name}</div><div className="ph">{l.phone}</div></div></div></td>
                      <td><span className="svc-tag"><span className="e">{s.em}</span>{s.t}</span></td>
                      <td style={{ color: "var(--muted)", fontSize: 13 }}>{l.area}</td>
                      <td><StatusBadge status={l.status} /></td>
                      <td><div className="row-act"><a className="mini-btn go" href={"tel:" + l.phone} title="Call"><Ico d="phone" s={15} /></a></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty"><div className="ei"><Ico d="inbox" s={26} /></div>No booking requests yet. They&apos;ll appear here the moment a customer books.</div>
          )}
        </div>

        <div className="card panel">
          <div className="ph"><h3>Quick actions</h3></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {quick.map((q) => (
              <Link key={q.href} href={q.href} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: 12, border: "1px solid var(--line)", background: "var(--panel-2)" }}>
                <span style={{ width: 42, height: 42, borderRadius: 11, background: q.bg, color: q.c, display: "grid", placeItems: "center", flex: "0 0 auto" }}><Ico d={q.ic} s={21} /></span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontWeight: 600, fontSize: 14.5 }}>{q.t}</span>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>{q.d}</span>
                </span>
                <Ico d="chevron" s={18} color="var(--faint)" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
