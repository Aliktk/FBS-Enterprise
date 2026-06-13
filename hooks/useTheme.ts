"use client";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

/** Reads the theme set by the pre-paint bootstrap script and toggles it. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") as Theme) || "dark";
    setTheme(current);
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("af_theme", next);
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return { theme, toggle };
}
