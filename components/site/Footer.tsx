import { waNumber } from "@/lib/constants";
import type { Settings } from "@/lib/types";

interface FooterProps {
  settings: Settings;
}

export function Footer({ settings }: FooterProps) {
  const wa = `https://wa.me/${waNumber(settings.whatsappNumber)}`;
  const year = 2026;
  return (
    <footer className="foot" id="contact">
      <div className="foot-grid">
        <div>
          <div className="big">{settings.businessName}</div>
          <p>Cooling. Power. Technology — and everything in between, under one roof across Peshawar &amp; KPK.</p>
          <p style={{ color: "var(--orange-2)", marginTop: "10px" }}>
            {settings.primaryPhone} · {settings.email}
          </p>
        </div>
        <div>
          <h4>Services</h4>
          <a href="#services">AC &amp; cooling</a><a href="#services">Solar systems</a><a href="#services">Electrical</a>
          <a href="#services">CCTV</a><a href="#services">Plumbing</a><a href="#services">Welding</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="#network">The vision</a><a href="#coverage">Coverage</a><a href="#book">Book a fix</a><a href="#contact">Contact</a>
          <a href="/login" style={{ color: "var(--orange-2)" }}>Staff login →</a>
        </div>
        <div>
          <h4>Connect</h4>
          <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href={settings.facebookUrl || "#"} target={settings.facebookUrl ? "_blank" : undefined} rel="noopener noreferrer">Facebook</a>
          <a href={settings.instagramUrl || "#"} target={settings.instagramUrl ? "_blank" : undefined} rel="noopener noreferrer">Instagram</a>
          <a href={settings.youtubeUrl || "#"} target={settings.youtubeUrl ? "_blank" : undefined} rel="noopener noreferrer">YouTube</a>
        </div>
      </div>
      <div className="copy">
        <span>© {year} {settings.businessName.toUpperCase()} · PESHAWAR · KPK</span>
        <span>BUILT FOR THE NETWORK TO COME</span>
      </div>
    </footer>
  );
}
