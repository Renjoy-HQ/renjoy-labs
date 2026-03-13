"use client";
import { useState, useEffect, useMemo } from "react";
import { submitLead } from "../../../lib/submitLead";

const META = {
  title: "Stake Your Claim",
  subtitle: "What the gold rushes actually teach us about the AI frontier",
  date: "March 2026",
  readTime: "12 min read",
  series: "Essay 1 of 3",
  author: "Jacob Mueller",
  role: "CEO, Renjoy",
};

const TOC = [
  { id: "shovels", label: "The man who sold the shovels" },
  { id: "color", label: "Finding color" },
  { id: "modern", label: "The modern shovel sellers" },
  { id: "skeptics", label: "The skeptics always show up" },
  { id: "behind", label: "What gold rushes leave behind" },
  { id: "stake", label: "Stake your claim" },
];

const SOCIALS = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/jacobtmueller/", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label: "X", url: "https://x.com/Jacobtmueller", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
];

const RELATED = [
  { title: "The Mulrooney Play", subtitle: "Why the best VRM companies won't look like VRM companies", tag: "Essay 2", link: "/essays/the-mulrooney-play" },
  { title: "The Sutter Trap", subtitle: "Why the best operators are the most at risk", tag: "Essay 3", link: "/essays/the-sutter-trap" },
];

// ─── Shared design components ───

function NoiseOverlay() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.035, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}

function SectionFlakes({ count = 5, seed = 0 }) {
  const flakes = useMemo(() => {
    const rng = (i) => { const v = Math.sin((seed + 1) * 9301 + i * 4973) * 10000; return v - Math.floor(v); };
    return Array.from({ length: count }, (_, i) => {
      const r = rng(i), r2 = rng(i+100), r3 = rng(i+200), r4 = rng(i+300);
      const size = 2 + r * 4;
      return { x: 5+r2*90, y: 8+r3*84, size, opacity: 0.18+r*0.3, duration: 5+r4*7, delay: r2*8, glow: size > 4 ? 6+r*10 : 0, isDiamond: r > 0.6, shimmer: size > 5, drift: (r3-0.5)*8 };
    });
  }, [count, seed]);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {flakes.map((f, i) => (
        <div key={i} style={{
          position: "absolute", left: `${f.x}%`, top: `${f.y}%`, width: `${f.size}px`, height: `${f.size}px`,
          borderRadius: f.isDiamond ? "1px" : "50%", transform: f.isDiamond ? "rotate(45deg)" : "none",
          background: f.shimmer ? `linear-gradient(135deg, rgba(232,169,158,${f.opacity}), rgba(212,137,122,${f.opacity}))` : `rgba(212,137,122,${f.opacity})`,
          animation: f.shimmer ? `flakeFloat ${f.duration}s ease-in-out infinite, flakeShimmer ${2+f.delay*0.3}s ease-in-out infinite` : `flakeFloat ${f.duration}s ease-in-out infinite`,
          animationDelay: `${f.delay}s`,
          boxShadow: f.glow > 0 ? `0 0 ${f.glow}px rgba(212,137,122,${f.opacity*0.45})` : "none",
        }} />
      ))}
    </div>
  );
}

// Pull quote component
function PQ({ children, tweet }) {
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const tweetUrl = tweet ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${tweet}" — via @Jacobtmueller`)}&url=${encodeURIComponent(pageUrl)}` : null;
  return (
    <div style={{ position: "relative", margin: "48px 0" }}>
      <blockquote style={{ margin: 0, padding: "32px 0 32px 32px", borderLeft: "2px solid rgba(212,137,122,0.3)", fontFamily: "'Figtree', sans-serif", fontSize: "24px", fontWeight: 700, lineHeight: 1.45, fontStyle: "italic", color: "#e8e4df", maxWidth: "600px" }}>
        {children}
      </blockquote>
      {tweetUrl && (
        <a href={tweetUrl} target="_blank" rel="noopener noreferrer" title="Tweet this quote" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "8px", marginLeft: "32px", padding: "5px 12px", borderRadius: "100px", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", color: "#6b6760", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none", transition: "all 0.2s", letterSpacing: "0.04em" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#d4897a"; e.currentTarget.style.borderColor = "rgba(212,137,122,0.25)"; e.currentTarget.style.background = "rgba(212,137,122,0.06)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#6b6760"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Tweet this
        </a>
      )}
    </div>
  );
}

function ShareBar({ url, title }) {
  const [copied, setCopied] = useState(false);

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  function copyLink() {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  const btnStyle = {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "7px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 500,
    fontFamily: "'JetBrains Mono', monospace", cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
    color: "#9a958e", textDecoration: "none", transition: "all 0.2s",
    letterSpacing: "0.02em",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#4a4640", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: "4px" }}>Share</span>
      <a href={xUrl} target="_blank" rel="noopener noreferrer" style={btnStyle}
        onMouseEnter={e => { e.currentTarget.style.color = "#d4897a"; e.currentTarget.style.borderColor = "rgba(212,137,122,0.25)"; e.currentTarget.style.background = "rgba(212,137,122,0.06)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#9a958e"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        X
      </a>
      <a href={liUrl} target="_blank" rel="noopener noreferrer" style={btnStyle}
        onMouseEnter={e => { e.currentTarget.style.color = "#d4897a"; e.currentTarget.style.borderColor = "rgba(212,137,122,0.25)"; e.currentTarget.style.background = "rgba(212,137,122,0.06)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#9a958e"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        LinkedIn
      </a>
      <button onClick={copyLink} style={{ ...btnStyle, border: "1px solid rgba(255,255,255,0.08)" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#d4897a"; e.currentTarget.style.borderColor = "rgba(212,137,122,0.25)"; e.currentTarget.style.background = "rgba(212,137,122,0.06)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#9a958e"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      >
        {copied ? (
          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
        ) : (
          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy link</>
        )}
      </button>
    </div>
  );
}

// Section heading
function H2({ children, id }) {
  return (
    <h2 id={id} style={{
      fontFamily: "'Figtree', sans-serif", fontSize: "32px", fontWeight: 800,
      lineHeight: 1.2, letterSpacing: "-0.02em", marginTop: "64px", marginBottom: "24px",
      color: "#e8e4df", scrollMarginTop: "80px",
    }}>{children}</h2>
  );
}

// Paragraph
function P({ children }) {
  return <p style={{ fontSize: "18px", lineHeight: 1.8, color: "#b5b0a8", marginBottom: "24px" }}>{children}</p>;
}

// Bold inline
function B({ children }) {
  return <strong style={{ color: "#e8e4df", fontWeight: 600 }}>{children}</strong>;
}

export default function StakeYourClaim() {
  const [scrollY, setScrollY] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalSubscribed, setModalSubscribed] = useState(false);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const [docHeight, setDocHeight] = useState(1);
  useEffect(() => {
    const update = () => setDocHeight(document.documentElement.scrollHeight - window.innerHeight || 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const progress = Math.min(scrollY / docHeight, 1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        @keyframes flakeFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-12px) scale(1.15)} }
        @keyframes flakeShimmer { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.8)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .fade-in { animation: fadeUp 0.6s ease forwards; }
        .fade-d1 { animation-delay:0.1s; opacity:0; }
        .fade-d2 { animation-delay:0.2s; opacity:0; }
        .fade-d3 { animation-delay:0.3s; opacity:0; }
        .fade-d4 { animation-delay:0.4s; opacity:0; }
        a.gold-link { color: #d4897a; text-decoration: none; border-bottom: 1px solid rgba(212,137,122,0.3); transition: border-color 0.2s; }
        a.gold-link:hover { border-color: #d4897a; }
        ::selection { background: rgba(212,137,122,0.3); color: #fff; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1e0f16; }
        ::-webkit-scrollbar-thumb { background: rgba(212,137,122,0.2); border-radius: 3px; }
      `}</style>

      <div style={{ background: "#1e0f16", color: "#e8e4df", minHeight: "100vh", fontFamily: "'Figtree', sans-serif" }}>
        <NoiseOverlay />

        {/* Progress bar */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: "3px", background: "rgba(255,255,255,0.03)" }}>
          <div style={{ height: "100%", width: `${progress * 100}%`, background: "linear-gradient(90deg, #d4897a, #e8a99e)", transition: "width 0.1s linear" }} />
        </div>

        {/* Nav */}
        <nav style={{
          position: "fixed", top: "3px", left: 0, right: 0, zIndex: 100, padding: "16px 40px",
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
              color: "#d4897a", background: "rgba(212,137,122,0.08)",
              padding: "4px 12px", borderRadius: "6px", fontFamily: "'JetBrains Mono', monospace",
              border: "1px solid rgba(212,137,122,0.15)",
            }}>LABS</span>
          </div>
          <button onClick={() => setShowModal(true)} style={{
            background: "linear-gradient(135deg, #e05a3a, #c94a30)", color: "#fff",
            padding: "8px 20px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 600,
            cursor: "pointer", fontFamily: "'Figtree', sans-serif",
          }}>Subscribe</button>
        </nav>

        {/* Subscribe Modal */}
        {showModal && (
          <div onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(25,12,18,0.82)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", animation: "modalFadeIn 0.25s ease forwards" }}>
            <div style={{ background: "linear-gradient(135deg, #281620, #22121a)", border: "1px solid rgba(212,137,122,0.12)", borderRadius: "24px", padding: "52px 48px", maxWidth: "460px", width: "100%", position: "relative", textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(212,137,122,0.04)", animation: "modalSlideUp 0.3s ease forwards", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)", width: "300px", height: "200px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(212,137,122,0.06) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
              {[
                { top:"12px",left:"12px",borderTop:"1px solid rgba(212,137,122,0.12)",borderLeft:"1px solid rgba(212,137,122,0.12)" },
                { top:"12px",right:"12px",borderTop:"1px solid rgba(212,137,122,0.12)",borderRight:"1px solid rgba(212,137,122,0.12)" },
                { bottom:"12px",left:"12px",borderBottom:"1px solid rgba(212,137,122,0.12)",borderLeft:"1px solid rgba(212,137,122,0.12)" },
                { bottom:"12px",right:"12px",borderBottom:"1px solid rgba(212,137,122,0.12)",borderRight:"1px solid rgba(212,137,122,0.12)" },
              ].map((s,i)=>(<div key={i} style={{position:"absolute",width:"18px",height:"18px",...s}}/>))}
              <button onClick={()=>setShowModal(false)} style={{ position:"absolute",top:"16px",right:"16px",background:"none",border:"none",color:"#6b6760",fontSize:"20px",cursor:"pointer",width:"32px",height:"32px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
              <div style={{ width:"56px",height:"56px",borderRadius:"16px",margin:"0 auto 24px",background:"rgba(212,137,122,0.08)",border:"1px solid rgba(212,137,122,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"26px",position:"relative" }}>⛏</div>
              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",color:"#d4897a",display:"block",marginBottom:"14px" }}>The Mining Report</span>
              <h3 style={{ fontFamily:"'Figtree',sans-serif",fontSize:"30px",fontWeight:800,lineHeight:1.2,marginBottom:"12px",position:"relative" }}>Dispatches from<br/>the diggings.</h3>
              <p style={{ fontSize:"15px",lineHeight:1.65,color:"#9a958e",maxWidth:"340px",margin:"0 auto 28px",position:"relative" }}>A biweekly newsletter on AI, hospitality, and building in the age of the gold rush. No hype. Just the color we're finding in the pan.</p>
              {!modalSubscribed ? (
                <>
                  <div style={{ display:"flex",gap:"10px",maxWidth:"360px",margin:"0 auto",position:"relative" }}>
                    <input type="email" placeholder="your@email.com" value={modalEmail} onChange={e=>setModalEmail(e.target.value)} autoFocus
                      style={{ flex:1,padding:"14px 18px",borderRadius:"10px",background:"rgba(25,12,18,0.55)",border:"1px solid rgba(212,137,122,0.15)",color:"#e8e4df",fontSize:"15px",fontFamily:"'Figtree',sans-serif",outline:"none" }}
                      onFocus={e=>e.target.style.borderColor="rgba(212,137,122,0.4)"} onBlur={e=>e.target.style.borderColor="rgba(212,137,122,0.15)"}
                      onKeyDown={e=>{if(e.key==="Enter"&&modalEmail.includes("@")){setModalSubscribed(true);submitLead({type:"newsletter",email:modalEmail,source:"essay_stake-your-claim_modal"})}}} />
                    <button onClick={()=>{if(modalEmail.includes("@")){setModalSubscribed(true);submitLead({type:"newsletter",email:modalEmail,source:"essay_stake-your-claim_modal"})}}} style={{ background:"linear-gradient(135deg,#e05a3a,#c94a30)",color:"#fff",padding:"14px 22px",borderRadius:"10px",border:"none",fontSize:"15px",fontWeight:600,cursor:"pointer",fontFamily:"'Figtree',sans-serif",whiteSpace:"nowrap" }}>Stake a Claim</button>
                  </div>
                  <p style={{ fontSize:"12px",color:"#4a4640",marginTop:"16px",fontFamily:"'JetBrains Mono',monospace",position:"relative" }}>No spam. Unsubscribe anytime.</p>
                </>
              ) : (
                <div style={{ background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:"12px",padding:"18px 24px",maxWidth:"360px",margin:"0 auto",position:"relative" }}>
                  <span style={{ color:"#4ade80",fontSize:"15px",fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:"8px" }}><span style={{fontSize:"18px"}}>✓</span>Claim staked. First dispatch incoming.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ HERO ═══ */}
        <header style={{ padding: "160px 40px 80px", position: "relative", overflow: "hidden" }}>
          <SectionFlakes count={8} seed={1} />
          <div style={{ maxWidth: "720px", margin: "0 auto", position: "relative", zIndex: 2 }}>
            <div className="fade-in fade-d1" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#d4897a" }}>{META.series}</span>
              <span style={{ color: "rgba(212,137,122,0.3)" }}>·</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#6b6760" }}>{META.date}</span>
              <span style={{ color: "rgba(212,137,122,0.3)" }}>·</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#6b6760" }}>{META.readTime}</span>
            </div>

            <h1 className="fade-in fade-d2" style={{
              fontFamily: "'Figtree', sans-serif", fontSize: "clamp(42px, 6vw, 64px)", fontWeight: 800,
              lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "16px",
            }}>{META.title}</h1>

            <p className="fade-in fade-d3" style={{
              fontFamily: "'Figtree', sans-serif", fontSize: "22px", fontStyle: "italic",
              color: "#9a958e", lineHeight: 1.5, marginBottom: "36px",
            }}>{META.subtitle}</p>

            <div className="fade-in fade-d4" style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(212,137,122,0.2), rgba(212,137,122,0.08))",
                  border: "1px solid rgba(212,137,122,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "15px", fontWeight: 700, color: "#d4897a",
                }}>JM</div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>{META.author}</div>
                  <div style={{ fontSize: "13px", color: "#6b6760", fontFamily: "'JetBrains Mono', monospace" }}>{META.role}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {SOCIALS.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" title={`Follow on ${s.label}`}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: "34px", height: "34px", borderRadius: "8px",
                      color: "#6b6760", background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      textDecoration: "none", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#d4897a"; e.currentTarget.style.borderColor = "rgba(212,137,122,0.25)"; e.currentTarget.style.background = "rgba(212,137,122,0.06)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#6b6760"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  >{s.icon}</a>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <ShareBar url="https://labs.renjoy.com/essays/stake-your-claim" title="Stake Your Claim — Renjoy Labs" />
            </div>
          </div>
        </header>

        {/* ═══ TABLE OF CONTENTS ═══ */}
        <div style={{ padding: "0 40px 48px" }}>
          <div style={{
            maxWidth: "720px", margin: "0 auto", padding: "24px 28px",
            background: "rgba(255,235,232,0.015)", borderRadius: "14px",
            border: "1px solid rgba(212,137,122,0.06)",
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 600,
              letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6760",
              marginBottom: "14px",
            }}>In this essay</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {TOC.map((item, i) => (
                <a key={i} href={`#${item.id}`} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  textDecoration: "none", color: "#9a958e", fontSize: "14px",
                  fontWeight: 500, transition: "color 0.2s", lineHeight: 1.4,
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "#d4897a"}
                  onMouseLeave={e => e.currentTarget.style.color = "#9a958e"}
                >
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
                    color: "rgba(212,137,122,0.35)", minWidth: "20px",
                  }}>{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ ARTICLE BODY ═══ */}
        <article style={{ padding: "0 40px 80px", position: "relative" }}>
          <SectionFlakes count={6} seed={2} />
          <div style={{ maxWidth: "720px", margin: "0 auto", position: "relative", zIndex: 2 }}>

            <P>On January 24, 1848, James Marshall spotted something shining at Sutter's Mill. Within weeks, San Francisco was a ghost town. Sutter's own laborers deserted him. First they left in small groups, then all of them, from the clerks to the cooks. The <em>San Francisco Californian</em> ran one final editorial lamenting that the whole country echoed with the cry of gold while fields sat half-planted and houses half-built. Then the newspaper's staff walked off the job too.</P>

            <P>The economics explain the madness. A common laborer earned $1 per day in 1847. By 1849, that same laborer could earn $7 per day, a wage premium that made the gold fields an economically rational choice for almost anyone with functioning legs. Nearly 100,000 people set out for California in 1849 alone, roughly equivalent to 1.45 million people today.</P>

            <P>I've been thinking about this a lot recently as I try to wrap my mind around the age of AI. Not because I'm a gold rush historian, but because I run a company and I recognize the feelings many of us share. Fear. Excitement. Disbelief. Astonishment. Incredulity. That something foundational is happening.</P>

            <P>The ground under your feet is different than it was two years ago. Heck, even two months ago. And the most natural human response to that kind of shift is to stand still and wait for clarity.</P>

            <P>I think that's the wrong move. It was the wrong move in 1848, and it's the wrong move now.</P>

            <H2 id="shovels">The man who sold the shovels</H2>

            <P>Samuel Brannan didn't grab a pan when gold was discovered. He grabbed the supply chain. He bought every pick, shovel, and mining pan in the region for about 20 cents each, then sprinted through Portsmouth Square waving a bottle of gold dust and shouting about riches on the American River. He sold those same pans for $15 apiece — a 7,400% markup — and his store peaked at $5,000 per day in sales, roughly $125,000 in today's dollars. He became California's first millionaire without mining a single ounce of gold.</P>

            <P>Philip Armour saw a different angle. Before building his $110 million meatpacking empire, Armour earned his initial fortune not by mining, but by employing out-of-work miners to build sluices and aqueducts. He didn't sell supplies to miners or mine himself. He hired the misfortunate to build infrastructure. A third archetype entirely.</P>

            <P>Levi Strauss showed up in 1853 as a dry goods wholesaler, not a tailor. He sold cloth, bedding, and supplies to general stores across gold country. The jeans came later when a customer named Jacob Davis wrote to him about copper-riveted work pants that could survive the mines but couldn't afford the $68 patent fee. Strauss could. They filed the patent in 1873, and a $6 billion brand was born from a supply-chain insight, not a gold strike.</P>

            <P>Leland Stanford ran a general store for miners. He used gold rush profits to co-found the Central Pacific Railroad with three other Sacramento merchants. Stanford later served as governor and senator, and after his son died of typhoid, he and his wife donated $40 million to found a university. In fact, the very one that would seed Silicon Valley.</P>

            <P>The wealth distribution data tells the same story from the other side. Roughly 10% of gold-seekers realized any profit after accounting for costs. Only the top 4% made a profit worth mentioning. <B>Just 1% became rich.</B> While the "easy gold" of 1848 allowed miners to average $20 per day, by 1853 average daily yields plummeted to less than $6 per day.</P>

            <PQ tweet="The people who build the tools outlast the people who chase the treasure. The miners went bust when the easy placer gold dried up. The merchants built dynasties.">The people who build the tools outlast the people who chase the treasure. The miners went bust when the easy placer gold dried up. The merchants built dynasties.</PQ>

            <H2 id="color">Finding color</H2>

            <P>There's a term from the diggings called "finding color" — when minute particles of gold appear in your pan. Not enough to celebrate. Not a bonanza. Just the first sign that something valuable might be present in the ground you're working.</P>

            <P>That's where most of us are right now with AI. We've found color. We're seeing the first glimmers. A task that used to take four hours now takes twenty minutes. A team of three doing work that used to need twelve. A founder building a product without a CTO. Not enough to declare victory. But enough to keep working the claim.</P>

            <P>The question is what you do next. Because in 1848, finding color was the easy part. What separated the people who built lasting wealth from the people who went broke was never about who found gold first. It was about what they built around it.</P>

            <P>But here's the thing about staking a claim in 1849: it didn't just mean panning for gold. The smartest claims weren't on the riverbed. They were on the supply route, the town square, the trail every miner had to walk through. Brannan staked his claim on the supply chain. Stanford staked his on the crossroads. The claim worth staking was never the gold itself. It was the ground where you could build something that would still be standing after the rush moved on.</P>

            <H2 id="modern">The modern shovel sellers</H2>

            <P>NVIDIA is this era's Samuel Brannan. The company reached $130.5 billion in annual revenue by fiscal 2025, up from $27 billion two years earlier. They achieved this by selling GPUs to everyone building AI. They don't build the intelligence — they sell the picks.</P>

            <P>The cloud providers — AWS, Azure, Google Cloud — are the railroads, the physical infrastructure on which everything runs. Satya Nadella admitted the bottleneck is electricity. They have chips sitting in inventory they can't plug in. The constraint has become physical. Just like building a railroad through the Sierra Nevada was physical.</P>

            <P>Yet the democratization parallel is the one that matters most to anyone reading this. Just as any person could stake a gold claim in 1849, anyone can now build with AI. Solo-founded startups rose from about 22% of new companies in 2015 to 38% in 2024. We're going to see that percentage explode in 2026. Small teams are shipping products that would've required fifty engineers a year ago. The tools for building a great company aren't locked behind capital anymore.</P>

            <P>But here's where the analogy becomes somewhat strained. The 1849 gold fields were radically decentralized. Any person with a pan could try their luck, whereas the AI infrastructure layer is dominated by a handful of hyperscalers. The tools are democratized. The picks and shovels are affordable. But the mines themselves — the massive GPU clusters and energy contracts — are concentrated in ways the gold fields never were. You can build on top of this infrastructure, but you don't own it unless you move compute on premises and build agents with open source models.</P>

            <H2 id="skeptics">The skeptics always show up</H2>

            <P>When the first gold reports reached San Francisco, citizens tested the ore with spyglasses and iron ladles. Many who couldn't confirm it through their own experiments declared the whole thing a humbug. The doubt persisted because people couldn't fathom that something so valuable had been sitting there undiscovered. Accepting the news meant accepting that they'd been standing on gold the whole time.</P>

            <P>Sound familiar?</P>

            <P>Every frontier generates the same three reactions. There are the people who rush in blindly. There are the people who refuse to believe. And then there are the people who pay attention, figure out what the new world actually rewards, and build for it.</P>

            <P>The man who literally owned the land where gold was discovered is a cautionary tale. John Sutter clung to his old agricultural empire while the new reality dismantled it. Workers deserted. Squatters overran his land. The man at the epicenter of history's greatest wealth event died penniless, petitioning Congress for money that never came.</P>

            <P><B>Sutter didn't fail because the opportunity wasn't real. He failed because he couldn't let go of the model that used to work.</B></P>

            <H2 id="behind">What gold rushes leave behind</H2>

            <P>The strongest argument for embracing any gold rush is what it builds.</P>

            <P>San Francisco went from about 200 people in 1846 to nearly 57,000 by 1860. A settlement of tents became the commercial capital of the Pacific with churches, theaters, schools, and newspapers. The Transcontinental Railroad, funded by the profits of gold rush merchants, remade the country. Wells Fargo, founded in 1852 to serve gold rush banking, became the dominant financial institution of the West.</P>

            <P>In the Klondike, Dawson City erupted from 500 to 17,000 in two years, gaining fire hydrants and electric lights faster than most established cities. The rush created the Yukon Territory itself, doubled Vancouver's population, and vindicated the Alaska Purchase — which had been derided for decades as "Seward's Folly" until gold made it the gateway to the north.</P>

            <P>The dot-com bubble left behind the fiber-optic cables that power the modern internet. Railroad tracks laid during speculative manias carried freight for a century. AI is deep in the Frenzy stage of the Installation Phase. Massive capital is flooding into data centers and chips, laying the groundwork for a future deployment period where AI becomes invisible, embedded, and everywhere.</P>

            <PQ tweet="The opportunity wasn't in the gold. It was in the people who came for the gold.">The opportunity wasn't in the gold. It was in the people who came for the gold.</PQ>

            <P>Belinda Mulrooney, the Klondike's richest woman, understood this intuitively. She arrived in Dawson with goods she'd hauled over the Chilkoot Pass — silk underwear, cotton cloth, hot water bottles. Once she arrived, she tossed her last coin into the river. Her goods netted a 600% profit. She built Dawson's finest hotel and brought the town its first telephone.</P>

            <H2 id="stake">Stake your claim</H2>

            <P>Of the roughly 100,000 people who set out for the Klondike, only about 4,000 found gold and only a few hundred struck it rich. The individual outcomes were brutal, random, and often unfair. But the collective outcome was civilization: cities, railroads, universities, and industries that outlasted every individual prospector's story.</P>

            <P>The fear around AI is real and I won't dismiss it. I've felt it myself. I think we're going to see a lot of creative destruction these next several years as entire business models are rethought and new nimble companies challenge massive incumbents.</P>

            <P>But here's what the gold rushes actually teach us, if we're willing to learn: The miners who chased the easy placer gold went broke when the streams dried up. They bet everything on extraction and had nothing when the resource thinned out. The skeptics who declared it all a humbug showed up after the early information advantage had evaporated and the easy claims were picked clean. And the incumbents like Sutter — the ones who owned the land but refused to adapt — lost everything because they couldn't let go of the model that used to work.</P>

            <P>The people who built lasting wealth did something different. Brannan controlled the supply chain before anyone knew they needed supplies. Armour hired the people who failed and put them to work building infrastructure. Strauss spotted a patent opportunity buried in a customer letter. Stanford reinvested merchant profits into a railroad and then a university. Mulrooney looked at a gold camp full of cold, dirty miners and saw a market for silk and hot water and fine hotels.</P>

            <P><B>None of them mined gold. All of them built something that outlasted the rush.</B></P>

            <P>The barrier to building something right now has never been lower. An API key, a laptop, and an idea worth testing is the modern equivalent of a pan, a shovel, and a claim stake. Capital isn't the bottleneck anymore.</P>

            <P>But "build something" isn't enough. The gold rushes are specific about what works. Solve a real problem that the rush itself creates. Build the infrastructure that everyone else depends on. Serve the people who show up, not the resource they're chasing. And if you're already running a company, ask yourself the hardest question Sutter never asked: <em>is the model you're protecting still the model worth building?</em></P>

            <P>I think about this every day at my own company. We manage vacation rental properties, and for years this industry has operated like miners — chasing individual bookings, clinging to manual processes, treating every property as a claim to be extracted from. The Sutter trap is everywhere in our space. We made a deliberate choice to stop panning and start building. We're investing in AI-first operations, building systems that scale, and betting everything on the idea that the opportunity isn't in the properties themselves — it's in the owners who trust us with them and the guests who walk through the doors.</P>

            <P>We didn't stake our claim on a riverbed. We staked it on the supply route, on the infrastructure and hospitality that every property owner in this industry is going to need as AI reshapes what's possible. That bet is far from proven. But the gold rushes are clear about one thing: the people who widened what staking a claim meant — succeeded.</P>

            <P><B>We believe the new limits in the age of AI are ambition, creativity, and the laws of physics.</B></P>

            <P>We've staked our claim not on the gold, but on serving the prospectors. Where will you stake yours?</P>

            {/* Series footer */}
            <div style={{
              marginTop: "64px", padding: "24px 0", borderTop: "1px solid rgba(212,137,122,0.1)",
              fontFamily: "'Figtree', sans-serif", fontSize: "16px", fontStyle: "italic", color: "#6b6760",
            }}>
              This is the first essay in a series on what the gold rushes teach us about building hospitality companies in the age of AI.
            </div>
          </div>
        </article>

        {/* ═══ SHARE BAR ═══ */}
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 40px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#6b6760", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>If this was useful, share it</p>
            <ShareBar url="https://labs.renjoy.com/essays/stake-your-claim" title="Stake Your Claim — Renjoy Labs" />
          </div>
        </div>

        {/* ═══ NEWSLETTER ═══ */}
        <section id="newsletter" style={{ padding: "80px 40px", position: "relative", zIndex: 2 }}>
          <div style={{
            maxWidth: "600px", margin: "0 auto", background: "linear-gradient(135deg, rgba(212,137,122,0.04), rgba(212,137,122,0.015))",
            borderRadius: "20px", border: "1px solid rgba(212,137,122,0.1)", padding: "48px 40px", textAlign: "center",
          }}>
            <div style={{ fontSize: "24px", marginBottom: "16px" }}>⛏</div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d4897a", display: "block", marginBottom: "12px" }}>The Mining Report</span>
            <h3 style={{ fontFamily: "'Figtree', sans-serif", fontSize: "26px", fontWeight: 800, marginBottom: "10px" }}>Dispatches from the diggings.</h3>
            <p style={{ fontSize: "15px", color: "#9a958e", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto 24px" }}>A biweekly newsletter on AI, hospitality, and what we're learning as we build. No hype. Just the color we're finding in the pan.</p>
            {!subscribed ? (
              <div style={{ display: "flex", gap: "10px", maxWidth: "400px", margin: "0 auto" }}>
                <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1, padding: "12px 16px", borderRadius: "10px", background: "rgba(25,12,18,0.5)", border: "1px solid rgba(212,137,122,0.12)", color: "#e8e4df", fontSize: "15px", fontFamily: "'Figtree', sans-serif", outline: "none" }} />
                <button onClick={() => { if (email.includes("@")) { setSubscribed(true); submitLead({type:"newsletter",email,source:"essay_stake-your-claim_inline"}); } }}
                  style={{ background: "linear-gradient(135deg, #e05a3a, #c94a30)", color: "#fff", padding: "12px 20px", borderRadius: "10px", border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "'Figtree', sans-serif", whiteSpace: "nowrap" }}>
                  Stake a Claim
                </button>
              </div>
            ) : (
              <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "12px", padding: "14px 24px", maxWidth: "400px", margin: "0 auto" }}>
                <span style={{ color: "#4ade80", fontSize: "14px", fontWeight: 500 }}>✓ Claim staked. First dispatch incoming.</span>
              </div>
            )}
          </div>
        </section>

        {/* ═══ RELATED ═══ */}
        <section style={{ padding: "60px 40px 100px", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#d4897a", display: "block", marginBottom: "24px" }}>Continue Reading</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {RELATED.map((r, i) => (
                <a key={i} href={r.link} style={{
                  display: "block", padding: "28px", borderRadius: "16px", textDecoration: "none",
                  background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)",
                  transition: "all 0.3s ease", color: "#e8e4df",
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d4897a" }}>{r.tag}</span>
                  <h4 style={{ fontFamily: "'Figtree', sans-serif", fontSize: "22px", fontWeight: 700, margin: "12px 0 8px", lineHeight: 1.25 }}>{r.title}</h4>
                  <p style={{ fontSize: "14px", color: "#9a958e", lineHeight: 1.5 }}>{r.subtitle}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: "30px 40px", borderTop: "1px solid rgba(212,137,122,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "720px", margin: "0 auto" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.02em" }}>renjoy</span><span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", color: "#d4897a", background: "rgba(212,137,122,0.08)", padding: "3px 9px", borderRadius: "5px", fontFamily: "'JetBrains Mono', monospace", border: "1px solid rgba(212,137,122,0.12)" }}>LABS</span></span>
          <span style={{ fontSize: "12px", color: "#6b6760", fontFamily: "'JetBrains Mono', monospace" }}>Colorado Springs · Salida · Buena Vista · Cripple Creek</span>
        </footer>
      </div>
    </>
  );
}
