"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ico } from "./AdminIcon";
import { toast } from "./Toast";
import { createProjectAction, toggleProjectPublishedAction, deleteProjectAction } from "@/app/admin/actions";
import type { Project } from "@/lib/types";

const SERVICE_OPTIONS = ["AC", "Solar", "Electrical", "CCTV", "Plumbing", "Welding", "Civil"];

interface Draft {
  title: string; service: string; area: string; doneOn: string; imageUrl: string | null; published: boolean;
}

export function GalleryView({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({ title: "", service: "Solar", area: "", doneOn: "", imageUrl: null, published: true });
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);

  const startAdd = () => {
    setDraft({ title: "", service: "Solar", area: "", doneOn: "", imageUrl: null, published: true });
    setOpen(true);
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setDraft((d) => ({ ...d, imageUrl: data.url }));
      toast("Photo uploaded");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!draft.title) return toast("Add a project title");
    setBusy(true);
    const res = await createProjectAction(draft);
    setBusy(false);
    if (!res.ok) return toast(res.error);
    toast(draft.published ? "Photo published to live site" : "Photo saved as draft");
    setOpen(false);
    router.refresh();
  };

  const togglePub = async (p: Project) => {
    const res = await toggleProjectPublishedAction(p.id, !p.published);
    if (!res.ok) return toast(res.error);
    router.refresh();
  };

  const del = async (id: string) => {
    const res = await deleteProjectAction(id);
    if (!res.ok) return toast(res.error);
    toast("Project removed");
    router.refresh();
  };

  return (
    <div className="view">
      <div className="vhead">
        <div>
          <h2 className="vt">Projects &amp; gallery</h2>
          <div className="vd">Published photos appear in the gallery on your live website.</div>
        </div>
        <div className="toolbar"><button className="btn btn--primary" onClick={startAdd}><Ico d="plus" s={17} /> Add project photo</button></div>
      </div>

      <div className="gal">
        <div className="gcard add" onClick={startAdd}>
          <div className="plus">+</div>
          <div style={{ fontWeight: 600 }}>Upload a job photo</div>
          <div style={{ fontSize: 12.5 }}>JPG / PNG · drag or browse</div>
        </div>
        {projects.map((p) => (
          <div className="gcard" key={p.id}>
            <div className="ph-img" style={{ backgroundImage: p.imageUrl ? `url(${p.imageUrl})` : undefined }}>
              <div className="pub">
                {p.published
                  ? <span className="badge badge--good"><span className="dot" />LIVE</span>
                  : <span className="badge badge--muted"><span className="dot" />DRAFT</span>}
              </div>
              <div className="ov">
                <button className="mini-btn" title={p.published ? "Unpublish" : "Publish"} onClick={() => togglePub(p)}><Ico d={p.published ? "eyeoff" : "eye"} s={15} /></button>
                <button className="mini-btn" title="Delete" onClick={() => del(p.id)}><Ico d="trash" s={15} /></button>
              </div>
            </div>
            <div className="gmeta">
              <div className="gt">{p.title}</div>
              <div className="gs"><span className="badge badge--muted" style={{ padding: "2px 7px" }}>{p.service}</span> {p.area}{p.doneOn ? ` · ${p.doneOn}` : ""}</div>
            </div>
          </div>
        ))}
      </div>

      {/* add drawer */}
      <div className={"drawer-scrim" + (open ? " open" : "")} onClick={() => setOpen(false)} />
      <aside className={"drawer" + (open ? " open" : "")}>
        {open && (
          <>
            <div className="dh"><h3>Add project photo</h3><button className="mini-btn" onClick={() => setOpen(false)}><Ico d="x" s={16} /></button></div>
            <div className="db">
              <label className="dropzone" style={{ marginBottom: 18, display: "block" }}>
                <input type="file" accept="image/*" hidden onChange={onFile} />
                <div className="di"><Ico d="upload" s={24} /></div>
                <div style={{ fontWeight: 600, color: "var(--ink)" }}>{uploading ? "Uploading…" : draft.imageUrl ? "Replace photo" : "Click to browse"}</div>
                <div style={{ fontSize: 12.5, marginTop: 4 }}>JPG / PNG / WebP up to 10MB</div>
              </label>
              {draft.imageUrl && (
                <div style={{ marginBottom: 16, borderRadius: 11, overflow: "hidden", border: "1px solid var(--line)", aspectRatio: "4/3", backgroundImage: `url(${draft.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              )}
              <div className="field"><label>Project title <span className="req">*</span></label><input className="input" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. 5kW On-grid Solar" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field"><label>Service</label>
                  <select className="select" value={draft.service} onChange={(e) => setDraft({ ...draft, service: e.target.value })}>
                    {SERVICE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="field"><label>Area</label><input className="input" value={draft.area} onChange={(e) => setDraft({ ...draft, area: e.target.value })} placeholder="Hayatabad" /></div>
              </div>
              <div className="field"><label>Done on</label><input className="input" value={draft.doneOn} onChange={(e) => setDraft({ ...draft, doneOn: e.target.value })} placeholder="e.g. Jun 2026" /></div>
              <label className="checkline" style={{ marginTop: 4 }}><input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Publish to live site immediately</label>
            </div>
            <div className="df">
              <button className="btn btn--soft" style={{ flex: 1 }} onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn btn--primary" style={{ flex: 1 }} onClick={save} disabled={busy || uploading}><Ico d="check" s={16} /> {busy ? "Saving…" : "Save & publish"}</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
