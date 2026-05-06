"use client";
import { useState, useEffect, useMemo } from "react";
import { submitLead } from "../../../lib/submitLead";

const META = {
  title: "Rebuilding the Plane While Flying It",
  subtitle: "Why the most painful phase of our AI transformation is proof we're doing the right thing",
  series: "AI Transformation",
  date: "May 2026",
  readTime: "8 min read",
  author: "Jacob Mueller",
  role: "CEO, Renjoy",
};

const TOC = [
  { id: "bolted-on", label: "What \"bolted-on\" actually looks like" },
  { id: "breaking-point", label: "The decision that breaks everything" },
  { id: "real-cost", label: "What it actually costs" },
  { id: "why-anyway", label: "Why we're doing it anyway" },
  { id: "lesson", label: "The lesson I'd share" },
];

const SOCIALS = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/jacobtmueller/", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label: "X", url: "https://x.com/Jacobtmueller", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
];

const RELATED = [
  { title: "The Mulrooney Play", subtitle: "Why the best VRM companies won't look like VRM companies", tag: "Essay 2", link: "/essays/the-mulrooney-play" },
  { title: "How VRM Operators Are Actually Using AI Right Now", subtitle: "A practitioner's guide from inside the operation", tag: "Essay 4", link: "/essays/how-vrm-operators-use-ai" },
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

export default function RebuildingThePlane() {
  const [scrollY,setScrollY]=useState(0);
  const [email,setEmail]=useState("");
  const [subscribed,setSubscribed]=useState(false);
  const [showModal,setShowModal]=useState(false);
  const [modalEmail,setModalEmail]=useState("");
  const [modalSubscribed,setModalSubscribed]=useState(false);
  const [isMobile,setIsMobile]=useState(false);
  useEffect(()=>{const h=()=>setScrollY(window.scrollY);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h);},[]);
  useEffect(()=>{const u=()=>setIsMobile(window.innerWidth<768);u();window.addEventListener("resize",u);return()=>window.removeEventListener("resize",u);},[]);
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
          {!modalSubscribed?(<><div style={{display:"flex",gap:"10px",maxWidth:"360px",margin:"0 auto",position:"relative"}}><input type="email" placeholder="your@email.com" value={modalEmail} onChange={e=>setModalEmail(e.target.value)} autoFocus style={{flex:1,padding:"14px 18px",borderRadius:"10px",background:"rgba(25,12,18,0.55)",border:"1px solid rgba(212,137,122,0.15)",color:"#e8e4df",fontSize:"15px",fontFamily:"'Figtree',sans-serif",outline:"none"}} onFocus={e=>e.target.style.borderColor="rgba(212,137,122,0.4)"} onBlur={e=>e.target.style.borderColor="rgba(212,137,122,0.15)"} onKeyDown={e=>{if(e.key==="Enter"&&modalEmail.includes("@")){setModalSubscribed(true);submitLead({type:"newsletter",email:modalEmail,source:"essay_rebuilding-the-plane_modal"})}}}/><button onClick={()=>{if(modalEmail.includes("@")){setModalSubscribed(true);submitLead({type:"newsletter",email:modalEmail,source:"essay_rebuilding-the-plane_modal"})}}} style={{background:"linear-gradient(135deg,#e05a3a,#c94a30)",color:"#fff",padding:"14px 22px",borderRadius:"10px",border:"none",fontSize:"15px",fontWeight:600,cursor:"pointer",fontFamily:"'Figtree',sans-serif",whiteSpace:"nowrap"}}>Stake a Claim</button></div><p style={{fontSize:"12px",color:"#4a4640",marginTop:"16px",fontFamily:"'JetBrains Mono',monospace",position:"relative"}}>No spam. Unsubscribe anytime.</p></>):(<div style={{background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:"12px",padding:"18px 24px",maxWidth:"360px",margin:"0 auto",position:"relative"}}><span style={{color:"#4ade80",fontSize:"15px",fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}><span style={{fontSize:"18px"}}>✓</span>Claim staked. First dispatch incoming.</span></div>)}
        </div></div>)}

        <header style={{padding:"160px 40px 80px",position:"relative",overflow:"hidden"}}>
          <SectionFlakes count={8} seed={55}/>
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
              <ShareBar url="https://labs.renjoy.com/essays/rebuilding-the-plane" title="Rebuilding the Plane While Flying It — Renjoy Labs" />
            </div>
          </div>
        </header>

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
          <SectionFlakes count={6} seed={56}/>
          <div style={{maxWidth:"720px",margin:"0 auto",position:"relative",zIndex:2}}>

            <P>Right now at Renjoy, we are running two architectures simultaneously. Our legacy stack — the patchwork of SaaS tools we stitched together to get to 200+ properties — is still handling live operations. Guests are checking in, handymen are getting dispatched, owners are receiving reports. The plane is flying.</P>

            <P>And we're tearing it apart mid-flight.</P>

            <P>We are building an AI-native operating system called RenjoyOS. Instead of bolting AI features onto our existing tools, we're rebuilding the foundation. It starts with a new database plus orchestration layer and internal dashboards. We're creating AI agents that don't just answer questions but actually do operational work — scheduling housekeeping, enriching maintenance tasks, generating briefings, resolving guest issues autonomously, vetting potential new team members.</P>

            <P>It is, without exaggeration, the hardest thing we've done so far.</P>

            <H2 id="bolted-on">What "bolted-on" actually looks like</H2>

            <P>Like many operators, we initially relied on a collection of separate, top-tier tools for each core function: a PMS for reservations, a dedicated platform for housekeeping and maintenance tasks, a guest messaging system, a pricing engine, and so on. Later, we began integrating various AI components — a specialized AI messaging bot, automated workflows — on top of this existing structure.</P>

            <P>It works, but not well enough.</P>

            <P>The problem with bolted-on AI is that it hits a ceiling fast. Your AI guest messaging tool can answer questions, but it can't see the maintenance task that was just created for the same property. Your automated dispatch can assign a technician, but it can't check whether that tech is clocked in because that data lives in a completely different system. Your AI-generated owner reports pull revenue data from one source and cleaning costs from another, and reconciling them requires a human who holds the full picture in their head. Trying to stitch all this together with bolt-on tools led to a massive amount of tech debt we now have to disentangle.</P>

            <PQ tweet="You feel like you're making progress because each individual tool is impressive. But the operating model underneath hasn't changed. You're still a property management company with AI features. You're not an AI-native operator.">You feel like you're making progress because each individual tool is impressive. But the operating model underneath hasn't changed. You're still a property management company with AI features. You're not an AI-native operator.</PQ>

            <P>We had over a dozen SaaS tools, each with its own data model, its own API quirks, its own limitations. Our "AI strategy" was really just a collection of point solutions that couldn't talk well with one another. We were spending $300k+ a year on software and still relying on people to be the integration layer between systems.</P>

            <H2 id="breaking-point">The decision that breaks everything (temporarily)</H2>

            <P>Earlier this year, we made the call to stop adding features to the old stack and start building the new one. We hired a Head of AI whose job description opens with this line: "Not a PM company with AI bolted on — an AI-native operating system that happens to manage properties."</P>

            <P>That sounds great in a job posting. In practice, it means we are now maintaining two systems while building a third. Our legacy task management platform is still dispatching cleaners every morning. Our new operations platform is being onboarded in parallel. Our custom-built orchestration layer runs 100+ automated workflows that bridge the gap between old and new. And our internal AI agent, Joy, is slowly absorbing functions that used to require three different tools and a Slack message chain.</P>

            <P>Some days the Frankenstein software stack holds. Some days it doesn't.</P>

            <P>Last month, an issue broke our calendar and listing syncs from our PMS. Guest-facing data went stale. The fix required debugging an authentication gateway pattern that exists solely because we're pulling data from a legacy system into a new database that wasn't designed for the old system's API rate limits. Not an AI problem — a "two architectures at once" problem.</P>

            <P>We also still have 100+ legacy database tables from our old system of record. We can't query them all effectively and we can't build against them without using a ridiculous number of tokens. But we can't remove them yet because downstream workflows still reference them during the migration. They just sit there, a monument to tech debt and transition tax.</P>

            <H2 id="real-cost">The pain is real — here's what it actually costs</H2>

            <P>I want to be specific about this because most transformation narratives skip the ugly middle.</P>

            <P><B>Context switching destroys productivity.</B> When the team is maintaining an old system, building a new one, and keeping them synchronized, they're not doing any of those things well. Research suggests it takes 20+ minutes to fully refocus after switching between complex systems. We feel that every day. Our team is juggling legacy maintenance, new feature development, and migration work simultaneously.</P>

            <P><B>We pay twice for everything for a time.</B> During a parallel migration, you're licensing the old platform and building the new one. You're training people on both. You're writing documentation for systems that will be deprecated in months. System migrations increase costs by 30–50% and that tracks with our experience.</P>

            <P><B>Our team gets exhausted.</B> We've found the team's willingness to support organizational change has not kept pace with the lightning advances within AI. We're a 40-person company asking people to learn new tools, adapt to new workflows, and maintain the old ones — all while guests keep checking in and owners keep expecting reports on time.</P>

            <H2 id="why-anyway">Why we're doing it anyway</H2>

            <P>Here's what I try to keep telling myself: organizations systematically avoid the behaviors that actually drive success specifically because those behaviors create discomfort. Most companies focus on the easy stuff — collaboration, continuous improvement, teamwork. They neglect accountability, decisive action, and performance pressure. The uncomfortable stuff.</P>

            <P>The difference between success and failure isn't intelligence but rather a willingness to embrace the suck.</P>

            <P>I think about this every time somebody complains about a tool in our daily Renjoy Rally. The pain isn't a sign that the strategy is wrong. The pain is the strategy. If it were comfortable, everyone would do it, and it wouldn't be a competitive advantage.</P>

            <PQ tweet="The pain isn't a sign that the strategy is wrong. The pain is the strategy. If it were comfortable, everyone would do it, and it wouldn't be a competitive advantage.">The pain isn't a sign that the strategy is wrong. The pain is the strategy. If it were comfortable, everyone would do it, and it wouldn't be a competitive advantage.</PQ>

            <P>Our bet is that the best vacation rental manager in the world — the one where no owner chooses to leave — is an AI-native operator with the highest-paid frontline team in the industry, undercutting competitors on price while delivering 4.9+ guest experiences. That's only possible if the operating system is radically more efficient than anyone else's. And you don't get a radically different operating system by adding AI features to the same architecture everyone else is using.</P>

            <H2 id="lesson">The lesson I'd share with anyone considering this</H2>

            <P>The plane metaphor implies speed and drama but I've found the reality is slower and quieter. It's replacing one workflow at a time. Migrating one data table at a time. Onboarding one new platform while decommissioning the old one. And doing it all while answering guest messages at 11pm and making sure the cleaners know which units to flip tomorrow morning.</P>

            <P>If you're running a company right now and you feel the pull to fundamentally change how your business operates — not just add a new tool, but rebuild the model — I'd offer this: the discomfort you're feeling is good. When the transformation is easy, you probably aren't transforming. When it's painful and messy and you're maintaining two systems and your team is tired and things keep breaking in the seams — that's usually a sign you're doing something real.</P>

            <PQ tweet="Go toward the pain because it's where the moat gets built.">Go toward the pain because it's where the moat gets built.</PQ>

            <div style={{marginTop:"64px",padding:"24px 0",borderTop:"1px solid rgba(212,137,122,0.1)",fontFamily:"'Figtree',sans-serif",fontSize:"16px",fontStyle:"italic",color:"#6b6760"}}>
              Jacob Mueller is CEO and Co-Founder of Renjoy, a vacation rental management company building an AI-native operating model across Colorado and Florida. He writes about AI, hospitality, and what it takes to build companies that last at <a href="/" style={{color:"#d4897a",textDecoration:"none"}}>Renjoy Labs</a>.
            </div>
          </div>
        </article>

        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 40px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#6b6760", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>If this was useful, share it</p>
            <ShareBar url="https://labs.renjoy.com/essays/rebuilding-the-plane" title="Rebuilding the Plane While Flying It — Renjoy Labs" />
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
                <button onClick={()=>{if(email.includes("@")){setSubscribed(true);submitLead({type:"newsletter",email,source:"essay_rebuilding-the-plane_inline"})}}} style={{background:"linear-gradient(135deg,#e05a3a,#c94a30)",color:"#fff",padding:"12px 20px",borderRadius:"10px",border:"none",fontSize:"14px",fontWeight:600,cursor:"pointer",fontFamily:"'Figtree',sans-serif",whiteSpace:"nowrap"}}>Stake a Claim</button>
              </div>
            ):(
              <div style={{background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:"12px",padding:"14px 24px",maxWidth:"400px",margin:"0 auto"}}><span style={{color:"#4ade80",fontSize:"14px",fontWeight:500}}>✓ Claim staked. First dispatch incoming.</span></div>
            )}
          </div>
        </section>

        <section style={{padding:"60px 40px 100px",position:"relative",zIndex:2}}>
          <div style={{maxWidth:"720px",margin:"0 auto"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#d4897a",display:"block",marginBottom:"24px"}}>Continue Reading</span>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:"20px"}}>
              {RELATED.map((r,i)=>(
                <a key={i} href={r.link} style={{display:"block",padding:"28px",borderRadius:"16px",textDecoration:"none",background:"rgba(255,255,255,0.015)",border:"1px solid rgba(255,255,255,0.06)",transition:"all 0.3s ease",color:"#e8e4df"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(212,137,122,0.04)";e.currentTarget.style.borderColor="rgba(212,137,122,0.12)"}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.015)";e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}}
                >
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
