"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ico } from "./AdminIcon";
import { toast } from "./Toast";
import { createTestimonialAction, toggleTestimonialPublishedAction, deleteTestimonialAction } from "@/app/admin/actions";
import type { Testimonial } from "@/lib/types";

interface Draft { name: string; meta: string; stars: number; quote: string; published: boolean; }

export function TestimonialsView({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({ name: "", meta: "", stars: 5, quote: "", published: true });
  const [busy, setBusy] = useState(false);

  const startAdd = () => {
    setDraft({ name: "", meta: "", stars: 5, quote: "", published: true });
    setOpen(true);
  };

  const save = async () => {
    if (!draft.name || !draft.quote) return toast("Name and review text are required");
    setBusy(true);
    const res = await createTestimonialAction(draft);
    setBusy(false);
    if (!res.ok) return toast(res.error);
    toast(draft.published ? "Testimonial published" : "Testimonial saved");
    setOpen(false);
    router.refresh();
  };

  const togglePub = async (t: Testimonial) => {
    const res = await toggleTestimonialPublishedAction(t.id, !t.published);
    if (!res.ok) return toast(res.error);
    router.refresh();
  };

  const del = async (id: string) => {
    const res = await deleteTestimonialAction(id);
    if (!res.ok) return toast(res.error);
    toast("Testimonial removed");
    router.refresh();
  };

  return (
    <div className="view">
      <div className="vhead">
        <div>
          <h2 className="vt">Customer testimonials</h2>
          <div className="vd">Approve and publish reviews to show on the live site.</div>
        </div>
        <div className="toolbar"><button className="btn btn--primary" onClick={startAdd}><Ico d="plus" s={17} /> Add testimonial</button></div>
      </div>

      <div className="tlist">
        {testimonials.map((t) => (
          <div className="card tcard" key={t.id}>
            <div className="tact">
              {t.published
                ? <span className="badge badge--good"><span className="dot" />LIVE</span>
                : <span className="badge badge--muted"><span className="dot" />HIDDEN</span>}
            </div>
            <div className="stars">{"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}</div>
            <div className="quote">&quot;{t.quote}&quot;</div>
            <div className="who">
              <div className="av">{t.name.charAt(0)}</div>
              <div className="meta" style={{ flex: 1 }}><div className="n">{t.name}</div><div className="s">{t.meta}</div></div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="mini-btn" title={t.published ? "Hide" : "Publish"} onClick={() => togglePub(t)}><Ico d={t.published ? "eyeoff" : "eye"} s={15} /></button>
                <button className="mini-btn" title="Delete" onClick={() => del(t.id)}><Ico d="trash" s={15} /></button>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && <div className="empty"><div className="ei"><Ico d="star" s={26} /></div>No testimonials yet.</div>}
      </div>

      <div className={"drawer-scrim" + (open ? " open" : "")} onClick={() => setOpen(false)} />
      <aside className={"drawer" + (open ? " open" : "")}>
        {open && (
          <>
            <div className="dh"><h3>Add testimonial</h3><button className="mini-btn" onClick={() => setOpen(false)}><Ico d="x" s={16} /></button></div>
            <div className="db">
              <div className="field"><label>Customer name <span className="req">*</span></label><input className="input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Ahmed K." /></div>
              <div className="field"><label>Detail (area · service)</label><input className="input" value={draft.meta} onChange={(e) => setDraft({ ...draft, meta: e.target.value })} placeholder="Hayatabad · AC repair" /></div>
              <div className="field"><label>Rating</label>
                <div style={{ display: "flex", gap: 6, fontSize: 26, cursor: "pointer" }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} onClick={() => setDraft({ ...draft, stars: n })} style={{ color: n <= draft.stars ? "var(--orange)" : "var(--line-2)" }}>★</span>
                  ))}
                </div>
              </div>
              <div className="field"><label>Review text <span className="req">*</span></label><textarea className="textarea" value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} placeholder="What did the customer say?" /></div>
              <label className="checkline"><input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Publish to live site immediately</label>
            </div>
            <div className="df">
              <button className="btn btn--soft" style={{ flex: 1 }} onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn btn--primary" style={{ flex: 1 }} onClick={save} disabled={busy}><Ico d="check" s={16} /> {busy ? "Saving…" : "Save & publish"}</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
