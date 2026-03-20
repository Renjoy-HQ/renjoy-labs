"use client";
import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');`;

const C = {
  bg: "#1e0f16",
  card: "#241418",
  inputBg: "#2a1c22",
  border: "#3a2a30",
  accent: "#d4897a",
  accentDim: "rgba(212,137,122,0.15)",
  accentBorder: "rgba(212,137,122,0.35)",
  text: "#e8e4df",
  body: "#b5b0a8",
  muted: "#9a958e",
  dim: "#6b6760",
  dimmer: "#4a4640",
  ctaFrom: "#e05a3a",
  ctaTo: "#c94a30",
  green: "#4ade80",
  greenBg: "rgba(74,222,128,0.06)",
  greenBorder: "rgba(74,222,128,0.15)",
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  background: C.inputBg,
  border: `1px solid ${C.border}`,
  borderRadius: "8px",
  color: C.text,
  fontSize: "14px",
  fontFamily: "'Figtree', sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontFamily: "'JetBrains Mono', monospace",
  color: C.dim,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "6px",
};

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function PreviewCard({ form }) {
  const isEssay = form.content_type === "essay";
  return (
    <div style={{
      border: `1px solid ${C.border}`,
      borderRadius: "12px",
      padding: "24px",
      background: "transparent",
      fontFamily: "'Figtree', sans-serif",
    }}>
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 600,
          letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent,
        }}>
          {form.content_category || "CATEGORY"}
        </span>
        <span style={{
          display: "flex", alignItems: "center", gap: "5px",
          fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: C.green,
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.green, display: "inline-block" }} />
          PUBLISHED
        </span>
      </div>

      {/* Title */}
      <div style={{ fontSize: "20px", fontWeight: 700, color: C.text, lineHeight: 1.25, marginBottom: "6px" }}>
        {form.content_title || "Title"}
      </div>

      {/* Subtitle */}
      {form.content_subtitle && (
        <div style={{ fontSize: "14px", fontStyle: "italic", color: C.muted, marginBottom: "14px", lineHeight: 1.5 }}>
          {form.content_subtitle}
        </div>
      )}

      {/* Summary */}
      <div style={{ fontSize: "14px", color: C.body, lineHeight: 1.7, marginBottom: "20px" }}>
        {form.content_summary || "Summary will appear here..."}
      </div>

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${C.accent}`, marginBottom: "14px", opacity: 0.4 }} />

      {/* Footer */}
      {isEssay ? (
        <div style={{ fontSize: "13px", color: C.dim }}>
          — {form.read_time ? `${form.read_time} min read` : "? min read"}
        </div>
      ) : (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "12px",
          color: C.dim, letterSpacing: "0.04em",
        }}>
          {form.tech_stack || "tech · stack · here"}
        </div>
      )}
    </div>
  );
}

const EMPTY_FORM = {
  content_type: "essay",
  content_title: "",
  content_subtitle: "",
  content_category: "",
  content_summary: "",
  content_preheader: "",
  content_url: "",
  pull_quote: "",
  content_connector: "",
  read_time: "",
  content_how: "",
  content_result: "",
  tech_stack: "",
};

export default function DispatchPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { ok: bool, message: string }

  function handleAuth(e) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_DISPATCH_SECRET) {
      setAuthed(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password.");
    }
  }

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function sendDispatch() {
    setLoading(true);
    setShowConfirm(false);
    setResult(null);
    try {
      const res = await fetch("/api/dispatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: "Dispatch sent successfully." });
        setForm(EMPTY_FORM);
      } else {
        setResult({ ok: false, message: data.error || "Something went wrong." });
      }
    } catch (err) {
      setResult({ ok: false, message: "Network error. Check your connection." });
    } finally {
      setLoading(false);
    }
  }

  const focusStyle = { borderColor: C.accent };

  // ─── Password gate ───
  if (!authed) {
    return (
      <>
        <style>{`${FONTS} *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}`}</style>
        <div style={{
          background: C.bg, minHeight: "100vh", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontFamily: "'Figtree', sans-serif",
        }}>
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: "16px", padding: "48px 40px", width: "100%", maxWidth: "400px",
          }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "24px", marginBottom: "12px" }}>⛏</div>
              <div style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>The Mining Report</div>
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: C.text }}>Dispatch Admin</h1>
            </div>
            <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Field label="Password">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter dispatch password"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = C.border}
                  autoFocus
                />
              </Field>
              {authError && (
                <div style={{ fontSize: "13px", color: "#f87171", fontFamily: "'JetBrains Mono', monospace" }}>{authError}</div>
              )}
              <button type="submit" style={{
                padding: "12px", borderRadius: "8px", border: "none",
                background: `linear-gradient(135deg, ${C.ctaFrom}, ${C.ctaTo})`,
                color: "#fff", fontSize: "14px", fontWeight: 600,
                cursor: "pointer", fontFamily: "'Figtree', sans-serif",
              }}>Unlock</button>
            </form>
          </div>
        </div>
      </>
    );
  }

  // ─── Dispatch form ───
  return (
    <>
      <style>{`${FONTS} *,*::before,*::after{box-sizing:border-box;margin:0;padding:0} textarea{resize:vertical}`}</style>
      <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Figtree', sans-serif", color: C.text }}>

        {/* Header */}
        <div style={{ borderBottom: `1px solid ${C.border}`, padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em" }}>renjoy</span>
            <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", color: C.accent, background: C.accentDim, padding: "3px 9px", borderRadius: "5px", fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${C.accentBorder}` }}>LABS</span>
            <span style={{ color: C.border, fontSize: "16px" }}>/</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: C.dim }}>dispatch</span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: C.dimmer }}>The Mining Report</span>
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 40px", display: "grid", gridTemplateColumns: "1fr 380px", gap: "48px", alignItems: "start" }}>

          {/* ─── Form ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div>
              <h2 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "6px" }}>Send Dispatch</h2>
              <p style={{ fontSize: "14px", color: C.muted }}>Fill out the fields below to send a dispatch to all Mining Report subscribers.</p>
            </div>

            {/* Content type */}
            <Field label="Content Type">
              <div style={{ display: "flex", gap: "8px" }}>
                {["essay", "project"].map(type => (
                  <button key={type} onClick={() => set("content_type", type)} style={{
                    padding: "8px 20px", borderRadius: "100px", fontSize: "13px", fontWeight: 500,
                    cursor: "pointer", fontFamily: "'Figtree', sans-serif", transition: "all 0.2s",
                    background: form.content_type === type ? C.accentDim : "rgba(255,255,255,0.03)",
                    border: `1px solid ${form.content_type === type ? C.accentBorder : "rgba(255,255,255,0.08)"}`,
                    color: form.content_type === type ? C.accent : C.muted,
                  }}>{type.charAt(0).toUpperCase() + type.slice(1)}</button>
                ))}
              </div>
            </Field>

            {/* Common fields */}
            <Field label="Title">
              <input value={form.content_title} onChange={e => set("content_title", e.target.value)} placeholder="Stake Your Claim" style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => e.target.style.borderColor = C.border} />
            </Field>

            <Field label="Subtitle">
              <input value={form.content_subtitle} onChange={e => set("content_subtitle", e.target.value)} placeholder="What the gold rushes actually teach us..." style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => e.target.style.borderColor = C.border} />
            </Field>

            <Field label="Category">
              <input value={form.content_category} onChange={e => set("content_category", e.target.value)} placeholder="PRACTICAL AI" style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => e.target.style.borderColor = C.border} />
            </Field>

            <Field label="Summary (2–3 sentence hook)">
              <textarea value={form.content_summary} onChange={e => set("content_summary", e.target.value)}
                placeholder="What to try first, what to measure, and when to stop..."
                rows={3} style={{ ...inputStyle, lineHeight: 1.6 }}
                onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => e.target.style.borderColor = C.border} />
            </Field>

            <Field label="Preheader (inbox preview text)">
              <input value={form.content_preheader} onChange={e => set("content_preheader", e.target.value)} placeholder="What to try first, what to measure, and when to stop." style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => e.target.style.borderColor = C.border} />
            </Field>

            <Field label="Content URL">
              <input value={form.content_url} onChange={e => set("content_url", e.target.value)} placeholder="https://labs.renjoy.com/essays/finding-color" style={inputStyle}
                onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => e.target.style.borderColor = C.border} />
            </Field>

            {/* Essay-specific fields */}
            {form.content_type === "essay" && (
              <>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "28px", display: "flex", flexDirection: "column", gap: "28px" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>Essay Fields</div>

                  <Field label="Pull Quote">
                    <textarea value={form.pull_quote} onChange={e => set("pull_quote", e.target.value)}
                      placeholder="The question is what you do next."
                      rows={2} style={{ ...inputStyle, lineHeight: 1.6 }}
                      onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => e.target.style.borderColor = C.border} />
                  </Field>

                  <Field label="Connector (why it matters for VRM operators)">
                    <textarea value={form.content_connector} onChange={e => set("content_connector", e.target.value)}
                      placeholder="If you've been meaning to test AI but haven't started, this is the essay."
                      rows={2} style={{ ...inputStyle, lineHeight: 1.6 }}
                      onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => e.target.style.borderColor = C.border} />
                  </Field>

                  <Field label="Read Time (minutes)">
                    <input type="number" value={form.read_time} onChange={e => set("read_time", e.target.value)} placeholder="10" style={{ ...inputStyle, width: "120px" }}
                      onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => e.target.style.borderColor = C.border} />
                  </Field>
                </div>
              </>
            )}

            {/* Project-specific fields */}
            {form.content_type === "project" && (
              <>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "28px", display: "flex", flexDirection: "column", gap: "28px" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>Project Fields</div>

                  <Field label="How It Works">
                    <textarea value={form.content_how} onChange={e => set("content_how", e.target.value)}
                      placeholder="When a task hits Breezeway, our system classifies it across 89 rules..."
                      rows={3} style={{ ...inputStyle, lineHeight: 1.6 }}
                      onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => e.target.style.borderColor = C.border} />
                  </Field>

                  <Field label="Result">
                    <textarea value={form.content_result} onChange={e => set("content_result", e.target.value)}
                      placeholder="Zero manual triage. Five-minute response times."
                      rows={2} style={{ ...inputStyle, lineHeight: 1.6 }}
                      onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => e.target.style.borderColor = C.border} />
                  </Field>

                  <Field label="Tech Stack">
                    <input value={form.tech_stack} onChange={e => set("tech_stack", e.target.value)} placeholder="n8n · Supabase · Slack API · Breezeway" style={inputStyle}
                      onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => e.target.style.borderColor = C.border} />
                  </Field>
                </div>
              </>
            )}

            {/* Result feedback */}
            {result && (
              <div style={{
                padding: "14px 18px", borderRadius: "10px",
                background: result.ok ? C.greenBg : "rgba(248,113,113,0.06)",
                border: `1px solid ${result.ok ? C.greenBorder : "rgba(248,113,113,0.2)"}`,
                color: result.ok ? C.green : "#f87171",
                fontSize: "14px", fontFamily: "'JetBrains Mono', monospace",
              }}>
                {result.ok ? "✓ " : "✕ "}{result.message}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={() => setShowConfirm(true)}
              disabled={loading}
              style={{
                padding: "14px 28px", borderRadius: "8px", border: "none",
                background: loading ? "rgba(255,255,255,0.05)" : `linear-gradient(135deg, ${C.ctaFrom}, ${C.ctaTo})`,
                color: loading ? C.muted : "#fff",
                fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Figtree', sans-serif", alignSelf: "flex-start",
              }}
            >
              {loading ? "Sending…" : "Send Dispatch"}
            </button>
          </div>

          {/* ─── Preview ─── */}
          <div style={{ position: "sticky", top: "32px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: C.dim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Preview</div>
            <PreviewCard form={form} />
          </div>
        </div>

        {/* ─── Confirm modal ─── */}
        {showConfirm && (
          <div onClick={e => { if (e.target === e.currentTarget) setShowConfirm(false); }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(25,12,18,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{
              background: "#281620", border: `1px solid ${C.border}`,
              borderRadius: "20px", padding: "40px 36px", maxWidth: "420px", width: "100%", textAlign: "center",
            }}>
              <div style={{ fontSize: "28px", marginBottom: "16px" }}>⛏</div>
              <h3 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "10px", fontFamily: "'Figtree', sans-serif" }}>Send this dispatch?</h3>
              <p style={{ fontSize: "14px", color: C.muted, marginBottom: "8px", lineHeight: 1.6 }}>
                This will send <strong style={{ color: C.text }}>"{form.content_title}"</strong> to all Mining Report subscribers via GHL.
              </p>
              <p style={{ fontSize: "13px", color: C.dimmer, fontFamily: "'JetBrains Mono', monospace", marginBottom: "28px" }}>This cannot be undone.</p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button onClick={() => setShowConfirm(false)} style={{
                  padding: "10px 24px", borderRadius: "8px", border: `1px solid ${C.border}`,
                  background: "transparent", color: C.muted, fontSize: "14px", cursor: "pointer", fontFamily: "'Figtree', sans-serif",
                }}>Cancel</button>
                <button onClick={sendDispatch} style={{
                  padding: "10px 24px", borderRadius: "8px", border: "none",
                  background: `linear-gradient(135deg, ${C.ctaFrom}, ${C.ctaTo})`,
                  color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "'Figtree', sans-serif",
                }}>Yes, send it</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
