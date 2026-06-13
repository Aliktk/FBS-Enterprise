import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${BRAND.name} — ${BRAND.tagline}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #070A12 0%, #0B1020 55%, #15294B 100%)",
          color: "#F5F2EA",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#FFB25C", fontSize: 30, letterSpacing: 6 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid #FF7A1A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>⚡</div>
          {BRAND.short} · {BRAND.city}
        </div>
        <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.0, marginTop: 28 }}>Whatever breaks,</div>
        <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.0, color: "#FF7A1A" }}>we fix it.</div>
        <div style={{ fontSize: 34, color: "rgba(245,242,234,0.65)", marginTop: 30, maxWidth: 900 }}>
          AC · Solar · UPS · Electrical · CCTV · Plumbing · Welding — booked like you order food, across Peshawar.
        </div>
      </div>
    ),
    { ...size },
  );
}
