"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { submitLead } from "../lib/submitLead";

// ─── JSON-LD Structured Data ───
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Renjoy",
      url: "https://renjoy.com",
      description:
        "AI-first vacation rental property management across Colorado.",
      areaServed: [
        "El Paso County, Colorado",
        "Chaffee County, Colorado",
        "Teller County, Colorado",
      ],
    },
    {
      "@type": "WebPage",
      name: "Renjoy Labs — Building the Future of Hospitality",
      description:
        "How Renjoy uses artificial intelligence to transform short-term rental management. Essays, projects, and insights from CEO Jacob Mueller.",
      url: "https://renjoy.com/ai",
    },
    {
      "@type": "Person",
      name: "Jacob Mueller",
      jobTitle: "CEO",
      worksFor: { "@type": "Organization", name: "Renjoy" },
      description: "CEO of Renjoy, writing about AI-first vacation rental management and what the gold rushes teach us about building hospitality companies.",
      url: "https://renjoy.com/ai",
    },
    {
      "@type": "Article",
      headline: "Stake Your Claim: What the Gold Rushes Actually Teach Us About the AI Frontier",
      author: { "@type": "Person", name: "Jacob Mueller" },
      publisher: { "@type": "Organization", name: "Renjoy" },
      datePublished: "2026-03-01",
      description: "Only 1% of gold rush miners got rich. The people who built the tools built dynasties. An essay on what the gold rushes teach us about building companies in the age of AI.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How is AI changing vacation rental property management?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AI is reshaping VRM operations through dynamic pricing, automated guest communications, predictive maintenance dispatch, and real-time owner reporting. The real shift is that AI raises the baseline for every operator, meaning competing on tasks alone is a race to parity. The operators who win will compete on hospitality.",
          },
        },
        {
          "@type": "Question",
          name: "Should I hire a property manager that uses AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. A great AI-first property manager automates repetitive work so their people can focus on genuine hospitality. Ask what they have automated and what they have chosen to keep human. If they cannot answer clearly, they may be bolting AI onto a broken process.",
          },
        },
        {
          "@type": "Question",
          name: "Can small vacation rental management companies compete with AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The barrier to building with AI has never been lower. Small teams are shipping tools that would have required fifty engineers two years ago. The new advantages are speed of adoption, willingness to experiment, and clarity about what problems to solve.",
          },
        },
        {
          "@type": "Question",
          name: "What is the Sutter Trap in property management?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Sutter Trap describes successful operators who resist AI adoption because their current model is working. Named after John Sutter, who owned the land where gold was discovered but lost everything because he could not let go of his existing business model. In VRM, operators running 50 to 150 properties profitably are most at risk.",
          },
        },
      ],
    },
  ],
};

// ─── Data ───
const FEATURED_ARTICLE = {
  tag: "Featured Essay",
  title: "Stake Your Claim",
  subtitle: "What the gold rushes actually teach us about the AI frontier",
  excerpt:
    "Only 1% of gold rush miners got rich. The people who built the tools — the supply chains, the infrastructure, the hotels — built dynasties. We're living through the same pattern right now. The barrier to building has never been lower. The question is what you build.",
  readTime: "12 min read",
  date: "March 2026",
  link: "/essays/stake-your-claim",
};

const ARTICLES = [
  {
    tag: "Hospitality × AI",
    title: "The Mulrooney Play",
    excerpt:
      "The best VRM companies of the next decade won't look like VRM companies. They'll look like hospitality companies that happen to manage vacation rentals.",
    readTime: "14 min",
    status: "Published",
    subtitle: "Why the best VRM companies won't look like VRM companies",
    link: "/essays/the-mulrooney-play",
  },
  {
    tag: "The Incumbent's Dilemma",
    title: "The Sutter Trap",
    excerpt:
      "The operators most at risk aren't the struggling ones. They're the ones doing well. 'It's working' is the most dangerous sentence in business when the ground is shifting.",
    readTime: "16 min",
    status: "Published",
    subtitle: "Why the best operators are the most at risk",
    link: "/essays/the-sutter-trap",
  },
  {
    tag: "Practical AI",
    title: "Finding Color",
    excerpt:
      "A non-hype guide to running small AI experiments in your operation without betting the company. What to try first, what to measure, and when to stop.",
    readTime: "10 min",
    status: "Coming Soon",
  },
  {
    tag: "Unit Economics",
    title: "Nobody's Coming to Save Your Margins",
    excerpt:
      "OTA fees climbing, owner expectations rising, labor getting harder. AI doesn't fix this automatically. You have to rebuild the cost structure deliberately.",
    readTime: "11 min",
    status: "Coming Soon",
  },
  {
    tag: "Positioning",
    title: "The $15 Pan",
    excerpt:
      "Most VRM operators think they sell property management. They actually sell peace of mind, time back, and asset protection. The ones who understand this retain owners at 2x the rate.",
    readTime: "9 min",
    status: "Coming Soon",
  },
  {
    tag: "Scaling",
    title: "Build the Railroad, Not the Mine",
    excerpt:
      "What 'infrastructure' actually means for a VRM operator. Not just tech — playbooks, training systems, feedback loops, and the operating model that lets you run 300 the way you ran 30.",
    readTime: "12 min",
    status: "Coming Soon",
  },
];

const PROJECTS = [
  {
    name: "Market Intelligence",
    description:
      "Real-time scrapers that pull conversion rates, occupancy, and competitive pricing from Airbnb daily. Operators who see the market clearly price better and win more bookings.",
    status: "Operators Are Building This",
    tech: ["Web Scraping", "Supabase", "Python"],
    icon: "◈",
  },
  {
    name: "Automated Owner Reports",
    description:
      "AI-generated Slack or email reports that synthesize revenue, occupancy, and market position — sent daily or weekly with zero manual work. Owner trust goes up, churn goes down.",
    status: "Operators Are Building This",
    tech: ["LLM", "Slack API", "Automation"],
    icon: "◆",
  },
  {
    name: "Dynamic Pricing Copilot",
    description:
      "AI that recommends nightly rates based on market signals, seasonality, and booking velocity. Not a black box — a copilot that explains its reasoning so you stay in control.",
    status: "Emerging",
    tech: ["Machine Learning", "Revenue Mgmt"],
    icon: "◇",
  },
  {
    name: "AI Guest Communications",
    description:
      "Handles the predictable 90% of guest messages instantly, 24/7, in any language. Your team focuses on the 10% that actually needs a human — edge cases, recovery, genuine care.",
    status: "Operators Are Building This",
    tech: ["NLP", "Messaging APIs"],
    icon: "◎",
  },
  {
    name: "Predictive Maintenance",
    description:
      "Systems that notice patterns — HVAC filters due, water heater age, seasonal prep windows — and dispatch proactively instead of reactively. Fewer emergencies, happier guests.",
    status: "Emerging",
    tech: ["IoT", "Agentic AI"],
    icon: "▣",
  },
  {
    name: "Unified Ops Dashboard",
    description:
      "A single view consolidating property performance, market data, team tasks, and owner health into one AI-enhanced platform. The operating system your VRM company deserves.",
    status: "Emerging",
    tech: ["Next.js", "Supabase", "Custom"],
    icon: "⬡",
  },
];

const FAQ_ITEMS = [
  {
    q: "How is AI changing vacation rental property management?",
    a: "AI is reshaping VRM operations from the ground up. At Renjoy, we use AI for dynamic pricing, automated guest communications, predictive maintenance dispatch, and real-time owner reporting. Tasks that took our team four hours now take twenty minutes. But the real shift isn't efficiency — it's that AI is raising the baseline for what every operator can deliver, which means competing on tasks alone is a race to parity. The operators who win will compete on hospitality, not just execution.",
  },
  {
    q: "Should I hire a property manager that uses AI?",
    a: "Yes, but with a caveat: the AI should free the team to deliver better hospitality, not replace the human element. A great AI-first property manager automates the repetitive work — scheduling, data entry, routine guest messages — so their people can focus on the moments that require genuine care. Ask your property manager what they've automated and what they've chosen to keep human. If they can't answer clearly, they may be bolting AI onto a broken process rather than building around it.",
  },
  {
    q: "What does 'AI-first' mean for a property management company?",
    a: "AI-first means the operating model is designed around artificial intelligence from day one rather than adding AI tools onto legacy workflows. At Renjoy, this means our revenue management, guest communications, owner reporting, and market analysis all flow through AI-enhanced systems. Our team doesn't spend time on data entry or routine messages — they spend it on owner relationships, guest experience recovery, and the judgment calls that actually require a human.",
  },
  {
    q: "Can small vacation rental management companies compete with AI?",
    a: "Absolutely. The barrier to building with AI has never been lower. Solo founders and small teams are now shipping tools and systems that would have required fifty engineers two years ago. At Renjoy, we operate across three Colorado markets with a lean team precisely because AI amplifies what each person can do. The new advantages aren't scale or capital — they're speed of adoption, willingness to experiment, and clarity about what problems to solve.",
  },
  {
    q: "What is the 'Sutter Trap' in property management?",
    a: "The Sutter Trap is a concept from our essay series comparing AI to the gold rushes. John Sutter owned the land where gold was discovered but lost everything because he couldn't let go of his existing agricultural business model. In VRM, the Sutter Trap describes successful operators — typically running 50 to 150 properties profitably — who resist AI adoption because 'it's working.' The danger is that the baseline is rising beneath them as new operators build AI-first from day one on fundamentally different economics.",
  },
  {
    q: "How can I talk to Renjoy about AI in hospitality?",
    a: "We love these conversations. Whether you're a property owner curious about AI-powered management, a fellow operator exploring new tools, or someone building at the intersection of AI and hospitality — reach out. We share what we're learning openly because we believe the best ideas come from dialogue, not secrecy. Email us or subscribe to The Mining Report, our biweekly newsletter.",
  },
];

// ═══════════════════════════════════════
//  BACKGROUND & DESIGN COMPONENTS
// ═══════════════════════════════════════

function NoiseOverlay() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
      opacity: 0.035, mixBlendMode: "overlay",
    }}>
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

function GridBackground({ scrollY }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.022 }}>
        <defs>
          <pattern id="smallGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(212,137,122,0.5)" strokeWidth="0.5" />
          </pattern>
          <pattern id="largeGrid" width="300" height="300" patternUnits="userSpaceOnUse">
            <rect width="300" height="300" fill="url(#smallGrid)" />
            <path d="M 300 0 L 0 0 0 300" fill="none" stroke="rgba(212,137,122,0.8)" strokeWidth="1" />
          </pattern>
          <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="35%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="gridMask"><rect width="100%" height="100%" fill="url(#gridFade)" /></mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#largeGrid)" mask="url(#gridMask)" />
      </svg>
      <div style={{
        position: "absolute", top: "-200px", right: "-200px", width: "900px", height: "900px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,137,122,0.07) 0%, rgba(212,137,122,0.02) 40%, transparent 70%)",
        filter: "blur(60px)", transform: `translateY(${scrollY * 0.05}px)`,
      }} />
      <div style={{
        position: "absolute", bottom: "-300px", left: "-200px", width: "800px", height: "800px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(160,120,80,0.04) 0%, transparent 70%)",
        filter: "blur(80px)",
      }} />
    </div>
  );
}

function FloatingOrbs({ scrollY }) {
  const orbs = useMemo(() => [
    { x: "8%", y: "15%", size: 180, color: "212,137,122", opacity: 0.04, speed: 0.08 },
    { x: "85%", y: "25%", size: 240, color: "212,137,122", opacity: 0.03, speed: 0.05 },
    { x: "70%", y: "55%", size: 140, color: "190,130,120", opacity: 0.025, speed: 0.07 },
    { x: "15%", y: "70%", size: 200, color: "212,137,122", opacity: 0.03, speed: 0.06 },
    { x: "50%", y: "40%", size: 320, color: "170,110,105", opacity: 0.02, speed: 0.03 },
    { x: "92%", y: "80%", size: 160, color: "212,137,122", opacity: 0.035, speed: 0.04 },
  ], []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {orbs.map((orb, i) => (
        <div key={i} style={{
          position: "absolute", left: orb.x, top: orb.y,
          width: `${orb.size}px`, height: `${orb.size}px`, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${orb.color},${orb.opacity}) 0%, transparent 70%)`,
          filter: "blur(40px)",
          transform: `translateY(${scrollY * orb.speed * (i % 2 === 0 ? -1 : 1)}px)`,
          transition: "transform 0.1s linear",
        }} />
      ))}
    </div>
  );
}

function TopographicLines() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none" }}>
      <defs>
        <linearGradient id="topoFade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(212,137,122,1)" />
          <stop offset="100%" stopColor="rgba(212,137,122,0)" />
        </linearGradient>
      </defs>
      {[120, 180, 240, 300, 360, 420].map((y, i) => (
        <path key={i}
          d={`M -20 ${y} Q 200 ${y - 40 + i * 12} 400 ${y + 20 - i * 8} T 820 ${y - 10 + i * 6}`}
          fill="none" stroke="url(#topoFade)" strokeWidth={0.8 - i * 0.08} opacity={0.6 - i * 0.08}
        />
      ))}
    </svg>
  );
}

function HeroFlakes() {
  const flakes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        x: Math.random() * 100, y: Math.random() * 100,
        size: 1.5 + Math.random() * 2, opacity: 0.2 + Math.random() * 0.25,
        duration: 6 + Math.random() * 8, delay: Math.random() * 10,
        glow: 0, shape: "circle", drift: (Math.random() - 0.5) * 6,
      });
    }
    for (let i = 0; i < 25; i++) {
      arr.push({
        x: Math.random() * 100, y: Math.random() * 100,
        size: 2.5 + Math.random() * 3, opacity: 0.35 + Math.random() * 0.3,
        duration: 4 + Math.random() * 6, delay: Math.random() * 8,
        glow: 8 + Math.random() * 10,
        shape: Math.random() > 0.6 ? "diamond" : "circle",
        drift: (Math.random() - 0.5) * 10,
      });
    }
    for (let i = 0; i < 15; i++) {
      arr.push({
        x: Math.random() * 100, y: Math.random() * 100,
        size: 4 + Math.random() * 4, opacity: 0.5 + Math.random() * 0.35,
        duration: 3 + Math.random() * 5, delay: Math.random() * 6,
        glow: 14 + Math.random() * 18,
        shape: Math.random() > 0.5 ? "diamond" : "circle",
        drift: (Math.random() - 0.5) * 14, shimmer: true,
      });
    }
    return arr;
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      {flakes.map((f, i) => {
        const isDiamond = f.shape === "diamond";
        return (
          <div key={i} style={{
            position: "absolute", left: `${f.x}%`, top: `${f.y}%`,
            width: `${f.size}px`, height: `${f.size}px`,
            borderRadius: isDiamond ? "1px" : "50%",
            transform: isDiamond ? "rotate(45deg)" : "none",
            background: f.shimmer
              ? `linear-gradient(135deg, rgba(232,169,158,${f.opacity}), rgba(212,137,122,${f.opacity}), rgba(255,200,190,${f.opacity * 0.8}))`
              : `rgba(212, 137, 122, ${f.opacity})`,
            animation: f.shimmer
              ? `flakeFloat ${f.duration}s ease-in-out infinite, flakeShimmer ${2 + Math.random() * 3}s ease-in-out infinite`
              : `flakeFloat ${f.duration}s ease-in-out infinite`,
            animationDelay: `${f.delay}s`,
            boxShadow: f.glow > 0
              ? `0 0 ${f.glow}px rgba(212,137,122,${f.opacity * 0.5}), 0 0 ${f.glow * 2}px rgba(212,137,122,${f.opacity * 0.15})`
              : "none",
            ["--drift"]: `${f.drift}px`,
          }} />
        );
      })}
    </div>
  );
}

function SectionFlakes({ count = 6, seed = 0 }) {
  // Sparse, subtle flakes for content sections — sits behind text
  const flakes = useMemo(() => {
    const rng = (i) => {
      // Simple seeded-ish pseudo-random so each section looks different
      const v = Math.sin((seed + 1) * 9301 + i * 4973) * 10000;
      return v - Math.floor(v);
    };
    return Array.from({ length: count }, (_, i) => {
      const r = rng(i);
      const r2 = rng(i + 100);
      const r3 = rng(i + 200);
      const r4 = rng(i + 300);
      const size = 2 + r * 4;
      return {
        x: 5 + r2 * 90,
        y: 8 + r3 * 84,
        size,
        opacity: 0.18 + r * 0.3,
        duration: 5 + r4 * 7,
        delay: r2 * 8,
        glow: size > 4 ? 6 + r * 10 : 0,
        isDiamond: r > 0.6,
        shimmer: size > 5,
        drift: (r3 - 0.5) * 8,
      };
    });
  }, [count, seed]);

  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden",
      pointerEvents: "none", zIndex: 0,
    }}>
      {flakes.map((f, i) => (
        <div key={i} style={{
          position: "absolute", left: `${f.x}%`, top: `${f.y}%`,
          width: `${f.size}px`, height: `${f.size}px`,
          borderRadius: f.isDiamond ? "1px" : "50%",
          transform: f.isDiamond ? "rotate(45deg)" : "none",
          background: f.shimmer
            ? `linear-gradient(135deg, rgba(232,169,158,${f.opacity}), rgba(212,137,122,${f.opacity}))`
            : `rgba(212, 137, 122, ${f.opacity})`,
          animation: f.shimmer
            ? `flakeFloat ${f.duration}s ease-in-out infinite, flakeShimmer ${2 + f.delay * 0.3}s ease-in-out infinite`
            : `flakeFloat ${f.duration}s ease-in-out infinite`,
          animationDelay: `${f.delay}s`,
          boxShadow: f.glow > 0
            ? `0 0 ${f.glow}px rgba(212,137,122,${f.opacity * 0.45}), 0 0 ${f.glow * 2}px rgba(212,137,122,${f.opacity * 0.1})`
            : "none",
          ["--drift"]: `${f.drift}px`,
        }} />
      ))}
    </div>
  );
}

function ConnectionLines() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none" }}>
      <defs>
        <linearGradient id="lineGrad1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="30%" stopColor="rgba(212,137,122,0.8)" />
          <stop offset="70%" stopColor="rgba(212,137,122,0.8)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="lineGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="rgba(212,137,122,0.6)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <line x1="0" y1="100" x2="400" y2="100" stroke="url(#lineGrad1)" strokeWidth="0.5" />
      <line x1="300" y1="200" x2="900" y2="200" stroke="url(#lineGrad1)" strokeWidth="0.5" />
      <line x1="600" y1="300" x2="1200" y2="300" stroke="url(#lineGrad1)" strokeWidth="0.5" />
      <line x1="400" y1="100" x2="400" y2="200" stroke="url(#lineGrad2)" strokeWidth="0.5" />
      <line x1="900" y1="200" x2="900" y2="300" stroke="url(#lineGrad2)" strokeWidth="0.5" />
      {[[400,100],[400,200],[300,200],[900,200],[900,300],[600,300]].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="3" fill="rgba(212,137,122,0.5)" />
          <circle cx={cx} cy={cy} r="6" fill="none" stroke="rgba(212,137,122,0.2)" strokeWidth="0.5">
            <animate attributeName="r" values="6;12;6" dur="3s" begin={`${i*0.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" begin={`${i*0.5}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <circle r="2" fill="rgba(212,137,122,0.9)">
        <animateMotion path="M 0,100 L 400,100 L 400,200 L 900,200 L 900,300 L 1200,300" dur="8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function SectionDivider({ variant = "default" }) {
  if (variant === "wave") {
    return (
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0, position: "relative", height: "80px", zIndex: 2 }}>
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" style={{ width: "100%", height: "80px" }}>
          <path d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,80 L0,80 Z" fill="rgba(212,137,122,0.015)" />
          <path d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40" fill="none" stroke="rgba(212,137,122,0.08)" strokeWidth="0.5" />
        </svg>
      </div>
    );
  }
  return (
    <div style={{
      width: "100%", height: "1px", position: "relative", zIndex: 2,
      background: "linear-gradient(90deg, transparent, rgba(212,137,122,0.15), rgba(255,255,255,0.04), transparent)",
    }}>
      <div style={{
        position: "absolute", left: "50%", top: "-4px", transform: "translateX(-50%)",
        width: "8px", height: "8px", borderRadius: "50%", background: "rgba(212,137,122,0.2)",
        boxShadow: "0 0 12px rgba(212,137,122,0.15)",
      }} />
    </div>
  );
}

function GlowCard({ children, style, className, ...props }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)} className={className}
      style={{ position: "relative", ...style }} {...props}>
      {isHovered && (
        <div style={{
          position: "absolute", inset: "-1px", borderRadius: "inherit", pointerEvents: "none", zIndex: 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212,137,122,0.1), transparent 60%)`,
        }} />
      )}
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════
//  UI COMPONENTS
// ═══════════════════════════════════════

function AnimatedCounter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <button onClick={onToggle} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 0", background: "none", border: "none", color: "#e8e4df",
        fontSize: "18px", fontFamily: "'Figtree', sans-serif", fontWeight: 500,
        cursor: "pointer", textAlign: "left", lineHeight: 1.4, gap: "20px",
      }}>
        <span>{item.q}</span>
        <span style={{
          fontSize: "24px", color: "#d4897a",
          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease", flexShrink: 0,
        }}>+</span>
      </button>
      <div style={{
        maxHeight: isOpen ? "300px" : "0", opacity: isOpen ? 1 : 0,
        transition: "all 0.4s ease", overflow: "hidden",
      }}>
        <p style={{
          color: "#9a958e", fontSize: "16px", lineHeight: 1.7,
          padding: "0 0 24px 0", fontFamily: "'Figtree', sans-serif", maxWidth: "680px",
        }}>{item.a}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    Live: { bg: "rgba(74, 222, 128, 0.1)", text: "#4ade80", dot: "#4ade80" },
    Published: { bg: "rgba(74, 222, 128, 0.1)", text: "#4ade80", dot: "#4ade80" },
    "Operators Are Building This": { bg: "rgba(74, 222, 128, 0.08)", text: "#4ade80", dot: "#4ade80" },
    "In Development": { bg: "rgba(212, 137, 122, 0.1)", text: "#d4897a", dot: "#d4897a" },
    Emerging: { bg: "rgba(212, 137, 122, 0.08)", text: "#d4897a", dot: "#d4897a" },
    Planned: { bg: "rgba(148, 143, 137, 0.1)", text: "#948f89", dot: "#948f89" },
    "Coming Soon": { bg: "rgba(148, 143, 137, 0.1)", text: "#948f89", dot: "#948f89" },
  };
  const c = colors[status] || colors["Planned"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px",
      borderRadius: "100px", background: c.bg, fontSize: "12px", fontWeight: 600,
      color: c.text, letterSpacing: "0.03em", textTransform: "uppercase",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <span style={{
        width: "6px", height: "6px", borderRadius: "50%", background: c.dot,
        animation: status === "Live" ? "pulse 2s infinite" : "none",
      }} />
      {status}
    </span>
  );
}

// ═══════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════

export default function RenjoyAILanding() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalSubscribed, setModalSubscribed] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes flakeFloat {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: var(--base-op, 1); }
          25% { transform: translateY(-8px) translateX(var(--drift, 4px)) scale(1.1); }
          50% { transform: translateY(-14px) translateX(calc(var(--drift, 4px) * -0.5)) scale(1.2); opacity: calc(var(--base-op, 1) * 1.4); }
          75% { transform: translateY(-6px) translateX(var(--drift, 4px)) scale(1.05); }
        }
        @keyframes flakeShimmer {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.8); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(1.15); }
        }
        @keyframes orbPulse { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.08); opacity: 0.8; } }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .fade-in { animation: fadeUp 0.8s ease forwards; }
        .fade-in-d1 { animation-delay: 0.1s; opacity: 0; }
        .fade-in-d2 { animation-delay: 0.25s; opacity: 0; }
        .fade-in-d3 { animation-delay: 0.4s; opacity: 0; }
        .fade-in-d4 { animation-delay: 0.55s; opacity: 0; }
        .fade-in-d7 { animation-delay: 1.0s; opacity: 0; }

        .article-card { transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
        .article-card:hover { transform: translateY(-6px); }
        .project-card { transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
        .project-card:hover { transform: translateY(-4px); }
        .cta-btn { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(212, 137, 122, 0.3); }
        .cta-red { background: linear-gradient(135deg, #e05a3a, #c94a30) !important; color: #fff !important; }
        .cta-red:hover { background: linear-gradient(135deg, #d4897a, #b5685a) !important; color: #1e0f16 !important; box-shadow: 0 8px 40px rgba(212, 137, 122, 0.35) !important; }
        .cta-btn-outline { transition: all 0.3s ease; }
        .cta-btn-outline:hover { background: rgba(212, 137, 122, 0.12) !important; border-color: #d4897a !important; color: #d4897a !important; }
        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: #d4897a !important; }
        ::selection { background: rgba(212, 137, 122, 0.3); color: #fff; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1e0f16; }
        ::-webkit-scrollbar-thumb { background: rgba(212,137,122,0.2); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(212,137,122,0.4); }
      `}</style>

      <div style={{ display: "none" }} dangerouslySetInnerHTML={{
        __html: `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`,
      }} />

      <div style={{
        background: "#1e0f16", color: "#ede8e2", minHeight: "100vh",
        fontFamily: "'Figtree', sans-serif", overflowX: "hidden", position: "relative",
      }}>

        {/* ══════ GLOBAL BACKGROUND LAYERS ══════ */}
        <NoiseOverlay />
        <GridBackground scrollY={scrollY} />
        <FloatingOrbs scrollY={scrollY} />

        {/* Scanline */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
          overflow: "hidden", opacity: 0.015,
        }}>
          <div style={{
            width: "100%", height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(212,137,122,0.6), transparent)",
            animation: "scanline 8s linear infinite",
          }} />
        </div>

        {/* ══════ NAV ══════ */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center",
          background: scrollY > 50 ? "rgba(30, 15, 22, 0.92)" : "transparent",
          backdropFilter: scrollY > 50 ? "blur(24px) saturate(1.2)" : "none",
          borderBottom: scrollY > 50 ? "1px solid rgba(212,137,122,0.06)" : "1px solid transparent",
          transition: "all 0.4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <span style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>renjoy</span>
            <span style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
              color: "#d4897a", background: "rgba(212,137,122,0.08)",
              padding: "4px 12px", borderRadius: "6px", fontFamily: "'JetBrains Mono', monospace",
              border: "1px solid rgba(212,137,122,0.15)", marginLeft: "8px",
            }}>LABS</span>
          </div>
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            {["Articles", "Projects", "FAQ"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="nav-link"
                style={{ color: "#9a958e", textDecoration: "none", fontSize: "14px", fontWeight: 500, letterSpacing: "0.02em" }}>
                {item}
              </a>
            ))}
            <button onClick={() => setShowModal(true)} style={{
              background: "none", border: "1px solid rgba(212,137,122,0.2)", color: "#d4897a",
              padding: "8px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", fontFamily: "'Figtree', sans-serif", letterSpacing: "0.02em",
              transition: "all 0.2s ease",
            }}
              onMouseEnter={e => { e.target.style.background = "rgba(212,137,122,0.08)"; e.target.style.borderColor = "rgba(212,137,122,0.4)"; }}
              onMouseLeave={e => { e.target.style.background = "none"; e.target.style.borderColor = "rgba(212,137,122,0.2)"; }}
            >Subscribe</button>
            <button onClick={() => setShowContact(true)} className="cta-btn" style={{
              background: "linear-gradient(135deg, #e05a3a, #c94a30)",
              color: "#fff", padding: "10px 24px", borderRadius: "8px",
              border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer",
              fontFamily: "'Figtree', sans-serif",
            }}>Let's Talk AI</button>
          </div>
        </nav>

        {/* ══════ SUBSCRIBE MODAL ══════ */}
        {showModal && (
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(25,12,18,0.82)", backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "20px",
              animation: "modalFadeIn 0.25s ease forwards",
            }}
          >
            <div style={{
              background: "linear-gradient(135deg, #281620, #22121a)",
              border: "1px solid rgba(212,137,122,0.12)",
              borderRadius: "24px", padding: "52px 48px", maxWidth: "460px", width: "100%",
              position: "relative", textAlign: "center",
              boxShadow: "0 24px 80px rgba(25,12,18,0.65), 0 0 60px rgba(212,137,122,0.04)",
              animation: "modalSlideUp 0.3s ease forwards",
              overflow: "hidden",
            }}>
              {/* Inner glow */}
              <div style={{
                position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)",
                width: "300px", height: "200px", borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(212,137,122,0.06) 0%, transparent 70%)",
                filter: "blur(40px)", pointerEvents: "none",
              }} />

              {/* Corner accents */}
              {[
                { top: "12px", left: "12px", borderTop: "1px solid rgba(212,137,122,0.12)", borderLeft: "1px solid rgba(212,137,122,0.12)" },
                { top: "12px", right: "12px", borderTop: "1px solid rgba(212,137,122,0.12)", borderRight: "1px solid rgba(212,137,122,0.12)" },
                { bottom: "12px", left: "12px", borderBottom: "1px solid rgba(212,137,122,0.12)", borderLeft: "1px solid rgba(212,137,122,0.12)" },
                { bottom: "12px", right: "12px", borderBottom: "1px solid rgba(212,137,122,0.12)", borderRight: "1px solid rgba(212,137,122,0.12)" },
              ].map((s, i) => (
                <div key={i} style={{ position: "absolute", width: "18px", height: "18px", ...s }} />
              ))}

              {/* Close button */}
              <button onClick={() => setShowModal(false)} style={{
                position: "absolute", top: "16px", right: "16px", background: "none",
                border: "none", color: "#6b6760", fontSize: "20px", cursor: "pointer",
                width: "32px", height: "32px", borderRadius: "8px", display: "flex",
                alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.target.style.color = "#e8e4df"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { e.target.style.color = "#6b6760"; e.target.style.background = "none"; }}
              >✕</button>

              {/* Icon */}
              <div style={{
                width: "56px", height: "56px", borderRadius: "16px", margin: "0 auto 24px",
                background: "rgba(212,137,122,0.08)", border: "1px solid rgba(212,137,122,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px",
                position: "relative",
              }}>⛏</div>

              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 600,
                letterSpacing: "0.15em", textTransform: "uppercase", color: "#d4897a",
                display: "block", marginBottom: "14px",
              }}>The Mining Report</span>

              <h3 style={{
                fontFamily: "'Figtree', sans-serif", fontSize: "30px", fontWeight: 800,
                lineHeight: 1.2, marginBottom: "12px", position: "relative",
              }}>Dispatches from<br />the diggings.</h3>

              <p style={{
                fontSize: "15px", lineHeight: 1.65, color: "#9a958e",
                maxWidth: "340px", margin: "0 auto 28px", position: "relative",
              }}>
                A biweekly newsletter on AI, hospitality, and building
                in the age of the gold rush. No hype. Just the color
                we're finding in the pan.
              </p>

              {!modalSubscribed ? (
                <>
                  <div style={{ display: "flex", gap: "10px", maxWidth: "360px", margin: "0 auto", position: "relative" }}>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={modalEmail}
                      onChange={(e) => setModalEmail(e.target.value)}
                      autoFocus
                      style={{
                        flex: 1, padding: "14px 18px", borderRadius: "10px",
                        background: "rgba(25,12,18,0.55)", border: "1px solid rgba(212,137,122,0.15)",
                        color: "#e8e4df", fontSize: "15px", fontFamily: "'Figtree', sans-serif",
                        outline: "none", transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "rgba(212,137,122,0.4)"}
                      onBlur={(e) => e.target.style.borderColor = "rgba(212,137,122,0.15)"}
                      onKeyDown={(e) => { if (e.key === "Enter" && modalEmail.includes("@")) { setModalSubscribed(true); submitLead({ type: "newsletter", email: modalEmail, source: "homepage_modal" }); if (typeof gtag !== "undefined") gtag("event", "newsletter_signup", { method: "modal" }); } }}
                    />
                    <button
                      onClick={() => { if (modalEmail.includes("@")) { setModalSubscribed(true); submitLead({ type: "newsletter", email: modalEmail, source: "homepage_modal" }); if (typeof gtag !== "undefined") gtag("event", "newsletter_signup", { method: "modal" }); } }}
                      className="cta-btn cta-red"
                      style={{
                        padding: "14px 22px", borderRadius: "10px",
                        border: "none", fontSize: "15px", fontWeight: 600, cursor: "pointer",
                        fontFamily: "'Figtree', sans-serif", whiteSpace: "nowrap",
                      }}
                    >Stake a Claim</button>
                  </div>
                  <p style={{
                    fontSize: "12px", color: "#4a4640", marginTop: "16px",
                    fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.02em",
                    position: "relative",
                  }}>No spam. Unsubscribe anytime.</p>
                </>
              ) : (
                <div style={{
                  background: "rgba(74, 222, 128, 0.06)", border: "1px solid rgba(74,222,128,0.15)",
                  borderRadius: "12px", padding: "18px 24px", maxWidth: "360px", margin: "0 auto",
                  position: "relative",
                }}>
                  <span style={{
                    color: "#4ade80", fontSize: "15px", fontWeight: 500,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  }}>
                    <span style={{ fontSize: "18px" }}>✓</span>
                    Claim staked. First dispatch incoming.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════ CONTACT MODAL ══════ */}
        {showContact && (
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setShowContact(false); }}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(25,12,18,0.82)", backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "20px",
              animation: "modalFadeIn 0.25s ease forwards",
            }}
          >
            <div style={{
              background: "linear-gradient(135deg, #281620, #22121a)",
              border: "1px solid rgba(212,137,122,0.12)",
              borderRadius: "24px", padding: "48px 44px", maxWidth: "500px", width: "100%",
              position: "relative",
              boxShadow: "0 24px 80px rgba(25,12,18,0.65), 0 0 60px rgba(212,137,122,0.04)",
              animation: "modalSlideUp 0.3s ease forwards",
              overflow: "hidden",
            }}>
              {/* Inner glow */}
              <div style={{
                position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)",
                width: "300px", height: "200px", borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(212,137,122,0.06) 0%, transparent 70%)",
                filter: "blur(40px)", pointerEvents: "none",
              }} />

              {/* Corner accents */}
              {[
                { top: "12px", left: "12px", borderTop: "1px solid rgba(212,137,122,0.12)", borderLeft: "1px solid rgba(212,137,122,0.12)" },
                { top: "12px", right: "12px", borderTop: "1px solid rgba(212,137,122,0.12)", borderRight: "1px solid rgba(212,137,122,0.12)" },
                { bottom: "12px", left: "12px", borderBottom: "1px solid rgba(212,137,122,0.12)", borderLeft: "1px solid rgba(212,137,122,0.12)" },
                { bottom: "12px", right: "12px", borderBottom: "1px solid rgba(212,137,122,0.12)", borderRight: "1px solid rgba(212,137,122,0.12)" },
              ].map((s, i) => (
                <div key={i} style={{ position: "absolute", width: "18px", height: "18px", ...s }} />
              ))}

              {/* Close button */}
              <button onClick={() => setShowContact(false)} style={{
                position: "absolute", top: "16px", right: "16px", background: "none",
                border: "none", color: "#6b6760", fontSize: "20px", cursor: "pointer",
                width: "32px", height: "32px", borderRadius: "8px", display: "flex",
                alignItems: "center", justifyContent: "center", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.target.style.color = "#e8e4df"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { e.target.style.color = "#6b6760"; e.target.style.background = "none"; }}
              >✕</button>

              {!contactSent ? (
                <div style={{ position: "relative" }}>
                  {/* Header */}
                  <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{
                      width: "56px", height: "56px", borderRadius: "16px", margin: "0 auto 20px",
                      background: "rgba(212,137,122,0.08)", border: "1px solid rgba(212,137,122,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px",
                    }}>💬</div>
                    <h3 style={{
                      fontFamily: "'Figtree', sans-serif", fontSize: "28px", fontWeight: 800,
                      lineHeight: 1.2, marginBottom: "8px",
                    }}>Let's talk AI.</h3>
                    <p style={{ fontSize: "15px", color: "#9a958e", lineHeight: 1.5 }}>
                      No pitch. No form letter. Just a real conversation<br />about what you're building or thinking about.
                    </p>
                  </div>

                  {/* Form */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {/* Name + Email row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", color: "#6b6760", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Name</label>
                        <input
                          type="text" placeholder="Jane Doe"
                          value={contactForm.name}
                          onChange={e => setContactForm({...contactForm, name: e.target.value})}
                          style={{
                            width: "100%", padding: "12px 16px", borderRadius: "10px",
                            background: "rgba(25,12,18,0.55)", border: "1px solid rgba(212,137,122,0.12)",
                            color: "#e8e4df", fontSize: "15px", fontFamily: "'Figtree', sans-serif", outline: "none",
                            transition: "border-color 0.2s",
                          }}
                          onFocus={e => e.target.style.borderColor = "rgba(212,137,122,0.35)"}
                          onBlur={e => e.target.style.borderColor = "rgba(212,137,122,0.12)"}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", color: "#6b6760", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Email</label>
                        <input
                          type="email" placeholder="jane@company.com"
                          value={contactForm.email}
                          onChange={e => setContactForm({...contactForm, email: e.target.value})}
                          style={{
                            width: "100%", padding: "12px 16px", borderRadius: "10px",
                            background: "rgba(25,12,18,0.55)", border: "1px solid rgba(212,137,122,0.12)",
                            color: "#e8e4df", fontSize: "15px", fontFamily: "'Figtree', sans-serif", outline: "none",
                            transition: "border-color 0.2s",
                          }}
                          onFocus={e => e.target.style.borderColor = "rgba(212,137,122,0.35)"}
                          onBlur={e => e.target.style.borderColor = "rgba(212,137,122,0.12)"}
                        />
                      </div>
                    </div>

                    {/* Topic */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", color: "#6b6760", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>What's on your mind?</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {[
                          "AI in my business",
                          "Property management",
                          "Building with AI",
                          "Just want to chat",
                        ].map(topic => (
                          <button
                            key={topic}
                            onClick={() => setContactForm({...contactForm, topic: contactForm.topic === topic ? "" : topic})}
                            style={{
                              padding: "8px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: 500,
                              cursor: "pointer", fontFamily: "'Figtree', sans-serif",
                              transition: "all 0.2s",
                              background: contactForm.topic === topic ? "rgba(212,137,122,0.15)" : "rgba(255,255,255,0.03)",
                              border: contactForm.topic === topic ? "1px solid rgba(212,137,122,0.35)" : "1px solid rgba(255,255,255,0.08)",
                              color: contactForm.topic === topic ? "#d4897a" : "#9a958e",
                            }}
                          >{topic}</button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", color: "#6b6760", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Anything else? <span style={{ color: "#4a4640", textTransform: "none", letterSpacing: "0" }}>(optional)</span></label>
                      <textarea
                        placeholder="Tell us what you're working on, what questions you have, or what caught your eye..."
                        value={contactForm.message}
                        onChange={e => setContactForm({...contactForm, message: e.target.value})}
                        rows={3}
                        style={{
                          width: "100%", padding: "12px 16px", borderRadius: "10px",
                          background: "rgba(25,12,18,0.55)", border: "1px solid rgba(212,137,122,0.12)",
                          color: "#e8e4df", fontSize: "15px", fontFamily: "'Figtree', sans-serif", outline: "none",
                          resize: "vertical", minHeight: "80px", transition: "border-color 0.2s",
                        }}
                        onFocus={e => e.target.style.borderColor = "rgba(212,137,122,0.35)"}
                        onBlur={e => e.target.style.borderColor = "rgba(212,137,122,0.12)"}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      onClick={() => {
                        if (contactForm.name && contactForm.email.includes("@")) { setContactSent(true); submitLead({ type: "contact", email: contactForm.email, name: contactForm.name, topic: contactForm.topic, message: contactForm.message, source: "homepage_contact" }); if (typeof gtag !== "undefined") gtag("event", "contact_form_submit"); }
                      }}
                      style={{
                        width: "100%", padding: "16px", borderRadius: "12px", border: "none",
                        background: "linear-gradient(135deg, #e05a3a, #c94a30)", color: "#fff",
                        fontSize: "16px", fontWeight: 600, cursor: "pointer",
                        fontFamily: "'Figtree', sans-serif", marginTop: "4px",
                        transition: "all 0.2s",
                        opacity: (contactForm.name && contactForm.email.includes("@")) ? 1 : 0.5,
                      }}
                    >Send It Over</button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0", position: "relative" }}>
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "50%", margin: "0 auto 24px",
                    background: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74,222,128,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px",
                  }}>✓</div>
                  <h3 style={{
                    fontFamily: "'Figtree', sans-serif", fontSize: "26px", fontWeight: 800,
                    marginBottom: "12px",
                  }}>Message received.</h3>
                  <p style={{ fontSize: "16px", color: "#9a958e", lineHeight: 1.6, maxWidth: "320px", margin: "0 auto 8px" }}>
                    Jacob or someone from the Renjoy team will get back to you within a day or two. Looking forward to it.
                  </p>
                  <button onClick={() => setShowContact(false)} style={{
                    marginTop: "20px", padding: "12px 28px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "#e8e4df", fontSize: "14px", fontWeight: 500, cursor: "pointer",
                    fontFamily: "'Figtree', sans-serif", transition: "all 0.2s",
                  }}>Close</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════ HERO ══════ */}
        <section style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "160px 40px 80px", position: "relative",
          overflow: "hidden", zIndex: 2,
        }}>
          <TopographicLines />
          <ConnectionLines />
          <HeroFlakes />

          {/* Large decorative ring */}
          <div style={{
            position: "absolute", right: "-120px", top: "50%", transform: "translateY(-50%)",
            width: "600px", height: "600px", borderRadius: "50%",
            border: "1px solid rgba(212,137,122,0.04)",
            boxShadow: "inset 0 0 60px rgba(212,137,122,0.02)", pointerEvents: "none",
          }}>
            <div style={{ position: "absolute", inset: "40px", borderRadius: "50%", border: "1px solid rgba(212,137,122,0.03)" }} />
            <div style={{ position: "absolute", inset: "80px", borderRadius: "50%", border: "1px dashed rgba(212,137,122,0.025)" }} />
            <div style={{
              position: "absolute", top: "50%", left: "0", width: "8px", height: "8px",
              marginTop: "-4px", marginLeft: "-4px", borderRadius: "50%",
              background: "rgba(212,137,122,0.4)", boxShadow: "0 0 16px rgba(212,137,122,0.3)",
              animation: "orbPulse 3s ease-in-out infinite",
            }} />
          </div>

          <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", position: "relative" }}>
            <div className="fade-in fade-in-d1" style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, transparent, #d4897a)" }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", fontWeight: 500,
                letterSpacing: "0.15em", textTransform: "uppercase", color: "#d4897a",
              }}>For VRM Operators · By Renjoy</span>
            </div>

            <h1 className="fade-in fade-in-d2" style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: "clamp(48px, 7vw, 84px)", fontWeight: 800,
              lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: "900px", marginBottom: "32px",
            }}>
              The VRM industry<br />is in a{" "}
              <span style={{
                background: "linear-gradient(135deg, #d4897a, #e8a99e, #c97a6e, #d4897a)",
                backgroundSize: "300% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "gradientShift 6s ease infinite",
              }}>gold rush.</span>
              <br />Here's what<br />we're learning.
            </h1>

            <p className="fade-in fade-in-d3" style={{
              fontSize: "20px", lineHeight: 1.7, color: "#a8a29e", maxWidth: "580px", marginBottom: "48px",
            }}>
              AI is rewriting how vacation rentals are managed — pricing, guest comms, owner reporting, all of it. We're an operator in Colorado figuring this out in real time and sharing everything. Essays, tools, and honest conversations for VRM operators who'd rather build than wait.
            </p>

            <div className="fade-in fade-in-d4" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <a href="#featured" className="cta-btn cta-red" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "16px 32px", borderRadius: "10px", textDecoration: "none",
                fontSize: "16px", fontWeight: 600,
              }}>Read "Stake Your Claim" <span style={{ fontSize: "18px" }}>→</span></a>
              <button onClick={() => setShowContact(true)} className="cta-btn-outline" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(240,76,59,0.04)", color: "#ede8e2",
                padding: "16px 32px", borderRadius: "10px",
                fontSize: "16px", fontWeight: 500, border: "1px solid rgba(240,76,59,0.25)",
                cursor: "pointer", fontFamily: "'Figtree', sans-serif",
              }}>Talk to Us About AI</button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="fade-in fade-in-d7" style={{
            position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
            opacity: scrollY > 100 ? 0 : 0.4, transition: "opacity 0.3s",
          }}>
            <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", color: "#9a958e" }}>Scroll</span>
            <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(212,137,122,0.5), transparent)" }} />
          </div>
        </section>

        {/* ══════ STATS BAR ══════ */}
        <section style={{ padding: "60px 40px", position: "relative", zIndex: 2 }}>
          <SectionFlakes count={4} seed={1} />
          <SectionDivider variant="wave" />
          <div style={{
            maxWidth: "1200px", margin: "20px auto 0", display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)", gap: "40px",
            background: "rgba(212,137,122,0.015)", borderRadius: "20px",
            padding: "48px 40px", border: "1px solid rgba(212,137,122,0.06)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)",
              width: "600px", height: "300px", borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(212,137,122,0.04) 0%, transparent 70%)",
              filter: "blur(40px)", pointerEvents: "none",
            }} />
            {[
              { value: <><AnimatedCounter end={73} suffix="%" /></>, label: "Of Operators Cite Staffing as #1 Barrier" },
              { value: <><AnimatedCounter end={90} suffix="%" /></>, label: "Of Guest Messages AI Can Handle" },
              { value: <><AnimatedCounter end={38} suffix="%" /></>, label: "Of New Companies Are Solo-Founded" },
              { value: <>1<span style={{ fontSize: "32px" }}>%</span></>, label: "Of Gold Rush Miners Got Rich" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center", position: "relative" }}>
                {i < 3 && <div style={{
                  position: "absolute", right: 0, top: "10%", bottom: "10%", width: "1px",
                  background: "rgba(212,137,122,0.08)",
                }} />}
                <div style={{
                  fontFamily: "'Figtree', sans-serif", fontSize: "46px", fontWeight: 700,
                  color: "#d4897a", marginBottom: "8px", textShadow: "0 0 40px rgba(212,137,122,0.15)",
                }}>{stat.value}</div>
                <div style={{
                  fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "#9a958e", fontFamily: "'JetBrains Mono', monospace",
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════ FEATURED ARTICLE ══════ */}
        <section id="featured" style={{ padding: "120px 40px", position: "relative", zIndex: 2 }}>
          <SectionFlakes count={6} seed={2} />
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
              {/* Left: Visual Card */}
              <div style={{
                position: "relative", aspectRatio: "4/3", borderRadius: "20px", overflow: "hidden",
                background: "linear-gradient(135deg, #2a1820, #22121a)",
                border: "1px solid rgba(212,137,122,0.1)",
                boxShadow: "0 0 80px rgba(212,137,122,0.03), inset 0 0 40px rgba(25,12,18,0.5)",
              }}>
                {/* Card grid overlay */}
                <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.05 }}>
                  <defs>
                    <pattern id="cardGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(212,137,122,0.6)" strokeWidth="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cardGrid)" />
                </svg>
                {/* Gold particles inside card */}
                {[...Array(35)].map((_, i) => {
                  const sz = 2 + Math.random() * 5;
                  const op = 0.25 + Math.random() * 0.55;
                  const isDiamond = Math.random() > 0.55;
                  return (
                    <div key={i} style={{
                      position: "absolute",
                      width: `${sz}px`, height: `${sz}px`,
                      borderRadius: isDiamond ? "1px" : "50%",
                      transform: isDiamond ? "rotate(45deg)" : "none",
                      background: sz > 5
                        ? `linear-gradient(135deg, rgba(232,169,158,${op}), rgba(212,137,122,${op}))`
                        : `rgba(212, 137, 122, ${op})`,
                      top: `${3 + Math.random() * 94}%`, left: `${3 + Math.random() * 94}%`,
                      animation: `particleFloat ${3 + Math.random() * 5}s ease-in-out infinite${sz > 5 ? `, flakeShimmer ${2 + Math.random() * 3}s ease-in-out infinite` : ""}`,
                      animationDelay: `${Math.random() * 4}s`,
                      boxShadow: sz > 3
                        ? `0 0 ${sz * 3}px rgba(212,137,122,${op * 0.45}), 0 0 ${sz * 6}px rgba(212,137,122,${op * 0.12})`
                        : `0 0 ${sz * 2}px rgba(212,137,122,${op * 0.3})`,
                    }} />
                  );
                })}
                {/* Center content */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}>
                  <div style={{
                    width: "100px", height: "100px", borderRadius: "50%",
                    border: "1px solid rgba(212,137,122,0.15)", display: "flex",
                    alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
                    background: "rgba(212,137,122,0.03)", boxShadow: "0 0 40px rgba(212,137,122,0.05)",
                  }}>
                    <span style={{ fontSize: "42px" }}>⛏</span>
                  </div>
                  <div style={{
                    fontFamily: "'Figtree', sans-serif", fontSize: "26px", fontWeight: 700,
                    fontStyle: "italic", color: "rgba(212,137,122,0.5)",
                  }}>"Stake Your Claim"</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(212,137,122,0.3)",
                    marginTop: "8px", letterSpacing: "0.1em", textTransform: "uppercase",
                  }}>Featured Essay · March 2026</div>
                </div>
                {/* Corner accents */}
                {[
                  { top: "16px", left: "16px", borderTop: "1px solid rgba(212,137,122,0.12)", borderLeft: "1px solid rgba(212,137,122,0.12)" },
                  { top: "16px", right: "16px", borderTop: "1px solid rgba(212,137,122,0.12)", borderRight: "1px solid rgba(212,137,122,0.12)" },
                  { bottom: "16px", left: "16px", borderBottom: "1px solid rgba(212,137,122,0.12)", borderLeft: "1px solid rgba(212,137,122,0.12)" },
                  { bottom: "16px", right: "16px", borderBottom: "1px solid rgba(212,137,122,0.12)", borderRight: "1px solid rgba(212,137,122,0.12)" },
                ].map((s, i) => (
                  <div key={i} style={{ position: "absolute", width: "24px", height: "24px", ...s }} />
                ))}
              </div>

              {/* Right: Content */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ width: "24px", height: "1px", background: "#d4897a" }} />
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 600,
                    letterSpacing: "0.15em", textTransform: "uppercase", color: "#d4897a",
                  }}>{FEATURED_ARTICLE.tag} · {FEATURED_ARTICLE.date}</span>
                </div>
                <h2 style={{
                  fontFamily: "'Figtree', sans-serif", fontSize: "48px", fontWeight: 800,
                  lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "12px",
                }}>{FEATURED_ARTICLE.title}</h2>
                <p style={{
                  fontSize: "20px", color: "#9a958e", fontStyle: "italic", marginBottom: "24px",
                  fontFamily: "'Figtree', sans-serif",
                }}>{FEATURED_ARTICLE.subtitle}</p>
                <p style={{
                  fontSize: "17px", lineHeight: 1.75, color: "#b5b0a8", marginBottom: "24px", maxWidth: "480px",
                }}>{FEATURED_ARTICLE.excerpt}</p>
                <div style={{
                  display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px",
                  paddingBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(212,137,122,0.2), rgba(212,137,122,0.08))",
                    border: "1px solid rgba(212,137,122,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", fontWeight: 700, color: "#d4897a",
                  }}>JM</div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#e8e4df" }}>Jacob Mueller</div>
                    <div style={{ fontSize: "12px", color: "#6b6760", fontFamily: "'JetBrains Mono', monospace" }}>CEO, Renjoy</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <a href={FEATURED_ARTICLE.link} className="cta-btn cta-red" style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "14px 28px", borderRadius: "10px", textDecoration: "none",
                    fontSize: "15px", fontWeight: 600,
                  }}>Read the Full Essay <span>→</span></a>
                  <span style={{ fontSize: "13px", color: "#9a958e", fontFamily: "'JetBrains Mono', monospace" }}>
                    {FEATURED_ARTICLE.readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ══════ ARTICLES ══════ */}
        <section id="articles" style={{ padding: "120px 40px", position: "relative", zIndex: 2 }}>
          <SectionFlakes count={5} seed={3} />
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "60px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ width: "24px", height: "1px", background: "#d4897a" }} />
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 600,
                    letterSpacing: "0.15em", textTransform: "uppercase", color: "#d4897a",
                  }}>The Essay Series</span>
                </div>
                <h2 style={{ fontFamily: "'Figtree', sans-serif", fontSize: "42px", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  From the Frontier
                </h2>
                <p style={{ fontSize: "15px", color: "#6b6760", marginTop: "8px" }}>
                  By Jacob Mueller, CEO of Renjoy
                </p>
              </div>
              <p style={{ fontSize: "16px", color: "#9a958e", maxWidth: "420px", lineHeight: 1.6, textAlign: "right" }}>
                A series on what the gold rushes teach us about building hospitality companies in the age of AI. Written for operators, owners, and builders.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {ARTICLES.map((article, i) => (
                <a key={i} href={article.link || undefined} style={{ textDecoration: "none", color: "inherit", display: "contents" }}>
                <GlowCard className="article-card" style={{
                  background: article.status === "Published"
                    ? "rgba(212,137,122,0.02)"
                    : "rgba(255,235,232,0.018)",
                  border: article.status === "Published"
                    ? "1px solid rgba(212,137,122,0.1)"
                    : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "20px", cursor: "pointer", overflow: "hidden",
                }}>
                  <div style={{
                    padding: "36px", display: "flex", flexDirection: "column",
                    justifyContent: "space-between", minHeight: "300px", height: "100%",
                  }}>
                    <div>
                      <div style={{
                        width: "40px", height: "2px", borderRadius: "1px",
                        background: article.status === "Published"
                          ? "linear-gradient(90deg, #d4897a, rgba(212,137,122,0.3))"
                          : "linear-gradient(90deg, #d4897a, transparent)",
                        marginBottom: "20px",
                      }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 600,
                          letterSpacing: "0.1em", textTransform: "uppercase", color: "#d4897a",
                        }}>{article.tag}</span>
                        <StatusBadge status={article.status} />
                      </div>
                      <h3 style={{
                        fontFamily: "'Figtree', sans-serif", fontSize: "24px", fontWeight: 700,
                        lineHeight: 1.25, marginBottom: article.subtitle ? "6px" : "12px",
                      }}>{article.title}</h3>
                      {article.subtitle && (
                        <p style={{
                          fontSize: "13px", fontStyle: "italic", color: "#7a756e",
                          fontFamily: "'Figtree', sans-serif", marginBottom: "12px",
                        }}>{article.subtitle}</p>
                      )}
                      <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#9a958e" }}>{article.excerpt}</p>
                    </div>
                    <div style={{
                      marginTop: "24px", fontSize: "13px", color: "#6b6760",
                      fontFamily: "'JetBrains Mono', monospace",
                      display: "flex", alignItems: "center", gap: "8px",
                    }}>
                      <div style={{ width: "12px", height: "1px", background: "rgba(212,137,122,0.3)" }} />
                      {article.readTime} read
                    </div>
                  </div>
                </GlowCard>
                </a>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ══════ AI PROJECTS ══════ */}
        <section id="projects" style={{ padding: "120px 40px", position: "relative", zIndex: 2 }}>
          <SectionFlakes count={7} seed={4} />
          <div style={{
            position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
            width: "800px", height: "600px", borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(212,137,122,0.025) 0%, transparent 60%)",
            filter: "blur(100px)", pointerEvents: "none",
          }} />

          <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
            <div style={{ textAlign: "center", marginBottom: "80px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, transparent, #d4897a)" }} />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 600,
                  letterSpacing: "0.15em", textTransform: "uppercase", color: "#d4897a",
                }}>What's Possible Right Now</span>
                <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, #d4897a, transparent)" }} />
              </div>
              <h2 style={{ fontFamily: "'Figtree', sans-serif", fontSize: "42px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "16px" }}>
                AI in VRM Operations
              </h2>
              <p style={{ fontSize: "17px", color: "#a8a29e", maxWidth: "580px", margin: "0 auto", lineHeight: 1.6 }}>
                These are the systems VRM operators are building right now with AI. Some are live in our operation. Others are emerging across the industry. All of them were impossible two years ago.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {PROJECTS.map((project, i) => (
                <GlowCard key={i} className="project-card" style={{
                  background: "rgba(255,235,232,0.015)", border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "20px", cursor: "default", overflow: "hidden",
                }}>
                  <div style={{ padding: "32px", position: "relative" }}>
                    <div style={{
                      position: "absolute", top: 0, left: 0, width: "60px", height: "60px",
                      borderTop: "1px solid rgba(212,137,122,0.08)", borderLeft: "1px solid rgba(212,137,122,0.08)",
                      borderTopLeftRadius: "20px", pointerEvents: "none",
                    }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "12px",
                        background: "rgba(212,137,122,0.06)", border: "1px solid rgba(212,137,122,0.08)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "24px", color: "#d4897a",
                      }}>{project.icon}</div>
                      <StatusBadge status={project.status} />
                    </div>
                    <h3 style={{ fontSize: "19px", fontWeight: 600, marginBottom: "10px" }}>{project.name}</h3>
                    <p style={{ fontSize: "14px", lineHeight: 1.65, color: "#9a958e", marginBottom: "20px" }}>
                      {project.description}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {project.tech.map((t) => (
                        <span key={t} style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 500,
                          padding: "4px 10px", borderRadius: "6px",
                          background: "rgba(212,137,122,0.04)", border: "1px solid rgba(212,137,122,0.06)",
                          color: "#7a756e",
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider variant="wave" />

        {/* ══════ QUOTE ══════ */}
        <section style={{ padding: "120px 40px", textAlign: "center", position: "relative", zIndex: 2 }}>
          <SectionFlakes count={4} seed={5} />
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "500px", height: "500px", borderRadius: "50%",
            border: "1px solid rgba(212,137,122,0.03)", pointerEvents: "none",
          }}>
            <div style={{ position: "absolute", inset: "60px", borderRadius: "50%", border: "1px solid rgba(212,137,122,0.025)" }} />
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
            <div style={{
              fontFamily: "'Figtree', sans-serif", fontSize: "120px",
              color: "rgba(212,137,122,0.06)", lineHeight: 0.5, marginBottom: "20px",
            }}>"</div>
            <blockquote style={{
              fontFamily: "'Figtree', sans-serif", fontSize: "36px", fontWeight: 700,
              lineHeight: 1.4, fontStyle: "italic", marginBottom: "24px",
            }}>
              The opportunity wasn't in the gold.<br />
              <span style={{
                background: "linear-gradient(135deg, #d4897a, #e8a99e)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>It was in the people who came for the gold.</span>
            </blockquote>
            <p style={{
              fontSize: "14px", color: "#6b6760", fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>— Jacob Mueller, "Stake Your Claim"</p>
          </div>
        </section>

        <SectionDivider />

        {/* ══════ FAQ ══════ */}
        <section id="faq" style={{ padding: "120px 40px", position: "relative", zIndex: 2 }}>
          <SectionFlakes count={4} seed={6} />
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ marginBottom: "60px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "24px", height: "1px", background: "#d4897a" }} />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 600,
                  letterSpacing: "0.15em", textTransform: "uppercase", color: "#d4897a",
                }}>Frequently Asked</span>
              </div>
              <h2 style={{ fontFamily: "'Figtree', sans-serif", fontSize: "42px", fontWeight: 800 }}>
                AI & Vacation Rental<br />Management
              </h2>
            </div>
            <div style={{
              background: "rgba(255,235,232,0.012)", borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.04)", padding: "8px 40px",
            }}>
              {FAQ_ITEMS.map((item, i) => (
                <FAQItem key={i} item={item} isOpen={openFAQ === i}
                  onToggle={() => setOpenFAQ(openFAQ === i ? null : i)} />
              ))}
            </div>
          </div>
        </section>

        <SectionDivider variant="wave" />

        {/* ══════ NEWSLETTER ══════ */}
        <section id="newsletter" style={{ padding: "100px 40px", position: "relative", zIndex: 2 }}>
          <SectionFlakes count={5} seed={8} />
          <div style={{
            maxWidth: "680px", margin: "0 auto", position: "relative",
            background: "linear-gradient(135deg, rgba(212,137,122,0.04), rgba(212,137,122,0.015))",
            borderRadius: "24px", border: "1px solid rgba(212,137,122,0.1)",
            padding: "56px 48px", textAlign: "center",
            boxShadow: "0 0 80px rgba(212,137,122,0.03), inset 0 1px 0 rgba(212,137,122,0.08)",
            overflow: "hidden",
          }}>
            {/* Corner accents */}
            {[
              { top: "12px", left: "12px", borderTop: "1px solid rgba(212,137,122,0.15)", borderLeft: "1px solid rgba(212,137,122,0.15)" },
              { top: "12px", right: "12px", borderTop: "1px solid rgba(212,137,122,0.15)", borderRight: "1px solid rgba(212,137,122,0.15)" },
              { bottom: "12px", left: "12px", borderBottom: "1px solid rgba(212,137,122,0.15)", borderLeft: "1px solid rgba(212,137,122,0.15)" },
              { bottom: "12px", right: "12px", borderBottom: "1px solid rgba(212,137,122,0.15)", borderRight: "1px solid rgba(212,137,122,0.15)" },
            ].map((s, i) => (
              <div key={i} style={{ position: "absolute", width: "20px", height: "20px", ...s }} />
            ))}

            {/* Inner glow */}
            <div style={{
              position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)",
              width: "400px", height: "200px", borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(212,137,122,0.06) 0%, transparent 70%)",
              filter: "blur(40px)", pointerEvents: "none",
            }} />

            {/* Icon */}
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px", margin: "0 auto 24px",
              background: "rgba(212,137,122,0.08)", border: "1px solid rgba(212,137,122,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px",
            }}>⛏</div>

            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 600,
              letterSpacing: "0.15em", textTransform: "uppercase", color: "#d4897a",
              display: "block", marginBottom: "14px",
            }}>The Mining Report</span>

            <h2 style={{
              fontFamily: "'Figtree', sans-serif", fontSize: "32px", fontWeight: 800,
              lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "12px",
            }}>
              Dispatches from<br />the diggings.
            </h2>

            <p style={{
              fontSize: "16px", lineHeight: 1.65, color: "#9a958e",
              maxWidth: "460px", margin: "0 auto 32px", position: "relative",
            }}>
              A biweekly newsletter on AI, hospitality, and what we're
              learning as we build. No hype. No fluff. Just the color
              we're finding in the pan.
            </p>

            {!subscribed ? (
              <div style={{
                display: "flex", gap: "10px", maxWidth: "440px", margin: "0 auto",
                position: "relative",
              }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1, padding: "14px 18px", borderRadius: "10px",
                    background: "rgba(25,12,18,0.5)", border: "1px solid rgba(212,137,122,0.12)",
                    color: "#e8e4df", fontSize: "15px", fontFamily: "'Figtree', sans-serif",
                    outline: "none",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(212,137,122,0.35)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(212,137,122,0.12)"}
                />
                <button
                  onClick={() => {
                    if (email && email.includes("@")) { setSubscribed(true); submitLead({ type: "newsletter", email, source: "homepage_inline" }); if (typeof gtag !== "undefined") gtag("event", "newsletter_signup", { method: "inline" }); }
                  }}
                  className="cta-btn cta-red"
                  style={{
                    padding: "14px 24px", borderRadius: "10px",
                    border: "none", fontSize: "15px", fontWeight: 600, cursor: "pointer",
                    fontFamily: "'Figtree', sans-serif", whiteSpace: "nowrap",
                  }}
                >
                  Stake a Claim
                </button>
              </div>
            ) : (
              <div style={{
                background: "rgba(74, 222, 128, 0.06)", border: "1px solid rgba(74,222,128,0.15)",
                borderRadius: "12px", padding: "16px 24px",
                maxWidth: "440px", margin: "0 auto",
              }}>
                <span style={{
                  color: "#4ade80", fontSize: "15px", fontWeight: 500,
                  fontFamily: "'Figtree', sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}>
                  <span style={{ fontSize: "18px" }}>✓</span>
                  Claim staked. First dispatch incoming.
                </span>
              </div>
            )}

            <p style={{
              fontSize: "12px", color: "#6b6760", marginTop: "16px",
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.02em",
            }}>
              No spam. Unsubscribe anytime. We respect your inbox like we respect the claim.
            </p>
          </div>
        </section>

        <SectionDivider />

        {/* ══════ CTA ══════ */}
        <section id="connect" style={{ padding: "120px 40px 160px", textAlign: "center", position: "relative", zIndex: 2 }}>
          <SectionFlakes count={5} seed={7} />
          <div style={{
            position: "absolute", bottom: "-100px", left: "50%", transform: "translateX(-50%)",
            width: "1000px", height: "600px", borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(212,137,122,0.05) 0%, transparent 60%)",
            filter: "blur(100px)", pointerEvents: "none",
          }} />

          <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative" }}>
            <div style={{
              width: "60px", height: "60px", borderRadius: "50%", margin: "0 auto 32px",
              border: "1px solid rgba(212,137,122,0.12)", display: "flex",
              alignItems: "center", justifyContent: "center", background: "rgba(212,137,122,0.03)",
            }}>
              <div style={{
                width: "24px", height: "24px", borderRadius: "50%",
                background: "rgba(212,137,122,0.15)", boxShadow: "0 0 20px rgba(212,137,122,0.2)",
                animation: "pulse 3s ease-in-out infinite",
              }} />
            </div>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 600,
              letterSpacing: "0.15em", textTransform: "uppercase", color: "#d4897a",
              marginBottom: "20px", display: "block",
            }}>Let's Connect</span>
            <h2 style={{
              fontFamily: "'Figtree', sans-serif", fontSize: "48px", fontWeight: 800,
              lineHeight: 1.15, marginBottom: "20px",
            }}>Fellow operator?<br />Let's compare notes.</h2>
            <p style={{
              fontSize: "18px", lineHeight: 1.7, color: "#a8a29e",
              maxWidth: "540px", margin: "0 auto 48px",
            }}>
              If you're running a VRM company and thinking about AI — what to try, what to skip, how to avoid the Sutter Trap — we'd love to swap stories. No pitch. Just two operators figuring out what's next.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              <button onClick={() => setShowContact(true)} className="cta-btn" style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                background: "linear-gradient(135deg, #e05a3a, #c94a30)", color: "#fff",
                padding: "18px 40px", borderRadius: "12px",
                fontSize: "17px", fontWeight: 600, border: "none", cursor: "pointer",
                fontFamily: "'Figtree', sans-serif",
              }}>Start a Conversation</button>
              <a href="https://renjoy.com" className="cta-btn-outline" style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                background: "rgba(212,137,122,0.04)", color: "#e8e4df",
                padding: "18px 40px", borderRadius: "12px", textDecoration: "none",
                fontSize: "17px", fontWeight: 500, border: "1px solid rgba(212,137,122,0.15)",
              }}>Visit Renjoy →</a>
            </div>
          </div>
        </section>

        {/* ══════ FOOTER ══════ */}
        <footer style={{
          padding: "40px", borderTop: "1px solid rgba(212,137,122,0.06)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em" }}>renjoy</span>
            <span style={{
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em",
              color: "#d4897a", background: "rgba(212,137,122,0.08)",
              padding: "3px 10px", borderRadius: "5px", fontFamily: "'JetBrains Mono', monospace",
              border: "1px solid rgba(212,137,122,0.12)",
            }}>LABS</span>
          </div>
          <div style={{ fontSize: "13px", color: "#6b6760", fontFamily: "'JetBrains Mono', monospace" }}>
            Colorado Springs · Salida · Buena Vista · Cripple Creek
          </div>
        </footer>
      </div>
    </>
  );
}
