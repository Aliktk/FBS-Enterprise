import { listAllServices } from "@/lib/db/repositories/services";
import { ServicesView } from "@/components/admin/ServicesView";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await listAllServices();
  return <ServicesView services={services} />;
}
