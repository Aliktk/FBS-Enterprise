import type { Testimonial } from "@/lib/types";

interface TestimonialsProps {
  items: Testimonial[];
}

/** Public social-proof section, fed from published testimonials in admin. */
export function Testimonials({ items }: TestimonialsProps) {
  if (!items.length) return null;
  return (
    <section className="section testimonials" id="reviews">
      <div className="wrap">
        <div className="eyebrow reveal"><span className="ln"></span><span className="n">WHAT PESHAWAR SAYS</span><span className="ln"></span></div>
        <h2 className="h2 reveal d1">Trusted by <span className="em">your neighbours.</span></h2>
        <div className="tgrid">
          {items.slice(0, 6).map((t, i) => (
            <figure className={"tq reveal d" + ((i % 4) + 1)} key={t.id}>
              <div className="stars" aria-label={`${t.stars} out of 5 stars`}>
                {"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}
              </div>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <span className="nm">{t.name}</span>
                {t.meta && <span className="mt">{t.meta}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
