"use client";
import { useState, useEffect, useMemo } from "react";

const META = {
  title: "The Mulrooney Play",
  subtitle: "Why the best VRM companies won't look like VRM companies",
  date: "March 2026",
  readTime: "14 min read",
  series: "Essay 2 of 3",
  author: "Jacob Mueller",
  role: "CEO, Renjoy",
};

const TOC = [
  { id: "extraction", label: "The extraction mindset" },
  { id: "mulrooney-saw", label: "What Mulrooney actually saw" },
  { id: "operational", label: "The hospitality difference is operational" },
  { id: "why-now", label: "Why this matters now" },
  { id: "practice", label: "What the Mulrooney Play looks like in practice" },
  { id: "flywheel", label: "The flywheel underneath" },
  { id: "hardest", label: "The hardest part" },
  { id: "fairview", label: "The Fairview is still standing" },
];

const SOCIALS = [
  { label: "LinkedIn", url: "https://linkedin.com/in/jacobmueller", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label: "X", url: "https://x.com/jacobmueller", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
];

const RELATED = [
  { title: "Stake Your Claim", subtitle: "What the gold rushes actually teach us about the AI frontier", tag: "Essay 1", link: "/essays/stake-your-claim" },
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

function PQ({children}){return(<blockquote style={{margin:"48px 0",padding:"32px 0 32px 32px",borderLeft:"2px solid rgba(212,137,122,0.3)",fontFamily:"'Figtree',sans-serif",fontSize:"24px",fontWeight:700,lineHeight:1.45,fontStyle:"italic",color:"#e8e4df",maxWidth:"600px"}}>{children}</blockquote>);}
function H2({children,id}){return(<h2 id={id} style={{fontFamily:"'Figtree',sans-serif",fontSize:"32px",fontWeight:800,lineHeight:1.2,letterSpacing:"-0.02em",marginTop:"64px",marginBottom:"24px",color:"#e8e4df",scrollMarginTop:"80px"}}>{children}</h2>);}
function P({children}){return(<p style={{fontSize:"18px",lineHeight:1.8,color:"#b5b0a8",marginBottom:"24px"}}>{children}</p>);}
function B({children}){return(<strong style={{color:"#e8e4df",fontWeight:600}}>{children}</strong>);}

export default function MulrooneyPlay() {
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
          {!modalSubscribed?(<><div style={{display:"flex",gap:"10px",maxWidth:"360px",margin:"0 auto",position:"relative"}}><input type="email" placeholder="your@email.com" value={modalEmail} onChange={e=>setModalEmail(e.target.value)} autoFocus style={{flex:1,padding:"14px 18px",borderRadius:"10px",background:"rgba(25,12,18,0.55)",border:"1px solid rgba(212,137,122,0.15)",color:"#e8e4df",fontSize:"15px",fontFamily:"'Figtree',sans-serif",outline:"none"}} onFocus={e=>e.target.style.borderColor="rgba(212,137,122,0.4)"} onBlur={e=>e.target.style.borderColor="rgba(212,137,122,0.15)"} onKeyDown={e=>{if(e.key==="Enter"&&modalEmail.includes("@"))setModalSubscribed(true)}}/><button onClick={()=>{if(modalEmail.includes("@"))setModalSubscribed(true)}} style={{background:"linear-gradient(135deg,#e05a3a,#c94a30)",color:"#fff",padding:"14px 22px",borderRadius:"10px",border:"none",fontSize:"15px",fontWeight:600,cursor:"pointer",fontFamily:"'Figtree',sans-serif",whiteSpace:"nowrap"}}>Stake a Claim</button></div><p style={{fontSize:"12px",color:"#4a4640",marginTop:"16px",fontFamily:"'JetBrains Mono',monospace",position:"relative"}}>No spam. Unsubscribe anytime.</p></>):(<div style={{background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:"12px",padding:"18px 24px",maxWidth:"360px",margin:"0 auto",position:"relative"}}><span style={{color:"#4ade80",fontSize:"15px",fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}><span style={{fontSize:"18px"}}>✓</span>Claim staked. First dispatch incoming.</span></div>)}
        </div></div>)}

        <header style={{padding:"160px 40px 80px",position:"relative",overflow:"hidden"}}>
          <SectionFlakes count={8} seed={10}/>
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
          <SectionFlakes count={6} seed={11}/>
          <div style={{maxWidth:"720px",margin:"0 auto",position:"relative",zIndex:2}}>

            <P>In the winter of 1897, a young woman named Belinda Mulrooney arrived in Dawson City, Yukon, hauling a sled loaded with silk underwear, cotton cloth, and hot water bottles over the Chilkoot Pass. She'd bought the goods in San Francisco. The markup in Dawson was 600%.</P>

            <P>When she got to town, she tossed her last coin into the river. She wouldn't need it.</P>

            <P>Dawson was a gold camp. Tens of thousands of prospectors crammed into a muddy settlement at the edge of the world, sleeping in tents, eating bad food, freezing through the subarctic night. The whole town existed for one purpose: extraction. Find gold, take gold, leave.</P>

            <P>Mulrooney looked at the same scene everyone else did, but she saw something different. She didn't see a gold camp. She saw a town full of cold, dirty, lonely people with money and no place to spend it. She saw a hospitality market.</P>

            <P>So she built the Fairview Hotel, which became Dawson's finest. Real beds. Hot baths. Dining service. She installed the town's first telephone. By 1902, her company was valued at over a million dollars — about $30 million today. She became the richest woman in the Klondike without ever swinging a pickaxe.</P>

            <PQ>The opportunity was never in the gold. It was in the people who came for the gold. And serving those people — really serving them — was a better business than mining ever was.</PQ>

            <P>I think the vacation rental management industry is sitting in Dawson City right now, and most of us are still acting like miners.</P>

            <H2 id="extraction">The extraction mindset</H2>

            <P>Let me describe a business model and see if it sounds familiar.</P>

            <P>You acquire a property, list it on platforms you don't control, and compete for bookings against hundreds of operators within a few miles of you. You earn a cut of whatever the platforms send your way. When something breaks you react, handle it, and move on to the next one.</P>

            <P>Your operating rhythm is defined by turnovers: clean it, flip it, fill it. Your tech stack is a collection of point solutions duct-taped together by manual processes and tribal knowledge. And your owner relationships are, if you're being honest, largely transactional. They stay because you're performing a service. They leave when someone offers a lower fee, and you find it acceptable because 10% churn is industry standard.</P>

            <P>This is the extraction model. It's how the vast majority of VRM companies operate. And I'm not saying it from a high horse. We've operated this way too.</P>

            <P>The extraction model isn't stupid. It works. Properties book, revenue flows, and owners get checks. But it has a ceiling, and if you've been in this business long enough, you can feel it.</P>

            <P><B>You can't differentiate on the product.</B> Your competitors list on the same platforms, use the same pricing tools, hire from the same labor pool, and photograph the same mountain views. A three-bedroom cabin in the Rockies is a three-bedroom cabin in the Rockies.</P>

            <P><B>You can't differentiate on price.</B> Fees are compressing while OTA commissions keep climbing. Owner expectations keep rising. Racing to the bottom on management fees is a losing strategy, and everyone knows it, yet most of the industry does it anyway.</P>

            <P><B>You can't differentiate on scale alone.</B> Adding more properties to a broken operating model just multiplies the chaos. The operator who's drowning at 40 units doesn't magically start swimming at 80. If anything, the problems get heavier.</P>

            <P>So if you can't win on product, price, or scale — what's left?</P>

            <H2 id="mulrooney-saw">What Mulrooney actually saw</H2>

            <P>The miners in Dawson were asking: <em>Where's the gold?</em> The supply sellers were asking: <em>What do the miners need?</em> Mulrooney was asking something different entirely: <em>What do these people actually want?</em></P>

            <P>And the answer wasn't gold. Gold was the vehicle. What they actually wanted was comfort. Dignity. A hot bath after weeks on the trail. A real meal. A place that felt like civilization in the middle of the wilderness. They wanted to feel human again.</P>

            <P>Mulrooney didn't reframe the product. She reframed the category. A gold camp isn't a mining operation. It's a town full of people with unmet needs. And the right business to build isn't a mining company — it's a hospitality company.</P>

            <P>The vacation rental industry is overdue for the same reframe. Most VRM companies define themselves by what they manage: properties. But properties don't have feelings. Properties don't refer their friends. Properties don't decide to stay or leave based on whether they feel valued.</P>

            <P>People do.</P>

            <PQ>The Mulrooney Play is the recognition that the best VRM companies won't look like VRM companies. They'll look like hospitality companies that happen to manage vacation rentals.</PQ>

            <H2 id="operational">The hospitality difference is operational, not aspirational</H2>

            <P>I should be specific here, because "hospitality" gets thrown around a lot. Every VRM website says they offer "exceptional hospitality." It's become meaningless.</P>

            <P>The difference between a property management company that talks about hospitality and a hospitality company that manages properties is operational. It shows up in how you build your systems, what you measure, and where you invest.</P>

            <P><B>A property manager measures occupancy. A hospitality company measures the guest experience.</B> Occupancy tells you whether the calendar is full. Guest experience tells you why it's full, or why it won't be next year. A property with 90% occupancy and a 4.2 guest rating is a ticking time bomb. A property at 71% occupancy with a 4.9 rating is a flywheel that's accelerating.</P>

            <P><B>A property manager reacts to owner complaints. A hospitality company prevents them.</B> If your owner relations strategy is "handle inbound tickets and send monthly statements," you're a property manager. If you're proactively communicating property health, surfacing investment opportunities, and building a relationship where the owner genuinely trusts your judgment, you're running a hospitality operation.</P>

            <P><B>A property manager treats housekeeping as a cost center. A hospitality company treats it as the foundation.</B> Cleanliness is the single most cited factor in guest reviews, and it touches every single stay. If your cleaning team is managed reactively with no QA process, training standards, or career path, the foundation of your guest experience is held together by hope.</P>

            <P><B>A property manager uses technology to manage listings. A hospitality company uses technology to free people.</B> If your tech stack is a collection of platforms that each require a human to operate, you've adopted more work. The hospitality model automates the repetitive, predictable tasks so your people can focus on the moments that actually require a human: edge cases, recovery opportunities, and acts of genuine care that generate five-star reviews.</P>

            <H2 id="why-now">Why this matters now</H2>

            <P>Three forces are converging that make the extraction model increasingly fragile and the hospitality model increasingly necessary.</P>

            <P><B>AI is eliminating the task layer.</B> The things that used to differentiate a "good" property manager — fast response times, dynamic pricing, efficient scheduling — are becoming table stakes. When any operator can deploy an AI agent that responds to guest inquiries in under two minutes, 24/7, the execution floor rises for everyone. Competing on tasks is a race to parity. Competing on how your people make owners and guests <em>feel</em> is a race with no finish line.</P>

            <P><B>Owner expectations are diverging from industry delivery.</B> Today's owners have been conditioned by consumer technology to expect transparency, real-time reporting, and proactive communication. They're comparing you to their wealth advisor, not to the last PM who ghosted them. The gap between what owners expect and what most VRMs deliver is widening every year.</P>

            <P><B>Consolidation is compressing the middle.</B> The big players are getting bigger through acquisition. The scrappy solo operators are getting more efficient through AI tools. The 30-to-150 unit companies that are too big to wing it and too small for enterprise systems are getting squeezed from both directions. The only durable escape is the depth of your relationship with the people you serve.</P>

            <H2 id="practice">What the Mulrooney Play looks like in practice</H2>

            <P>I'll speak from my own experience because I don't want this to sound prescriptive. What works for a 200-property company in Colorado may not map perfectly to your market. But the principles transfer.</P>

            <P>At Renjoy, we made a deliberate decision to stop thinking of ourselves as a property management company. We are becoming a hospitality company — an operating model change.</P>

            <P>The first thing that changed was what we measure. Our north star isn't units under management or revenue per property. It's whether an owner would ever choose to leave. That sounds soft until you make it operational. It means tracking owner communication cadence, response times, proactive outreach frequency, NPS scores, and churn leading indicators. It means building an entire Owner Relations function whose explicit purpose is: no owner chooses to leave.</P>

            <P>The second thing that changed was how we think about our team. In the extraction model, your field team is labor. In the hospitality model, they're the product. Our housekeepers aren't just people who clean. They're the first impression of our brand, every single stay.</P>

            <P>The third thing was technology. We adopted an AI-first approach, but not to replace people — to free them. We automate the repetitive and give our team access to information to proactively surprise our guests. Our AI models notice communications with guests, such as a birthday, and automatically generate a task for our team to grab a birthday card, balloons, or whatever else the AI gathers from the conversation to personalize the surprise.</P>

            <P>This is the Mulrooney Play. We're not building a mining operation. We're building the Fairview Hotel.</P>

            <H2 id="flywheel">The flywheel underneath</H2>

            <P>The hospitality model isn't just nicer. It's structurally better economics.</P>

            <P>When you deliver a genuinely excellent guest experience, you get better reviews. Better reviews earn better placement on booking platforms. Better placement drives more bookings at higher rates. Higher rates mean better returns for owners. Better returns mean owners stay. Owners who stay refer other owners. And a growing portfolio of high-fit owners lets you invest more in your team, your technology, and your properties — which produces even better guest experiences.</P>

            <PQ>Hospitality is the input. Everything else is the output.</PQ>

            <P>The extraction model doesn't have a flywheel. It has a treadmill. You acquire properties, service them, lose some, replace them. There's no compounding because there's no deepening. Every new property is the same lift as the last one.</P>

            <H2 id="hardest">The hardest part</H2>

            <P>I'll be honest: the hardest part of making this shift isn't operational. It's cultural. Changing the identity of an organization takes thought, persistence, and risk.</P>

            <P>If you've built a successful property management company, you have a deeply ingrained sense of what your business is. You manage properties. That's the category. Letting go of that identity, even when the market is telling you it's the right move, feels like letting go of the thing that got you here.</P>

            <P>This is exactly what happened to John Sutter. He wasn't a bad businessman. He was a successful one who couldn't let go of the identity that made him successful. He defined himself as an agricultural magnate. When the world changed around him, he kept building the farm.</P>

            <P>The operators who are going to thrive over the next decade aren't the ones with the most properties, the best technology, or the lowest fees. They're the ones willing to answer a harder question: <em>What business am I actually in?</em></P>

            <P>If the answer is "property management," the ceiling is visible and getting lower.</P>

            <P>If the answer is "I deliver exceptional experiences for the people who trust me with their homes and their vacations," the ceiling disappears.</P>

            <H2 id="fairview">The Fairview is still standing</H2>

            <P>The Klondike gold rush lasted roughly three years. By 1899, the easy placer gold was gone. Most miners left Dawson with less money than they arrived with. But the infrastructure Mulrooney built didn't leave with them. The hotel, the telephone, the town she helped create — those persisted. They became the foundation of something lasting.</P>

            <P>The best VRM companies of the next decade are going to make the same play. They'll stop managing properties and start serving hospitality. They'll stop competing on the listing, the calendar, the nightly rate, and start competing on the experience.</P>

            <P><B>They won't look like VRM companies at all. They'll look like hospitality companies that happen to manage vacation rentals.</B></P>

            <P>That's the Mulrooney Play. And the barrier to making it has never been lower.</P>

            <div style={{marginTop:"64px",padding:"24px 0",borderTop:"1px solid rgba(212,137,122,0.1)",fontFamily:"'Figtree',sans-serif",fontSize:"16px",fontStyle:"italic",color:"#6b6760"}}>
              This is the second essay in a series on what the gold rushes teach us about building companies in the age of AI. The first essay, "Stake Your Claim," explored the broader parallels between gold rush economics and the AI frontier.
            </div>
          </div>
        </article>

        <section id="newsletter" style={{padding:"80px 40px",position:"relative",zIndex:2}}>
          <div style={{maxWidth:"600px",margin:"0 auto",background:"linear-gradient(135deg,rgba(212,137,122,0.04),rgba(212,137,122,0.015))",borderRadius:"20px",border:"1px solid rgba(212,137,122,0.1)",padding:"48px 40px",textAlign:"center"}}>
            <div style={{fontSize:"24px",marginBottom:"16px"}}>⛏</div>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",color:"#d4897a",display:"block",marginBottom:"12px"}}>The Mining Report</span>
            <h3 style={{fontFamily:"'Figtree',sans-serif",fontSize:"26px",fontWeight:800,marginBottom:"10px"}}>Dispatches from the diggings.</h3>
            <p style={{fontSize:"15px",color:"#9a958e",lineHeight:1.6,maxWidth:"400px",margin:"0 auto 24px"}}>A biweekly newsletter on AI, hospitality, and what we're learning as we build.</p>
            {!subscribed?(
              <div style={{display:"flex",gap:"10px",maxWidth:"400px",margin:"0 auto"}}>
                <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={{flex:1,padding:"12px 16px",borderRadius:"10px",background:"rgba(25,12,18,0.5)",border:"1px solid rgba(212,137,122,0.12)",color:"#e8e4df",fontSize:"15px",fontFamily:"'Figtree',sans-serif",outline:"none"}}/>
                <button onClick={()=>{if(email.includes("@"))setSubscribed(true)}} style={{background:"linear-gradient(135deg,#e05a3a,#c94a30)",color:"#fff",padding:"12px 20px",borderRadius:"10px",border:"none",fontSize:"14px",fontWeight:600,cursor:"pointer",fontFamily:"'Figtree',sans-serif",whiteSpace:"nowrap"}}>Stake a Claim</button>
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
