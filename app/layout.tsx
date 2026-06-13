import type { Metadata } from "next";
import { Anton, Sora, Space_Grotesk, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { BRAND, SITE_URL } from "@/lib/constants";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const sora = Sora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sora", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-space", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-caveat", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s — ${BRAND.name}`,
  },
  description:
    "Cooling, power, surveillance, plumbing & welding across Peshawar — booked like you order food, with a live dispatch tracker. One number, one trusted team.",
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: "One call. Complete technical solution across Peshawar & KPK.",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

// Set the persisted theme before first paint to avoid a flash. Public-site only;
// admin defines its own palette and ignores data-theme.
const themeBootstrap = `(function(){try{var t=localStorage.getItem('af_theme');if(!t){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${anton.variable} ${sora.variable} ${spaceGrotesk.variable} ${caveat.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
