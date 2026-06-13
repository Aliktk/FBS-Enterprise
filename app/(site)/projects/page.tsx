import type { Metadata } from "next";
import Image from "next/image";
import { listPublishedProjects } from "@/lib/db/repositories/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "Recent technical-service projects delivered across Peshawar & KPK by Nexvolt Technical Services.",
};

export default async function ProjectsPage() {
  const projects = await listPublishedProjects();
  return (
    <main className="section" style={{ paddingTop: "140px" }}>
      <div className="wrap">
        <div className="eyebrow"><span className="n">OUR WORK</span><span className="ln"></span></div>
        <h2 className="h2">Recent <span className="em">projects.</span></h2>
        <p className="lead">A selection of jobs delivered across Peshawar &amp; KPK — every one warrantied.</p>
        {projects.length === 0 ? (
          <p className="lead" style={{ marginTop: 24 }}>New projects are published here as they&apos;re completed.</p>
        ) : (
          <div className="pgrid">
            {projects.map((p) => (
              <article className="pcard" key={p.id}>
                <div className="pcard-img">
                  {p.imageUrl && <Image src={p.imageUrl} alt={p.title} fill sizes="(max-width:560px) 100vw, (max-width:880px) 50vw, 33vw" />}
                </div>
                <div className="pcard-meta">
                  <h3>{p.title}</h3>
                  <span>{p.service}{p.area ? ` · ${p.area}` : ""}{p.doneOn ? ` · ${p.doneOn}` : ""}</span>
                </div>
              </article>
            ))}
          </div>
        )}
        <div style={{ marginTop: 40 }}>
          <a className="btn btn--fire btn--lg" href="/#book"><span className="sheen"></span>Book a fix</a>
        </div>
      </div>
    </main>
  );
}
