"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInAction, resetPasswordAction } from "./actions";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setOk("");
    if (!email || !password) return setErr("Please enter your email and password.");
    setBusy(true);
    const res = await signInAction(email, password);
    if (!res.ok) {
      setBusy(false);
      return setErr(res.error);
    }
    router.replace(redirectTo || "/admin");
    router.refresh();
  };

  const forgot = async () => {
    setErr(""); setOk("");
    const res = await resetPasswordAction(email);
    if (!res.ok) return setErr(res.error);
    setOk("If that email has an account, a reset link is on its way.");
  };

  return (
    <form className="auth-card" onSubmit={submit} autoComplete="on">
      <div className="head">
        <div className="mini">
          <span className="mk">⚡</span>
          <span className="wordmark"><b>NEXVOLT</b><small>TECHNICAL · ADMIN</small></span>
        </div>
        <h2>Welcome back</h2>
        <div className="sub">Sign in to your admin dashboard.</div>
      </div>

      {err && (
        <div className="auth-err">
          <span>⚠</span><span>{err}</span>
        </div>
      )}
      {ok && (
        <div className="auth-ok">
          <span>✓</span><span>{ok}</span>
        </div>
      )}

      <div className="field">
        <label htmlFor="email">Email address</label>
        <div className="input-group">
          <input
            className="input"
            type="email"
            id="email"
            name="email"
            placeholder="owner@nexvolt.pk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <div className="input-group">
          <input
            className="input"
            type={show ? "text" : "password"}
            id="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="button" className="ig-btn" aria-label="Show password" onClick={() => setShow((s) => !s)}>
            {show ? "🙈" : "👁"}
          </button>
        </div>
      </div>

      <div className="auth-rowx">
        <label className="checkline"><input type="checkbox" defaultChecked /> Keep me signed in</label>
        <button type="button" className="linklike" onClick={forgot}>Forgot password?</button>
      </div>

      <button type="submit" className="btn btn--primary btn--block" style={{ padding: "13px" }} disabled={busy}>
        {busy ? "Signing in…" : "Sign in to dashboard"}
      </button>

      <div className="auth-note">
        <span>🛡</span>
        <span><b>Accounts are created by your administrator.</b> There&apos;s no public sign-up — your DevOps/admin issues credentials. Need access? Ask your administrator to add you.</span>
      </div>

      <div className="foot-mini">SECURED ADMIN ACCESS · v2026.06</div>
    </form>
  );
}
