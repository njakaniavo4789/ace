import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Lightbulb, Users, Target,
  Heart, Sparkles, Compass, Handshake, ShieldCheck, Rocket
} from "lucide-react";

/* ============================================================
   INTRO CINÉMATIQUE — style "ta-dum" Netflix
   ============================================================ */
function CinematicIntro({ onDone }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("count"); // count -> flash -> logo -> leaving
  const doneRef = useRef(false);
  const canvasRef = useRef(null);
  const logoText = "ACE SERVICES";

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase("leaving");
    setTimeout(() => onDone(), 900);
  }, [onDone]);

  // Particules d'ambiance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, w, h;
    const particles = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.5 - 0.15,
        a: Math.random() * 0.6 + 0.1
      });
    }

    let boost = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx * (1 + boost);
        p.y += p.vy * (1 + boost);
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1 + boost * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,97,${Math.min(1, p.a + boost * 0.4)})`;
        ctx.fill();
      });
      if (boost > 0) boost = Math.max(0, boost - 0.02);
      raf = requestAnimationFrame(draw);
    };
    draw();

    // écoute les "impacts" pour faire vibrer les particules
    canvas._boostParticles = () => { boost = 1; };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const start = performance.now();
    const duration = 2200;
    let raf;

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setCount(Math.floor(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setCount(100);
        canvasRef.current && canvasRef.current._boostParticles && canvasRef.current._boostParticles();
        setPhase("flash");
        setTimeout(() => setPhase("logo"), 260);
        setTimeout(finish, 2800);
      }
    };
    raf = requestAnimationFrame(tick);
    const failsafe = setTimeout(finish, 6200);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failsafe);
    };
  }, [finish]);

  const showRings = phase === "flash" || phase === "logo";

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black overflow-hidden"
      style={{
        opacity: phase === "leaving" ? 0 : 1,
        transition: "opacity 0.9s ease",
        pointerEvents: phase === "leaving" ? "none" : "auto",
        animation: phase === "flash" ? "screenShake 0.35s ease" : "none"
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* halo central */}
      <div
        className="absolute h-[900px] w-[900px] rounded-full blur-3xl pulse-glow"
        style={{
          background: "radial-gradient(circle, rgba(201,169,97,0.35) 0%, transparent 65%)",
          opacity: phase === "flash" ? 1 : 0.5,
          transition: "opacity 0.3s ease"
        }}
      />

      {/* anneaux sonores type "ta-dum" */}
      {showRings && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[0, 0.16, 0.32].map((delay, i) => (
            <span
              key={i}
              className="absolute rounded-full border-2"
              style={{
                width: 140,
                height: 140,
                borderColor: "rgba(201,169,97,0.65)",
                animation: `ringExpand 1.4s cubic-bezier(0.15,0.7,0.3,1) ${delay}s both`
              }}
            />
          ))}
        </div>
      )}

      {/* grain film */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)" }}
      />

      {/* flash blanc */}
      <div
        className="absolute inset-0 bg-white pointer-events-none"
        style={{ opacity: phase === "flash" ? 0.95 : 0, transition: "opacity 0.22s ease" }}
      />

      {phase === "count" && (
        <div className="relative text-center">
          <p
            key={count}
            className="font-display text-[26vw] md:text-[16rem] font-extrabold text-white leading-none tabular-nums tracking-tighter"
            style={{ animation: "digitPop 0.16s ease" }}
          >
            {count}
          </p>
          <div className="mt-6 mx-auto h-[2px] w-64 bg-white/10 overflow-hidden">
            <div className="h-full bg-[#c9a961]" style={{ width: `${count}%`, transition: "width 0.15s linear" }} />
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-[0.6em] text-[#c9a961]/80">
            ACE Services présente
          </p>
        </div>
      )}

      {(phase === "logo" || phase === "flash") && (
        <div className="relative text-center px-6">
          <p className="font-display text-5xl md:text-7xl font-extrabold uppercase text-white tracking-tight flex justify-center flex-wrap">
            {logoText.split("").map((ch, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  animation: `letterDrop 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 0.035}s both, chromaSnap 0.5s ease-out ${0.55 + i * 0.035}s both`
                }}
              >
                {ch}
              </span>
            ))}
          </p>
          <div className="mt-8 w-40 h-[2px] bg-white/20 mx-auto overflow-hidden">
            <div className="h-full bg-[#c9a961]" style={{ animation: "lineGrow 1.4s 0.5s ease forwards" }} />
          </div>
          <p
            className="mt-5 text-[10px] uppercase tracking-[0.6em] text-[#c9a961]"
            style={{ animation: "fadeUp 1s 0.9s ease both" }}
          >
            Notre histoire
          </p>
        </div>
      )}

      <style>{`
        @keyframes logoReveal {
          0% { opacity: 0; transform: scale(1.15); filter: blur(12px); letter-spacing: 0.1em; }
          100% { opacity: 1; transform: scale(1); filter: blur(0); letter-spacing: -0.02em; }
        }
        @keyframes letterDrop {
          0% { opacity: 0; transform: translateY(-26px) scale(0.7); filter: blur(6px); }
          60% { opacity: 1; transform: translateY(4px) scale(1.05); filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chromaSnap {
          0% { text-shadow: -3px 0 #ff2d55, 3px 0 #2dd4ff; }
          70% { text-shadow: -1px 0 #ff2d55, 1px 0 #2dd4ff; }
          100% { text-shadow: none; }
        }
        @keyframes digitPop {
          0% { transform: scale(1.18); }
          100% { transform: scale(1); }
        }
        @keyframes ringExpand {
          0% { transform: scale(0.2); opacity: 0.85; }
          100% { transform: scale(5.5); opacity: 0; }
        }
        @keyframes screenShake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        @keyframes lineGrow { 0% { width: 0%; } 100% { width: 100%; } }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   SÉQUENCE CINÉMA
   ============================================================ */
function CinemaSequence({ onDone }) {
  const scenes = useMemo(() => [
    { text: "Chaque grande entreprise commence par une idée.", beat: "slow" },
    { text: "Une intuition. Une envie d'entreprendre.", beat: "slow" },
    { text: "Mais entre l'idée et l'entreprise…", beat: "pause" },
    { text: "…il y a un chemin que beaucoup redoutent.", beat: "slow" },
    { text: "C'est là qu'ACE Services entre en scène.", beat: "impact" },
    { text: "Nous transformons vos idées en projets concrets.", beat: "impact" }
  ], []);

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [impactFlash, setImpactFlash] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started) return;
    setVisible(false);

    if (scenes[index].beat === "impact") {
      setImpactFlash(true);
      setTimeout(() => setImpactFlash(false), 200);
    }

    const appear = setTimeout(() => setVisible(true), 200);

    const total = scenes[index].beat === "pause" ? 2000 : 3200;
    const fadeOut = 700;

    const showTimer = setTimeout(() => {
      setVisible(false);
      const nextTimer = setTimeout(() => {
        if (index < scenes.length - 1) setIndex((i) => i + 1);
        else onDone();
      }, fadeOut);
      return () => clearTimeout(nextTimer);
    }, total);

    return () => {
      clearTimeout(appear);
      clearTimeout(showTimer);
    };
  }, [index, started, scenes, onDone]);

  return (
    <div className="fixed inset-0 z-[450] flex items-center justify-center bg-black px-6 overflow-hidden">
      <div
        className="pointer-events-none absolute h-[800px] w-[800px] rounded-full blur-3xl pulse-glow"
        style={{
          background:
            scenes[index].beat === "impact"
              ? "radial-gradient(circle, rgba(201,169,97,0.45) 0%, transparent 65%)"
              : "radial-gradient(circle, rgba(201,169,97,0.22) 0%, transparent 70%)",
          transition: "background 1.2s ease"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-white"
        style={{ opacity: impactFlash ? 0.5 : 0, transition: "opacity 0.18s ease" }}
      />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[6vh] bg-black z-10" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[6vh] bg-black z-10" />

      <div className="relative max-w-3xl text-center z-20">
        <p
          className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
            filter: visible ? "blur(0)" : "blur(6px)",
            transition:
              "opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1), filter 0.8s ease"
          }}
        >
          {scenes[index].text}
        </p>

        <div className="mt-14 flex items-center justify-center gap-2">
          {scenes.map((_, i) => (
            <span
              key={i}
              className="h-[2px] transition-all duration-500"
              style={{
                width: i === index ? "36px" : "12px",
                background: i <= index ? "#c9a961" : "rgba(255,255,255,0.18)",
                boxShadow: i === index ? "0 0 10px rgba(201,169,97,0.7)" : "none"
              }}
            />
          ))}
        </div>

        <button
          onClick={onDone}
          className="absolute -bottom-28 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-white/90 transition-colors cursor-pointer"
        >
          Passer l'intro
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   FOND ANIMÉ DE LA PAGE (particules + halos dérivants)
   ============================================================ */
function PageBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, w, h;
    const particles = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 46; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -Math.random() * 0.14 - 0.02,
        a: Math.random() * 0.35 + 0.08
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,97,${p.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
      <div
        className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(201,169,97,0.22) 0%, transparent 70%)",
          animation: "blobFloatA 24s ease-in-out infinite alternate"
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-8%] h-[620px] w-[620px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(201,169,97,0.16) 0%, transparent 70%)",
          animation: "blobFloatB 28s ease-in-out infinite alternate"
        }}
      />
      <style>{`
        @keyframes blobFloatA {
          0% { transform: translate(0px, 0px) scale(1); }
          100% { transform: translate(60px, 90px) scale(1.15); }
        }
        @keyframes blobFloatB {
          0% { transform: translate(0px, 0px) scale(1); }
          100% { transform: translate(-70px, -60px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   HOOK useInView
   ============================================================ */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ============================================================
   SLIDES DATA
   ============================================================ */
const SLIDES = [
  {
    id: "intro",
    eyebrow: "Le commencement",
    title: "À propos de nous",
    icon: <Lightbulb size={22} />,
    tag: "01 — Présentation",
    description:
      "ACE Services est un service spécialisé dans l'accompagnement à la création d'entreprise. Nous aidons les futurs entrepreneurs et porteurs de projets à transformer leurs idées en projets concrets et réalisables.",
    bullets: [
      "Accompagnement personnalisé à chaque étape",
      "Démarches administratives simplifiées",
      "Organisation du projet et orientation financière",
      "Un objectif : rendre la création d'entreprise accessible à tous"
    ]
  },
  {
    id: "who",
    eyebrow: "Qui nous sommes",
    title: "Notre identité",
    icon: <Users size={22} />,
    tag: "02 — Identité",
    description:
      "ACE Services est une entreprise spécialisée dans l'accompagnement à la création d'entreprise et le conseil aux porteurs de projets à Madagascar.",
    bullets: [
      "Une équipe à l'écoute de vos idées",
      "Une expertise locale, adaptée à votre réalité",
      "Un accompagnement de A à Z",
      "Une relation de proximité et de confiance"
    ]
  },
  {
    id: "mission",
    eyebrow: "Notre raison d'être",
    title: "Notre mission",
    icon: <Target size={22} />,
    tag: "03 — Mission",
    description:
      "Accompagner et conseiller les entrepreneurs dans la création et la gestion de leur entreprise, en rendant le parcours plus simple, accessible et sécurisé.",
    bullets: [
      "Guider chaque porteur de projet pas à pas",
      "Sécuriser les démarches et les décisions",
      "Rendre l'entrepreneuriat accessible à tous",
      "Transformer une idée en entreprise viable"
    ]
  },
  {
    id: "vision",
    eyebrow: "Notre horizon",
    title: "Notre vision",
    icon: <Compass size={22} />,
    tag: "04 — Vision",
    description:
      "Devenir la référence de l'accompagnement entrepreneurial à Madagascar, en créant un écosystème où chaque idée trouve les moyens de devenir réalité.",
    bullets: [
      "Un écosystème entrepreneurial dynamique",
      "Des projets solides et durablement viables",
      "Une culture de l'entrepreneuriat accessible",
      "Un impact positif sur l'économie locale"
    ]
  },
  {
    id: "values",
    eyebrow: "Ce qui nous guide",
    title: "Nos valeurs",
    icon: <Heart size={22} />,
    tag: "05 — Valeurs",
    description: "Quatre piliers qui orientent chacune de nos actions et décisions au quotidien.",
    values: [
      { icon: <Handshake size={18} />, label: "Écoute", text: "Comprendre vos besoins pour mieux vous conseiller." },
      { icon: <ShieldCheck size={18} />, label: "Professionnalisme", text: "Des solutions fiables et adaptées à votre projet." },
      { icon: <Heart size={18} />, label: "Confiance", text: "Une relation durable et transparente." },
      { icon: <Rocket size={18} />, label: "Engagement", text: "Votre réussite est notre moteur." }
    ]
  }
];

/* ============================================================
   PAGE À PROPOS — présentation en SLIDES
   ============================================================ */
export default function AboutPage({ onBack = () => {} }) {
  const [step, setStep] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("next"); // "next" | "prev"
  const [animPhase, setAnimPhase] = useState("idle"); // "idle" | "out" | "in"
  const [isAnimating, setIsAnimating] = useState(false);
  const lockRef = useRef(false);

  const handleIntroDone = useCallback(() => setStep("cinema"), []);
  const handleCinemaDone = useCallback(() => setStep("page"), []);

  useEffect(() => {
    document.body.style.overflow = step === "page" ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [step]);

  const changeTo = useCallback((idx) => {
    if (lockRef.current || idx < 0 || idx >= SLIDES.length || idx === current) return;
    lockRef.current = true;
    setIsAnimating(true);
    setDirection(idx > current ? "next" : "prev");
    setAnimPhase("out");
    setTimeout(() => {
      setCurrent(idx);
      setAnimPhase("in");
      setTimeout(() => {
        setAnimPhase("idle");
        setIsAnimating(false);
        lockRef.current = false;
      }, 520);
    }, 320);
  }, [current]);

  const goNext = useCallback(() => changeTo(current + 1), [changeTo, current]);
  const goPrev = useCallback(() => changeTo(current - 1), [changeTo, current]);
  const goTo = useCallback((idx) => changeTo(idx), [changeTo]);

  // Navigation clavier
  useEffect(() => {
    if (step !== "page") return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, goNext, goPrev]);

  const slide = SLIDES[current];
  const isFirst = current === 0;
  const isLast = current === SLIDES.length - 1;
  const progressPct = ((current + 1) / SLIDES.length) * 100;

  const slideAnimation =
    animPhase === "out"
      ? `${direction === "next" ? "slideOutNext" : "slideOutPrev"} 0.32s cubic-bezier(0.4,0,1,1) both`
      : animPhase === "in"
        ? `${direction === "next" ? "slideInNext" : "slideInPrev"} 0.55s cubic-bezier(0.22,1,0.36,1) both`
        : "none";

  return (
    <div className="min-h-screen w-full bg-white text-gray-800" style={{ fontFamily: "Manrope, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Syne:wght@500;600;700;800&display=swap');
        .font-display { font-family: 'Syne', sans-serif; letter-spacing: -0.01em; }
        ::selection { background: #c9a961; color: white; }
        @keyframes pulseGlow {
          0%,100% { opacity: 0.3; transform: scale(1) }
          50% { opacity: 0.55; transform: scale(1.08) }
        }
        .pulse-glow { animation: pulseGlow 6s ease-in-out infinite; }
        @keyframes slideInNext {
          0% { opacity: 0; transform: translateX(40px) scale(0.99); filter: blur(6px); }
          100% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
        }
        @keyframes slideInPrev {
          0% { opacity: 0; transform: translateX(-40px) scale(0.99); filter: blur(6px); }
          100% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
        }
        @keyframes slideOutNext {
          0% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
          100% { opacity: 0; transform: translateX(-40px) scale(0.99); filter: blur(6px); }
        }
        @keyframes slideOutPrev {
          0% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
          100% { opacity: 0; transform: translateX(40px) scale(0.99); filter: blur(6px); }
        }
      `}</style>

      {step === "intro" && <CinematicIntro onDone={handleIntroDone} />}
      {step === "cinema" && <CinemaSequence onDone={handleCinemaDone} />}

      <div
        style={{
          opacity: step === "page" ? 1 : 0,
          transition: "opacity 0.8s ease",
          pointerEvents: step === "page" ? "auto" : "none"
        }}
      >
        {step === "page" && <PageBackground />}

        {/* barre de progression globale */}
        <div className="fixed top-0 left-0 right-0 z-20 h-[2px] bg-gray-100">
          <div
            className="h-full bg-[#c9a961]"
            style={{ width: `${progressPct}%`, transition: "width 0.5s cubic-bezier(0.22,1,0.36,1)" }}
          />
        </div>

        {/* ============ HEADER ============ */}
        <header className="relative z-10 px-6 md:px-12 pt-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors cursor-pointer group"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 group-hover:border-black transition-colors">
              <ArrowLeft size={16} />
            </span>
            Retour à l'accueil
          </button>

          <p className="hidden md:block text-[10px] font-black uppercase tracking-[0.4em] text-[#c9a961]">
            ACE Services — À propos
          </p>
        </header>

        {/* ============ SLIDE ============ */}
        <main className="relative z-10 px-6 md:px-12 pt-10 pb-32 min-h-[80vh] flex items-center">
          {/* halo de fond */}
          <div
            className="pointer-events-none absolute top-1/3 left-1/4 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl pulse-glow"
            style={{ background: "radial-gradient(circle, #c9a961 0%, transparent 70%)" }}
          />

          <div
            key={slide.id}
            className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center"
            style={{ animation: slideAnimation }}
          >
            {/* Colonne gauche : contenu */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c9a961] mb-5">
                {slide.tag}
              </p>

              <h2 className="font-display font-extrabold uppercase leading-[0.9] text-5xl md:text-7xl lg:text-8xl text-gray-900 mb-8">
                {slide.title}
              </h2>

              <p className="max-w-xl text-lg md:text-xl text-gray-600 leading-snug mb-10">
                {slide.description}
              </p>

              {/* Bullets (sauf slide valeurs) */}
              {slide.bullets && (
                <ul className="space-y-3 max-w-xl">
                  {slide.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-700"
                      style={{ animation: `slideInNext 0.6s ${0.15 + i * 0.08}s both` }}
                    >
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#c9a961] shrink-0" />
                      <span className="text-base leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Cartes valeurs */}
              {slide.values && (
                <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                  {slide.values.map((v, i) => (
                    <div
                      key={v.label}
                      className="border-l-2 border-[#c9a961]/60 pl-4 py-2"
                      style={{ animation: `slideInNext 0.6s ${0.15 + i * 0.08}s both` }}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[#c9a961]">
                        {v.icon}
                        <p className="font-display text-lg">{v.label}</p>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{v.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Colonne droite : numéro + icône */}
            <div className="hidden lg:flex flex-col items-end gap-6 select-none">
              <span className="font-display text-[10rem] xl:text-[12rem] font-extrabold leading-none text-gray-100">
                {String(current + 1).padStart(2, "0")}
              </span>
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a961]/40 text-[#c9a961]">
                {slide.icon}
              </span>
            </div>
          </div>
        </main>

        {/* ============ BARRE DE NAVIGATION ============ */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/85 backdrop-blur-md border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between gap-6">

            {/* Précédent */}
            <button
              onClick={goPrev}
              disabled={isFirst || isAnimating}
              className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                isFirst || isAnimating ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:text-black"
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 group-hover:border-black transition-colors">
                <ArrowLeft size={14} />
              </span>
              Précédent
            </button>

            {/* Points indicateurs */}
            <div className="flex items-center gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  disabled={isAnimating}
                  aria-label={`Aller à ${s.title}`}
                  className="group cursor-pointer"
                >
                  <span
                    className="block h-[3px] transition-all duration-400"
                    style={{
                      width: i === current ? "36px" : "14px",
                      background: i <= current ? "#c9a961" : "rgba(0,0,0,0.15)",
                      boxShadow: i === current ? "0 0 10px rgba(201,169,97,0.6)" : "none"
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Suivant / Terminer */}
            {!isLast ? (
              <button
                onClick={goNext}
                disabled={isAnimating}
                className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                  isAnimating ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:text-black"
                }`}
              >
                Suivant
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 hover:border-black transition-colors">
                  <ArrowRight size={14} />
                </span>
              </button>
            ) : (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-[#c9a961] hover:text-black transition-all duration-300 cursor-pointer"
              >
                Commencer mon projet <ArrowUpRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}