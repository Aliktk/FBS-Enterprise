"use client";
import { useCinematicChoreography } from "@/hooks/useCinematicChoreography";

/** Client wrapper: ambient background + the scroll/mouse choreography engine. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  useCinematicChoreography();
  return (
    <div className="site-root">
      <div className="atmos" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />
      <div id="app">{children}</div>
    </div>
  );
}
