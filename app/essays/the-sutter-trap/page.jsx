"use client";
import { useState, useEffect, useMemo } from "react";
import { submitLead } from "../../../lib/submitLead";

const META = {
  title: "The Sutter Trap",
  subtitle: "Why the best operators are the most at risk",
  date: "March 2026",
  readTime: "16 min read",
  series: "Essay 3 of 3",
  author: "Jacob Mueller",
  role: "CEO, Renjoy",
};

const TOC = [
  { id: "what-is", label: "What is the Sutter Trap?" },
  { id: "vrm-version", label: "The VRM version of the Sutter Trap" },
  { id: "resist", label: "Why good operators resist" },
  { id: "five-signs", label: "Five signs you're in the Sutter Trap" },
  { id: "should-have", label: "What Sutter should have done" },
  { id: "for-us", label: "What this looks like for us" },
  { id: "gold-always", label: "The gold was always there" },
];

const SOCIALS = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/jacobtmueller/", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label: "X", url: "https://x.com/Jacobtmueller", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
];

const RELATED = [
  { title: "Stake Your Claim", subtitle: "What the gold rushes actually teach us about the AI frontier", tag: "Essay 1", link: "/essays/stake-your-claim" },
  { title: "The Mulrooney Play", subtitle: "Why the best VRM companies won't look like VRM companies", tag: "Essay 2", link: "/essays/the-mulrooney-play" },
];

function NoiseOverlay() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.035, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#noise)" /></svg>
    </div>
  );
}

function SectionFlakes({ count = 5, seed = 0 }) {
  const flakes = useMemo(() => {
    const rng = (i) => { const v = Math.sin((seed+1)*9301+i*4973)*10000; return v-Math.floor(v); };
    return Array.from({ length: count }, (_, i) => {
      const r=rng(i),r2=rng(i+100),r3=rng(i+200),r4=rng(i+300); const size=2+r*4;
      return { x:5+r2*90, y:8+r3*84, size, opacity:0.18+r*0.3, duration:5+r4*7, delay:r2*8, glow:size>4?6+r*10:0, isDiamond:r>0.6, shimmer:size>5, drift:(r3-0.5)*8 };
    });
  }, [count, seed]);
  return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0 }}>
      {flakes.map((f,i)=>(
        <div key={i} style={{ position:"absolute",left:`${f.x}%`,top:`${f.y}%`,width:`${f.size}px`,height:`${f.size}px`,
          borderRadius:f.isDiamond?"1px":"50%",transform:f.isDiamond?"rotate(45deg)":"none",
          background:f.shimmer?`linear-gradient(135deg,rgba(232,169,158,${f.opacity}),rgba(212,137,122,${f.opacity}))`:`rgba(212,137,122,${f.opacity})`,
          animation:f.shimmer?`flakeFloat ${f.duration}s ease-in-out infinite,flakeShimmer ${2+f.delay*0.3}s ease-in-out infinite`:`flakeFloat ${f.duration}s ease-in-out infinite`,
          animationDelay:`${f.delay}s`, boxShadow:f.glow>0?`0 0 ${f.glow}px rgba(212,137,122,${f.opacity*0.45})`:"none",
        }}/>
      ))}
    </div>
  );
}

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

function H2({children,id}){return(<h2 id={id} style={{fontFamily:"'Figtree',sans-serif",fontSize:"32px",fontWeight:800,lineHeight:1.2,letterSpacing:"-0.02em",marginTop:"64px",marginBottom:"24px",color:"#e8e4df",scrollMarginTop:"80px"}}>{children}</h2>);}
function P({children}){return(<p style={{fontSize:"18px",lineHeight:1.8,color:"#b5b0a8",marginBottom:"24px"}}>{children}</p>);}
function B({children}){return(<strong style={{color:"#e8e4df",fontWeight:600}}>{children}</strong>);}

export default function SutterTrap() {
  const [scrollY,setScrollY]=useState(0);
  const [email,setEmail]=useState("");
  const [subscribed,setSubscribed]=useState(false);
  const [showModal,setShowModal]=useState(false);
  const [modalEmail,setModalEmail]=useState("");
  const [modalSubscribed,setModalSubscribed]=useState(false);
  useEffect(()=>{const h=()=>setScrollY(window.scrollY);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h);},[]);
  const [docHeight,setDocHeight]=useState(1);
  useEffect(()=>{const u=()=>setDocHeight(document.documentElement.scrollHeight-window.innerHeight||1);u();window.addEventListener("resize",u);return()=>window.removeEventListener("resize",u);},[]);
  const progress=Math.min(scrollY/docHeight,1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box} html{scroll-behavior:smooth}
        @keyframes flakeFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(1.15)}}
        @keyframes flakeShimmer{0%,100%{filter:brightness(1)}50%{filter:brightness(1.8)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes modalFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes modalSlideUp{from{opacity:0;transform:translateY(20px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        .fade-in{animation:fadeUp .6s ease forwards} .fade-d1{animation-delay:.1s;opacity:0} .fade-d2{animation-delay:.2s;opacity:0} .fade-d3{animation-delay:.3s;opacity:0} .fade-d4{animation-delay:.4s;opacity:0}
        ::selection{background:rgba(212,137,122,0.3);color:#fff}
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#1e0f16} ::-webkit-scrollbar-thumb{background:rgba(212,137,122,0.2);border-radius:3px}
      `}</style>

      <div style={{background:"#1e0f16",color:"#e8e4df",minHeight:"100vh",fontFamily:"'Figtree',sans-serif"}}>
        <NoiseOverlay />

        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:200,height:"3px",background:"rgba(255,255,255,0.03)"}}>
          <div style={{height:"100%",width:`${progress*100}%`,background:"linear-gradient(90deg,#d4897a,#e8a99e)",transition:"width 0.1s linear"}}/>
        </div>

        <nav style={{position:"fixed",top:"3px",left:0,right:0,zIndex:100,padding:"16px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:scrollY>80?"rgba(30,15,22,0.92)":"transparent",backdropFilter:scrollY>80?"blur(24px)":"none",borderBottom:scrollY>80?"1px solid rgba(212,137,122,0.06)":"1px solid transparent",transition:"all 0.3s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <a href="/" style={{color:"#e8e4df",textDecoration:"none",fontSize:"20px",fontWeight:700,letterSpacing:"-0.02em"}}>renjoy</a>
            <span style={{fontSize:"11px",fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"#d4897a",background:"rgba(212,137,122,0.08)",padding:"4px 12px",borderRadius:"6px",fontFamily:"'JetBrains Mono',monospace",border:"1px solid rgba(212,137,122,0.15)"}}>LABS</span>
          </div>
          <button onClick={()=>setShowModal(true)} style={{background:"linear-gradient(135deg,#e05a3a,#c94a30)",color:"#fff",padding:"8px 20px",borderRadius:"8px",border:"none",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"'Figtree',sans-serif"}}>Subscribe</button>
        </nav>

        {showModal&&(<div onClick={e=>{if(e.target===e.currentTarget)setShowModal(false)}} style={{position:"fixed",inset:0,zIndex:200,background:"rgba(25,12,18,0.82)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",animation:"modalFadeIn 0.25s ease forwards"}}><div style={{background:"linear-gradient(135deg,#281620,#22121a)",border:"1px solid rgba(212,137,122,0.12)",borderRadius:"24px",padding:"52px 48px",maxWidth:"460px",width:"100%",position:"relative",textAlign:"center",boxShadow:"0 24px 80px rgba(0,0,0,0.5),0 0 60px rgba(212,137,122,0.04)",animation:"modalSlideUp 0.3s ease forwards",overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-60px",left:"50%",transform:"translateX(-50%)",width:"300px",height:"200px",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(212,137,122,0.06) 0%,transparent 70%)",filter:"blur(40px)",pointerEvents:"none"}}/>
          {[{top:"12px",left:"12px",borderTop:"1px solid rgba(212,137,122,0.12)",borderLeft:"1px solid rgba(212,137,122,0.12)"},{top:"12px",right:"12px",borderTop:"1px solid rgba(212,137,122,0.12)",borderRight:"1px solid rgba(212,137,122,0.12)"},{bottom:"12px",left:"12px",borderBottom:"1px solid rgba(212,137,122,0.12)",borderLeft:"1px solid rgba(212,137,122,0.12)"},{bottom:"12px",right:"12px",borderBottom:"1px solid rgba(212,137,122,0.12)",borderRight:"1px solid rgba(212,137,122,0.12)"}].map((s,i)=>(<div key={i} style={{position:"absolute",width:"18px",height:"18px",...s}}/>))}
          <button onClick={()=>setShowModal(false)} style={{position:"absolute",top:"16px",right:"16px",background:"none",border:"none",color:"#6b6760",fontSize:"20px",cursor:"pointer",width:"32px",height:"32px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          <div style={{width:"56px",height:"56px",borderRadius:"16px",margin:"0 auto 24px",background:"rgba(212,137,122,0.08)",border:"1px solid rgba(212,137,122,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"26px",position:"relative"}}>⛏</div>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",color:"#d4897a",display:"block",marginBottom:"14px"}}>The Mining Report</span>
          <h3 style={{fontFamily:"'Figtree',sans-serif",fontSize:"30px",fontWeight:800,lineHeight:1.2,marginBottom:"12px",position:"relative"}}>Dispatches from<br/>the diggings.</h3>
          <p style={{fontSize:"15px",lineHeight:1.65,color:"#9a958e",maxWidth:"340px",margin:"0 auto 28px",position:"relative"}}>A biweekly newsletter on AI, hospitality, and building in the age of the gold rush. No hype. Just the color we're finding in the pan.</p>
          {!modalSubscribed?(<><div style={{display:"flex",gap:"10px",maxWidth:"360px",margin:"0 auto",position:"relative"}}><input type="email" placeholder="your@email.com" value={modalEmail} onChange={e=>setModalEmail(e.target.value)} autoFocus style={{flex:1,padding:"14px 18px",borderRadius:"10px",background:"rgba(25,12,18,0.55)",border:"1px solid rgba(212,137,122,0.15)",color:"#e8e4df",fontSize:"15px",fontFamily:"'Figtree',sans-serif",outline:"none"}} onFocus={e=>e.target.style.borderColor="rgba(212,137,122,0.4)"} onBlur={e=>e.target.style.borderColor="rgba(212,137,122,0.15)"} onKeyDown={e=>{if(e.key==="Enter"&&modalEmail.includes("@")){setModalSubscribed(true);submitLead({type:"newsletter",email:modalEmail,source:"essay_sutter-trap_modal"})}}}/><button onClick={()=>{if(modalEmail.includes("@")){setModalSubscribed(true);submitLead({type:"newsletter",email:modalEmail,source:"essay_sutter-trap_modal"})}}} style={{background:"linear-gradient(135deg,#e05a3a,#c94a30)",color:"#fff",padding:"14px 22px",borderRadius:"10px",border:"none",fontSize:"15px",fontWeight:600,cursor:"pointer",fontFamily:"'Figtree',sans-serif",whiteSpace:"nowrap"}}>Stake a Claim</button></div><p style={{fontSize:"12px",color:"#4a4640",marginTop:"16px",fontFamily:"'JetBrains Mono',monospace",position:"relative"}}>No spam. Unsubscribe anytime.</p></>):(<div style={{background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:"12px",padding:"18px 24px",maxWidth:"360px",margin:"0 auto",position:"relative"}}><span style={{color:"#4ade80",fontSize:"15px",fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}><span style={{fontSize:"18px"}}>✓</span>Claim staked. First dispatch incoming.</span></div>)}
        </div></div>)}

        <header style={{padding:"160px 40px 80px",position:"relative",overflow:"hidden"}}>
          <SectionFlakes count={8} seed={20}/>
          <div style={{maxWidth:"720px",margin:"0 auto",position:"relative",zIndex:2}}>
            <div className="fade-in fade-d1" style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px",flexWrap:"wrap"}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#d4897a"}}>{META.series}</span>
              <span style={{color:"rgba(212,137,122,0.3)"}}>·</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"#6b6760"}}>{META.date}</span>
              <span style={{color:"rgba(212,137,122,0.3)"}}>·</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"#6b6760"}}>{META.readTime}</span>
            </div>
            <h1 className="fade-in fade-d2" style={{fontFamily:"'Figtree',sans-serif",fontSize:"clamp(42px,6vw,64px)",fontWeight:800,lineHeight:1.1,letterSpacing:"-0.03em",marginBottom:"16px"}}>{META.title}</h1>
            <p className="fade-in fade-d3" style={{fontFamily:"'Figtree',sans-serif",fontSize:"22px",fontStyle:"italic",color:"#9a958e",lineHeight:1.5,marginBottom:"36px"}}>{META.subtitle}</p>
            <div className="fade-in fade-d4" style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:"24px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
                <div style={{width:"44px",height:"44px",borderRadius:"50%",background:"linear-gradient(135deg,rgba(212,137,122,0.2),rgba(212,137,122,0.08))",border:"1px solid rgba(212,137,122,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",fontWeight:700,color:"#d4897a"}}>JM</div>
                <div><div style={{fontSize:"15px",fontWeight:600}}>{META.author}</div><div style={{fontSize:"13px",color:"#6b6760",fontFamily:"'JetBrains Mono',monospace"}}>{META.role}</div></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                {SOCIALS.map((s,i)=>(
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" title={`Follow on ${s.label}`}
                    style={{display:"flex",alignItems:"center",justifyContent:"center",width:"34px",height:"34px",borderRadius:"8px",color:"#6b6760",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",textDecoration:"none",transition:"all 0.2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.color="#d4897a";e.currentTarget.style.borderColor="rgba(212,137,122,0.25)";e.currentTarget.style.background="rgba(212,137,122,0.06)"}}
                    onMouseLeave={e=>{e.currentTarget.style.color="#6b6760";e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";e.currentTarget.style.background="rgba(255,255,255,0.03)"}}
                  >{s.icon}</a>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <ShareBar url="https://labs.renjoy.com/essays/the-sutter-trap" title="The Sutter Trap — Renjoy Labs" />
            </div>
          </div>
        </header>

        {/* ═══ TABLE OF CONTENTS ═══ */}
        <div style={{padding:"0 40px 48px"}}>
          <div style={{maxWidth:"720px",margin:"0 auto",padding:"24px 28px",background:"rgba(255,235,232,0.015)",borderRadius:"14px",border:"1px solid rgba(212,137,122,0.06)"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#6b6760",marginBottom:"14px"}}>In this essay</div>
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              {TOC.map((item,i)=>(
                <a key={i} href={`#${item.id}`} style={{display:"flex",alignItems:"center",gap:"12px",textDecoration:"none",color:"#9a958e",fontSize:"14px",fontWeight:500,transition:"color 0.2s",lineHeight:1.4}}
                  onMouseEnter={e=>e.currentTarget.style.color="#d4897a"} onMouseLeave={e=>e.currentTarget.style.color="#9a958e"}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"rgba(212,137,122,0.35)",minWidth:"20px"}}>{String(i+1).padStart(2,"0")}</span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <article style={{padding:"0 40px 80px",position:"relative"}}>
          <SectionFlakes count={6} seed={21}/>
          <div style={{maxWidth:"720px",margin:"0 auto",position:"relative",zIndex:2}}>

            <P>John Sutter was not a failure. That's the part everyone gets wrong.</P>

            <P>By 1847, Sutter had built one of the most impressive private enterprises in the American West. His compound, which he called New Helvetia, covered roughly 150,000 acres in the Sacramento Valley. He employed hundreds of workers. He ran a flour mill, a blanket factory, a tannery, and a distillery. He was producing crops at a scale that made him the agricultural anchor of Northern California. The Mexican government had granted him the land. The American military consulted him. Traders and settlers passed through his fort as a matter of course.</P>

            <P>Sutter had built a real business. A diversified operation with multiple revenue streams, a loyal workforce, and a physical footprint that would be impressive by any era's standards. He was the incumbent, and he had earned it.</P>

            <P>Then, on January 24, 1848, a carpenter named James Marshall found gold in the tailrace of a sawmill Sutter was building on the American River. And within 18 months, everything Sutter had built was gone.</P>

            <P>His workers deserted. First in small groups, then all of them, from the clerks to the cooks. Squatters overran his land. His livestock was stolen. His crops went unharvested. He spent the last decades of his life petitioning Congress for compensation that never came. He died in 1880 in a Washington D.C. boarding house, essentially broke.</P>

            <P>The man at the epicenter of the greatest wealth event in American history lost everything. Not because the opportunity wasn't real, but because he couldn't let go of the model that used to work.</P>

            <P>I've been thinking about Sutter a lot recently. Not as a historical curiosity, but as a warning. Because the Sutter Trap isn't a story about the 1840s. It's a pattern, and it's playing out right now across the vacation rental industry as AI rewrites the rules of how businesses operate.</P>

            <H2 id="what-is">What is the Sutter Trap?</H2>

            <P>The Sutter Trap is what happens when a successful operator's greatest asset, their working business model, becomes the very thing that prevents them from adapting to a fundamental shift.</P>

            <P>Sutter's problem wasn't ignorance. He knew gold had been found. He was literally standing on it. His problem was that acknowledging what gold meant for the world required him to abandon the identity and the operation he'd spent a decade building. He was an agricultural magnate. That's who he was. And the idea that the world might now reward something entirely different wasn't just inconvenient, it was existential for him.</P>

            <P>So he did what most successful operators do when the ground shifts. He tried to suppress it. He asked Marshall to keep the discovery quiet. He doubled down on his existing plans. He kept building the sawmill. He stuck his head in the proverbial sand.</P>

            <P>Clayton Christensen named this pattern 150 years later in <em>The Innovator's Dilemma</em> — and if you haven't revisited that book since AI started reshaping every industry, now's the time. Christensen studied why well-managed, profitable, customer-focused companies routinely got displaced by inferior ones. His conclusion was counterintuitive: they failed precisely because they were well-managed. They listened to their current customers, invested in proven product lines, and optimized the business model that was working. They did everything right, and that's what killed them. The disruptive technology didn't have to be better. It just had to be cheaper, simpler, or more accessible, and then it improved fast enough to eat the incumbent's market from below.</P>

            <P>Sutter was living Christensen's thesis a century before it was written. His agricultural empire was the sustaining technology. Gold was the disruption. And Sutter's rational, experienced, operationally sound response to that disruption was exactly wrong.</P>

            <H2 id="vrm-version">The VRM version of the Sutter Trap</H2>

            <P>I see this pattern everywhere in vacation rental management. And here's what makes it so sneaky: the operators most at risk aren't the struggling ones. They're the ones who are doing well.</P>

            <P>If you're running 50 to 150 properties and the business is profitable, you have a team that knows how to execute, your owners are mostly happy, and your reviews are solid, you are the most likely person in this industry to get disrupted by AI. Not because you're doing something wrong but because everything is working.</P>

            <P>Let me be specific about what "working" looks like in VRM right now and why it's deceptive.</P>

            <P>Your guest communication process works because you have a great team member who answers messages fast. But an AI agent can now handle 90% of those messages instantly, around the clock, in multiple languages, and at higher quality. The operator down the road who deploys that agent didn't just match your response time. They eliminated it as a variable entirely. Your competitive advantage evaporated.</P>

            <P>Your pricing strategy works because you've been in the market for years and you have good intuition. But machine learning models are now processing market data, competitor rates, booking velocity, and seasonal patterns in real time, adjusting prices multiple times per day. The new operator who showed up last year with 20 properties and an AI-driven pricing engine is capturing revenue you're leaving on the table every night.</P>

            <P>Your owner relationships work because you're personally available. You pick up the phone. You remember their kids' names. That matters, and it will keep mattering. But the operator who combines that personal touch with automated owner reporting, proactive maintenance alerts generated by predictive models, and real-time portfolio dashboards isn't just matching your service. They're redefining what owners expect from everyone else, including you.</P>

            <P>This is the Sutter Trap in action. Your success has trained you to trust a model that is quietly becoming obsolete. Not because it's bad. Because the baseline is rising beneath it.</P>

            <H2 id="resist">Why good operators resist</H2>

            <P>Christensen's most uncomfortable insight is that successful companies don't fail at AI because of laziness or stupidity. They fail from good discipline. They do what good businesses are supposed to do: they listen to their best customers, they invest in their most profitable product lines, and they optimize their existing operations. The problem is that disruptive shifts don't come from your best customers. They come from the competitors.</P>

            <P>In VRM, the equivalent pattern is clear. The operators who've built something real are optimizing their current model. They're hiring better people, tightening their processes, maybe upgrading their PMS, maybe even implementing AI on the edges. These are all rational investments.</P>

            <P>Meanwhile, a different kind of operator is emerging. They're smaller, leaner, and built from day one around AI as a core operating layer, not a bolt-on. They don't have legacy processes to protect because they never had them. They don't have a team of 15 whose jobs depend on the current workflow because they built the workflow around four people and a set of AI agents. They look unimpressive today. They're managing 30 units. Maybe 40. Their brand isn't polished. They don't have your market relationships.</P>

            <P>But they're improving fast. And they're improving on a cost curve that your model can't match.</P>

            <P>This is exactly how disruption works. The new entrant isn't better than the incumbent on the metrics the incumbent cares about. Not yet. But they're operating on fundamentally different economics. And by the time the incumbent notices, the gap has already closed.</P>

            <H2 id="five-signs">Five signs you're in the Sutter Trap</H2>

            <P><B>1. Your competitive advantage is your team's effort, not your systems.</B> If the quality of your operation depends on specific people working hard rather than systems working consistently, you're one resignation away from a crisis. Effort scales linearly. Systems scale exponentially and with AI, this gap widens every month.</P>

            <P><B>2. You've evaluated AI tools and decided they're "not ready yet."</B> This is the most Sutter-coded sentence in the industry right now. The tools are imperfect, yes. The question isn't whether the tools are perfect. The question is whether they're improving faster than your current processes, and the answer is certainly yes.</P>

            <P><B>3. Your response to new competitors is "they don't have our experience."</B> Experience is a real advantage, but only when it's encoded into systems that compound. If your experience lives in your head and your senior team's habits, it's a dependency. The new operator with less experience but better systems will close the gap faster than you expect.</P>

            <P><B>4. You're growing by adding properties without fundamentally changing how you operate them.</B> Horizontal growth without operational evolution is the Sutter playbook. More acres, more crops, same model. In VRM, this means taking on 20 new properties while still managing guest communication the same way you did at 50 units. Growth is masking the underlying fragility.</P>

            <P><B>5. You haven't built anything in the last year that didn't exist before.</B> I'm not talking about adopting a tool. I'm saying <em>built</em> something. A new process, a new system, a new way of serving your owners or guests that represents a genuine departure from how you operated twelve months ago. If everything in your business is iterative improvement on existing processes, you're optimizing the farm while gold is being pulled from the river.</P>

            <H2 id="should-have">What Sutter should have done</H2>

            <P>The tragedy of Sutter's story isn't just that he failed to adapt. It's that he was better positioned than anyone to succeed. He had the land. He had the workforce (temporarily). He had the supply chain, the relationships, the infrastructure. If anyone should have become a gold rush magnate, it was John Sutter.</P>

            <P>But adaptation would have required him to do something psychologically brutal: voluntarily dismantle pieces of his agricultural empire, redeploy his resources toward a model he didn't fully understand, and accept that the thing he'd built was no longer the thing the world needed most. It was a very human mistake. And it's the same choice facing every successful VRM operator right now.</P>

            <P>The operators who navigated gold rushes successfully didn't abandon their advantages, but rather redirected them. Stanford used his merchant relationships and gold rush profits to build a railroad. Armour used his labor connections to build infrastructure. <a href="/essays/the-mulrooney-play" style={{color:"#d4897a",textDecoration:"none",borderBottom:"1px solid rgba(212,137,122,0.3)"}}>Mulrooney</a> used her supply chain expertise to build a hotel. None of them threw away their expertise, they just applied it to what the new world rewarded.</P>

            <P>For a VRM operator sitting on 100 properties, a strong team, and a decade of market knowledge, the AI transformation strategy is not to panic-adopt every tool on the market. It's to ask a genuinely hard question: Which parts of what I've built are infrastructure that compounds, and which parts are the agricultural empire I'm protecting out of habit?</P>

            <P>Your market knowledge, owner relationships, and reputation are infrastructure. Your manual guest communication, spreadsheet-based pricing process, and reactive maintenance dispatch is not. The first group is what you build on. The second group is what AI replaces.</P>

            <H2 id="for-us">What this looks like for us</H2>

            <P>I'm writing this from inside the trap, not above it. Renjoy manages 200 properties, and I can point to a dozen things in our operation right now that are still built on the old model. Processes that depend on a specific person knowing the right answer. Workflows that work because someone remembers to check. Owner touchpoints that happen because a team member has good instincts, not because a system prompted them.</P>

            <P>We're not immune to the Sutter Trap. The difference, I hope, is that we're aware of it and awareness changes what you build next.</P>

            <P>Over the past month or two, we've deliberately identified the parts of our operation that were sustained by effort and started replacing them with systems. AI-driven guest communication that handles the predictable 90% so our team can invest their energy in the surprising 20%. Automated owner reporting that goes out consistently, not when someone remembers.</P>

            <P>None of this means we've "solved" AI in VRM. We haven't. We're experimenting, failing at some of it, and iterating as quickly as we can. But we think the posture matters. We're actively asking which parts of our current model are the farm and which parts are the gold. And we're willing to let go of the farm.</P>

            <P>The willingness, more than any specific technology, is what separates the operators who will thrive from the ones who will end up like Sutter, holding onto something the world has moved past.</P>

            <H2 id="gold-always">The gold was always there</H2>

            <P>Here's the cruelest detail of Sutter's story. The gold had been sitting in that riverbed for millennia. It was there the entire time Sutter was building his agricultural empire. He walked past it, farmed over it, built structures on top of it. The resource that would redefine the world was literally under his feet, and he never noticed because he wasn't looking for it.</P>

            <P>AI feels like that to me. The capability to fundamentally change how we operate, serve our owners, and deliver hospitality has been building for years. It's not arriving someday. It's here. And unlike previous waves of business technology, this one doesn't wait for you to adopt it. Your competitors adopt it and the market moves whether you're ready or not. The operators who recognize that and act on it will build the next generation of great VRM companies. Those who keep farming the same way they always have will eventually look up and find that the world has moved on.</P>

            <P>Sutter's land produced more wealth than almost any piece of real estate in American history, but it didn't produce it for him.</P>

            <P>The question for every operator reading this is simple: Are you building on the gold, or are you still farming over it?</P>

            <div style={{marginTop:"64px",padding:"24px 0",borderTop:"1px solid rgba(212,137,122,0.1)",fontFamily:"'Figtree',sans-serif",fontSize:"16px",fontStyle:"italic",color:"#6b6760"}}>
              This is the third essay in a series on what the gold rushes teach us about building companies in the age of AI. The first essay, <a href="/essays/stake-your-claim" style={{color:"#d4897a",textDecoration:"none",borderBottom:"1px solid rgba(212,137,122,0.3)"}}>Stake Your Claim</a>, explored the broad parallels between gold rush economics and the AI frontier. The second, <a href="/essays/the-mulrooney-play" style={{color:"#d4897a",textDecoration:"none",borderBottom:"1px solid rgba(212,137,122,0.3)"}}>The Mulrooney Play</a>, made the case for reframing VRM as a hospitality business. This one is about why the best operators are the most at risk of missing the shift.
            </div>
          </div>
        </article>

        {/* ═══ SHARE BAR ═══ */}
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 40px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#6b6760", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>If this was useful, share it</p>
            <ShareBar url="https://labs.renjoy.com/essays/the-sutter-trap" title="The Sutter Trap — Renjoy Labs" />
          </div>
        </div>

        <section id="newsletter" style={{padding:"80px 40px",position:"relative",zIndex:2}}>
          <div style={{maxWidth:"600px",margin:"0 auto",background:"linear-gradient(135deg,rgba(212,137,122,0.04),rgba(212,137,122,0.015))",borderRadius:"20px",border:"1px solid rgba(212,137,122,0.1)",padding:"48px 40px",textAlign:"center"}}>
            <div style={{fontSize:"24px",marginBottom:"16px"}}>⛏</div>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",color:"#d4897a",display:"block",marginBottom:"12px"}}>The Mining Report</span>
            <h3 style={{fontFamily:"'Figtree',sans-serif",fontSize:"26px",fontWeight:800,marginBottom:"10px"}}>Dispatches from the diggings.</h3>
            <p style={{fontSize:"15px",color:"#9a958e",lineHeight:1.6,maxWidth:"400px",margin:"0 auto 24px"}}>A biweekly newsletter on AI, hospitality, and what we're learning as we build.</p>
            {!subscribed?(
              <div style={{display:"flex",gap:"10px",maxWidth:"400px",margin:"0 auto"}}>
                <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={{flex:1,padding:"12px 16px",borderRadius:"10px",background:"rgba(25,12,18,0.5)",border:"1px solid rgba(212,137,122,0.12)",color:"#e8e4df",fontSize:"15px",fontFamily:"'Figtree',sans-serif",outline:"none"}}/>
                <button onClick={()=>{if(email.includes("@")){setSubscribed(true);submitLead({type:"newsletter",email,source:"essay_sutter-trap_inline"})}}} style={{background:"linear-gradient(135deg,#e05a3a,#c94a30)",color:"#fff",padding:"12px 20px",borderRadius:"10px",border:"none",fontSize:"14px",fontWeight:600,cursor:"pointer",fontFamily:"'Figtree',sans-serif",whiteSpace:"nowrap"}}>Stake a Claim</button>
              </div>
            ):(
              <div style={{background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:"12px",padding:"14px 24px",maxWidth:"400px",margin:"0 auto"}}><span style={{color:"#4ade80",fontSize:"14px",fontWeight:500}}>✓ Claim staked. First dispatch incoming.</span></div>
            )}
          </div>
        </section>

        <section style={{padding:"60px 40px 100px",position:"relative",zIndex:2}}>
          <div style={{maxWidth:"720px",margin:"0 auto"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#d4897a",display:"block",marginBottom:"24px"}}>Continue Reading</span>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
              {RELATED.map((r,i)=>(
                <a key={i} href={r.link} style={{display:"block",padding:"28px",borderRadius:"16px",textDecoration:"none",background:"rgba(255,255,255,0.015)",border:"1px solid rgba(255,255,255,0.06)",transition:"all 0.3s ease",color:"#e8e4df"}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#d4897a"}}>{r.tag}</span>
                  <h4 style={{fontFamily:"'Figtree',sans-serif",fontSize:"22px",fontWeight:700,margin:"12px 0 8px",lineHeight:1.25}}>{r.title}</h4>
                  <p style={{fontSize:"14px",color:"#9a958e",lineHeight:1.5}}>{r.subtitle}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <footer style={{padding:"30px 40px",borderTop:"1px solid rgba(212,137,122,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:"720px",margin:"0 auto"}}>
          <span style={{display:"flex",alignItems:"center",gap:"8px"}}><span style={{fontSize:"16px",fontWeight:700,letterSpacing:"-0.02em"}}>renjoy</span><span style={{fontSize:"9px",fontWeight:700,letterSpacing:"0.18em",color:"#d4897a",background:"rgba(212,137,122,0.08)",padding:"3px 9px",borderRadius:"5px",fontFamily:"'JetBrains Mono',monospace",border:"1px solid rgba(212,137,122,0.12)"}}>LABS</span></span>
          <span style={{fontSize:"12px",color:"#6b6760",fontFamily:"'JetBrains Mono',monospace"}}>Colorado Springs · Salida · Buena Vista · Cripple Creek</span>
        </footer>
      </div>
    </>
  );
}
