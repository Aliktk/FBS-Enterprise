import Image from "next/image";
import type { ReactNode } from "react";

/* ---- scene VFX ---- */
function Frost() {
  return (
    <div className="vfx vfx-frost">
      {Array.from({ length: 14 }).map((_, i) => (
        <span className="frostbit" key={i} style={{
          left: `${(i * 7 + 5) % 100}%`,
          animationDuration: `${4 + (i % 5)}s`,
          animationDelay: `${(i % 7) * 0.5}s`,
          bottom: "20%",
        }} />
      ))}
    </div>
  );
}
function Sun() {
  return <div className="vfx"><span className="sun" /></div>;
}
function Arc() {
  return (
    <div className="vfx">
      <svg className="arc" viewBox="0 0 400 400" preserveAspectRatio="none">
        <path d="M40 200 L120 180 L150 240 L210 150 L260 230 L320 170 L370 210" pathLength="1" />
        <path d="M40 280 L110 300 L160 250 L230 320 L300 260 L360 300" pathLength="1" style={{ animationDelay: "1.1s" }} />
      </svg>
    </div>
  );
}
function Scan() {
  return (
    <div className="vfx">
      <span className="scanline" />
      <span className="scanline" style={{ animationDelay: "1.7s" }} />
    </div>
  );
}
function Sparks() {
  return (
    <div className="vfx" style={{ left: "24%", top: "64%" }}>
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <span className="spark" key={i} style={{
          "--dx": `${Math.cos(a) * (40 + (i % 4) * 18)}px`,
          "--dy": `${Math.sin(a) * (40 + (i % 4) * 18) - 20}px`,
          animationDuration: `${0.8 + (i % 5) * 0.18}s`,
          animationDelay: `${(i % 6) * 0.25}s`,
        } as React.CSSProperties} />;
      })}
    </div>
  );
}

interface Chapter {
  id: string; svc: string; no: string; word: string; ic: string; flip: boolean; isNew?: boolean;
  title: ReactNode; body: string; stats: { n: string; l: string }[];
  src: string; ph: string; loc: string; grad: string; vfx: ReactNode;
}

const CHAPTERS: Chapter[] = [
  { id: "cool", svc: "ac", no: "01 / COOL", word: "COOL", ic: "❄", flip: false,
    title: <>Beat the <span className="em">heat.</span></>,
    body: "All-brand AC installation, gas charging, servicing and repair — Haier, Gree, Dawlance, Orient, Mitsubishi. We arrive fast and leave you cold.",
    stats: [{ n: "2 hr", l: "avg response" }, { n: "90 day", l: "service warranty" }],
    ph: "AC / cooling", vfx: <Frost />,
    src: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=1400&q=80&auto=format&fit=crop",
    loc: "Recent: AC service · University Town",
    grad: "linear-gradient(160deg,#0b2a3a,#0a1530 60%)" },
  { id: "power", svc: "solar", no: "02 / POWER", word: "POWER", ic: "☀", flip: true,
    title: <>Make your own <span className="em">power.</span></>,
    body: "On-grid, off-grid and hybrid solar — sized for your roof, your load and your bill. We handle the panels, the inverter and the net-metering paperwork.",
    stats: [{ n: "80%", l: "avg bill cut" }, { n: "25 yr", l: "panel warranty" }],
    ph: "solar / rooftop",
    src: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=1400&q=80&auto=format&fit=crop",
    loc: "Recent: 5kW solar · Hayatabad", vfx: <Sun />,
    grad: "linear-gradient(180deg,#3a1f0a,#ff7a1a 70%,#15294b)" },
  { id: "current", svc: "elec", no: "03 / CURRENT", word: "CURRENT", ic: "⚡", flip: false,
    title: <>The backbone of every <span className="em">building.</span></>,
    body: "House wiring, DB installation, fault-finding, switchboards — plus inverter & UPS install, repair and maintenance. Code-compliant, every time.",
    stats: [{ n: "1,200+", l: "homes wired" }, { n: "100%", l: "compliant" }],
    ph: "wiring / electrical", vfx: <Arc />,
    src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1400&q=80&auto=format&fit=crop",
    loc: "Recent: DB rewire · Saddar",
    grad: "linear-gradient(150deg,#0a1530,#0b1d3a)" },
  { id: "watch", svc: "cctv", no: "04 / WATCH", word: "WATCH", ic: "📹", flip: true,
    title: <>Eyes on your <span className="em">property.</span></>,
    body: "CCTV and IP camera installation, NVR setup and electronics repair. We don’t leave until the feed is live on your phone — clearly, from anywhere.",
    stats: [{ n: "4K", l: "support" }, { n: "App", l: "remote view" }],
    ph: "CCTV / camera", vfx: <Scan />,
    src: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1400&q=80&auto=format&fit=crop",
    loc: "Recent: 8-cam setup · Warsak",
    grad: "linear-gradient(150deg,#070a12,#0d1426)" },
  { id: "build", svc: "plumb", no: "05 / BUILD", word: "BUILD", ic: "🔧", flip: false, isNew: true,
    title: <>And we <span className="em">build</span> what needs building.</>,
    body: "New for 2026 — plumbing (pipes, fixtures, leaks), welding (grills, gates, custom fabrication) and small civil work. The same standards, the same warranties.",
    stats: [{ n: "3", l: "new trades" }, { n: "1", l: "team" }],
    ph: "welding / plumbing", vfx: <Sparks />,
    src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1400&q=80&auto=format&fit=crop",
    loc: "Recent: custom gate · Tehkal",
    grad: "linear-gradient(150deg,#2a1206,#0b1020)" },
];

interface ServiceChaptersProps {
  enabledKeys: string[];
}

/** 5 service chapters; a chapter shows only if its mapped service is enabled. */
export function ServiceChapters({ enabledKeys }: ServiceChaptersProps) {
  const enabled = new Set(enabledKeys);
  const chapters = CHAPTERS.filter((c) => enabled.size === 0 || enabled.has(c.svc));
  return (
    <section className="chapters" id="services">
      {chapters.map((c) => (
        <div className={"chapter" + (c.flip ? " flip" : "")} key={c.id}>
          <div className="scene reveal" data-kb style={{ background: c.grad }}>
            <div className="scene-img">
              <Image src={c.src} alt={c.ph} fill sizes="(max-width:880px) 100vw, 50vw" />
            </div>
            {c.vfx}
            <div className="gloss"></div>
            <div className="tagno mono">{c.no}</div>
            <div className="scene-loc mono"><i></i>{c.loc}</div>
            <div className="bigword">{c.word}</div>
          </div>
          <div className="copy">
            <div className="ic reveal">{c.ic}</div>
            <h3 className="reveal d1">{c.title}{c.isNew && <span className="newtag">NEW</span>}</h3>
            <p className="reveal d2">{c.body}</p>
            <div className="stats reveal d3">
              {c.stats.map((s, i) => (
                <div className="s" key={i}><div className="n">{s.n}</div><div className="l">{s.l}</div></div>
              ))}
            </div>
            <div className="row reveal d4">
              <button className="btn btn--fire" data-book data-service={c.svc}><span className="sheen"></span>Book this service</button>
              <a className="btn btn--ghost" href="#book">How it works</a>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
