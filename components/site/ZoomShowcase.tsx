import { Icon } from "./Icon";

const RING = [
  { name: "ac", t: "AC" }, { name: "solar", t: "Solar" }, { name: "bolt", t: "Power" },
  { name: "ups", t: "UPS" }, { name: "cctv", t: "CCTV" }, { name: "plug", t: "Wiring" },
  { name: "drop", t: "Plumbing" }, { name: "flame", t: "Welding" },
];

/** Pinned zoom-to-reveal: 3D icon ring + kinetic headline (scroll-driven --p). */
export function ZoomShowcase() {
  return (
    <section className="zoom-track" data-zoom id="showcase">
      <div className="zoom-sticky">
        <div className="zoom-bgword display">SERVICE</div>
        <div className="zoom-stage" data-tilt3d>
          <div className="zoom-ring">
            {RING.map((r, i) => {
              const a = (i / RING.length) * 360;
              return (
                <div className="zoom-node" key={i} style={{ "--a": a + "deg", "--i": i } as React.CSSProperties}>
                  <div className="zn-card">
                    <Icon name={r.name} width="34" height="34" />
                    <span>{r.t}</span>
                  </div>
                </div>
              );
            })}
            <div className="zoom-core">
              <Icon name="bolt" width="30" height="30" />
            </div>
          </div>
        </div>
        <div className="zoom-copy">
          <div className="eyebrow"><span className="n">EVERYTHING, ONE TEAM</span></div>
          <h2 className="kinetic display" data-kinetic>
            {"EIGHT TRADES.".split("").map((c, i) => (
              <span key={i} style={{ "--k": i } as React.CSSProperties}>{c === " " ? " " : c}</span>
            ))}
            <br />
            {"ONE NUMBER.".split("").map((c, i) => (
              <span key={i} style={{ "--k": i + 14 } as React.CSSProperties}>{c === " " ? " " : c}</span>
            ))}
          </h2>
          <p className="zoom-sub">Scroll — and watch every service we do snap into focus.</p>
        </div>
        <div className="zoom-cue mono">SCROLL TO ZOOM ↓</div>
      </div>
    </section>
  );
}
