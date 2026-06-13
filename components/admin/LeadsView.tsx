"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Ico } from "./AdminIcon";
import { StatusBadge } from "./StatusBadge";
import { toast } from "./Toast";
import { createClient } from "@/lib/supabase/client";
import { cycleLeadStatusAction, saveLeadNoteAction } from "@/app/admin/actions";
import { BOOKING_SERVICES, waNumber, nextLeadStatus, type LeadStatus } from "@/lib/constants";
import type { Lead } from "@/lib/types";

function svc(key: string) {
  const f = BOOKING_SERVICES.find((s) => s.id === key);
  return { em: f?.em ?? "🛠", t: f?.t ?? key };
}

const FILTERS = ["all", "new", "scheduled", "done"] as const;

export function LeadsView({ initialLeads }: { initialLeads: Lead[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [active, setActive] = useState<Lead | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const counts = {
    all: initialLeads.length,
    new: initialLeads.filter((l) => l.status === "new").length,
    scheduled: initialLeads.filter((l) => l.status === "scheduled").length,
    done: initialLeads.filter((l) => l.status === "done").length,
  };
  const shown = filter === "all" ? initialLeads : initialLeads.filter((l) => l.status === filter);

  // live updates — refresh when leads change (new booking, status edits elsewhere)
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-leads")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, (payload) => {
        if (payload.eventType === "INSERT") toast("New booking request received");
        router.refresh();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const cycle = async (l: Lead) => {
    const next = nextLeadStatus(l.status as LeadStatus);
    const res = await cycleLeadStatusAction(l.id, l.status as LeadStatus);
    if (!res.ok) return toast(res.error);
    toast(`${l.name} → ${next}`);
    router.refresh();
  };

  const openLead = (l: Lead) => {
    setActive(l);
    setNote(l.internalNote ?? "");
  };

  const saveNote = async () => {
    if (!active) return;
    setBusy(true);
    const res = await saveLeadNoteAction(active.id, note);
    setBusy(false);
    if (!res.ok) return toast(res.error);
    toast("Note saved");
    setActive(null);
    router.refresh();
  };

  return (
    <div className="view">
      <div className="vhead">
        <div>
          <h2 className="vt">Booking requests</h2>
          <div className="vd">Every &quot;Book a fix&quot; submission from the website lands here.</div>
        </div>
        <div className="toolbar">
          {FILTERS.map((f) => (
            <button key={f} className={"btn btn--sm " + (filter === f ? "btn--navy" : "btn--soft")} onClick={() => setFilter(f)}>
              {f[0].toUpperCase() + f.slice(1)} <span style={{ opacity: 0.7 }}>· {counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card panel" style={{ padding: 0 }}>
        <table className="tbl">
          <thead><tr><th>Customer</th><th>Service</th><th>Area</th><th>Urgency</th><th>Status</th><th>When</th><th></th></tr></thead>
          <tbody>
            {shown.map((l) => {
              const s = svc(l.service);
              const when = new Date(l.createdAt).toLocaleDateString();
              return (
                <tr key={l.id} style={{ cursor: "pointer" }} onClick={() => openLead(l)}>
                  <td><div className="who"><div className="av">{l.name.charAt(0)}</div><div><div className="nm">{l.name}</div><div className="ph">{l.phone}</div></div></div></td>
                  <td><span className="svc-tag"><span className="e">{s.em}</span>{s.t}</span></td>
                  <td style={{ color: "var(--muted)", fontSize: 13 }}>{l.area}</td>
                  <td>
                    <span className="badge" style={{
                      background: l.urgency === "Emergency" ? "#FCEDEC" : l.urgency === "Urgent" ? "var(--warn-soft)" : "var(--panel-3)",
                      color: l.urgency === "Emergency" ? "var(--danger)" : l.urgency === "Urgent" ? "var(--warn)" : "var(--muted)",
                    }}>{l.urgency}</span>
                  </td>
                  <td onClick={(e) => { e.stopPropagation(); cycle(l); }} title="Click to advance status"><StatusBadge status={l.status} /></td>
                  <td style={{ color: "var(--faint)", fontSize: 12.5, fontFamily: "var(--font-space),monospace" }}>{when}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="row-act">
                      <a className="mini-btn go" href={"tel:" + l.phone} title="Call"><Ico d="phone" s={15} /></a>
                      <a className="mini-btn" href={`https://wa.me/${waNumber(l.phone)}`} target="_blank" rel="noopener noreferrer" title="WhatsApp"><Ico d="wa" s={15} /></a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {shown.length === 0 && <div className="empty"><div className="ei"><Ico d="inbox" s={26} /></div>No requests in this filter.</div>}
      </div>

      {/* lead drawer */}
      <div className={"drawer-scrim" + (active ? " open" : "")} onClick={() => setActive(null)} />
      <aside className={"drawer" + (active ? " open" : "")}>
        {active && (
          <>
            <div className="dh"><h3>Request details</h3><button className="mini-btn" onClick={() => setActive(null)}><Ico d="x" s={16} /></button></div>
            <div className="db">
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 13, background: "var(--panel-3)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 20 }}>{active.name.charAt(0)}</div>
                <div><div style={{ fontWeight: 700, fontSize: 18 }}>{active.name}</div><div style={{ color: "var(--muted)", fontFamily: "var(--font-space),monospace", fontSize: 13 }}>{active.phone}</div></div>
              </div>
              <div className="card panel" style={{ marginBottom: 16 }}>
                <Row k="Service" v={`${svc(active.service).em} ${svc(active.service).t}`} />
                <Row k="Area" v={active.area} />
                <Row k="Urgency" v={active.urgency} />
                <Row k="Status" v={active.status} />
                <Row k="Submitted" v={new Date(active.createdAt).toLocaleString()} last />
              </div>
              {active.note && (
                <div className="field"><label>Customer&apos;s note</label>
                  <div style={{ padding: 14, background: "var(--panel-2)", border: "1px solid var(--line)", borderRadius: 11, fontSize: 14.5, lineHeight: 1.55 }}>{active.note}</div>
                </div>
              )}
              <div className="field"><label>Internal note (private)</label>
                <textarea className="textarea" placeholder="Assign a technician, add a quote, etc." value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
            </div>
            <div className="df">
              <button className="btn btn--soft" style={{ flex: 1 }} onClick={() => setActive(null)}>Cancel</button>
              <button className="btn btn--primary" style={{ flex: 1 }} onClick={saveNote} disabled={busy}><Ico d="check" s={16} /> {busy ? "Saving…" : "Save note"}</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function Row({ k, v, last }: { k: string; v: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: last ? "none" : "1px solid var(--line)", fontSize: 14 }}>
      <span style={{ color: "var(--muted)" }}>{k}</span>
      <span style={{ fontWeight: 600 }}>{v}</span>
    </div>
  );
}
