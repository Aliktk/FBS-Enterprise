import Image from "next/image";

const HERO_CHIPS = [
  { t: "AC repair", x: "4%", y: "20%", d: 0.9 },
  { t: "Solar", x: "80%", y: "14%", d: 1.05 },
  { t: "CCTV", x: "86%", y: "64%", d: 1.2 },
  { t: "Wiring", x: "2%", y: "70%", d: 1.35 },
  { t: "Plumbing", x: "70%", y: "88%", d: 1.5 },
];

function wordize(str: string, line: "l1" | "l2") {
  return str.split(" ").map((w, i) => (
    <span className="word" key={i} style={{ animationDelay: `${(line === "l2" ? 0.42 : 0.25) + i * 0.08}s` }}>
      {w}&nbsp;
    </span>
  ));
}

/** Full-height hero with mouse parallax (driven by the choreography hook). */
export function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-bg">
        <Image
          src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=1900&q=80&auto=format&fit=crop"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="orbit" data-orbit>
        {HERO_CHIPS.map((c, i) => (
          <div
            className="chip3d float"
            key={i}
            style={{ left: c.x, top: c.y, animationDelay: `${0.6 + i * 0.12}s`, "--d": c.d } as React.CSSProperties}
            data-depth={c.d}
          >
            <span className="d"></span>{c.t}
          </div>
        ))}
      </div>
      <div className="hero-stage" data-stage>
        <div className="kicker">
          <span className="ln"></span>
          <span className="label">One call · complete solution</span>
        </div>
        <h1>
          <span className="l1 display">{wordize("Whatever breaks,", "l1")}</span>
          <span className="l2 display">{wordize("we fix it.", "l2")}</span>
        </h1>
        <p className="sub">
          Cooling, power, surveillance, plumbing &amp; welding — <b>booked like you order food,</b> delivered to your door
          across Peshawar. One number. One trusted team.
        </p>
        <div className="cta">
          <a className="btn btn--fire btn--lg" href="#book"><span className="sheen"></span>Book a fix in 60s</a>
          <a className="btn btn--ghost btn--lg" href="#services">Explore services</a>
        </div>
        <div className="rotor">
          <span className="label" style={{ color: "var(--faint)" }}>Right now:</span>
          <div className="win">
            <ul>
              <li>→ AC serviced in 2 hours, every brand</li>
              <li>→ 5kW solar designed for your roof</li>
              <li>→ CCTV installed &amp; on your phone, same day</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="cue"><span>SCROLL</span><span className="ln"></span></div>
    </header>
  );
}
