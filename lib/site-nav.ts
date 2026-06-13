/** Smooth-scroll to a section id (matches the prototype's offset). Client-only. */
export function scrollToId(id: string): void {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 76;
  window.scrollTo({ top, behavior: "smooth" });
}

export function goToBook(): void {
  scrollToId("book");
}
