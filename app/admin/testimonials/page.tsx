import { listAllTestimonials } from "@/lib/db/repositories/testimonials";
import { TestimonialsView } from "@/components/admin/TestimonialsView";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const testimonials = await listAllTestimonials();
  return <TestimonialsView testimonials={testimonials} />;
}
