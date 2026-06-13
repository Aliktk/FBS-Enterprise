"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { BRAND } from "@/lib/constants";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#book", label: "Book" },
  { href: "#network", label: "Network" },
  { href: "#coverage", label: "Coverage" },
];

/** Fixed nav — solid on scroll, theme toggle, and a mobile hamburger menu. */
export function Nav() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { toggle } = useTheme();

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", f, { passive: true });
    f();
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <nav className={"nav" + (solid ? " solid" : "")}>
      <a className="brand" href="#top">
        <span className="mk">⚡</span>
        <span className="nm"><b>{BRAND.short}</b><small>TECHNICAL · {BRAND.city}</small></span>
      </a>
      <div className="links">
        {LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
      </div>
      <div className="spacer"></div>
      <button className="theme-tog" onClick={toggle} aria-label="Toggle theme" title="Toggle light / dark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        <span className="lbl-l">Light</span><span className="lbl-d">Dark</span>
      </button>
      <div className="status"><i></i> Online · 24/7</div>
      <a className="btn btn--fire btn--sm" href="#book"><span className="sheen"></span>📞 Book a fix</a>
      <button
        className="nav-burger"
        aria-label="Menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
        </svg>
      </button>
      {menuOpen && (
        <div className="nav-mobile" onClick={() => setMenuOpen(false)}>
          {LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          <a href="/projects">Projects</a>
          <a href="#book">📞 Book a fix</a>
        </div>
      )}
    </nav>
  );
}
