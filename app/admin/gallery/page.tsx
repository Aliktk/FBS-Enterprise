import { listAllProjects } from "@/lib/db/repositories/projects";
import { GalleryView } from "@/components/admin/GalleryView";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const projects = await listAllProjects();
  return <GalleryView projects={projects} />;
}
