import type { SVGProps } from "react";

/** Clean 24×24 stroke icons (ported from the prototype's showcase.jsx ICONS). */
const ICONS: Record<string, React.ReactNode> = {
  ac: (<g><rect x="2.5" y="4" width="19" height="9" rx="2.2" /><path d="M5.5 9.5h13" /><path d="M6 16c0 1.6 1 2 1 3.5M12 16c0 1.6-1 2-1 3.5M18 16c0 1.6 1 2 1 3.5" /></g>),
  solar: (<g><rect x="3" y="4" width="18" height="11" rx="1" /><path d="M3 7.7h18M3 11.3h18M9 4v11M15 4v11" /><path d="M12 15v5M8 20h8" /></g>),
  bolt: (<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />),
  ups: (<g><rect x="3.5" y="6" width="17" height="12" rx="1.6" /><path d="M7 6V4h4v2" /><path d="M10 9 8 13h3l-1.5 3" /><path d="M15 10v4M17.5 11.5h-5" /></g>),
  cctv: (<g><rect x="3" y="6" width="13" height="6" rx="1.6" transform="rotate(-12 9.5 9)" /><circle cx="6.5" cy="8.5" r="1.3" /><path d="M16 8.5 21 7v5l-5-1.5" /><path d="M9 13.5 8 21M8 21h6" /></g>),
  wrench: (<path d="M15.5 4.5a4 4 0 0 0-5 5L4 16l4 4 6.5-6.5a4 4 0 0 0 5-5l-2.7 2.7-2.3-.6-.6-2.3 2.7-2.7z" />),
  flame: (<path d="M12 3c1 3.5 4.5 4.5 4.5 8.5A4.5 4.5 0 0 1 12 21a4.5 4.5 0 0 1-4.5-4.5C7.5 13 9 12 9.5 10c1.2.8 1.8 2 1.8 2C12 11 11 7 12 3z" />),
  drop: (<path d="M12 3c3 4 5.5 6.5 5.5 10a5.5 5.5 0 1 1-11 0C6.5 9.5 9 7 12 3z" />),
  brick: (<g><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3 9.7h18M3 14.3h18M9 5v4.7M15 9.7v4.6M9 14.3V19" /></g>),
  plug: (<g><path d="M9 2v5M15 2v5" /><path d="M6.5 7h11v3a5.5 5.5 0 0 1-11 0z" /><path d="M12 16v6" /></g>),
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: keyof typeof ICONS | string;
}

export function Icon({ name, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {ICONS[name] ?? ICONS.bolt}
    </svg>
  );
}
