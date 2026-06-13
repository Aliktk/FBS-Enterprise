const U = (id: string, w = 1900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

/** Full-bleed parallax image band (ken-burns via --kb). */
export function ParallaxBand() {
  return (
    <section className="pband" data-kb>
      <div className="pbimg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={U("1466611653911-95081537e5b7")} alt="" />
      </div>
      <div className="pbinner">
        <div className="eyebrow" style={{ justifyContent: "center" }}>
          <span className="ln"></span><span className="n">COOLING · POWER · TECHNOLOGY</span><span className="ln"></span>
        </div>
        <h2 className="h2" style={{ maxWidth: "14ch", margin: "0 auto" }}>
          One call. <span className="em">Complete solution.</span>
        </h2>
        <p className="lead" style={{ margin: "20px auto 0", textAlign: "center" }}>
          Everything technical for your home or business — under one roof, across Peshawar &amp; KPK.
        </p>
      </div>
    </section>
  );
}
