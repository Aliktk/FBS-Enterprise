import { Hero } from "@/components/site/Hero";
import { ZoomShowcase } from "@/components/site/ZoomShowcase";
import { KineticStrip } from "@/components/site/KineticStrip";
import { ServiceChapters } from "@/components/site/ServiceChapters";
import { ProofZoom } from "@/components/site/ProofZoom";
import { BookingFlow } from "@/components/site/BookingFlow";
import { NetworkSection } from "@/components/site/NetworkSection";
import { Coverage } from "@/components/site/Coverage";
import { Testimonials } from "@/components/site/Testimonials";
import { TrustBand } from "@/components/site/TrustBand";
import { ParallaxBand } from "@/components/site/ParallaxBand";
import { FinalCTA } from "@/components/site/FinalCTA";

import { getSettings } from "@/lib/db/repositories/settings";
import { listEnabledServices } from "@/lib/db/repositories/services";
import { listPublishedProjects } from "@/lib/db/repositories/projects";
import { listPublishedTestimonials } from "@/lib/db/repositories/testimonials";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, services, projects, testimonials] = await Promise.all([
    getSettings(),
    listEnabledServices(),
    listPublishedProjects(),
    listPublishedTestimonials(),
  ]);
  const enabledKeys = services.map((s) => s.key);

  return (
    <>
      <Hero />
      <ZoomShowcase />
      <KineticStrip />
      <ServiceChapters enabledKeys={enabledKeys} />
      <ProofZoom projects={projects} />
      <BookingFlow enabledKeys={enabledKeys} areas={settings.serviceAreas} whatsapp={settings.whatsappNumber} />
      <NetworkSection />
      <Coverage serviceAreas={settings.serviceAreas} comingSoonAreas={settings.comingSoonAreas} />
      <Testimonials items={testimonials} />
      <TrustBand />
      <ParallaxBand />
      <FinalCTA settings={settings} />
    </>
  );
}
