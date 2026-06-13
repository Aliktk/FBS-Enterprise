"use client";
import { useEffect } from "react";
import { scrollToId } from "@/lib/site-nav";

/**
 * Ports the prototype's global App() effect: scroll-driven --p / --kb,
 * mouse parallax + 3D tilt, IntersectionObserver reveals, the "Book this
 * service" click delegation, and the animation gate (.anim on .site-root).
 */
export function useCinematicChoreography() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".site-root");

    // reveal on scroll
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".reveal, [data-kinetic]").forEach((el) => io.observe(el));

    // "Book this service" -> preselect + scroll to #book
    const onClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;
      const b = target.closest<HTMLElement>("[data-book]");
      if (!b) return;
      const svc = b.getAttribute("data-service");
      if (svc) window.dispatchEvent(new CustomEvent("book-service", { detail: { service: svc } }));
      scrollToId("book");
    };
    document.addEventListener("click", onClick);

    // choreography engine
    const stage = document.querySelector<HTMLElement>("[data-stage]");
    const orbit = document.querySelector<HTMLElement>("[data-orbit]");
    const chips = orbit ? Array.from(orbit.querySelectorAll<HTMLElement>(".chip3d")) : [];
    const zoomTracks = Array.from(document.querySelectorAll<HTMLElement>("[data-zoom]"));
    const kbEls = Array.from(document.querySelectorAll<HTMLElement>("[data-kb]"));
    const tilt3d = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt3d]"));
    let mx = 0, my = 0, sy = 0, raf = 0;

    const apply = () => {
      raf = 0;
      const vh = window.innerHeight;
      if (stage) stage.style.transform = `rotateX(${-my * 3}deg) rotateY(${mx * 4}deg)`;
      chips.forEach((c) => {
        const d = parseFloat(c.dataset.depth || "1");
        c.style.translate = `${mx * 22 * d}px ${my * 18 * d - sy * 0.08 * d}px`;
      });
      zoomTracks.forEach((t) => {
        const r = t.getBoundingClientRect();
        const total = t.offsetHeight - vh;
        const scrolled = Math.min(Math.max(-r.top, 0), total);
        const p = total > 0 ? scrolled / total : 1;
        t.style.setProperty("--p", p.toFixed(4));
      });
      kbEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const d = Math.min(Math.abs(center - vh / 2) / (vh * 0.7), 1);
        el.style.setProperty("--kb", (1 - d).toFixed(3));
      });
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      tilt3d.forEach((el) => {
        el.style.setProperty("--ry", (mx * 12).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-my * 9).toFixed(2) + "deg");
      });
      queue();
    };
    const onScroll = () => {
      sy = window.scrollY;
      queue();
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();

    // animation gate — engage entrance animations once the clock advances
    const t0 = (document.timeline && document.timeline.currentTime) || 0;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const t1 = (document.timeline && document.timeline.currentTime) || 0;
        if (typeof t1 === "number" && typeof t0 === "number" && t1 > t0 + 4) {
          root?.classList.add("anim");
        }
      });
    });

    return () => {
      io.disconnect();
      document.removeEventListener("click", onClick);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}
