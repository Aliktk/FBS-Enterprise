/** Admin stroke icons (ported from the prototype's admin-data.jsx IC + Ico). */
const IC: Record<string, string> = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  inbox: "M3 13h4l2 3h6l2-3h4 M5 5h14l3 8v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-5z",
  image: "M3 4.5h18v15H3z M8.5 9.5a1.5 1.5 0 1 0 0-.01 M4 17l5-4.5 4 3.5 3-2.5 4 4",
  star: "M12 3l2.7 5.8 6.3.8-4.6 4.3 1.2 6.3L12 17.7 6.4 20l1.2-6.3L3 9.4l6.3-.8z",
  tools: "M14.5 5.5a3.5 3.5 0 0 0-4.6 4.4L3 16.8 6.2 20l6.9-6.9a3.5 3.5 0 0 0 4.4-4.6l-2.4 2.4-2-2 2.4-2.4z",
  gear: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6a7 7 0 0 0 .1-1z",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-3.5-3.5",
  bell: "M18 9a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8 M13.7 21a2 2 0 0 1-3.4 0",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  eyeoff: "M9.9 5.2A10 10 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3 3.9M6 6.5A18 18 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 4-.8 M4 4l16 16 M9.5 9.6a3 3 0 0 0 4.2 4.2",
  edit: "M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  trash: "M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
  check: "M20 6 9 17l-5-5",
  x: "M18 6 6 18 M6 6l12 12",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
  plus: "M12 5v14 M5 12h14",
  up: "M12 19V5 M5 12l7-7 7 7",
  drag: "M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01",
  ext: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14 21 3",
  menu: "M3 6h18M3 12h18M3 18h18",
  clock: "M12 7v5l3 2 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  mappin: "M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 9l5-5 5 5 M12 4v12",
  chevron: "M9 18l6-6-6-6",
  wa: "M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5z",
  shield: "M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z",
};

interface IcoProps {
  d: keyof typeof IC | string;
  s?: number;
  sw?: number;
  className?: string;
  color?: string;
}

export function Ico({ d, s = 20, sw = 1.7, className, color }: IcoProps) {
  const path = IC[d] ?? d;
  return (
    <svg
      viewBox="0 0 24 24"
      width={s}
      height={s}
      fill="none"
      stroke={color ?? "currentColor"}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {path.split(" M").map((seg, i) => (
        <path key={i} d={(i ? "M" : "") + seg} />
      ))}
    </svg>
  );
}
