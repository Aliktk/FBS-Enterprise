"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Ico } from "./AdminIcon";
import { Toast } from "./Toast";

const NAV = [
  { href: "/admin", t: "Overview", ic: "grid" },
  { href: "/admin/leads", t: "Booking requests", ic: "inbox" },
  { href: "/admin/gallery", t: "Projects & gallery", ic: "image" },
  { href: "/admin/testimonials", t: "Testimonials", ic: "star" },
  { href: "/admin/services", t: "Services", ic: "tools" },
  { href: "/admin/settings", t: "Settings", ic: "gear" },
];

interface AdminShellProps {
  user: { name: string; email: string };
  newLeads: number;
  children: React.ReactNode;
}

export function AdminShell({ user, newLeads, children }: AdminShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const current = NAV.find((n) => isActive(n.href)) ?? NAV[0];

  return (
    <div className="adm">
      <div className="admin">
        <aside className={"side" + (open ? " open" : "")}>
          <div className="brand">
            <span className="mk">⚡</span>
            <span className="wordmark on-dark"><b>NEXVOLT</b><small>ADMIN PANEL</small></span>
          </div>
          <nav className="nav">
            <div className="grp">Manage</div>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={"navlink" + (isActive(n.href) ? " active" : "")} onClick={() => setOpen(false)}>
                <Ico d={n.ic} s={19} className="ic" />
                <span>{n.t}</span>
                {n.href === "/admin/leads" && newLeads > 0 ? <span className="ct">{newLeads}</span> : null}
              </Link>
            ))}
            <div className="grp">Site</div>
            <a className="navlink" href="/" target="_blank" rel="noopener noreferrer">
              <Ico d="ext" s={19} className="ic" /><span>View live site</span>
            </a>
          </nav>
          <div className="uwrap">
            <div className="ucard">
              <div className="av">{user.name.charAt(0).toUpperCase()}</div>
              <div className="ui"><div className="n">{user.name}</div><div className="r">Owner · Admin</div></div>
              <form action="/auth/signout" method="post">
                <button className="lo" title="Sign out" type="submit"><Ico d="logout" s={17} /></button>
              </form>
            </div>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-label="Menu"><Ico d="menu" s={20} /></button>
            <div>
              <div className="crumb">Admin / {current.t}</div>
              <h1>{current.t}</h1>
            </div>
            <div className="sp" />
            <div className="search"><Ico d="search" s={17} /><input className="input" placeholder="Search…" /></div>
            <button className="icon-btn" title="Notifications"><Ico d="bell" s={19} /><span className="ping" /></button>
          </header>
          <div className="content">{children}</div>
        </div>

        {open && <div className="drawer-scrim open" style={{ zIndex: 18 }} onClick={() => setOpen(false)} />}
      </div>
      <Toast />
    </div>
  );
}
