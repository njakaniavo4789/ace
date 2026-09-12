import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Lightbulb, Users, Target,
  Heart, Sparkles, Compass, Handshake, ShieldCheck, Rocket, PenTool,
  BookOpen, Library, Barcode
} from "lucide-react";

/* ============================================================
   EASING "PAPIER LÉGER"
   ============================================================ */
function paperEase(raw) {
  let eased;
  if (raw < 0.14) {
    const t = raw / 0.14;
    eased = t * t * 0.05;
  } else if (raw < 0.78) {
    const t = (raw - 0.14) / 0.64;
    eased = 0.05 + (1 - Math.pow(1 - t, 2.1)) * 0.88;
  } else {
    const t = (raw - 0.78) / 0.22;
    const settle = 1 - Math.pow(1 - t, 3);
    const wobble = Math.sin(t * Math.PI) * 0.018 * (1 - t);
    eased = 0.93 + settle * 0.07 + wobble;
  }
  return Math.min(1, Math.max(0, eased));
}

/* ============================================================
   INTRO CINÉMATIQUE
   ============================================================ */
function CinematicIntro({ onDone }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("count");
  const doneRef = useRef(false);
  const canvasRef = useRef(null);
  const logoText = "ACE SERVICES";

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase("leaving");
    setTimeout(() => onDone(), 900);
  }, [onDone]);

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

      <div
        className="absolute h-[900px] w-[900px] rounded-full blur-3xl pulse-glow"
        style={{
          background: "radial-gradient(circle, rgba(201,169,97,0.35) 0%, transparent 65%)",
          opacity: phase === "flash" ? 1 : 0.5,
          transition: "opacity 0.3s ease"
        }}
      />

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

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)" }}
      />

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
   FOND ANIMÉ
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
   SLIDES DATA
   ============================================================ */
const SLIDES = [
  {
    id: "intro",
    eyebrow: "Le commencement",
    title: "À propos de nous",
    icon: <Lightbulb size={18} />,
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
    icon: <Users size={18} />,
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
    icon: <Target size={18} />,
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
    icon: <Compass size={18} />,
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
    icon: <Heart size={18} />,
    tag: "05 — Valeurs",
    description: "Quatre piliers qui orientent chacune de nos actions et décisions au quotidien.",
    values: [
      { icon: <Handshake size={14} />, label: "Écoute", text: "Comprendre vos besoins pour mieux vous conseiller." },
      { icon: <ShieldCheck size={14} />, label: "Professionnalisme", text: "Des solutions fiables et adaptées à votre projet." },
      { icon: <Heart size={14} />, label: "Confiance", text: "Une relation durable et transparente." },
      { icon: <Rocket size={14} />, label: "Engagement", text: "Votre réussite est notre moteur." }
    ]
  }
];

const CTA_SLIDE = {
  id: "cta",
  tag: "06 — Votre tour",
  icon: <PenTool size={18} />,
  cta: true
};
const TOTAL_CHAPTERS = SLIDES.length + 1;

/* ============================================================
   SLIDE CONTENT
   ============================================================ */
function SlideContent({ slide, slideIndex, pageSide }) {
  if (slide.cta) {
    return <CTAContent slide={slide} slideIndex={slideIndex} />;
  }
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[8px] font-black uppercase tracking-[0.35em] text-[#c9a961]">
          {slide.tag}
        </p>
        <span className="font-display text-[9px] text-gray-300 tracking-widest">
          {String(slideIndex + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>

      <div className="flex-1">
        <h2 className="font-display font-extrabold uppercase leading-[0.92] text-xl xl:text-2xl text-gray-900 mb-2">
          {slide.title}
        </h2>

        <div className="w-8 h-[2px] bg-[#c9a961] mb-2" />

        <p className="text-[11px] xl:text-xs text-gray-600 leading-relaxed mb-3">
          {slide.description}
        </p>

        {slide.bullets && (
          <ul className="space-y-1.5">
            {slide.bullets.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-gray-700"
                style={{ animation: `bulletIn 0.5s ${0.2 + i * 0.08}s both` }}
              >
                <span className="mt-1.5 h-1 w-1 rounded-full bg-[#c9a961] shrink-0" />
                <span className="text-[10px] xl:text-[11px] leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        )}

        {slide.values && (
          <div className="grid grid-cols-2 gap-2">
            {slide.values.map((v, i) => (
              <div
                key={v.label}
                className="border-l-2 border-[#c9a961]/60 pl-2 py-1"
                style={{ animation: `bulletIn 0.5s ${0.2 + i * 0.08}s both` }}
              >
                <div className="flex items-center gap-1 mb-0.5 text-[#c9a961]">
                  {v.icon}
                  <p className="font-display text-[10px] font-bold">{v.label}</p>
                </div>
                <p className="text-[9px] text-gray-500 leading-snug">{v.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#c9a961]/40 text-[#c9a961]">
            {slide.icon}
          </span>
          <span className="text-[8px] uppercase tracking-[0.3em] text-gray-400">
            ACE Services
          </span>
        </div>
        <span className="text-[8px] uppercase tracking-[0.3em] text-gray-300">
          {pageSide === "left" ? "— Chapitre" : "Suite —"}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   CTA CONTENT
   ============================================================ */
function CTAContent({ slide, slideIndex }) {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [inkProgress, setInkProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 300);
    const t2 = setTimeout(() => {
      let start = performance.now();
      const duration = 1400;
      const animate = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setInkProgress(eased);
        if (p < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const titleText = "À vous d'écrire votre histoire";
  const words = titleText.split(" ");

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-between relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: "#c9a961",
              left: `${8 + (i * 6.5) % 90}%`,
              top: `${10 + (i * 17) % 80}%`,
              opacity: mounted ? 0.6 : 0,
              animation: mounted
                ? `floatDust ${5 + (i % 4)}s ease-in-out ${i * 0.3}s infinite alternate`
                : "none",
              boxShadow: "0 0 6px rgba(201,169,97,0.6)"
            }}
          />
        ))}
      </div>

      <div
        className="absolute pointer-events-none"
        style={{
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(201,169,97,0.15) 0%, transparent 65%)",
          opacity: mounted ? 1 : 0,
          transition: "opacity 1.5s ease"
        }}
      />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <p className="text-[8px] font-black uppercase tracking-[0.35em] text-[#c9a961]">
          {slide.tag}
        </p>
        <span className="font-display text-[9px] text-gray-300 tracking-widest">
          {String(slideIndex + 1).padStart(2, "0")} / {String(TOTAL_CHAPTERS).padStart(2, "0")}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 px-2">
        <div
          className="mb-3"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) rotate(0deg) scale(1)" : "translateY(-30px) rotate(-45deg) scale(0.5)",
            transition: "opacity 0.8s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1)"
          }}
        >
          <div className="relative">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#c9a961]/50 text-[#c9a961] bg-white/60 backdrop-blur-sm">
              <PenTool size={16} style={{ animation: mounted ? "penFloat 3s ease-in-out infinite" : "none" }} />
            </span>
            <span
              className="absolute inset-0 rounded-full"
              style={{
                border: "1px solid rgba(201,169,97,0.5)",
                animation: mounted ? "ringPulse 2.5s ease-out infinite" : "none"
              }}
            />
          </div>
        </div>

        <h2 className="font-display font-extrabold uppercase leading-[0.95] text-lg xl:text-xl text-gray-900 mb-2 max-w-xs">
          {words.map((word, wi) => (
            <span
              key={wi}
              className="inline-block whitespace-nowrap mr-[0.25em]"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.7s ease ${0.25 + wi * 0.12}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${0.25 + wi * 0.12}s`
              }}
            >
              {word}
            </span>
          ))}
        </h2>

        <div className="relative mb-2" style={{ height: "2px", width: "120px", maxWidth: "70%" }}>
          <div
            className="absolute inset-y-0 left-0 bg-[#c9a961]"
            style={{
              width: `${inkProgress * 100}%`,
              boxShadow: "0 0 8px rgba(201,169,97,0.6)"
            }}
          />
          {inkProgress > 0 && inkProgress < 1 && (
            <span
              className="absolute top-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: `${inkProgress * 100}%`,
                width: "6px",
                height: "6px",
                background: "#c9a961",
                boxShadow: "0 0 12px rgba(201,169,97,0.9)",
                transform: "translate(-50%, -50%)"
              }}
            />
          )}
        </div>

        <p
          className="text-[10px] xl:text-[11px] text-gray-600 leading-relaxed max-w-[240px] mb-3"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 1s ease 1.2s, transform 1s ease 1.2s"
          }}
        >
          Chaque grande aventure commence par une première ligne. La vôtre commence maintenant.
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            const evt = new CustomEvent("cta-click");
            window.dispatchEvent(evt);
          }}
          className="group inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-2 text-[8px] font-black uppercase tracking-[0.3em] hover:bg-[#c9a961] hover:text-black transition-all duration-300 cursor-pointer"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) scale(1)" : "translateY(15px) scale(0.95)",
            transition: "opacity 0.9s ease 1.6s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 1.6s, background-color 0.3s, color 0.3s"
          }}
        >
          Démarrer mon projet
          <ArrowUpRight size={10} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#c9a961]/40 text-[#c9a961]">
            {slide.icon}
          </span>
          <span className="text-[8px] uppercase tracking-[0.3em] text-gray-400">
            ACE Services
          </span>
        </div>
        <span className="text-[8px] uppercase tracking-[0.3em] text-gray-300">
          Fin —
        </span>
      </div>

      <style>{`
        @keyframes floatDust {
          0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(8px, -12px) scale(1.3); opacity: 0.7; }
          100% { transform: translate(-6px, -20px) scale(1); opacity: 0.4; }
        }
        @keyframes penFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(-3deg); }
        }
        @keyframes ringPulse {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   COVER FACE
   ============================================================ */
function CoverFace({ variant, onAction, live }) {
  const isStart = variant === "start";

  return (
    <div className="absolute inset-0 overflow-hidden rounded-lg">
      <div className="absolute inset-0 book-cover" />

      <div
        className="absolute inset-0 opacity-[0.5] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px)"
        }}
      />

      <div className="absolute inset-[14px] border border-[#c9a961]/35 rounded-sm pointer-events-none" />
      <div className="absolute inset-[18px] border border-[#c9a961]/15 rounded-sm pointer-events-none" />

      {live && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.10) 45%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.10) 55%, transparent 70%)",
            backgroundSize: "260% 260%",
            animation: "sheenSweep 7s ease-in-out infinite"
          }}
        />
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 32%, rgba(201,169,97,0.16) 0%, transparent 60%)"
        }}
      />

      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        {isStart ? (
          <>
            <div
              className="inline-flex items-center gap-1.5 rounded-full border border-[#c9a961]/40 px-3 py-1 mb-5"
              style={{ animation: live ? "fadeUp 0.9s 0.15s ease both" : "none" }}
            >
              <Library size={10} className="text-[#c9a961]" />
              <span className="text-[8px] uppercase tracking-[0.3em] text-[#c9a961]/90">
                Bibliothèque ACE Services
              </span>
            </div>

            <span
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#c9a961]/50 text-[#c9a961] mb-5"
              style={{ animation: live ? "fadeUp 0.9s 0.3s ease both" : "none" }}
            >
              <Compass size={20} />
            </span>

            <h2
              className="font-display font-extrabold uppercase text-white leading-[0.95] text-3xl md:text-4xl tracking-tight mb-3"
              style={{ animation: live ? "fadeUp 0.9s 0.45s ease both" : "none" }}
            >
              ACE Services
            </h2>

            <div
              className="w-10 h-[2px] bg-[#c9a961] mb-3"
              style={{ animation: live ? "fadeUp 0.9s 0.6s ease both" : "none" }}
            />

            <p
              className="text-[9px] uppercase tracking-[0.4em] text-[#c9a961] mb-6"
              style={{ animation: live ? "fadeUp 0.9s 0.7s ease both" : "none" }}
            >
              Notre histoire
            </p>

            <button
              onClick={onAction}
              className="group inline-flex items-center gap-2 rounded-full bg-[#c9a961] text-black px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all duration-300 cursor-pointer"
              style={{ animation: live ? "fadeUp 0.9s 0.9s ease both" : "none" }}
            >
              <BookOpen size={11} />
              Ouvrir le livre
            </button>

            <div
              className="absolute bottom-5 left-5 flex items-center gap-1.5 bg-white/95 rounded-[2px] px-2 py-1 shadow-md"
              style={{ animation: live ? "fadeUp 0.9s 1.05s ease both" : "none" }}
            >
              <Barcode size={18} className="text-gray-800" />
              <div className="text-left leading-tight">
                <p className="text-[7px] font-bold text-gray-700 tracking-wide">ACE 2026.01</p>
                <p className="text-[6px] text-gray-400 tracking-wide">Notre histoire</p>
              </div>
            </div>

            <div
              className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#c9a961]/50 text-[#c9a961]"
              style={{ animation: live ? "fadeUp 0.9s 1.05s ease both" : "none" }}
            >
              <span className="text-[6px] uppercase tracking-widest leading-tight text-center">
                Éd.<br />2026
              </span>
            </div>
          </>
        ) : (
          <CTAContent slide={CTA_SLIDE} slideIndex={5} />
        )}
      </div>
    </div>
  );
}

/* ============================================================
   PAGE À PROPOS — LIVRE 3D
   ============================================================ */
export default function AboutPage({ onBack = () => {} }) {
  const [step, setStep] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [flip, setFlip] = useState({
    active: false,
    direction: "next",
    progress: 0,
    velocity: 0,
    fromIndex: 0,
    toIndex: 0
  });
  const flipRef = useRef(null);
  const animatingRef = useRef(false);

  const handleIntroDone = useCallback(() => setStep("cinema"), []);

  useEffect(() => {
    const handler = () => onBack();
    window.addEventListener("cta-click", handler);
    return () => window.removeEventListener("cta-click", handler);
  }, [onBack]);

  const startFlip = useCallback((targetIndex) => {
    if (animatingRef.current) return;
    if (targetIndex < 0 || targetIndex >= SLIDES.length) return;
    if (targetIndex === current) return;

    animatingRef.current = true;
    const direction = targetIndex > current ? "next" : "prev";
    const fromIndex = current;
    const toIndex = targetIndex;

    const duration = 820;
    const startTime = performance.now();

    setFlip({ active: true, direction, progress: 0, velocity: 0, fromIndex, toIndex });

    let lastP = 0;
    let lastT = startTime;

    const animate = (now) => {
      const elapsed = now - startTime;
      const raw = Math.min(elapsed / duration, 1);
      const eased = paperEase(raw);
      const dt = Math.max(1, now - lastT);
      const velocity = Math.abs(eased - lastP) / dt * 16.7;
      lastP = eased;
      lastT = now;

      setFlip((f) => ({ ...f, progress: eased, velocity }));

      if (raw < 1) {
        flipRef.current = requestAnimationFrame(animate);
      } else {
        setCurrent(toIndex);
        setFlip({ active: false, direction, progress: 0, velocity: 0, fromIndex: toIndex, toIndex });
        animatingRef.current = false;
      }
    };
    flipRef.current = requestAnimationFrame(animate);
  }, [current]);

  useEffect(() => {
    return () => {
      if (flipRef.current) cancelAnimationFrame(flipRef.current);
    };
  }, []);

  const [coverFlip, setCoverFlip] = useState({ active: false, progress: 0, mode: null });
  const coverRef = useRef(null);

  const animateCover = useCallback((mode, duration, onDone) => {
    if (coverRef.current) cancelAnimationFrame(coverRef.current);
    const startTime = performance.now();
    setCoverFlip({ active: true, progress: 0, mode });

    const animate = (now) => {
      const raw = Math.min((now - startTime) / duration, 1);
      const eased = paperEase(raw);
      setCoverFlip({ active: true, progress: eased, mode });
      if (raw < 1) {
        coverRef.current = requestAnimationFrame(animate);
      } else {
        setCoverFlip({ active: false, progress: 1, mode });
        onDone && onDone();
      }
    };
    coverRef.current = requestAnimationFrame(animate);
  }, []);

  const openBook = useCallback(() => {
    if (step !== "cover") return;
    setStep("opening");
    animateCover("opening", 1150, () => setStep("page"));
  }, [step, animateCover]);

  const closeBook = useCallback(() => {
    if (animatingRef.current) return;
    setStep("closing");
    animateCover("closing", 1150, () => setStep("end"));
  }, [animateCover]);

  useEffect(() => {
    return () => {
      if (coverRef.current) cancelAnimationFrame(coverRef.current);
    };
  }, []);

  const handleCinemaDone = useCallback(() => setStep("cover"), []);

  const showBook = step !== "intro" && step !== "cinema";

  useEffect(() => {
    document.body.style.overflow = (step === "intro" || step === "cinema") ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [step]);

  const goNext = useCallback(() => {
    if (current >= SLIDES.length - 1) {
      closeBook();
    } else {
      startFlip(current + 1);
    }
  }, [startFlip, current, closeBook]);
  const goPrev = useCallback(() => startFlip(current - 1), [startFlip, current]);
  const goTo = useCallback((idx) => startFlip(idx), [startFlip]);

  useEffect(() => {
    if (step !== "page") return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, goNext, goPrev]);

  const leftSlide = SLIDES[current];
  const rightIndex = current + 1;
  const rightSlide = SLIDES[rightIndex];

  const isFirst = current === 0;
  const isLast = current >= SLIDES.length - 1;
  const progressPct = ((current + 1) / SLIDES.length) * 100;
  const isAnimating = flip.active;

  const computeFlip = () => {
    if (!flip.active) return null;

    const p = flip.progress;
    const isNext = flip.direction === "next";

    let overshoot = 0;
    if (p > 0.82) {
      const t = (p - 0.82) / 0.18;
      overshoot = Math.sin(t * Math.PI) * 3;
    }
    const angle = (p * 180) + (isNext ? -overshoot : overshoot);

    const curl = Math.sin(p * Math.PI);
    const curlAsym = Math.pow(Math.sin(p * Math.PI), 0.72);

    const skewY = curlAsym * (isNext ? 6.5 : -6.5);
    const scaleX = 1 - curlAsym * 0.09;
    const scaleY = 1 + curlAsym * 0.015;
    const shadowIntensity = curl;

    const lift = -curlAsym * 13;
    const tiltX = Math.sin(p * Math.PI * 0.9) * (isNext ? 3.2 : -3.2);

    const motionBlur = Math.min(1.1, (flip.velocity || 0) * 0.55);

    const sheenPos = 15 + p * 70;

    const outgoingOpacity = p < 0.55 ? 1 : Math.max(0, 1 - (p - 0.55) / 0.4);
    const incomingOpacity = Math.min(1, 0.25 + p * 1.5);

    return {
      isNext, angle, skewY, scaleX, scaleY, shadowIntensity,
      lift, tiltX, motionBlur, sheenPos,
      outgoingOpacity, incomingOpacity
    };
  };

  const flipData = computeFlip();

  const showCoverPanel = step === "cover" || step === "opening" || step === "closing" || step === "end";
  const panelVariant = (step === "closing" || step === "end") ? "end" : "start";
  let panelAngle = 0;
  if (step === "opening") panelAngle = -165 * coverFlip.progress;
  else if (step === "closing") panelAngle = -165 * (1 - coverFlip.progress);
  const panelOpenFrac = Math.min(1, Math.abs(panelAngle) / 165);
  const panelCurl = Math.sin(panelOpenFrac * Math.PI);
  const panelLive = step === "cover" || step === "end";
  const panelAnimating = step === "opening" || step === "closing";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f4f2ec] via-[#eae7dd] to-[#e0dccd] text-gray-800 overflow-hidden" style={{ fontFamily: "Manrope, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Syne:wght@500;600;700;800&display=swap');
        .font-display { font-family: 'Syne', sans-serif; letter-spacing: -0.01em; }
        ::selection { background: #c9a961; color: white; }
        
        @keyframes pulseGlow {
          0%,100% { opacity: 0.3; transform: scale(1) }
          50% { opacity: 0.55; transform: scale(1.08) }
        }
        .pulse-glow { animation: pulseGlow 6s ease-in-out infinite; }
        
        @keyframes bulletIn {
          0% { opacity: 0; transform: translateX(14px); filter: blur(3px); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes sheenSweep {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
        }

        .book-scene {
          perspective: 2800px;
          perspective-origin: 50% 50%;
          transform-style: preserve-3d;
        }
        .book-page {
          transform-style: preserve-3d;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          will-change: transform, opacity;
          transform: translateZ(0);
        }
        .paper-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.5;
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(201,169,97,0.05) 0%, transparent 3%),
            radial-gradient(circle at 80% 70%, rgba(201,169,97,0.04) 0%, transparent 3%);
          background-size: 200px 200px, 300px 300px;
        }
        .paper-veins {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.35;
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.012) 2px, rgba(0,0,0,0.012) 3px);
        }
        .book-spine {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 36px;
          z-index: 30;
          pointer-events: none;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0) 0%,
            rgba(0,0,0,0.08) 20%,
            rgba(0,0,0,0.16) 45%,
            rgba(0,0,0,0.22) 50%,
            rgba(0,0,0,0.16) 55%,
            rgba(0,0,0,0.08) 80%,
            rgba(0,0,0,0) 100%
          );
        }
        .book-spine-stitches {
          position: absolute;
          top: 30px;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          z-index: 31;
          pointer-events: none;
          background-image: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 14px,
            rgba(201,169,97,0.4) 14px,
            rgba(201,169,97,0.4) 20px
          );
        }
        .book-cover {
          background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%);
          box-shadow:
            inset 0 0 0 1px rgba(201,169,97,0.15),
            0 30px 80px rgba(0,0,0,0.35),
            0 10px 30px rgba(0,0,0,0.25);
        }
        .book-edges-left {
          background: repeating-linear-gradient(
            to bottom,
            #ddd9cc 0px,
            #ddd9cc 1px,
            #c8c4b5 2px,
            #c8c4b5 3px
          );
        }
        .book-edges-right {
          background: repeating-linear-gradient(
            to bottom,
            #ddd9cc 0px,
            #ddd9cc 1px,
            #c8c4b5 2px,
            #c8c4b5 3px
          );
        }
        .page-curl-inner-left {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          width: 70px;
          pointer-events: none;
          background: linear-gradient(to left, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, transparent 100%);
        }
        .page-curl-inner-right {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 70px;
          pointer-events: none;
          background: linear-gradient(to right, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, transparent 100%);
        }
      `}</style>

      {step === "intro" && <CinematicIntro onDone={handleIntroDone} />}
      {step === "cinema" && <CinemaSequence onDone={handleCinemaDone} />}

      <div
        style={{
          opacity: showBook ? 1 : 0,
          transition: "opacity 0.8s ease",
          pointerEvents: showBook ? "auto" : "none"
        }}
      >
        {showBook && <PageBackground />}

        <div className="fixed top-0 left-0 right-0 z-40 h-[2px] bg-gray-200/50">
          <div
            className="h-full bg-[#c9a961]"
            style={{
              width: `${step === "page" ? progressPct : (panelVariant === "end" && (step === "closing" || step === "end") ? 100 : 0)}%`,
              transition: "width 0.5s cubic-bezier(0.22,1,0.36,1)"
            }}
          />
        </div>

        <header className="relative z-20 px-6 md:px-12 pt-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors cursor-pointer group"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-400/60 group-hover:border-black transition-colors bg-white/60 backdrop-blur-sm">
              <ArrowLeft size={14} />
            </span>
            Retour à l'accueil
          </button>

          <p className="hidden md:block text-[10px] font-black uppercase tracking-[0.4em] text-[#c9a961]">
            ACE Services — Notre histoire
          </p>
        </header>

        <main className="relative z-10 px-4 md:px-8 pt-6 pb-28 min-h-[80vh] flex items-center justify-center">
          
          <div
            className="relative w-full max-w-3xl book-scene"
            style={{
              perspective: `${2800 - (flipData?.shadowIntensity || 0) * 550}px`,
              transition: flip.active ? "none" : "perspective 0.3s ease"
            }}
          >
            
            <div
              className="relative mx-auto"
              style={{
                width: "100%",
                maxWidth: "720px",
                aspectRatio: "16 / 10",
                transformStyle: "preserve-3d"
              }}
            >
              <div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{
                  width: `${92 + (flipData?.shadowIntensity || 0) * 4}%`,
                  height: "40px",
                  background: "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 70%)",
                  filter: `blur(${14 + (flipData?.shadowIntensity || 0) * 6}px)`,
                  opacity: 1 - (flipData?.shadowIntensity || 0) * 0.25,
                  transition: flip.active ? "none" : "all 0.3s ease",
                  zIndex: 0
                }}
              />

              <div
                className="absolute inset-0 book-cover rounded-lg"
                style={{ transform: "translateZ(-20px)", zIndex: 1 }}
              />

              <div
                className="absolute book-edges-left rounded-l-lg"
                style={{ top: "6px", bottom: "6px", left: "-6px", width: "12px", zIndex: 2 }}
              />
              <div
                className="absolute book-edges-right rounded-r-lg"
                style={{ top: "6px", bottom: "6px", right: "-6px", width: "12px", zIndex: 2 }}
              />

              {/* CONTENEUR PRINCIPAL — pages du livre */}
              <div className="absolute inset-0" style={{ zIndex: 5, transformStyle: "preserve-3d" }}>

                {/* PAGE DE GAUCHE */}
                <div
                  className="absolute top-0 bottom-0 left-0 bg-white overflow-hidden"
                  style={{
                    width: "50%",
                    transformOrigin: "right center",
                    transformStyle: "preserve-3d",
                    borderRadius: "6px 0 0 6px"
                  }}
                >
                  <div className="paper-veins rounded-l-md" />
                  <div className="paper-grain rounded-l-md" />
                  <div className="page-curl-inner-left" />
                  <div className="relative h-full p-5 xl:p-6">
                    <span className="absolute bottom-3 left-5 xl:left-6 text-[9px] tracking-widest text-gray-400 font-mono">
                      {String(current * 2 + 1).padStart(2, "0")}
                    </span>
                    <SlideContent slide={leftSlide} slideIndex={current} pageSide="left" />
                  </div>
                </div>

                {/* PAGE DE DROITE (idle) */}
                {!flip.active && rightSlide && (
                  <div
                    className="absolute top-0 bottom-0 right-0 bg-white overflow-hidden"
                    style={{
                      width: "50%",
                      transformOrigin: "left center",
                      transformStyle: "preserve-3d",
                      borderRadius: "0 6px 6px 0"
                    }}
                  >
                    <div className="paper-veins rounded-r-md" />
                    <div className="paper-grain rounded-r-md" />
                    <div className="page-curl-inner-right" />
                    <div className="relative h-full p-5 xl:p-6">
                      <span className="absolute bottom-3 right-5 xl:right-6 text-[9px] tracking-widest text-gray-400 font-mono">
                        {String(rightIndex * 2 + 2).padStart(2, "0")}
                      </span>
                      <SlideContent slide={rightSlide} slideIndex={rightIndex} pageSide="right" />
                    </div>
                  </div>
                )}

                {/* DESTINATION pendant next */}
                {flip.active && flip.direction === "next" && (
                  <div
                    className="absolute top-0 bottom-0 right-0 bg-white overflow-hidden"
                    style={{
                      width: "50%",
                      transformOrigin: "left center",
                      transformStyle: "preserve-3d",
                      borderRadius: "0 6px 6px 0",
                      opacity: flipData?.incomingOpacity || 1
                    }}
                  >
                    <div className="paper-veins rounded-r-md" />
                    <div className="paper-grain rounded-r-md" />
                    <div className="page-curl-inner-right" />
                    <div
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        background: `linear-gradient(to right, rgba(0,0,0,${(flipData?.shadowIntensity || 0) * 0.35}) 0%, rgba(0,0,0,${(flipData?.shadowIntensity || 0) * 0.12}) 30%, transparent 70%)`
                      }}
                    />
                    <div className="relative h-full p-5 xl:p-6">
                      <span className="absolute bottom-3 right-5 xl:right-6 text-[9px] tracking-widest text-gray-400 font-mono">
                        {String(flip.toIndex * 2 + 2).padStart(2, "0")}
                      </span>
                      {SLIDES[flip.toIndex] && (
                        <SlideContent slide={SLIDES[flip.toIndex]} slideIndex={flip.toIndex} pageSide="right" />
                      )}
                    </div>
                  </div>
                )}

                {/* DESTINATION pendant prev */}
                {flip.active && flip.direction === "prev" && (
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-white overflow-hidden"
                    style={{
                      width: "50%",
                      transformOrigin: "right center",
                      transformStyle: "preserve-3d",
                      borderRadius: "6px 0 0 6px",
                      opacity: flipData?.incomingOpacity || 1
                    }}
                  >
                    <div className="paper-veins rounded-l-md" />
                    <div className="paper-grain rounded-l-md" />
                    <div className="page-curl-inner-left" />
                    <div
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        background: `linear-gradient(to left, rgba(0,0,0,${(flipData?.shadowIntensity || 0) * 0.35}) 0%, rgba(0,0,0,${(flipData?.shadowIntensity || 0) * 0.12}) 30%, transparent 70%)`
                      }}
                    />
                    <div className="relative h-full p-5 xl:p-6">
                      <span className="absolute bottom-3 left-5 xl:left-6 text-[9px] tracking-widest text-gray-400 font-mono">
                        {String(flip.toIndex * 2 + 1).padStart(2, "0")}
                      </span>
                      {SLIDES[flip.toIndex] && (
                        <SlideContent slide={SLIDES[flip.toIndex]} slideIndex={flip.toIndex} pageSide="left" />
                      )}
                    </div>
                  </div>
                )}

                {/* FEUILLE QUI TOURNE */}
                {flip.active && flipData && (
                  <div
                    className="absolute top-0 bottom-0 book-page"
                    style={{
                      width: "50%",
                      [flipData.isNext ? "right" : "left"]: 0,
                      transformOrigin: flipData.isNext ? "left center" : "right center",
                      transform: `
                        translateY(${flipData.lift}px)
                        translateZ(${flipData.shadowIntensity * 22}px)
                        rotateY(${flipData.angle}deg)
                        rotateX(${flipData.tiltX}deg)
                        skewY(${flipData.skewY}deg)
                        scaleX(${flipData.scaleX})
                        scaleY(${flipData.scaleY})
                      `,
                      opacity: flipData.outgoingOpacity,
                      filter: flipData.motionBlur > 0.08 ? `blur(${flipData.motionBlur}px)` : "none",
                      zIndex: 20,
                      transformStyle: "preserve-3d"
                    }}
                  >
                    {/* RECTO */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        borderRadius: flipData.isNext ? "0 6px 6px 0" : "6px 0 0 6px",
                        background: "linear-gradient(180deg, #ffffff 0%, #fdfcfa 50%, #faf9f5 100%)",
                        boxShadow: flipData.isNext
                          ? `${-flipData.shadowIntensity * 35}px 0 55px rgba(0,0,0,${flipData.shadowIntensity * 0.25})`
                          : `${flipData.shadowIntensity * 35}px 0 55px rgba(0,0,0,${flipData.shadowIntensity * 0.25})`
                      }}
                    >
                      <div
                        className="absolute inset-0 pointer-events-none z-20"
                        style={{
                          background: flipData.isNext
                            ? `linear-gradient(to left, rgba(0,0,0,${flipData.shadowIntensity * 0.42}) 0%, rgba(0,0,0,${flipData.shadowIntensity * 0.16}) 22%, transparent 60%)`
                            : `linear-gradient(to right, rgba(0,0,0,${flipData.shadowIntensity * 0.42}) 0%, rgba(0,0,0,${flipData.shadowIntensity * 0.16}) 22%, transparent 60%)`
                        }}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none z-20"
                        style={{
                          background: flipData.isNext
                            ? `linear-gradient(to right,
                                transparent 0%,
                                rgba(255,255,255,${flipData.shadowIntensity * 0.55}) ${flipData.sheenPos - 10}%,
                                rgba(255,255,255,${flipData.shadowIntensity * 0.85}) ${flipData.sheenPos}%,
                                rgba(255,255,255,${flipData.shadowIntensity * 0.55}) ${flipData.sheenPos + 10}%,
                                transparent 100%)`
                            : `linear-gradient(to left,
                                transparent 0%,
                                rgba(255,255,255,${flipData.shadowIntensity * 0.55}) ${flipData.sheenPos - 10}%,
                                rgba(255,255,255,${flipData.shadowIntensity * 0.85}) ${flipData.sheenPos}%,
                                rgba(255,255,255,${flipData.shadowIntensity * 0.55}) ${flipData.sheenPos + 10}%,
                                transparent 100%)`
                        }}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none z-20"
                        style={{
                          background: `radial-gradient(ellipse at 50% 0%, rgba(255,255,255,${flipData.shadowIntensity * 0.5}) 0%, transparent 50%)`
                        }}
                      />
                      <div className="paper-veins" />
                      <div className="paper-grain" />
                      <div className="relative h-full p-5 xl:p-6">
                        {flipData.isNext ? (
                          <>
                            <span className="absolute bottom-3 right-5 xl:right-6 text-[9px] tracking-widest text-gray-400 font-mono">
                              {String(flip.fromIndex * 2 + 2).padStart(2, "0")}
                            </span>
                            {SLIDES[flip.fromIndex + 1] && (
                              <SlideContent
                                slide={SLIDES[flip.fromIndex + 1]}
                                slideIndex={flip.fromIndex + 1}
                                pageSide="right"
                              />
                            )}
                          </>
                        ) : (
                          <>
                            <span className="absolute bottom-3 left-5 xl:left-6 text-[9px] tracking-widest text-gray-400 font-mono">
                              {String(flip.fromIndex * 2 + 1).padStart(2, "0")}
                            </span>
                            {SLIDES[flip.fromIndex] && (
                              <SlideContent
                                slide={SLIDES[flip.fromIndex]}
                                slideIndex={flip.fromIndex}
                                pageSide="left"
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* VERSO */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        borderRadius: flipData.isNext ? "6px 0 0 6px" : "0 6px 6px 0",
                        background: "linear-gradient(135deg, #fafaf8 0%, #f3f2ee 100%)"
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-40"
                        style={{
                          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(201,169,97,0.04) 10px, rgba(201,169,97,0.04) 11px)"
                        }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `radial-gradient(ellipse at ${flipData.isNext ? "right" : "left"} center, rgba(0,0,0,0.08) 0%, transparent 60%)`
                        }}
                      />
                      <div className="relative h-full p-5 xl:p-6">
                        {flipData.isNext ? (
                          <>
                            <span className="absolute bottom-3 left-5 xl:left-6 text-[9px] tracking-widest text-gray-400 font-mono">
                              {String(flip.toIndex * 2 + 1).padStart(2, "0")}
                            </span>
                            {SLIDES[flip.toIndex] && (
                              <SlideContent
                                slide={SLIDES[flip.toIndex]}
                                slideIndex={flip.toIndex}
                                pageSide="left"
                              />
                            )}
                          </>
                        ) : (
                          <>
                            <span className="absolute bottom-3 right-5 xl:right-6 text-[9px] tracking-widest text-gray-400 font-mono">
                              {String(flip.toIndex * 2 + 2).padStart(2, "0")}
                            </span>
                            {SLIDES[flip.toIndex + 1] && (
                              <SlideContent
                                slide={SLIDES[flip.toIndex + 1]}
                                slideIndex={flip.toIndex + 1}
                                pageSide="right"
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* COUVERTURE — placée DANS le conteneur principal pour rester
                    exactement à la même taille que le livre */}
                {showCoverPanel && (
                  <div
                    className="absolute inset-0 book-page"
                    style={{
                      transformOrigin: "left center",
                      transform: `
                        rotateY(${panelAngle}deg)
                        skewY(${panelCurl * 3}deg)
                        scaleX(${1 - panelCurl * 0.035})
                        translateZ(${panelCurl * 18}px)
                      `,
                      pointerEvents: panelAnimating ? "none" : "auto",
                      zIndex: 40
                    }}
                  >
                    {/* Face avant */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        boxShadow: `0 ${10 + panelCurl * 30}px ${40 + panelCurl * 40}px rgba(0,0,0,${0.3 + panelCurl * 0.2})`
                      }}
                    >
                      <CoverFace
                        variant={panelVariant}
                        live={panelLive}
                        onAction={panelVariant === "start" ? openBook : undefined}
                      />
                    </div>

                    {/* Face arrière */}
                    <div
                      className="absolute inset-0 overflow-hidden rounded-lg"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: "linear-gradient(135deg, #f8f6f0 0%, #efece2 100%)"
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-50"
                        style={{
                          backgroundImage: "repeating-linear-gradient(60deg, transparent, transparent 12px, rgba(201,169,97,0.05) 12px, rgba(201,169,97,0.05) 13px)"
                        }}
                      />
                      <div className="absolute inset-[14px] border border-[#c9a961]/25 rounded-sm" />
                    </div>
                  </div>
                )}
              </div>

              <div className="book-spine" />
              <div className="book-spine-stitches" />
            </div>

            {flip.active && (
              <div
                className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#c9a961]"
                style={{ animation: "fadeUp 0.35s ease both" }}
              >
                {flip.direction === "next" ? (
                  <>
                    <span>Tourner la page</span>
                    <ArrowRight size={12} />
                  </>
                ) : (
                  <>
                    <ArrowLeft size={12} />
                    <span>Page précédente</span>
                  </>
                )}
              </div>
            )}
          </div>
        </main>

        {step === "page" && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-xl border-t border-gray-300/50">
          <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

            <button
              onClick={goPrev}
              disabled={isFirst || isAnimating}
              className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer group ${
                isFirst || isAnimating ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:text-black"
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-400/60 group-hover:border-black transition-colors bg-white/70">
                <ArrowLeft size={12} />
              </span>
              Page précédente
            </button>

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

            {!isLast ? (
              <button
                onClick={goNext}
                disabled={isAnimating}
                className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer group ${
                  isAnimating ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:text-black"
                }`}
              >
                Page suivante
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-400/60 group-hover:border-black transition-colors bg-white/70">
                  <ArrowRight size={12} />
                </span>
              </button>
            ) : (
              <button
                onClick={closeBook}
                className="inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#c9a961] hover:text-black transition-all duration-300 cursor-pointer"
              >
                Refermer le livre <BookOpen size={12} />
              </button>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}