"use client";
import { useEffect, useState } from "react";

/** Fire a toast from any client component. */
export function toast(msg: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("adm-toast", { detail: msg }));
  }
}

export function Toast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const h = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      clearTimeout(t);
      t = setTimeout(() => setMsg(null), 2600);
    };
    window.addEventListener("adm-toast", h);
    return () => {
      window.removeEventListener("adm-toast", h);
      clearTimeout(t);
    };
  }, []);
  return (
    <div className={"toast" + (msg ? " show" : "")}>
      <span className="ti">✓</span>
      <span>{msg}</span>
    </div>
  );
}
