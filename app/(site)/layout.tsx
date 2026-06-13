import "./site.css";
import { SiteShell } from "@/components/site/SiteShell";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Fab } from "@/components/site/Fab";
import { getSettings } from "@/lib/db/repositories/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <SiteShell>
      <Nav />
      {children}
      <Footer settings={settings} />
      <Fab settings={settings} />
    </SiteShell>
  );
}
