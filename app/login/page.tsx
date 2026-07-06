import type { Metadata } from "next";
import "../admin/admin.css";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectTo = redirect && redirect.startsWith("/admin") ? redirect : "/admin";

  return (
    <div className="adm">
      <div className="auth">
        <aside className="auth-brand">
          <div className="grid-tex" />
          <div className="top">
            <span className="mk lg">⚡</span>
            <span className="wordmark on-dark"><b>FBS</b><small>TECHNICAL · ADMIN</small></span>
          </div>
          <div className="mid">
            <h1>Run your<br /><span className="o">business</span><br />from one screen.</h1>
            <p>Publish projects, manage leads, update services and post customer reviews — no code, no developer, no waiting.</p>
            <div className="feats">
              <div className="feat"><span className="fic">🖼</span> Publish job photos to the live site instantly</div>
              <div className="feat"><span className="fic">📥</span> See every booking request the moment it arrives</div>
              <div className="feat"><span className="fic">★</span> Add &amp; approve customer testimonials</div>
            </div>
          </div>
          <div className="btm">© 2026 Farhan Business Solution Enterprise · Peshawar, KPK</div>
        </aside>

        <main className="auth-form">
          <LoginForm redirectTo={redirectTo} />
        </main>
      </div>
    </div>
  );
}
