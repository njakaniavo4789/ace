import React, { useEffect, useRef, useState } from 'react';
import { Briefcase, Building2, Phone, ArrowRight, X, Menu, Sparkles } from 'lucide-react';

import logoISPM from './assets/logo_ispm.png';
import logoAce from './assets/logo.jpg';
import handshakeBg from './assets/img _fond.jpg';

/* ============================================= */
/* SPOTLIGHT QUI SUIT LA SOURIS                 */
/* ============================================= */
const Spotlight = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const move = (e) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--x', `${e.clientX - rect.left}px`);
      el.style.setProperty('--y', `${e.clientY - rect.top}px`);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return <div ref={ref} className="spotlight absolute inset-0 pointer-events-none z-10" aria-hidden="true" />;
};

/* ============================================= */
/* PARTICULES — plus discrètes sur fond photo    */
/* ============================================= */
const ParticleField = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles, animationId;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      const count = Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 14000);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2 + 0.8,
      }));
    };

    const step = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const force = (160 - dist) / 160;
          p.vx += (dx / dist) * force * 0.04;
          p.vy += (dy / dist) * force * 0.04;
        }
        p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 220, 150, 0.85)';
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(255, 210, 140, ${0.35 * (1 - dist / 140)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(step);
    };

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => { mouse.current = { x: -9999, y: -9999 }; };

    resize();
    step();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', handleLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
};

const NAV_ITEMS = [
  { icon: Building2, label: 'À propos', href: '#apropos' },
  { icon: Briefcase, label: 'Services', href: '#services' },
  { icon: Phone, label: 'Contact', href: '#contact' },
];

/* ============================================= */
/* LOGO SANS CADRE — TAILLE AGRANDIE             */
/* ============================================= */
const PremiumLogo = ({ src, alt, label, delay = 0 }) => (
  <div className="group relative animate-fade-in flex flex-col items-center" style={{ animationDelay: `${delay}s` }}>
    <img
      src={src} alt={alt}
      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-36 lg:h-36 object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_20px_rgba(255,220,150,0.55)]"
    />
    <div className="mt-3 flex flex-col items-center pointer-events-none">
      <span
        className="text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.35em] uppercase font-semibold transition-all duration-500 group-hover:tracking-[0.45em] text-amber-100"
        style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
      >
        {label}
      </span>
      <span className="mt-1.5 h-[2px] w-0 group-hover:w-16 transition-all duration-500 rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent, #f5d68a, transparent)' }}
      />
    </div>
  </div>
);

/* ============================================= */
/* PAGE PRINCIPALE                               */
/* ============================================= */
const HomePage = () => {
  const [activePage, setActivePage] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600&display=swap');

    @keyframes fade-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pulse-glow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.55; transform: scale(1.1); } }
    @keyframes nav-slide-in { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes arrow-bounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } }
    @keyframes bg-zoom {
      0% { transform: scale(1.05); }
      100% { transform: scale(1.15); }
    }
    @keyframes gradient-border {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    @keyframes float-slow {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .animate-fade-up { animation: fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
    .animate-fade-in { animation: fade-in 0.8s ease forwards; opacity: 0; }
    .animate-pulse-glow { animation: pulse-glow 6s ease-in-out infinite; }
    .animate-nav-slide { animation: nav-slide-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
    .animate-float-slow { animation: float-slow 5s ease-in-out infinite; }

    .btn-discover .shimmer-layer {
      background: linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%);
      background-size: 200% 100%;
    }
    .btn-discover:hover .shimmer-layer { animation: shimmer 2.5s linear infinite; }
    .btn-discover:hover .arrow-icon { animation: arrow-bounce 0.8s ease-in-out infinite; }

    .btn-discover::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 9999px;
      padding: 2px;
      background: linear-gradient(120deg, #f5d68a, #c9a961, #f5d68a, #b8954a, #f5d68a);
      background-size: 300% 300%;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      animation: gradient-border 4s ease infinite;
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    .btn-discover:hover::before { opacity: 1; }

    .spotlight {
      background: radial-gradient(600px circle at var(--x, 50%) var(--y, 50%),
        rgba(255, 220, 150, 0.12),
        rgba(255, 200, 120, 0.06) 40%,
        transparent 70%);
      transition: background 0.15s ease;
    }

    .bg-kenburns { animation: bg-zoom 20s ease-in-out infinite alternate; }

    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-400 { animation-delay: 0.4s; }
    .delay-500 { animation-delay: 0.5s; }

    .font-display { font-family: 'Playfair Display', serif; }
    .font-body { font-family: 'Inter', sans-serif; }
  `;

  return (
    <div className="min-h-screen relative overflow-hidden font-body text-white">
      <style>{customStyles}</style>

      <section id="accueil" className="relative min-h-screen w-full overflow-hidden flex flex-col">

        {/* ==== FOND IMMERSIF ==== */}
        <div
          className="absolute inset-0 -z-30 bg-kenburns"
          style={{
            backgroundImage: `url(${handshakeBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div
          className="absolute inset-0 -z-20"
          style={{
            background: `
              linear-gradient(135deg, rgba(10, 8, 5, 0.85) 0%, rgba(20, 15, 8, 0.55) 45%, rgba(10, 8, 5, 0.75) 100%),
              radial-gradient(circle at 70% 40%, rgba(201, 169, 97, 0.15) 0%, transparent 55%)
            `,
          }}
        />

        <div
          className="absolute inset-0 -z-20 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        <div
          className="absolute inset-0 -z-20 pointer-events-none opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-amber-500/10 rounded-full blur-[180px] animate-pulse-glow" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] bg-yellow-600/10 rounded-full blur-[180px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="absolute inset-0 pointer-events-none z-0">
          <ParticleField />
          <Spotlight />
        </div>

        {/* ==== CONTENU ==== */}
        <div className="relative z-30 flex flex-col min-h-screen">

          {/* LOGOS INVERSÉS ET AGRANDIS */}
          <div className="flex justify-between items-start px-4 sm:px-6 md:px-12 lg:px-16 pt-5 sm:pt-6 md:pt-8 shrink-0">
            <PremiumLogo src={logoAce} alt="ACE" label="ACE" delay={0.1} />
            <PremiumLogo src={logoISPM} alt="ISPM" label="ISPM" delay={0.2} />
          </div>

          {/* HERO TEXTE */}
          <div className="mt-auto px-4 sm:px-6 md:px-12 lg:px-20 pt-16 pb-28 sm:pb-24 md:pb-24 lg:pb-28">
            <div className="max-w-2xl animate-fade-up delay-300">

              <svg viewBox="0 0 120 16" className="w-20 sm:w-24 h-4 mb-4 sm:mb-5" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="flourishGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f5d68a" />
                    <stop offset="100%" stopColor="#c9a961" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="8" x2="45" y2="8" stroke="url(#flourishGrad)" strokeWidth="1" />
                <circle cx="60" cy="8" r="3" fill="none" stroke="url(#flourishGrad)" strokeWidth="1" />
                <line x1="75" y1="8" x2="120" y2="8" stroke="url(#flourishGrad)" strokeWidth="1" />
              </svg>

              <p className="text-amber-200/90 text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4 tracking-[0.3em] sm:tracking-[0.4em] uppercase font-semibold"
                style={{ textShadow: '0 2px 20px rgba(255, 200, 120, 0.5)' }}>
                Excellence & Partenariat
              </p>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6 leading-[1.05] text-white font-display"
                style={{ fontWeight: 600, textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}
              >
                L'Excellence au cœur<br className="hidden sm:block" /> de vos{" "}
                <span
                  className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent"
                  style={{ filter: 'drop-shadow(0 0 30px rgba(255, 210, 130, 0.5))' }}
                >
                  Réussites
                </span>
              </h1>

              <p className="text-white/70 text-sm md:text-lg leading-relaxed max-w-lg mb-8 sm:mb-10 font-light"
                style={{ textShadow: '0 2px 15px rgba(0,0,0,0.7)' }}>
                L'union de l'éducation (ISPM) et du service d'élite (Ace Services) pour transformer votre vision en réalité.
              </p>

              <a
                href="#apropos"
                className="btn-discover group relative inline-flex items-center gap-2 sm:gap-3 pl-6 sm:pl-8 pr-5 sm:pr-6 py-4 sm:py-5 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] cursor-pointer max-w-full"
                style={{
                  background: 'linear-gradient(135deg, #f5d68a 0%, #c9a961 50%, #b8954a 100%)',
                  boxShadow: '0 10px 40px rgba(201,169,97,0.5), 0 0 0 1px rgba(255,220,150,0.3) inset',
                }}
              >
                <span className="shimmer-layer absolute inset-0 rounded-full pointer-events-none" />
                <span className="relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 shrink-0">
                  <Sparkles size={18} style={{ color: '#ffffff' }} />
                </span>
                <span
                  className="relative text-sm sm:text-base md:text-lg font-bold tracking-[0.06em] sm:tracking-[0.08em] text-white whitespace-nowrap font-display"
                  style={{ textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}
                >
                  Découvrir l'entreprise
                </span>
                <span className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-500 group-hover:bg-white/20 shrink-0">
                  <ArrowRight size={18} className="arrow-icon transition-transform duration-300" style={{ color: '#ffffff' }} />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* NAVBAR DESKTOP */}
        <nav
          className="hidden lg:flex flex-col items-end fixed right-6 top-1/2 -translate-y-1/2 z-40 gap-3 animate-nav-slide"
          aria-label="Navigation principale"
        >
          {NAV_ITEMS.map((item, i) => {
            const isHovered = hoveredNav === i;
            return (
              <button
                key={item.label}
                onMouseEnter={() => setHoveredNav(i)}
                onMouseLeave={() => setHoveredNav(null)}
                onClick={() => setActivePage(item.label)}
                className="group relative flex items-center justify-end cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span
                  className="absolute right-full mr-4 flex items-center gap-2.5 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-400 ease-out pointer-events-none"
                  style={{
                    background: 'rgba(20, 15, 8, 0.85)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(245, 214, 138, 0.3)',
                    boxShadow: isHovered
                      ? '0 8px 40px rgba(201,169,97,0.35), inset 0 1px 0 rgba(255,220,150,0.2)'
                      : '0 4px 20px rgba(0,0,0,0.3)',
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateX(0) scale(1)' : 'translateX(12px) scale(0.92)',
                  }}
                >
                  <item.icon size={14} style={{ color: '#f5d68a' }} />
                  <span className="text-[11px] tracking-[0.2em] uppercase font-semibold font-display text-amber-100">
                    {item.label}
                  </span>
                  <ArrowRight size={11} className="transition-transform duration-300"
                    style={{ color: '#f5d68a', transform: isHovered ? 'translateX(2px)' : 'translateX(0)' }} />
                </span>

                <span
                  className="relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-400 ease-out overflow-hidden"
                  style={{
                    background: isHovered
                      ? 'linear-gradient(135deg, #f5d68a, #c9a961)'
                      : 'rgba(20, 15, 8, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: isHovered ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(245, 214, 138, 0.3)',
                    boxShadow: isHovered
                      ? '0 0 30px rgba(245,214,138,0.5), 0 8px 30px rgba(201,169,97,0.4)'
                      : '0 4px 20px rgba(0,0,0,0.3)',
                    transform: isHovered ? 'scale(1.1) rotate(-4deg)' : 'scale(1) rotate(0deg)',
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-2xl transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 70%)',
                      opacity: isHovered ? 1 : 0,
                    }}
                  />
                  <item.icon
                    size={20}
                    className="relative transition-all duration-400"
                    style={{
                      color: isHovered ? '#ffffff' : '#f5d68a',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                  />
                </span>

                <span
                  className="absolute -right-1.5 w-1.5 h-1.5 rounded-full transition-all duration-400"
                  style={{
                    background: isHovered ? '#f5d68a' : 'rgba(245,214,138,0.4)',
                    boxShadow: isHovered ? '0 0 10px rgba(245,214,138,1)' : 'none',
                    transform: isHovered ? 'scale(1.6)' : 'scale(1)',
                  }}
                />
              </button>
            );
          })}

          <div className="absolute right-5 top-1/2 -translate-y-1/2 h-32 w-[2px] bg-gradient-to-b from-transparent via-amber-300/30 to-transparent pointer-events-none -z-10" />
        </nav>
      </section>

      {/* NAVBAR MOBILE */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {mobileNavOpen && (
          <div className="flex flex-col gap-2.5 mb-1">
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.label}
                onClick={() => { setActivePage(item.label); setMobileNavOpen(false); }}
                className="animate-fade-up flex items-center gap-3 pl-4 pr-5 py-3 rounded-2xl transition-all duration-300"
                style={{
                  background: 'rgba(20, 15, 8, 0.9)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(245, 214, 138, 0.35)',
                  boxShadow: '0 8px 40px rgba(201,169,97,0.25), inset 0 1px 0 rgba(255,220,150,0.15)',
                  animationDelay: `${i * 0.06}s`,
                }}
              >
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(245,214,138,0.25), rgba(201,169,97,0.15))',
                    border: '1px solid rgba(245,214,138,0.4)',
                  }}
                >
                  <item.icon size={14} style={{ color: '#f5d68a' }} />
                </span>
                <span className="text-[12px] tracking-[0.12em] text-amber-100 font-display font-semibold">
                  {item.label}
                </span>
                <ArrowRight size={12} className="text-amber-300 ml-1" />
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setMobileNavOpen((o) => !o)}
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-400 overflow-hidden group"
          style={{
            background: mobileNavOpen
              ? 'linear-gradient(135deg, #2a2218, #1a140c)'
              : 'linear-gradient(135deg, #f5d68a, #c9a961)',
            boxShadow: mobileNavOpen
              ? '0 4px 25px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(245,214,138,0.3)'
              : '0 8px 30px rgba(201,169,97,0.5)',
            transform: mobileNavOpen ? 'rotate(90deg) scale(0.95)' : 'rotate(0deg) scale(1)',
          }}
        >
          {mobileNavOpen ? (
            <X size={20} style={{ color: '#f5d68a' }} className="relative" />
          ) : (
            <Menu size={20} style={{ color: '#ffffff' }} className="relative" />
          )}
        </button>
      </div>

      {/* MODAL */}
      {activePage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setActivePage(null)}>
          <div className="absolute inset-0 backdrop-blur-xl" style={{ background: 'rgba(10, 8, 5, 0.7)' }} />
          <div
            className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 text-center animate-fade-up overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 24, 15, 0.95), rgba(20, 15, 8, 0.95))',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(245, 214, 138, 0.35)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,214,138,0.15), inset 0 1px 0 rgba(255,220,150,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #f5d68a, transparent)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,214,138,0.4), transparent)' }} />

            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'rgba(245, 214, 138, 0.08)',
                border: '1px solid rgba(245, 214, 138, 0.35)',
                boxShadow: '0 0 30px rgba(245,214,138,0.2)',
              }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #f5d68a, #c9a961)', boxShadow: '0 4px 20px rgba(245,214,138,0.5)' }}>
                <span className="text-2xl">🚧</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-amber-100 mb-2 font-display">
              Page "{activePage}"
            </h2>
            <p className="text-sm text-amber-100/60 mb-6">
              Cette page n'est pas encore disponible.<br />Elle sera bientôt accessible.
            </p>

            <button
              onClick={() => setActivePage(null)}
              className="px-6 py-3 rounded-xl text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #f5d68a, #c9a961)',
                color: '#1a140c',
                boxShadow: '0 8px 25px rgba(245,214,138,0.4)',
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;