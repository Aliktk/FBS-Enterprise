import { waNumber } from "@/lib/constants";
import type { Settings } from "@/lib/types";

interface FinalCTAProps {
  settings: Settings;
}

/** Big closing call-to-action with the business phone number. */
export function FinalCTA({ settings }: FinalCTAProps) {
  const display = settings.primaryPhone.replace(/-/g, " · ");
  return (
    <section className="final">
      <div className="ring">— ONE CALL —</div>
      <div className="num">{display}</div>
      <div className="q">&quot;Whatever it is — we fix, install, or build it.&quot;</div>
      <div className="cta">
        <a className="btn btn--fire btn--lg" href="#book"><span className="sheen"></span>Book a fix now</a>
        <a className="btn btn--ghost btn--lg" href={`https://wa.me/${waNumber(settings.whatsappNumber)}`} target="_blank" rel="noopener noreferrer">💬 WhatsApp us</a>
      </div>
    </section>
  );
}
