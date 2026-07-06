"use client";
import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { BOOKING_SERVICES, URGENCY, URGENCY_LABEL, waNumber } from "@/lib/constants";
import { createLeadAction } from "@/app/(site)/actions";
import { createClient } from "@/lib/supabase/client";

const STATUS_STAGE: Record<string, number> = { new: 1, contacted: 2, scheduled: 3, done: 4 };

/** PK mobile: 10–11 digits, optional leading 0 (mirrors the server schema). */
const PHONE_RE = /^0?\d{10,11}$/;

const TRACK_STAGES = [
  { t: "Request received", s: "Logged at dispatch" },
  { t: "Technician assigned", s: "Matching nearest pro" },
  { t: "On the way", s: "Heading to your address" },
  { t: "On site · working", s: "Diagnosing & fixing" },
  { t: "Completed", s: "Warranty issued" },
];

interface BookingFlowProps {
  enabledKeys: string[];
  areas: string[];
  whatsapp: string;
}

export function BookingFlow({ enabledKeys, areas, whatsapp }: BookingFlowProps) {
  const services = BOOKING_SERVICES.filter((s) => enabledKeys.length === 0 || enabledKeys.includes(s.id));
  const areaList = areas.length ? areas : ["Hayatabad", "University Town", "Warsak Road", "Saddar", "Tehkal", "Gulberg"];

  const [step, setStep] = useState(0);
  const [service, setService] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<string>("urgent");
  const [area, setArea] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [hp, setHp] = useState(""); // honeypot — real users never fill this
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const [eta, setEta] = useState(18);
  const [van, setVan] = useState({ x: 14, y: 78 });

  // preselect from "Book this service" buttons
  useEffect(() => {
    const h = (e: Event) => {
      const id = (e as CustomEvent).detail?.service as string | undefined;
      const found = services.find((s) => s.id === id);
      if (found) {
        setService(found.id);
        setStep(1);
      }
    };
    window.addEventListener("book-service", h);
    return () => window.removeEventListener("book-service", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // courtesy reveal: request received -> technician assigned
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => setStage((s) => Math.max(s, 1)), 1200);
    return () => clearTimeout(t);
  }, [submitted]);

  // real status: poll the customer's own lead via the tracking-token RPC
  useEffect(() => {
    if (!submitted || !token) return;
    const supabase = createClient();
    let active = true;
    const poll = async () => {
      const { data } = await supabase.rpc("get_lead_status", { p_token: token });
      if (active && typeof data === "string" && STATUS_STAGE[data] != null) {
        setStage((s) => Math.max(s, STATUS_STAGE[data]));
      }
    };
    poll();
    const iv = setInterval(poll, 5000);
    return () => { active = false; clearInterval(iv); };
  }, [submitted, token]);

  // ETA + van animation
  useEffect(() => {
    if (!submitted) return;
    if (stage >= 4) {
      setEta(0);
      setVan({ x: 78, y: 34 });
      return;
    }
    if (stage === 2) setVan({ x: 62, y: 46 });
    if (stage === 3) setVan({ x: 80, y: 32 });
    const iv = setInterval(() => setEta((e) => (e > 1 && stage < 3 ? e - 1 : e)), 900);
    return () => clearInterval(iv);
  }, [submitted, stage]);

  const reset = () => {
    setSubmitted(false); setToken(null); setStage(0); setEta(18); setVan({ x: 14, y: 78 });
    setStep(0); setService(null); setArea(null); setName(""); setPhone(""); setErr("");
  };

  const next = () => {
    setErr("");
    if (step === 0 && !service) return setErr("Pick a service to continue.");
    if (step === 1 && !area) return setErr("Choose your area.");
    setStep((s) => Math.min(2, s + 1));
  };
  const back = () => {
    setErr("");
    setStep((s) => Math.max(0, s - 1));
  };

  const dispatch = async () => {
    setErr("");
    if (!name.trim()) return setErr("Tell us your name.");
    if (!PHONE_RE.test(phone.replace(/[\s-]/g, ""))) return setErr("Enter a valid phone number.");
    if (!service || !area) return setErr("Please complete the previous steps.");
    setBusy(true);
    const tok = crypto.randomUUID();
    const res = await createLeadAction({
      name,
      phone,
      service,
      area,
      urgency: URGENCY_LABEL[urgency as keyof typeof URGENCY_LABEL],
      note: null,
      trackingToken: tok,
      company: hp,
    });
    setBusy(false);
    if (!res.ok) return setErr(res.error);
    track("Dispatch", { service, area: area ?? "", urgency: URGENCY_LABEL[urgency as keyof typeof URGENCY_LABEL] });
    setToken(tok);
    setSubmitted(true);
  };

  const svcObj = services.find((s) => s.id === service);
  const urgencyObj = URGENCY.find((u) => u.id === urgency)!;
  const waText = `Hi 👋\n\nI just booked a fix:\n• Service: ${svcObj?.t ?? "-"}\n• Urgency: ${urgencyObj.t}\n• Area: ${area ?? "-"}\n• Name: ${name}\n• Phone: ${phone}`;
  const waHref = `https://wa.me/${waNumber(whatsapp)}?text=${encodeURIComponent(waText)}`;

  return (
    <section className="section book" id="book">
      <div className="wrap">
        <div className="eyebrow reveal"><span className="n">BOOK A FIX</span><span className="ln"></span></div>
        <h2 className="h2 reveal d1" style={{ marginBottom: "14px" }}>
          Order a repair like you<br /><span className="em">order food.</span>
        </h2>
        <p className="lead reveal d2" style={{ marginBottom: "40px" }}>
          Tell us what broke, we dispatch the right technician, and you watch it happen live — from &quot;request received&quot; to &quot;fixed &amp; warrantied.&quot;
        </p>

        <div className="panel reveal d2">
          {/* LEFT — flow */}
          <div className="flow">
            <div className="steps-h">
              {[0, 1, 2].map((i) => (
                <span key={i} className={"dot" + (i < step ? " done" : i === step ? " on" : "")}></span>
              ))}
            </div>

            <div className="stepwrap">
              {/* STEP 0 */}
              <div className={"step" + (step === 0 ? " active" : "")}>
                <div className="q">What needs fixing?</div>
                <div className="hint">Pick a service — you can add details in a sec.</div>
                <div className="svc-pick">
                  {services.map((s) => (
                    <button type="button" key={s.id} className={"opt" + (service === s.id ? " sel" : "")}
                      aria-pressed={service === s.id}
                      onClick={() => { setService(s.id); setErr(""); }}>
                      <span className="em">{s.em}</span>
                      <span className="t">{s.t}<small>{s.s}</small></span>
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 1 */}
              <div className={"step" + (step === 1 ? " active" : "")}>
                <div className="q">How soon &amp; where?</div>
                <div className="hint">{svcObj ? `${svcObj.em} ${svcObj.t} — ` : ""}choose urgency and your area.</div>
                <div className="fieldrow">
                  <label>Urgency</label>
                  <div className="chipset">
                    {URGENCY.map((u) => (
                      <button type="button" key={u.id} className={"c" + (urgency === u.id ? " sel" : "")}
                        aria-pressed={urgency === u.id} onClick={() => setUrgency(u.id)}>
                        {u.t} · <small style={{ opacity: 0.7 }}>{u.s}</small>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="fieldrow">
                  <label>Your area in Peshawar</label>
                  <div className="chipset">
                    {areaList.map((a) => (
                      <button type="button" key={a} className={"c" + (area === a ? " sel" : "")}
                        aria-pressed={area === a} onClick={() => { setArea(a); setErr(""); }}>{a}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* STEP 2 */}
              <div className={"step" + (step === 2 ? " active" : "")}>
                <div className="q">Where do we send the team?</div>
                <div className="hint">We&apos;ll confirm on WhatsApp within minutes.</div>
                <div className="fieldrow">
                  <label htmlFor="bk-name">Name</label>
                  <input id="bk-name" className="input" value={name} placeholder="e.g. Sana Khan" autoComplete="name" onChange={(e) => { setName(e.target.value); setErr(""); }} />
                </div>
                <div className="fieldrow">
                  <label htmlFor="bk-phone">Phone / WhatsApp</label>
                  <input id="bk-phone" className="input" type="tel" value={phone} placeholder="03XX-XXXXXXX" inputMode="tel" autoComplete="tel" onChange={(e) => { setPhone(e.target.value); setErr(""); }} />
                </div>
                {/* honeypot: hidden from users, catches bots */}
                <input
                  type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  value={hp} onChange={(e) => setHp(e.target.value)}
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />
                <div className="fieldrow" style={{ display: "flex", gap: "10px", flexWrap: "wrap", fontSize: "13px", color: "var(--faint)", fontFamily: "var(--font-space),'Space Grotesk',monospace" }}>
                  <span>📋 {svcObj ? svcObj.t : "—"}</span><span>·</span>
                  <span>⏱ {urgencyObj.t}</span><span>·</span>
                  <span>📍 {area || "—"}</span>
                </div>
              </div>
            </div>

            {err && <div className="err">⚠ {err}</div>}

            <div className="nav-row">
              {step > 0 ? (
                <button className="linkback" onClick={back}>← Back</button>
              ) : (
                <span className="mono" style={{ fontSize: "12px", color: "var(--faint)" }}>Step {step + 1} of 3</span>
              )}
              {step < 2 ? (
                <button className="btn btn--fire" onClick={next}><span className="sheen"></span>Continue →</button>
              ) : submitted ? (
                <a className="btn btn--fire" href={waHref} target="_blank" rel="noopener noreferrer"><span className="sheen"></span>💬 Confirm on WhatsApp</a>
              ) : (
                <button className="btn btn--fire" onClick={dispatch} disabled={busy}>
                  <span className="sheen"></span>{busy ? "Dispatching…" : "▶ Dispatch a technician"}
                </button>
              )}
            </div>
          </div>

          {/* RIGHT — live tracker */}
          <div className="tracker">
            <div className="thead">
              <span className="id mono">{submitted ? "#NXV-2026-0481" : "ORDER PREVIEW"}</span>
              <span className="live"><i></i>{submitted ? "LIVE" : "WAITING"}</span>
            </div>

            <div className="map">
              <div className="grid"></div>
              <svg className="route" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M14 78 Q 40 60 50 50 T 80 34" />
              </svg>
              <div className="home">🏠</div>
              <div className="van" style={{ left: van.x + "%", top: van.y + "%" }}>
                {stage >= 4 ? "✅" : stage >= 1 ? "🛻" : "📍"}
              </div>
            </div>

            <div className="tsteps">
              {TRACK_STAGES.map((s, i) => {
                const cls = !submitted ? "idle" : i < stage ? "done" : i === stage ? "now" : "idle";
                return (
                  <div className={"tstep " + cls} key={i}>
                    <span className={"mk " + (cls === "done" ? "done" : cls === "now" ? "now" : "")}>
                      {cls === "done" ? "✓" : i + 1}
                    </span>
                    <div className="tx">
                      <div className="t">{s.t}</div>
                      <div className="s">{i === 1 && stage >= 1 ? "Technician · 4.9★ assigned" : s.s}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="tfoot">
              {submitted && stage >= 1 && stage < 4 ? (
                <div className="tech-card">
                  <div className="av">F</div>
                  <div className="info"><div className="nm">FBS Enterprise</div><div className="rt">4.9★ · 320 jobs</div></div>
                </div>
              ) : (
                <span className="mono" style={{ fontSize: "12px", color: "var(--faint)" }}>
                  {submitted ? "Job complete" : "Fill the form to dispatch"}
                </span>
              )}
              {submitted ? (
                stage >= 4 ? (
                  <button className="btn btn--ghost btn--sm" onClick={reset}>Book another</button>
                ) : (
                  <span className="eta">ETA {eta} min</span>
                )
              ) : (
                <span className="eta">~18 min avg</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
