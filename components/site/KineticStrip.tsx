import { Icon } from "./Icon";

const STRIP = [
  { name: "ac", t: "AC SERVICE" }, { name: "solar", t: "SOLAR SYSTEMS" },
  { name: "ups", t: "INVERTER · UPS" }, { name: "plug", t: "ELECTRICAL" },
  { name: "cctv", t: "CCTV · SECURITY" }, { name: "drop", t: "PLUMBING" },
  { name: "flame", t: "WELDING" }, { name: "brick", t: "CIVIL WORK" },
];

/** Infinite marquee of service tiles (CSS-animated). */
export function KineticStrip() {
  const items = [...STRIP, ...STRIP];
  return (
    <div className="kstrip" data-kstrip aria-hidden="true">
      <div className="ktrack">
        {items.map((s, i) => (
          <div className="kitem" key={i}>
            <Icon name={s.name} width="26" height="26" />
            <span className="display">{s.t}</span>
            <span className="kdot">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
