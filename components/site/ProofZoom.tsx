import Image from "next/image";
import type { Project } from "@/lib/types";

const FALLBACK = [
  { k: "SOLAR", c: "5kW install · Hayatabad", img: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=900&q=80&auto=format&fit=crop" },
  { k: "WIRING", c: "DB rewire · Saddar", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80&auto=format&fit=crop" },
  { k: "CCTV", c: "8-cam setup · Warsak", img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=900&q=80&auto=format&fit=crop" },
  { k: "WELDING", c: "Custom gate · Tehkal", img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900&q=80&auto=format&fit=crop" },
  { k: "PLUMBING", c: "Bathroom refit · Gulberg", img: "https://images.unsplash.com/photo-1542013936693-884638332954?w=900&q=80&auto=format&fit=crop" },
  { k: "ELECTRONICS", c: "Board repair · Uni Town", img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=900&q=80&auto=format&fit=crop" },
];

interface ProofZoomProps {
  projects: Project[];
}

/** Pinned scroll-zoom mosaic of real project photos. */
export function ProofZoom({ projects }: ProofZoomProps) {
  const tiles =
    projects.length >= 3
      ? projects.slice(0, 6).map((p) => ({
          k: (p.service || "WORK").toUpperCase(),
          c: `${p.title}${p.area ? " · " + p.area : ""}`,
          img: p.imageUrl || FALLBACK[0].img,
        }))
      : FALLBACK;

  return (
    <section className="proof-track" data-zoom id="work">
      <div className="proof-sticky">
        <div className="proof-head">
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            <span className="ln"></span><span className="n">PROOF IN THE FIELD</span><span className="ln"></span>
          </div>
          <h2 className="h2">Real work. <span className="em">Real warranties.</span></h2>
        </div>
        <div className="proof-mosaic">
          {tiles.map((p, i) => (
            <div className="ptile" key={i}>
              <Image src={p.img} alt={p.c} fill sizes="(max-width:680px) 50vw, 33vw" />
              <div className="cap"><b>{p.k}</b>{p.c}</div>
            </div>
          ))}
        </div>
        <div className="proof-cue mono">SCROLL · every job, warrantied</div>
      </div>
    </section>
  );
}
