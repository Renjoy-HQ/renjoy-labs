"use client";
import { useState, useEffect } from "react";
import { submitLead } from "../../../lib/submitLead";

function NoiseOverlay() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.035, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px",
      borderRadius: "100px", fontSize: "12px", fontWeight: 600,
      fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em",
      background: "rgba(212, 137, 122, 0.12)", color: "#d4897a",
      border: "1px solid rgba(212,137,122,0.2)",
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#d4897a", display: "inline-block" }} />
      {status}
    </span>
  );
}

const STEPS = [
  {
    num: 1,
    title: "Trigger",
    desc: "n8n workflow polls Breezeway every 5 minutes for new unassigned tasks.",
  },
  {
    num: 2,
    title: "Classification",
    desc: "89 keyword-pattern rules map task descriptions to 10 skill categories (plumbing, electrical, HVAC, appliance, general, etc.). Example: \"toilet,\" \"leak,\" \"faucet\" → Plumbing.",
  },
  {
    num: 3,
    title: "Tech Matching",
    desc: "Supabase RPC classify_and_match_tech() ranks all technicians by skill level for that category, then checks Timeero's live clock-in data to see who's actually on shift.",
  },
  {
    num: 4,
    title: "Routing Logic",
    desc: "HIGH/URGENT tasks → only techs currently clocked in. No one on? → immediate escalation to dispatch managers via Slack @mention. NORMAL/LOW → full ranked list regardless of clock status.",
  },
  {
    num: 5,
    title: "Delivery",
    desc: "Auto-DMs the best-match tech on Slack with task details + Breezeway link.",
  },
  {
    num: 6,
    title: "Escalation",
    desc: "Separate workflow runs every 2 hours (7am–6pm MT, Mon–Sat). If a dispatched task hasn't been started within 2 hours (urgent) or 4 hours (normal), it escalates to the dispatch manager channel with @mentions.",
  },
  {
    num: 7,
    title: "Exclusions",
    desc: "15 recurring template task IDs are excluded — scheduled maintenance that doesn't need dispatch.",
  },
];

const DB_TABLES = [
  { name: "maintenance_technicians", detail: "7 techs" },
  { name: "skill_categories", detail: "10 categories" },
  { name: "tech_skills", detail: "70 rows" },
  { name: "task_classification_rules", detail: "89 patterns" },
  { name: "dispatch_log", detail: null },
  { name: "dispatch_template_exclusions", detail: null },
];

const STACK_FLOW = [
  { name: "n8n", role: "orchestration" },
  { name: "Supabase", role: "classification rules + tech skills + dispatch log" },
  { name: "Timeero API", role: "clock status" },
  { name: "Slack API", role: "DMs + channel posts" },
  { name: "Breezeway API", role: "task data" },
];

const IMPACT_ITEMS = [
  { text: "Zero manual triage for routine tasks" },
  { text: "Techs notified within 5 minutes of task creation" },
  { text: "Escalation catches everything that falls through the cracks" },
];

export default function MaintenanceAutoDispatch() {
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes flakeFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(1.15)}}
        .fade-in{animation:fadeUp .6s ease forwards}
        .fade-d1{animation-delay:.1s;opacity:0}
        .fade-d2{animation-delay:.2s;opacity:0}
        .fade-d3{animation-delay:.3s;opacity:0}
        .fade-d4{animation-delay:.4s;opacity:0}
        ::selection{background:rgba(212,137,122,0.3);color:#fff}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:#1e0f16}
        ::-webkit-scrollbar-thumb{background:rgba(212,137,122,0.2);border-radius:3px}
        .step-item:hover .step-num { background: rgba(212,137,122,0.18) !important; }
        .cta-btn { transition: all 0.2s ease; }
        .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(212,137,122,0.25) !important; }
        .cta-btn-secondary:hover { background: rgba(212,137,122,0.08) !important; border-color: rgba(212,137,122,0.3) !important; color: #d4897a !important; }
        .stack-node:hover { background: rgba(212,137,122,0.08) !important; border-color: rgba(212,137,122,0.25) !important; }
        .db-row:hover { background: rgba(212,137,122,0.04) !important; }
      `}</style>

      <div style={{ background: "#1e0f16", color: "#e8e4df", minHeight: "100vh", fontFamily: "'Figtree', sans-serif" }}>
        <NoiseOverlay />

        {/* Ambient glow */}
        <div style={{
          position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "400px", pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse at top, rgba(212,137,122,0.06) 0%, transparent 70%)",
        }} />

        {/* Nav */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: isMobile ? "14px 20px" : "16px 40px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: scrollY > 80 ? "rgba(30,15,22,0.92)" : "transparent",
          backdropFilter: scrollY > 80 ? "blur(24px)" : "none",
          borderBottom: scrollY > 80 ? "1px solid rgba(212,137,122,0.06)" : "1px solid transparent",
          transition: "all 0.3s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <a href="/" style={{ color: "#e8e4df", textDecoration: "none", fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em" }}>renjoy</a>
            <span style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
              color: "#d4897a", background: "rgba(212,137,122,0.08)", padding: "4px 12px",
              borderRadius: "6px", fontFamily: "'JetBrains Mono', monospace", border: "1px solid rgba(212,137,122,0.15)",
            }}>LABS</span>
          </div>
          <a href="/#projects" style={{
            display: "flex", alignItems: "center", gap: "6px",
            color: "#9a958e", textDecoration: "none", fontSize: "14px",
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.02em",
            transition: "color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "#d4897a"}
            onMouseLeave={e => e.currentTarget.style.color = "#9a958e"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Labs
          </a>
        </nav>

        {/* Header */}
        <header style={{ padding: isMobile ? "120px 20px 60px" : "160px 40px 80px", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at 30% 40%, rgba(212,137,122,0.04) 0%, transparent 60%)",
          }} />
          <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 2 }}>
            <div className="fade-in fade-d1" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 600,
                letterSpacing: "0.12em", textTransform: "uppercase", color: "#d4897a",
              }}>RENJOY BUILT</span>
              <span style={{ color: "rgba(212,137,122,0.3)" }}>·</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#6b6760" }}>March 2026</span>
            </div>

            <div className="fade-in fade-d1" style={{ marginBottom: "20px" }}>
              <StatusBadge status="Renjoy Built" />
            </div>

            <h1 className="fade-in fade-d2" style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: isMobile ? "36px" : "clamp(42px, 6vw, 64px)",
              fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em",
              marginBottom: "20px", color: "#e8e4df",
            }}>
              Maintenance Auto-Dispatch
            </h1>

            <p className="fade-in fade-d3" style={{
              fontSize: isMobile ? "17px" : "20px", lineHeight: 1.6, color: "#9a958e",
              maxWidth: "680px", marginBottom: "48px",
            }}>
              How we eliminated manual triage for every maintenance task across 200+ properties
            </p>

            {/* Impact stats */}
            <div className="fade-in fade-d4" style={{
              display: "flex", gap: isMobile ? "20px" : "40px",
              flexWrap: "wrap",
            }}>
              {[
                { stat: "< 5 min", label: "task to tech notification" },
                { stat: "89 rules", label: "classification patterns" },
                { stat: "Zero", label: "manual triage on routine tasks" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{
                    fontFamily: "'Figtree', sans-serif", fontSize: isMobile ? "28px" : "36px",
                    fontWeight: 800, color: "#d4897a", letterSpacing: "-0.02em", lineHeight: 1,
                  }}>{item.stat}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
                    color: "#6b6760", letterSpacing: "0.06em", textTransform: "uppercase",
                  }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", margin: "0 40px" }} />

        {/* Main content */}
        <main style={{ padding: isMobile ? "60px 20px" : "80px 40px", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>

            {/* Section 1: The Problem */}
            <section style={{ marginBottom: "80px" }}>
              <h2 style={{
                fontFamily: "'Figtree', sans-serif", fontSize: isMobile ? "26px" : "32px",
                fontWeight: 800, color: "#e8e4df", marginBottom: "24px",
                letterSpacing: "-0.02em", lineHeight: 1.2,
              }}>The Problem</h2>
              <p style={{ fontSize: "18px", lineHeight: 1.8, color: "#b5b0a8", marginBottom: "20px" }}>
                Maintenance tasks come in from Breezeway at all hours. Someone has to read the task, figure out what skill is needed, check who's available, and message the right tech. That's 5–10 minutes per task, dozens of times a day.
              </p>
              <p style={{ fontSize: "18px", lineHeight: 1.8, color: "#b5b0a8" }}>
                At 200+ properties, that's a dispatcher's entire day — just on routing.
              </p>
            </section>

            {/* Section 2: How It Works */}
            <section style={{ marginBottom: "80px" }}>
              <h2 style={{
                fontFamily: "'Figtree', sans-serif", fontSize: isMobile ? "26px" : "32px",
                fontWeight: 800, color: "#e8e4df", marginBottom: "36px",
                letterSpacing: "-0.02em", lineHeight: 1.2,
              }}>How It Works</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {STEPS.map((step, i) => (
                  <div key={i} className="step-item" style={{
                    display: "flex", gap: "20px", position: "relative",
                    paddingBottom: i < STEPS.length - 1 ? "0" : "0",
                  }}>
                    {/* Left: number + line */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div className="step-num" style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "rgba(212,137,122,0.1)", border: "1px solid rgba(212,137,122,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", fontWeight: 600,
                        color: "#d4897a", flexShrink: 0, transition: "background 0.2s",
                        position: "relative", zIndex: 1,
                      }}>{step.num}</div>
                      {i < STEPS.length - 1 && (
                        <div style={{
                          width: "1px", flex: 1, minHeight: "32px",
                          background: "linear-gradient(180deg, rgba(212,137,122,0.2) 0%, rgba(212,137,122,0.05) 100%)",
                          margin: "4px 0",
                        }} />
                      )}
                    </div>

                    {/* Right: content */}
                    <div style={{ paddingBottom: i < STEPS.length - 1 ? "32px" : "0", paddingTop: "6px" }}>
                      <h3 style={{
                        fontFamily: "'Figtree', sans-serif", fontSize: "17px", fontWeight: 700,
                        color: "#e8e4df", marginBottom: "8px",
                      }}>{step.title}</h3>
                      <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#9a958e" }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: The Stack */}
            <section style={{ marginBottom: "80px" }}>
              <h2 style={{
                fontFamily: "'Figtree', sans-serif", fontSize: isMobile ? "26px" : "32px",
                fontWeight: 800, color: "#e8e4df", marginBottom: "36px",
                letterSpacing: "-0.02em", lineHeight: 1.2,
              }}>The Stack</h2>

              {/* Stack flow diagram */}
              <div style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px", padding: isMobile ? "24px" : "32px", marginBottom: "32px",
              }}>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 600,
                  letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a4640",
                  marginBottom: "24px",
                }}>Data Flow</p>
                <div style={{
                  display: "flex", alignItems: "center", flexWrap: "wrap",
                  gap: isMobile ? "8px" : "0",
                }}>
                  {STACK_FLOW.map((node, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", flexWrap: "nowrap" }}>
                      <div className="stack-node" style={{
                        display: "flex", flexDirection: "column", gap: "4px",
                        padding: isMobile ? "10px 14px" : "12px 18px",
                        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "10px", transition: "all 0.2s",
                        minWidth: isMobile ? "auto" : "120px",
                      }}>
                        <span style={{
                          fontFamily: "'Figtree', sans-serif", fontSize: "14px", fontWeight: 700,
                          color: "#e8e4df",
                        }}>{node.name}</span>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
                          color: "#6b6760", lineHeight: 1.4,
                        }}>{node.role}</span>
                      </div>
                      {i < STACK_FLOW.length - 1 && (
                        <div style={{
                          padding: "0 10px", color: "rgba(212,137,122,0.4)",
                          fontSize: "18px", fontWeight: 300, flexShrink: 0,
                        }}>→</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Database tables */}
              <div style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px", overflow: "hidden",
              }}>
                <div style={{
                  padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(212,137,122,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                  </svg>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 600,
                    letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b6760",
                  }}>Supabase Tables</span>
                </div>
                {DB_TABLES.map((table, i) => (
                  <div key={i} className="db-row" style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 28px",
                    borderBottom: i < DB_TABLES.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                    transition: "background 0.15s",
                  }}>
                    <code style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "13px",
                      color: "#d4897a", fontWeight: 500,
                    }}>{table.name}</code>
                    {table.detail && (
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
                        color: "#4a4640", letterSpacing: "0.04em",
                      }}>{table.detail}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: The Impact */}
            <section style={{ marginBottom: "80px" }}>
              <h2 style={{
                fontFamily: "'Figtree', sans-serif", fontSize: isMobile ? "26px" : "32px",
                fontWeight: 800, color: "#e8e4df", marginBottom: "36px",
                letterSpacing: "-0.02em", lineHeight: 1.2,
              }}>The Impact</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {IMPACT_ITEMS.map((item, i) => (
                  <div key={i} style={{
                    background: "rgba(212,137,122,0.04)", border: "1px solid rgba(212,137,122,0.1)",
                    borderRadius: "14px", padding: isMobile ? "24px" : "28px 32px",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", left: 0, top: 0, bottom: 0, width: "3px",
                      background: "linear-gradient(180deg, #d4897a, rgba(212,137,122,0.3))",
                      borderRadius: "3px 0 0 3px",
                    }} />
                    <p style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: isMobile ? "18px" : "22px",
                      fontWeight: 700, color: "#e8e4df", lineHeight: 1.35,
                      paddingLeft: "4px",
                    }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer CTA */}
            <section style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "20px", padding: isMobile ? "40px 24px" : "56px 48px",
              textAlign: "center", position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: "400px", height: "300px", pointerEvents: "none",
                background: "radial-gradient(ellipse, rgba(212,137,122,0.05) 0%, transparent 70%)",
              }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 600,
                  letterSpacing: "0.12em", textTransform: "uppercase", color: "#d4897a",
                  marginBottom: "16px",
                }}>Building something similar?</p>
                <h3 style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: isMobile ? "26px" : "32px",
                  fontWeight: 800, color: "#e8e4df", marginBottom: "12px",
                  letterSpacing: "-0.02em",
                }}>See what else we're shipping</h3>
                <p style={{
                  fontSize: "16px", color: "#9a958e", lineHeight: 1.65,
                  maxWidth: "440px", margin: "0 auto 36px",
                }}>
                  We build operational infrastructure for vacation rental management. Here's more of what we're working on.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href="/#projects" className="cta-btn" style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "13px 26px", borderRadius: "10px",
                    background: "linear-gradient(135deg, #e05a3a, #c94a30)",
                    color: "#fff", textDecoration: "none",
                    fontSize: "15px", fontWeight: 600,
                    fontFamily: "'Figtree', sans-serif",
                    boxShadow: "0 4px 16px rgba(212,137,122,0.15)",
                  }}>
                    See more projects
                  </a>
                  <a href="https://labs.renjoy.com" target="_blank" rel="noopener noreferrer" className="cta-btn cta-btn-secondary" style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "13px 26px", borderRadius: "10px",
                    background: "transparent",
                    color: "#9a958e", textDecoration: "none",
                    fontSize: "15px", fontWeight: 600,
                    fontFamily: "'Figtree', sans-serif",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.2s",
                  }}>
                    Let's talk about it
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                </div>
              </div>
            </section>

          </div>
        </main>

        {/* Bottom padding */}
        <div style={{ height: "80px" }} />
      </div>
    </>
  );
}
