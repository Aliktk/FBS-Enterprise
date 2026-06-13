import { BRAND } from "@/lib/constants";

/** "The vision" platform teaser with rotating technician nodes. */
export function NetworkSection() {
  const nodes = ["❄", "☀", "⚡", "📹", "🔧", "🔥", "🔌", "🛠"];
  return (
    <section className="section network" id="network">
      <div className="wrap netgrid">
        <div>
          <div className="eyebrow reveal"><span className="n">THE VISION</span><span className="ln"></span></div>
          <h2 className="h2 reveal d1">One app.<br /><span className="em">Every technician.</span></h2>
          <p className="lead reveal d2">
            Today it&apos;s {BRAND.short.charAt(0) + BRAND.short.slice(1).toLowerCase()}&apos;s own team. Tomorrow it&apos;s a verified network — a
            marketplace where any trusted technician across KPK takes jobs, and every customer tracks the fix like a food order.
          </p>
          <div className="roadmap">
            <div className="rm reveal d2"><div className="ph">NOW</div><div className="tx"><h4>Book &amp; track a fix</h4><p>Request any service, get a live status from dispatch to done.</p></div></div>
            <div className="rm reveal d3"><div className="ph">NEXT</div><div className="tx"><h4>Verified technician network</h4><p>Onboard vetted pros city-by-city. Ratings, warranties, instant dispatch.</p></div></div>
            <div className="rm soon reveal d4"><div className="ph">LATER</div><div className="tx"><h4>Appliance &amp; parts delivery</h4><p>Order ACs, inverters, batteries &amp; spares — delivered and installed.</p></div></div>
          </div>
        </div>
        <div className="netviz reveal d2">
          <div className="ring" style={{ width: "78%", height: "78%" }}></div>
          <div className="ring" style={{ width: "52%", height: "52%" }}></div>
          <div className="core">NEXVOLT<br />HUB</div>
          <div className="spin">
            {nodes.slice(0, 4).map((n, i) => {
              const a = (i / 4) * 360;
              return <div className="node" key={i} style={{ transform: `rotate(${a}deg) translateX(140px) rotate(${-a}deg)` }}>{n}</div>;
            })}
          </div>
          <div className="spin rev">
            {nodes.slice(4).map((n, i) => {
              const a = (i / 4) * 360 + 45;
              return <div className="node" key={i} style={{ transform: `rotate(${a}deg) translateX(96px) rotate(${-a}deg)` }}>{n}</div>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
