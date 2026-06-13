"use client";
import { useRef, useState } from "react";
import { Ico } from "./AdminIcon";
import { toast } from "./Toast";
import { toggleServiceAction, reorderServicesAction } from "@/app/admin/actions";
import type { Service } from "@/lib/types";

export function ServicesView({ services }: { services: Service[] }) {
  const [list, setList] = useState<Service[]>(services);
  const dragIdx = useRef<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const toggle = async (svc: Service) => {
    setList((prev) => prev.map((s) => (s.id === svc.id ? { ...s, enabled: !s.enabled } : s)));
    const res = await toggleServiceAction(svc.id, !svc.enabled);
    if (!res.ok) {
      setList((prev) => prev.map((s) => (s.id === svc.id ? { ...s, enabled: svc.enabled } : s)));
      toast(res.error);
    }
  };

  const onDrop = async (i: number) => {
    const from = dragIdx.current;
    dragIdx.current = null;
    setOverIdx(null);
    if (from === null || from === i) return;
    const next = [...list];
    const [moved] = next.splice(from, 1);
    next.splice(i, 0, moved);
    setList(next);
    const res = await reorderServicesAction(next.map((s) => s.id));
    if (!res.ok) toast(res.error);
    else toast("Order saved");
  };

  return (
    <div className="view">
      <div className="vhead">
        <div>
          <h2 className="vt">Services</h2>
          <div className="vd">Drag to reorder. Toggle to show/hide on the website.</div>
        </div>
      </div>
      <div className="card panel">
        <div className="slist">
          {list.map((s, i) => (
            <div
              className={"srow" + (overIdx === i ? " drop-over" : "")}
              key={s.id}
              draggable
              onDragStart={() => { dragIdx.current = i; }}
              onDragOver={(e) => { e.preventDefault(); setOverIdx(i); }}
              onDragLeave={() => setOverIdx((v) => (v === i ? null : v))}
              onDrop={() => onDrop(i)}
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              <span className="drag-h" title="Drag to reorder"><Ico d="drag" s={18} /></span>
              <span className="se">{s.emoji}</span>
              <div className="sinfo">
                <div className="st">{s.title}{s.isNew && <span className="badge badge--new"><span className="dot" />NEW</span>}</div>
                <div className="sd">{s.description}</div>
              </div>
              <span style={{ fontSize: 12.5, color: s.enabled ? "var(--good)" : "var(--faint)", fontFamily: "var(--font-space),monospace", marginRight: 4 }}>
                {s.enabled ? "Visible" : "Hidden"}
              </span>
              <button className={"toggle" + (s.enabled ? " on" : "")} aria-label={`Toggle ${s.title}`} aria-pressed={s.enabled} onClick={() => toggle(s)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
