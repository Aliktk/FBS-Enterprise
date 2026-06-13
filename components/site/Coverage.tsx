interface CoverageProps {
  serviceAreas: string[];
  comingSoonAreas: string[];
}

/** Coverage radar + city tags. Pin positions are from the design; labels/tags come from settings. */
export function Coverage({ serviceAreas, comingSoonAreas }: CoverageProps) {
  const pins = [
    { x: "32%", y: "30%", t: "Hayatabad" }, { x: "60%", y: "40%", t: "Uni Town" },
    { x: "70%", y: "56%", t: "Warsak" }, { x: "46%", y: "64%", t: "Saddar" }, { x: "30%", y: "72%", t: "Tehkal" },
  ];
  return (
    <section className="section" id="coverage">
      <div className="wrap cov">
        <div>
          <div className="eyebrow reveal"><span className="n">COVERAGE</span><span className="ln"></span></div>
          <h2 className="h2 reveal d1">All of <span className="em">Peshawar.</span><br />Expanding across KPK.</h2>
          <p className="lead reveal d2">Six active zones, average response under 25 minutes inside the city, same-day dispatch beyond.</p>
          <div className="citywrap reveal d3">
            {serviceAreas.map((c) => (
              <span className="citytag" key={c}><i></i>{c}</span>
            ))}
            {comingSoonAreas.map((c) => (
              <span className="citytag soon" key={c}><i></i>{c} · soon</span>
            ))}
          </div>
        </div>
        <div className="radar reveal d2">
          <div className="sweep"></div>
          {pins.map((p, i) => (
            <div className="pin" key={i} style={{ left: p.x, top: p.y }}><span>{p.t}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}
