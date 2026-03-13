"use client";
import { useState, useEffect, useMemo } from "react";
import { submitLead } from "../../../lib/submitLead";

const META = {
  title: "How VRM Operators Are Actually Using AI Right Now",
  subtitle: "A practitioner's guide from inside the operation, not the vendor booth",
  series: "ESSAY 4 OF 4 · From the Frontier",
  date: "March 2026",
  readTime: "12 min read",
  author: "Jacob Mueller",
  role: "CEO, Renjoy",
};

const TOC = [
  { id: "guest-comms", label: "Guest communication" },
  { id: "pricing", label: "Dynamic pricing" },
  { id: "maintenance", label: "Maintenance dispatch" },
  { id: "intelligence", label: "Operational intelligence" },
  { id: "owners", label: "Owner reporting" },
  { id: "content", label: "Content and documentation" },
  { id: "unsolved", label: "What we haven't figured out" },
  { id: "start", label: "Where to start" },
];

const SOCIALS = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/jacobtmueller/", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label: "X", url: "https://x.com/Jacobtmueller", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
];

const RELATED = [
  { title: "The Mulrooney Play", subtitle: "Why the best VRM companies won't look like VRM companies", tag: "Essay 2", link: "/essays/the-mulrooney-play" },
  { title: "The Sutter Trap", subtitle: "Why the best operators are the most at risk", tag: "Essay 3", link: "/essays/the-sutter-trap" },
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

export default function HowVRMOperatorsUseAI() {
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
          {!modalSubscribed?(<><div style={{display:"flex",gap:"10px",maxWidth:"360px",margin:"0 auto",position:"relative"}}><input type="email" placeholder="your@email.com" value={modalEmail} onChange={e=>setModalEmail(e.target.value)} autoFocus style={{flex:1,padding:"14px 18px",borderRadius:"10px",background:"rgba(25,12,18,0.55)",border:"1px solid rgba(212,137,122,0.15)",color:"#e8e4df",fontSize:"15px",fontFamily:"'Figtree',sans-serif",outline:"none"}} onFocus={e=>e.target.style.borderColor="rgba(212,137,122,0.4)"} onBlur={e=>e.target.style.borderColor="rgba(212,137,122,0.15)"} onKeyDown={e=>{if(e.key==="Enter"&&modalEmail.includes("@")){setModalSubscribed(true);submitLead({type:"newsletter",email:modalEmail,source:"essay_how-vrm-operators-use-ai_modal"})}}}/><button onClick={()=>{if(modalEmail.includes("@")){setModalSubscribed(true);submitLead({type:"newsletter",email:modalEmail,source:"essay_how-vrm-operators-use-ai_modal"})}}} style={{background:"linear-gradient(135deg,#e05a3a,#c94a30)",color:"#fff",padding:"14px 22px",borderRadius:"10px",border:"none",fontSize:"15px",fontWeight:600,cursor:"pointer",fontFamily:"'Figtree',sans-serif",whiteSpace:"nowrap"}}>Stake a Claim</button></div><p style={{fontSize:"12px",color:"#4a4640",marginTop:"16px",fontFamily:"'JetBrains Mono',monospace",position:"relative"}}>No spam. Unsubscribe anytime.</p></>):(<div style={{background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:"12px",padding:"18px 24px",maxWidth:"360px",margin:"0 auto",position:"relative"}}><span style={{color:"#4ade80",fontSize:"15px",fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}><span style={{fontSize:"18px"}}>✓</span>Claim staked. First dispatch incoming.</span></div>)}
        </div></div>)}

        <header style={{padding:"160px 40px 80px",position:"relative",overflow:"hidden"}}>
          <SectionFlakes count={8} seed={40}/>
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
              <ShareBar url="https://labs.renjoy.com/essays/how-vrm-operators-use-ai" title="How VRM Operators Are Actually Using AI Right Now — Renjoy Labs" />
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
          <SectionFlakes count={6} seed={41}/>
          <div style={{maxWidth:"720px",margin:"0 auto",position:"relative",zIndex:2}}>

            <P>I'm going to skip the part where I explain what AI is or tell you it's going to change the world. Presumably you're aware. If you're managing vacation rental properties in 2026, you've heard the pitch from every software vendor, conference speaker, and LinkedIn thought leader alive: "AI is transformative! AI is the future! AI will revolutionize hospitality!"</P>

            <P>Agreed. But what does that actually look like on a Sunday morning when you have 24 turnovers, a broken dishwasher at your best property, and an owner asking why you spent money to maintain their property?</P>

            <P>I'm not writing this article as theory, a vendor pitch, or an influencer peddling a course. I'm writing about the actual day-to-day reality of how vacation rental managers use AI right now, as someone who runs a VRM company.</P>

            <P>We manage 200+ vacation rentals across Colorado and Florida with a team of about 50 people. We've been building AI into our operations for the past 3-6 months. To be honest, some of it works brilliantly but some of it has been a total waste of time. Since we've lit some cash on fire, I'd rather save you some of the pain by sharing what we've learned so far.</P>

            <H2 id="guest-comms">Guest Communication: the obvious starting point</H2>

            <P>If you're wondering how to use AI as a host, start here. Guest messaging is the highest-volume, most repetitive workflow in any VRM operation, and the ROI is obvious.</P>

            <P>We use an AI messaging platform that handles roughly 85% of inbound guest messages without human involvement: WiFi passwords, parking instructions, hot tub questions, check-in times, etc. The AI pulls from a property-specific knowledge base we built and constantly refine. When a guest asks about parking at a specific property, the AI knows the answer for that property and responds within the entire context of the relationship that guest has with us as a manager.</P>

            <P>The 15% that reaches our team is the stuff that actually requires a human: upset guests, unusual requests, and maintenance issues that need judgment. Which is what we think a hospitality team should be spending time on: service recovery.</P>

            <PQ tweet="AI guest messaging only works if your property documentation is thorough and accurate. If your property info lives in someone's head, the AI will confidently give guests wrong information — which is worse than slow information.">AI guest messaging only works if your property documentation is thorough and accurate. If your property info lives in someone's head, the AI will confidently give guests wrong information — which is worse than slow information.</PQ>

            <H2 id="pricing">Dynamic Pricing: machine learning has been doing this for years</H2>

            <P>This is another use of machine learning (AI) for short-term rentals and the one most operators already know. We use PriceLabs across our entire portfolio. It adjusts prices multiple times per day based on demand, competitors, seasonality, and local events.</P>

            <P>It's not magic though. The algorithm still needs human oversight for a variety of reasons. Put another way, if it's our algorithm vs your algorithm and we're both on PriceLabs, who wins the guest? We have a revenue manager who works alongside the AI, overriding when local knowledge tells us something the data doesn't.</P>

            <PQ tweet="The operators who treat dynamic pricing as set-and-forget consistently leave money on the table.">The operators who treat dynamic pricing as set-and-forget consistently leave money on the table.</PQ>

            <H2 id="maintenance">Maintenance Dispatch: the one that surprised us</H2>

            <P>This one surprised us. We built an automated dispatch system that watches for new issues from a variety of sources, classifies them by category (plumbing, electrical, HVAC, etc), matches them against a skills matrix for our seven technicians, checks who's clocked in, and sends a Slack notification. If nobody picks it up in two hours, it escalates.</P>

            <P>We started with about 30 classification rules and now have nearly 90. Honestly, this is closer to intelligent automation than what most people picture when they hear "AI." But the result is real: faster response times, fewer dropped tasks, and our dispatcher spending time on judgment calls instead of just routing and scheduling.</P>

            <H2 id="intelligence">Operational Intelligence: seeing the whole picture</H2>

            <P>Every morning at 7am, our Slack gets what we call the Daily Pulse: an automated briefing with yesterday's bookings, today's turnovers, flagged guest complaints, review scores, revenue pacing, and stale maintenance tasks. All of this existed in our various systems before — it used to take someone 30-45 minutes to compile every morning. Now it's waiting in Slack before anyone starts their day.</P>

            <P>We also built an internal AI assistant (named Joy) that our team can query in natural language. "What are the top maintenance issues at our Buena Vista properties this month?" "Which cleaners have the highest guest ratings?" It's essentially ChatGPT for vacation rental management, but connected to our actual operational data.</P>

            <PQ tweet="All of this existed in our various systems before. It used to take someone 30-45 minutes to compile every morning. Now it's waiting in Slack before anyone starts their day.">All of this existed in our various systems before. It used to take someone 30-45 minutes to compile every morning. Now it's waiting in Slack before anyone starts their day.</PQ>

            <H2 id="owners">Owner Reporting: saving time while building trust</H2>

            <P>We built automated reporting that pulls revenue data, compares it to market benchmarks, and generates monthly performance summaries. The data compilation that used to take 20 minutes per property per month now happens automatically.</P>

            <P>But be careful with what AI does here. The data aggregation is easy to automate. The part that actually retains owners — trust — still requires a human who knows that the Johnsons are worried about their HVAC and the Garcias want to understand their second property's performance relative to their first. AI gives our team the data faster. The owner stays because of the person who calls and explains what it means.</P>

            <PQ tweet="AI gives our team the data faster. The owner stays because of the person who calls and explains what it means.">AI gives our team the data faster. The owner stays because of the person who calls and explains what it means.</PQ>

            <H2 id="content">Content and Documentation: unglamorous admin work</H2>

            <P>Nobody talks about this at conferences, but it might save the most cumulative hours. We use Claude and Gemini for listing descriptions, owner communications, SOPs, training materials, review responses, and social content. The pattern is always the same: AI generates a solid first draft in minutes, a human edits and finalizes. We've cut content production time by roughly 80%.</P>

            <P>The win here is internal documentation. We describe a process conversationally, AI structures it into a proper SOP. We went from almost no written playbooks to documented processes for most key operations, largely because AI removed the friction of actually writing them.</P>

            <P>A word of warning: the ease of creating new SOPs can lead to a massive proliferation of content. This typically makes your teams' job more difficult, not more clear. Use it sparingly and tightly. You'll still get the time saving benefits without adding clutter.</P>

            <H2 id="unsolved">What we haven't figured out</H2>

            <P><B>Predictive maintenance.</B> Compelling idea, not enough sensor or failure data to make it work for us yet.</P>

            <P><B>Autonomous pricing.</B> Our tool suggests rates but a human still reviews. The cost of a pricing mistake on a peak weekend is too high to go fully hands-off yet.</P>

            <P><B>AI photography.</B> Getting better fast, not ready for actual listings. Professional photography is still worth it.</P>

            <H2 id="start">Where to start</H2>

            <P>If you haven't gone deep on AI yet, here's what I'd do based on our experience:</P>

            <P><B>1. Use ChatGPT or Claude for content today.</B> Zero integration, $20/month. Listing descriptions, review responses, internal docs. You'll see time savings immediately.</P>

            <P><B>2. Get your data in order.</B> AI amplifies whatever you feed it, including bad data. If your property details are spread across three systems and none of them agree, fix that before you buy any AI tool.</P>

            <P><B>3. Tackle guest communication.</B> Highest volume, most repetitive, best ROI — but requires building the knowledge base first.</P>

            <P><B>4. Go sequential, not simultaneous.</B> We made the mistake of deploying AI across five workflows at once and ended up with five half-built systems. Pick one, get it working, then move to the next.</P>

            <P>Most content about AI for short-term rentals is written by vendors selling their tools. They're not living with the consequences every day. The advantage operators have is that we understand the problems better than anyone.</P>

            <P>Four years in, the operators who will win the next five years aren't the ones with the biggest tech budgets. They're the ones willing to do the tedious work of documenting their properties, cleaning their data, redesigning their workflows, and treating AI as a co-pilot rather than a magic wand.</P>

            <PQ tweet="Your operator knowledge is the most valuable input into any AI system. You just need a willingness to rethink how you operate.">Your operator knowledge is the most valuable input into any AI system. You just need a willingness to rethink how you operate.</PQ>

            <P>Your operator knowledge is the most valuable input into any AI system. You just need a willingness to rethink how you operate. The question is whether you will.</P>

            <div style={{marginTop:"64px",padding:"24px 0",borderTop:"1px solid rgba(212,137,122,0.1)",fontFamily:"'Figtree',sans-serif",fontSize:"16px",fontStyle:"italic",color:"#6b6760"}}>
              Jacob Mueller is the CEO of Renjoy, an AI-first vacation rental management company operating 200+ properties across Colorado and Florida. He writes about what he's learning at labs.renjoy.com.
            </div>
          </div>
        </article>

        {/* ═══ SHARE BAR ═══ */}
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 40px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#6b6760", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>If this was useful, share it</p>
            <ShareBar url="https://labs.renjoy.com/essays/how-vrm-operators-use-ai" title="How VRM Operators Are Actually Using AI Right Now — Renjoy Labs" />
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
                <button onClick={()=>{if(email.includes("@")){setSubscribed(true);submitLead({type:"newsletter",email,source:"essay_how-vrm-operators-use-ai_inline"})}}} style={{background:"linear-gradient(135deg,#e05a3a,#c94a30)",color:"#fff",padding:"12px 20px",borderRadius:"10px",border:"none",fontSize:"14px",fontWeight:600,cursor:"pointer",fontFamily:"'Figtree',sans-serif",whiteSpace:"nowrap"}}>Stake a Claim</button>
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
