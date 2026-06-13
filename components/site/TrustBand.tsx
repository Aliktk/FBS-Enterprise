"use client";
import { useEffect, useRef, useState } from "react";

function CountUp({ to, suffix = "", dur = 1400 }: { to: number; suffix?: string; dur?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - start) / dur);
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(Math.round(to * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, dur]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const ITEMS = [
  { to: 5, suffix: "+", l: "years in Peshawar" },
  { to: 1200, suffix: "+", l: "jobs delivered" },
  { to: 8, suffix: "", l: "disciplines" },
  { to: 100, suffix: "%", l: "warranted work" },
];

export function TrustBand() {
  return (
    <section className="band">
      {ITEMS.map((it, i) => (
        <div className="b reveal" key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
          <div className="n"><CountUp to={it.to} suffix={it.suffix} /></div>
          <div className="l">{it.l}</div>
        </div>
      ))}
    </section>
  );
}
