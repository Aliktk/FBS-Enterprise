"use client";
import { useCallback, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

/** Custom event fired on toggle so all `useTheme` consumers re-read in sync. */
const THEME_EVENT = "af-theme-change";

function subscribe(callback: () => void): () => void {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}

/** Client snapshot: the theme the pre-paint bootstrap script wrote to <html>. */
function getSnapshot(): Theme {
  return (document.documentElement.getAttribute("data-theme") as Theme) || "dark";
}

/** Server snapshot: matches the SSR default so hydration never mismatches. */
function getServerSnapshot(): Theme {
  return "dark";
}

/**
 * Reads the theme set by the pre-paint bootstrap script and toggles it.
 * Uses useSyncExternalStore so the DOM attribute is the single source of
 * truth — no setState-in-effect and no hydration mismatch.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("af_theme", next);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, [theme]);

  return { theme, toggle };
}
