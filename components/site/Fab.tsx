import { waNumber } from "@/lib/constants";
import type { Settings } from "@/lib/types";

interface FabProps {
  settings: Settings;
}

/** Floating WhatsApp + Book buttons. */
export function Fab({ settings }: FabProps) {
  return (
    <div className="fab">
      <a className="wa" aria-label="Message us on WhatsApp" href={`https://wa.me/${waNumber(settings.whatsappNumber)}`} target="_blank" rel="noopener noreferrer">
        <span aria-hidden="true">💬</span><span className="lbl">WhatsApp</span>
      </a>
      <a className="ph" aria-label="Book a fix" href="#book"><span aria-hidden="true">📞</span><span className="lbl">Book a fix</span></a>
    </div>
  );
}
