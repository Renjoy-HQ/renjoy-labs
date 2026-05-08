"use client";
import { useState, useEffect, useMemo } from "react";
import { submitLead } from "../../../lib/submitLead";

const META = {
  title: "The $15 Pan",
  subtitle: "What you're actually selling",
  series: "Positioning",
  date: "May 2026",
  readTime: "9 min read",
  author: "Jacob Mueller",
  role: "CEO, Renjoy",
};

const TOC = [
  { id: "cleaning", label: "The cleaning is not the product" },
  { id: "ai-math", label: "Where AI changes the math" },
  { id: "where-we-are", label: "Where we are" },
  { id: "the-question", label: "The question" },
];

const SOCIALS = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/jacobtmueller/", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label: "X", url: "https://x.com/Jacobtmueller", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
];

const RELATED = [
  { title: "The Mulrooney Play", subtitle: "Why the best VRM companies won't look like VRM companies", tag: "Essay 2", link: "/essays/the-mulrooney-play" },
  { title: "Rebuilding the Plane While Flying It", subtitle: "Why the most painful phase of our AI transformation is proof we're doing the right thing", tag: "Essay 5", link: "/essays/rebuilding-the-plane" },
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
      navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }
  }
  const btnStyle = {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "7px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 500,
    fontFamily: "'JetBrains Mono', monospace", cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
    color: "#9a958e", textDecoration: "none", transition: "all 0.2s", letterSpacing: "0.02em",
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#4a4640", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: "4px" }}>Share</span>
      <a href={xUrl} target="_blank" rel="noopener noreferrer" style={btnStyle}
        onMouseEnter={e => { e.currentTarget.style.color = "#d4897a"; e.currentTarget.style.borderColor = "rgba(212,137,122,0.25)"; e.currentTarget.style.background = "rgba(212,137,122,0.06)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#9a958e"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        X
      </a>
      <a href={liUrl} target="_blank" rel="noopener noreferrer" style={btnStyle}
        onMouseEnter={e => { e.currentTarget.style.color = "#d4897a"; e.currentTarget.style.borderColor = "rgba(212,137,122,0.25)"; e.currentTarget.style.background = "rgba(212,137,122,0.06)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#9a958e"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        LinkedIn
      </a>
      <button onClick={copyLink} style={{ ...btnStyle, border: "1px solid rgba(255,255,255,0.08)" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#d4897a"; e.currentTarget.style.borderColor = "rgba(212,137,122,0.25)"; e.currentTarget.style.background = "rgba(212,137,122,0.06)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#9a958e"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
        {copied ? (<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>) : (<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy link</>)}
      </button>
    </div>
  );
}

function H2({children,id}){return(<h2 id={id} style={{fontFamily:"'Figtree',sans-serif",fontSize:"32px",fontWeight:800,lineHeight:1.2,letterSpacing:"-0.02em",marginTop:"64px",marginBottom:"24px",color:"#e8e4df",scrollMarginTop:"80px"}}>{children}</h2>);}
function P({children}){return(<p style={{fontSize:"18px",lineHeight:1.8,color:"#b5b0a8",marginBottom:"24px"}}>{children}</p>);}
function B({children}){return(<strong style={{color:"#e8e4df",fontWeight:600}}>{children}</strong>);}

export default function The15Pan() {
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
          {!modalSubscribed?(<><div style={{display:"flex",gap:"10px",maxWidth:"360px",margin:"0 auto",position:"relative"}}><input type="email" placeholder="your@email.com" value={modalEmail} onChange={e=>setModalEmail(e.target.value)} autoFocus style={{flex:1,padding:"14px 18px",borderRadius:"10px",background:"rgba(25,12,18,0.55)",border:"1px solid rgba(212,137,122,0.15)",color:"#e8e4df",fontSize:"15px",fontFamily:"'Figtree',sans-serif",outline:"none"}} onFocus={e=>e.target.style.borderColor="rgba(212,137,122,0.4)"} onBlur={e=>e.target.style.borderColor="rgba(212,137,122,0.15)"} onKeyDown={e=>{if(e.key==="Enter"&&modalEmail.includes("@")){setModalSubscribed(true);submitLead({type:"newsletter",email:modalEmail,source:"essay_the-15-pan_modal"})}}}/><button onClick={()=>{if(modalEmail.includes("@")){setModalSubscribed(true);submitLead({type:"newsletter",email:modalEmail,source:"essay_the-15-pan_modal"})}}} style={{background:"linear-gradient(135deg,#e05a3a,#c94a30)",color:"#fff",padding:"14px 22px",borderRadius:"10px",border:"none",fontSize:"15px",fontWeight:600,cursor:"pointer",fontFamily:"'Figtree',sans-serif",whiteSpace:"nowrap"}}>Stake a Claim</button></div><p style={{fontSize:"12px",color:"#4a4640",marginTop:"16px",fontFamily:"'JetBrains Mono',monospace",position:"relative"}}>No spam. Unsubscribe anytime.</p></>):(<div style={{background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:"12px",padding:"18px 24px",maxWidth:"360px",margin:"0 auto",position:"relative"}}><span style={{color:"#4ade80",fontSize:"15px",fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}><span style={{fontSize:"18px"}}>✓</span>Claim staked. First dispatch incoming.</span></div>)}
        </div></div>)}

        <header style={{padding:"160px 40px 80px",position:"relative",overflow:"hidden"}}>
          <SectionFlakes count={8} seed={70}/>
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
              <ShareBar url="https://labs.renjoy.com/essays/the-15-pan" title="The $15 Pan — Renjoy Labs" />
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
          <SectionFlakes count={6} seed={71}/>
          <div style={{maxWidth:"720px",margin:"0 auto",position:"relative",zIndex:2}}>

            <P>In 1849, a miner walked into Samuel Brannan's store in San Francisco and paid $15 for a tin pan that cost twenty cents to make. He didn't pay $15 because the pan was special. He paid $15 because the pan was the price of admission to a riverbed that might change his life.</P>

            <P>Brannan understood something about that transaction that most people miss. He wasn't selling tin. He was selling a chance at gold, at independence, at not going home a failure. The pan was the means by which he sold a story.</P>

            <PQ tweet="The pan was the means by which he sold a story.">The pan was the means by which he sold a story.</PQ>

            <P>I think about this from time to time — about what we're really selling.</P>

            <P>If you'd asked me four years ago what Renjoy sold, I would have said property management. Cleaning, guest communication, pricing, maintenance, reporting. It's what's on the website, what the contract enumerates, what shows up on the invoice.</P>

            <P>It's also not quite correct. In this analogy, it's the tin pan, not the possibility of gold.</P>

            <P>What an owner is actually buying — what they're handing you with a deeply valuable asset — is peace of mind, time, and the confidence that someone is protecting what they've built. It's hard to make money yet quite easy to lose it. The cleaning, the pricing, the guest comms — those are the pan. The story we should be selling is: your home is in good hands and someone is actively looking out for you.</P>

            <P>Operators who get this don't run their business the standard way. They price differently. They communicate differently. They retain owners at multiples of the industry average. And the ones figuring out how to use AI to make owners and guests feel more seen — not just to cut costs — are starting to pull away from the field in a way I don't think the industry has yet registered.</P>

            <H2 id="cleaning">The cleaning is not the product</H2>

            <P>Walk into any VRM conference and listen to how operators describe themselves. "We manage 80 doors." "We do turnovers, dynamic pricing, and 24/7 guest support." Notice what's being sold: activities, tasks, labor.</P>

            <P>Now listen to how an owner describes why they hired you. "I just don't want to think about it anymore." "My last manager ghosted me for three weeks while my HVAC was out." "I want to know my house is being taken care of."</P>

            <P>Those are trust complaints. And when an owner fires you, they rarely fire you for the cleaning. They fire you because they stopped believing you had it handled. The performance may even have been great, but the trust ran out.</P>

            <PQ tweet="When an owner fires you, they rarely fire you for the cleaning. They fire you because they stopped believing you had it handled.">When an owner fires you, they rarely fire you for the cleaning. They fire you because they stopped believing you had it handled.</PQ>

            <P>This is the gap between what the industry sells and what owners actually buy. Three things sit at the center of it, and most contracts don't mention them: <B>peace of mind</B> (the absence of dread on Friday afternoons), <B>time back</B> (the elimination of an entire mental category from your life), and <B>asset protection</B> (the house is more valuable when you give it back than when they handed it to you). The cleaning, messaging, and pricing are how you produce those things. They're inputs. The output is how an owner feels about their asset every day they're not at it.</P>

            <P>Once you see the product this way, three things change. You price differently because you're no longer benchmarked against the cheapest competitor. You communicate differently because the job stops being availability and starts being the proactive elimination of worry. You retain differently because owners who feel like their property is in good hands don't shop around just for a cheaper price.</P>

            <H2 id="ai-math">Where AI changes the math</H2>

            <P>Most of what gets written about AI in this industry is a cost-reduction story. Same output, fewer humans, better margin.</P>

            <P>That frame misses the full point. It treats AI like a discount and the product like a commodity. If the actual product is the feeling an owner has about their home, the question isn't "how do we deliver the same thing for less?" It's: how do we use AI to make every owner feel like the only owner we have, and every guest feel like the only guest?</P>

            <P>The thing that makes an owner feel taken care of isn't the monthly statement. It's the unprompted call about something they didn't know to ask about. The text that says, "your booking pace this fall is running 12% behind last year — here's what we think is going on and here's what we want to try." The note that mentions a maintenance issue caught three weeks ago that the owner never had to think about.</P>

            <P>The reason most operators don't do this consistently isn't that they don't want to. They frequently do. But signals are scattered: revenue management has the pacing data, maintenance has the work order, housekeeping has the photos from yesterday's turn, guest experience has the conversations — and the owner relations manager doesn't have time to stitch it together for 80 properties every week. So those moments don't happen. The owner gets the statement on the 10th and a generic email and decides, slowly, over months, that nobody's really paying attention.</P>

            <P>This is exactly the kind of work for which AI is built. Not the call itself — the call is the human's job — but the work that makes the call possible. Watching across the entire portfolio, surfacing the things that matter, and putting the right context in front of the right person at the right moment.</P>

            <P>We built an internal AI assistant called Joy that does exactly this. Joy watches signals across the company — maintenance tickets, guest sentiment, pricing deviations, review trends, booking pace — and prompts the right team member when something deserves an owner conversation. Pace falling behind? Joy flags it before next month's statement, with context to our revenue manager. Five-star review mentions the host gift basket? That's a story worth telling the owner. Maintenance issue resolved cleanly? The owner shouldn't get a quiet bill — they should get the version of events that says we caught this and we handled it.</P>

            <PQ tweet="Operators using AI to make people feel more seen are competing on something that doesn't commoditize.">Operators using AI to make people feel more seen are competing on something that doesn't commoditize.</PQ>

            <P>The cost-cutting story does belong here, just not as the headline. When AI compresses the back office, the savings shouldn't show up just in margin. They should also be reinvested. We're using ours to pay our field team more, recruit longer, train better, and keep our pricing-to-quality ratio lower than competitors.</P>

            <P>That's how we're going to win. Better field people deliver better stays. Better stays generate higher revenue. Higher revenue lengthens owner tenure. Operators using AI to bank the savings are competing on price, which is a race to commodity. Operators using AI to make people feel more seen are competing on something that doesn't commoditize.</P>

            <H2 id="where-we-are">Where we are</H2>

            <P>I'll be honest about the gap between thesis and reality. Joy catches some signals well and others poorly. Our owner relations cadence is more consistent than it was a year ago, but still varies more across the portfolio than I'd like. The reinvestment loop into field quality is real, but we're earlier in it than the strategy doc makes it sound on paper. We don't have it all figured out.</P>

            <P>What I can say with confidence is that owner churn at Renjoy runs around 2%, against an industry closer to 10%. That didn't happen because we got better at cleaning. It happened because we started building the company around what owners are actually buying. The structural side is showing up too. Headcount is going down while property count is going up. That's an important trendline.</P>

            <P>The infrastructure underneath all this is what we're calling RenjoyOS — the AI-native operating system we're building so that signals from every department live in one place and surface to the right person at the right time. It's not finished, not even close. It's painful. We're rebuilding pieces of the plane while it's flying.</P>

            <H2 id="the-question">The question</H2>

            <P>Most VRM operators will tell you they sell property management. A smaller group will tell you they sell hospitality. The smallest group will tell you they sell something owners can't quite articulate but immediately recognize when they have it: the absence of worry. The presence of trust. The quiet, pleasing feeling of being seen.</P>

            <P>If you're an owner, the next time you're evaluating a manager, stop asking what they do. Ask what you expect to feel on Sunday night once you've handed over your property.</P>

            <P>If you're an operator, the question is harder. What story are your owners actually buying from you — and is the way you've designed your business, pricing, team, and tools aimed at telling that story, or aimed at the tin pan?</P>

            <P>Because the operators who figure out what they're really selling, and aim AI at making people feel more seen rather than just making the org chart smaller, are building something fundamentally different than the rest of the industry. Something fundamentally harder to leave.</P>

            <div style={{marginTop:"64px",padding:"24px 0",borderTop:"1px solid rgba(212,137,122,0.1)",fontFamily:"'Figtree',sans-serif",fontSize:"16px",fontStyle:"italic",color:"#6b6760"}}>
              Jacob Mueller is CEO and Co-Founder of Renjoy, an AI-first vacation rental management company operating 200+ properties across Colorado and Florida. He writes about what he's learning at <a href="/" style={{color:"#d4897a",textDecoration:"none"}}>labs.renjoy.com</a>.
            </div>
          </div>
        </article>

        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 40px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#6b6760", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>If this was useful, share it</p>
            <ShareBar url="https://labs.renjoy.com/essays/the-15-pan" title="The $15 Pan — Renjoy Labs" />
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
                <button onClick={()=>{if(email.includes("@")){setSubscribed(true);submitLead({type:"newsletter",email,source:"essay_the-15-pan_inline"})}}} style={{background:"linear-gradient(135deg,#e05a3a,#c94a30)",color:"#fff",padding:"12px 20px",borderRadius:"10px",border:"none",fontSize:"14px",fontWeight:600,cursor:"pointer",fontFamily:"'Figtree',sans-serif",whiteSpace:"nowrap"}}>Stake a Claim</button>
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
