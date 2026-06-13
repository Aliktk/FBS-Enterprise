"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ico } from "./AdminIcon";
import { toast } from "./Toast";
import { saveSettingsAction } from "@/app/admin/actions";
import type { Settings } from "@/lib/types";

function splitList(v: string): string[] {
  return v.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
}

interface SettingsFormProps {
  settings: Settings;
  adminName: string;
  adminEmail: string;
}

export function SettingsForm({ settings, adminName, adminEmail }: SettingsFormProps) {
  const router = useRouter();
  const [s, setS] = useState<Settings>(settings);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((prev) => ({ ...prev, [k]: v }));

  const save = async () => {
    setBusy(true);
    const res = await saveSettingsAction(s);
    setBusy(false);
    if (!res.ok) return toast(res.error);
    toast("Settings saved");
    router.refresh();
  };

  return (
    <div className="view">
      <div className="vhead">
        <div>
          <h2 className="vt">Business settings</h2>
          <div className="vd">These details feed the contact info shown across your website.</div>
        </div>
        <div className="toolbar"><button className="btn btn--primary" onClick={save} disabled={busy}><Ico d="check" s={17} /> {busy ? "Saving…" : "Save changes"}</button></div>
      </div>

      <div className="settings-grid">
        <div className="card panel">
          <div className="ph"><h3>Contact details</h3></div>
          <div className="field"><label>Business name</label><input className="input" value={s.businessName} onChange={(e) => set("businessName", e.target.value)} /></div>
          <div className="field"><label>Primary phone</label><input className="input" value={s.primaryPhone} onChange={(e) => set("primaryPhone", e.target.value)} /></div>
          <div className="field"><label>WhatsApp number</label><input className="input" value={s.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} /></div>
          <div className="field"><label>Email</label><input className="input" value={s.email} onChange={(e) => set("email", e.target.value)} /></div>
        </div>

        <div className="card panel">
          <div className="ph"><h3>Coverage &amp; hours</h3></div>
          <div className="field"><label>Service areas (live)</label><textarea className="textarea" value={s.serviceAreas.join(", ")} onChange={(e) => set("serviceAreas", splitList(e.target.value))} /></div>
          <div className="field"><label>Coming soon</label><input className="input" value={s.comingSoonAreas.join(", ")} onChange={(e) => set("comingSoonAreas", splitList(e.target.value))} /></div>
          <div className="set-row">
            <div className="sl"><div className="t">24/7 emergency line</div><div className="d">Show the &quot;Online · 24/7&quot; badge</div></div>
            <button className={"toggle" + (s.emergency247 ? " on" : "")} aria-label="Toggle 24/7" onClick={() => set("emergency247", !s.emergency247)} />
          </div>
        </div>

        <div className="card panel">
          <div className="ph"><h3>Social links</h3></div>
          <div className="field"><label>Facebook</label><input className="input" value={s.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} placeholder="facebook.com/…" /></div>
          <div className="field"><label>Instagram</label><input className="input" value={s.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} placeholder="instagram.com/…" /></div>
          <div className="field"><label>YouTube (job clips)</label><input className="input" value={s.youtubeUrl} onChange={(e) => set("youtubeUrl", e.target.value)} placeholder="youtube.com/@…" /></div>
        </div>

        <div className="card panel">
          <div className="ph"><h3>Admin accounts</h3></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="set-row">
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--navy)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700 }}>{adminName.charAt(0).toUpperCase()}</div>
                <div><div style={{ fontWeight: 600 }}>{adminName}</div><div style={{ color: "var(--muted)", fontSize: 12.5 }}>{adminEmail} · Owner</div></div>
              </div>
            </div>
            <div className="auth-note" style={{ marginTop: 4 }}>
              <span>🛡</span>
              <span>New admin accounts are created by your developer/DevOps team — not from this panel — so access stays secure.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
