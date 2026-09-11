import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { ArrowLeft, ArrowUpRight, Lightbulb, Users, Target, Heart, Sparkles } from "lucide-react";

/* ============================================================
   INTRO CINÉMATIQUE — style Netflix
   Compteur + particules + lignes lumineuses + logo reveal
   ============================================================ */
function CinematicIntro({ onDone }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("count"); // count → flash → logo → leaving
  const doneRef = useRef(false);
  const canvasRef = useRef(null);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase("leaving");
    setTimeout(() => onDone(), 900);
  }, [onDone]);

  // Particules flottantes (poussière dorée)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let w, h;
    const particles = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.4 - 0.1,
        a: Math.random() * 0.6 + 0.1
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

  // Séquence : compteur → flash → logo → leaving
  useEffect(() => {
    const start = performance.now();
    const duration = 2200;
    let raf;

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // easing dramatique : lent au début, accélère, ralentit à la fin
      const eased = p < 0.5
        ? 2 * p * p
        : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setCount(Math.floor(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setCount(100);
        setPhase("flash");
        setTimeout(() => setPhase("logo"), 250);
        setTimeout(finish, 2600);
      }
    };
    raf = requestAnimationFrame(tick);
    const failsafe = setTimeout(finish, 6000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failsafe);
    };
  }, [finish]);

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black overflow-hidden"
      style={{
        opacity: phase === "leaving" ? 0 : 1,
        transition: "opacity 0.9s ease",
        pointerEvents: phase === "leaving" ? "none" : "auto"
      }}
    >
      {/* Canvas particules */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Halo doré pulsant */}
      <div
        className="absolute h-[900px] w-[900px] rounded-full blur-3xl pulse-glow"
        style={{
          background: "radial-gradient(circle, rgba(201,169,97,0.35) 0%, transparent 65%)",
          opacity: phase === "flash" ? 1 : 0.5,
          transition: "opacity 0.3s ease"
        }}
      />

      {/* Lignes horizontales style "scanline" cinéma */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)"
        }}
      />

      {/* Flash blanc */}
      <div
        className="absolute inset-0 bg-white pointer-events-none"
        style={{
          opacity: phase === "flash" ? 0.9 : 0,
          transition: "opacity 0.25s ease"
        }}
      />

      {/* Compteur */}
      {phase === "count" && (
        <div className="relative text-center">
          <p className="font-display text-[26vw] md:text-[16rem] font-extrabold text-white leading-none tabular-nums tracking-tighter">
            {count}
          </p>
          <div className="mt-6 mx-auto h-[2px] w-64 bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#c9a961]"
              style={{ width: `${count}%`, transition: "width 0.15s linear" }}
            />
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-[0.6em] text-[#c9a961]/80">
            ACE Services présente
          </p>
        </div>
      )}

      {/* Logo reveal */}
      {(phase === "logo" || phase === "flash") && (
        <div className="relative text-center px-6">
          <p
            className="font-display text-5xl md:text-7xl font-extrabold uppercase text-white tracking-tight"
            style={{
              animation: "logoReveal 1.2s cubic-bezier(0.22,1,0.36,1) forwards"
            }}
          >
            ACE Services
          </p>
          <div className="mt-8 w-40 h-[2px] bg-white/20 mx-auto overflow-hidden">
            <div
              className="h-full bg-[#c9a961]"
              style={{ animation: "lineGrow 1.4s ease forwards" }}
            />
          </div>
          <p
            className="mt-5 text-[10px] uppercase tracking-[0.6em] text-[#c9a961]"
            style={{ animation: "fadeUp 1s 0.4s ease both" }}
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
        @keyframes lineGrow {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   SÉQUENCE CINÉMA — sous-titres scéniques
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

  useEffect(() => {
    // petit délai initial pour laisser le fond s'installer
    const t = setTimeout(() => setStarted(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started) return;
    setVisible(false);
    const appear = setTimeout(() => setVisible(true), 200);

    const total = scenes[index].beat === "pause" ? 2000 : 3200;
    const fadeOut = 700;

    const showTimer = setTimeout(() => {
      setVisible(false);
      const nextTimer = setTimeout(() => {
        if (index < scenes.length - 1) {
          setIndex((i) => i + 1);
        } else {
          onDone();
        }
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
      {/* Halo de fond qui change selon la scène */}
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

      {/* Vignette cinéma */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)"
        }}
      />

      {/* Barres noires haut/bas style cinéma */}
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

        {/* Indicateur de progression */}
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
   HOOKS UTILITAIRES
   ============================================================ */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function RevealWord({ text, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block mr-3">
          {word.split("").map((ch, ci) => (
            <span
              key={ci}
              className="inline-block"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(60px)",
                transition: `all 0.7s cubic-bezier(0.22,1,0.36,1) ${delay + (wi * 5 + ci) * 0.03}s`
              }}
            >
              {ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

/* ============================================================
   PAGE À PROPOS
   ============================================================ */
export default function AboutPage({ onBack }) {
  const [step, setStep] = useState("intro");

  const handleIntroDone = useCallback(() => setStep("cinema"), []);
  const handleCinemaDone = useCallback(() => setStep("page"), []);

  useEffect(() => {
    document.body.style.overflow = step === "page" ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [step]);

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
        <div className="px-6 md:px-12 pt-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors cursor-pointer group"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 group-hover:border-black transition-colors">
              <ArrowLeft size={16} />
            </span>
            Retour a l'accueil
          </button>
        </div>

        <section className="relative overflow-hidden px-6 md:px-12 pt-16 pb-24">
          <div
            className="pointer-events-none absolute -top-24 left-1/4 h-[420px] w-[420px] rounded-full opacity-20 blur-3xl pulse-glow"
            style={{ background: "radial-gradient(circle, #c9a961 0%, transparent 70%)" }}
          />
          <h1 className="relative font-display font-extrabold uppercase leading-[0.82] text-[22vw] md:text-[9rem] -ml-1 text-gray-900">
            <RevealWord text="A propos" />
          </h1>
          <p className="relative mt-10 max-w-xl text-lg md:text-xl text-gray-600 leading-snug">
            Nous guidons vos idées vers une entreprise concrète, avec un accompagnement pas à pas jusqu'à son lancement.
          </p>
        </section>

        <Section n="01" icon={<Lightbulb size={20} />} eyebrow="Le commencement" title="A propos de nous">
          <p>ACE Services est un service spécialisé dans l'accompagnement à la création d'entreprise. Nous aidons les futurs entrepreneurs et porteurs de projets à transformer leurs idées en projets concrets et réalisables.</p>
          <p>Nous proposons un accompagnement personnalisé tout au long des différentes étapes de la création d'entreprise : démarches administratives, organisation du projet et orientation financière.</p>
          <p>Notre ambition est de rendre la création d'entreprise plus simple, accessible et sécurisée pour tous.</p>
        </Section>

        <Section n="02" icon={<Users size={20} />} eyebrow="Qui nous sommes" title="Qui sommes-nous ?">
          <p>ACE Services est une entreprise spécialisée dans l'accompagnement à la création d'entreprise et le conseil aux porteurs de projets à Madagascar.</p>
          <p>Nous mettons notre expertise et notre écoute au service de vos idées, pour vous guider à chaque étape de votre projet.</p>
        </Section>

        <Section n="03" icon={<Target size={20} />} eyebrow="Notre raison d'être" title="Notre mission">
          <p>Accompagner et conseiller les entrepreneurs dans la création et la gestion de leur entreprise.</p>
          <p>Rendre la création d'entreprise plus simple, accessible et sécurisée pour tous.</p>
        </Section>

        <Section n="04" icon={<Heart size={20} />} eyebrow="Ce qui nous guide" title="Nos valeurs">
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
            {[
              { label: "Ecoute", text: "Comprendre vos besoins pour mieux vous conseiller." },
              { label: "Professionnalisme", text: "Des solutions fiables et adaptées à votre projet." },
              { label: "Confiance", text: "Une relation durable et transparente." },
              { label: "Engagement", text: "Votre réussite est notre moteur." }
            ].map((v) => (
              <div key={v.label} className="border-l-2 border-[#c9a961]/60 pl-4">
                <p className="font-display text-lg mb-1 text-[#c9a961]">{v.label}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <section className="relative overflow-hidden px-6 md:px-12 py-32 text-center">
          <div
            className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 h-[500px] w-[700px] opacity-25 blur-3xl pulse-glow"
            style={{ background: "radial-gradient(circle, #c9a961 0%, transparent 70%)" }}
          />
          <div className="relative flex justify-center mb-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a961]/40 text-[#c9a961]">
              <Sparkles size={22} />
            </span>
          </div>
          <p className="relative text-[10px] font-black uppercase tracking-[0.4em] text-[#c9a961] mb-6">
            La suite
          </p>
          <h2 className="relative font-display font-extrabold uppercase leading-[0.9] text-4xl md:text-6xl lg:text-7xl text-gray-900 max-w-4xl mx-auto">
            <RevealWord text="Votre histoire commence maintenant." />
          </h2>
          <button
            onClick={onBack}
            className="relative mt-10 inline-flex items-center gap-3 rounded-full bg-black text-white px-9 py-4 text-xs font-black uppercase tracking-widest hover:bg-[#c9a961] hover:text-black transition-all duration-300 cursor-pointer"
          >
            Commencer mon projet <ArrowUpRight size={16} />
          </button>
        </section>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION RÉUTILISABLE
   ============================================================ */
function Section({ n, icon, eyebrow, title, children }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  return (
    <section
      ref={ref}
      className="relative px-6 md:px-12 py-20 border-t border-gray-200"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(50px)",
        transition: "all 1s cubic-bezier(0.22,1,0.36,1)"
      }}
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-[auto_1fr] gap-8 md:gap-12">
        <div className="flex md:flex-col items-center md:items-start gap-4">
          <span className="font-display text-5xl md:text-7xl font-extrabold text-gray-200 leading-none">
            {n}
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a961]/40 text-[#c9a961]">
            {icon}
          </span>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#c9a961] mb-3">
            {eyebrow}
          </p>
          <h2 className="font-display font-extrabold uppercase leading-[0.95] text-3xl md:text-5xl text-gray-900 mb-6">
            {title}
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed max-w-2xl">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}