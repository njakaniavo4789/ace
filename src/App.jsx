import React, { useEffect, useRef, useState } from 'react';
import { Briefcase, Building2, Phone, ArrowRight, Plus, X, Menu, Sparkles } from 'lucide-react';

import logoISPM from './assets/logo_ispm.png';
import logoAce from './assets/ace.png';

/* PARTICLES CANVAS — plus visibles, taille modérée */
const ParticleField = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height, particles, animationId;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      // Densité légèrement augmentée
      const count = Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 8000);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.6 + 1.2, // Points plus gros mais raisonnables
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
        if (dist < 190) {
          const force = (190 - dist) / 190;
          p.vx += (dx / dist) * force * 0.05;
          p.vy += (dy / dist) * force * 0.05;
        }
        p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));

        // Points plus visibles
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(184, 149, 74, 0.95)';
        ctx.fill();
      }

      // Liens plus visibles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 165) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(201, 169, 97, ${0.45 * (1 - dist / 165)})`;
            ctx.lineWidth = 1.2;
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

/* ILLUSTRATION ANIMÉE DU BÂTIMENT */
const BuildingIllustration = () => {
  const floors = 8;
  const cols = 4;
  const windows = [];
  for (let r = 0; r < floors; r++) {
    for (let c = 0; c < cols; c++) {
      const roll = (r * cols + c) % 5;
      const kind = roll === 0 ? 'dark' : roll <= 2 ? 'warm' : 'cool';
      windows.push({
        x: 38 + c * 33,
        y: 58 + r * 27,
        kind,
        delay: ((r * cols + c) * 0.3) % 5,
        duration: 4 + ((r + c) % 3),
      });
    }
  }

  return (
    <svg viewBox="0 0 240 380" className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="towerBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8e2d4" />
          <stop offset="100%" stopColor="#c9a961" />
        </linearGradient>
        <linearGradient id="towerSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b8954a" />
          <stop offset="100%" stopColor="#d4b878" />
        </linearGradient>
        <linearGradient id="wingBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dcd6c8" />
          <stop offset="100%" stopColor="#b8954a" />
        </linearGradient>
        <linearGradient id="glassSheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="65%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9a961" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c9a961" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="4" y="352" width="232" height="10" rx="2" fill="#e0d8c4" />
      <ellipse cx="118" cy="360" rx="92" ry="13" fill="url(#groundShadow)" />

      <g opacity="0.9">
        <rect x="46" y="336" width="4" height="16" fill="#b8954a" />
        <circle cx="48" cy="330" r="10" fill="#c9a961" />
        <rect x="190" y="336" width="4" height="16" fill="#b8954a" />
        <circle cx="192" cy="330" r="10" fill="#c9a961" />
      </g>

      <rect x="150" y="210" width="58" height="126" rx="3" fill="url(#wingBody)" />
      <rect x="158" y="228" width="14" height="16" rx="1.5" fill="#f5edd8" className="window-glow" style={{ animationDelay: '1.1s', animationDuration: '5s' }} />
      <rect x="184" y="228" width="14" height="16" rx="1.5" fill="#c9a961" opacity="0.7" className="window-glow" style={{ animationDelay: '2.4s', animationDuration: '4.5s' }} />
      <rect x="158" y="256" width="14" height="16" rx="1.5" fill="#d4b878" />
      <rect x="184" y="256" width="14" height="16" rx="1.5" fill="#f5edd8" className="window-glow" style={{ animationDelay: '3s', animationDuration: '4.8s' }} />

      <rect x="20" y="46" width="146" height="290" rx="4" fill="url(#towerBody)" />
      <rect x="166" y="46" width="16" height="290" fill="url(#towerSide)" />
      <rect x="20" y="46" width="146" height="290" rx="4" fill="url(#glassSheen)" />

      <rect x="34" y="30" width="30" height="16" rx="2" fill="#d4b878" />
      <rect x="37" y="34" width="4" height="8" fill="#b8954a" />
      <rect x="45" y="34" width="4" height="8" fill="#b8954a" />
      <rect x="53" y="34" width="4" height="8" fill="#b8954a" />
      <rect x="20" y="42" width="162" height="6" fill="#c9a961" opacity="0.4" />
      <line x1="49" y1="30" x2="49" y2="8" stroke="#c9a961" strokeWidth="2" />
      <circle cx="49" cy="8" r="2.5" fill="#d4b878" className="antenna-blink" />
      <line x1="130" y1="46" x2="130" y2="16" stroke="#c9a961" strokeWidth="2" />
      <path d="M130,16 L154,22 L130,28 Z" fill="#d4b878" className="flag-wave" />

      {[112, 166, 220, 274].map((y, i) => (
        <rect key={i} x="20" y={y} width="146" height="3" fill="#c9a961" opacity="0.25" />
      ))}

      {windows.map((w, i) => (
        <rect
          key={i}
          x={w.x}
          y={w.y}
          width="15"
          height="19"
          rx="1.5"
          fill={w.kind === 'warm' ? '#f5edd8' : w.kind === 'cool' ? '#c9a961' : '#d4b878'}
          opacity={w.kind === 'dark' ? 1 : 0.95}
          className={w.kind === 'dark' ? '' : 'window-glow'}
          style={w.kind === 'dark' ? undefined : { animationDelay: `${w.delay}s`, animationDuration: `${w.duration}s` }}
        />
      ))}

      <path d="M74,296 L132,296 L124,286 L82,286 Z" fill="#c9a961" opacity="0.85" />
      <line x1="80" y1="296" x2="80" y2="306" stroke="#c9a961" strokeWidth="1.5" />
      <line x1="126" y1="296" x2="126" y2="306" stroke="#c9a961" strokeWidth="1.5" />

      <rect x="82" y="300" width="42" height="32" rx="2" fill="#d4b878" opacity="0.6" />
      <line x1="103" y1="300" x2="103" y2="332" stroke="#b8954a" strokeWidth="1.5" />

      <g className="birds-fly" fill="none" stroke="#c9a961" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
        <path d="M4,20 q5,-6 10,0 q5,-6 10,0" />
        <path d="M20,34 q4,-5 8,0 q4,-5 8,0" />
      </g>
    </svg>
  );
};


const NAV_ITEMS = [
  { icon: Building2, label: 'À propos', href: '#apropos' },
  { icon: Briefcase, label: 'Services', href: '#services' },
  { icon: Phone, label: 'Contact', href: '#contact' },
];

/* ============================================= */
/* COMPOSANT LOGO SIMPLE — sans cadre            */
/* ============================================= */
const PremiumLogo = ({ src, alt, label, delay = 0 }) => {
  return (
    <div
      className="group relative animate-fade-in flex flex-col items-center"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Halo doré discret pour fondre le logo dans l'ambiance de la page */}
      <div
        className="absolute -inset-3 md:-inset-4 rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(circle, rgba(201,169,97,0.22) 0%, rgba(212,184,120,0.08) 55%, transparent 75%)',
          filter: 'blur(6px)',
          opacity: 0.85,
        }}
      />

      <img
        src={src}
        alt={alt}
        className="relative w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain transition-transform duration-500 group-hover:scale-110"
        style={{
          filter: 'drop-shadow(0 2px 6px rgba(201,169,97,0.25)) sepia(0.12) saturate(1.05)',
          mixBlendMode: 'multiply',
        }}
      />

      <div className="mt-2 flex flex-col items-center pointer-events-none">
        <span
          className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-semibold transition-all duration-500 group-hover:tracking-[0.45em]"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#b8954a',
            opacity: 0.9,
            textShadow: '0 0 12px rgba(201,169,97,0.3)',
          }}
        >
          {label}
        </span>
        <span
          className="mt-1 h-[1.5px] w-0 group-hover:w-10 transition-all duration-500 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #c9a961, transparent)',
          }}
        />
      </div>
    </div>
  );
};


const HomePage = () => {
  const [activePage, setActivePage] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap');

    @keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pulse-glow { 0%, 100% { opacity: 0.25; transform: scale(1); } 50% { opacity: 0.45; transform: scale(1.08); } }
    @keyframes float-card {
      0%, 100% { transform: translateY(0px) rotate(-1.2deg); }
      50% { transform: translateY(-16px) rotate(1deg); }
    }
    @keyframes window-glow {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }
    @keyframes antenna-blink {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
    @keyframes nav-slide-in {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes arrow-bounce {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(4px); }
    }
    @keyframes diamond-pulse {
      0%, 100% { opacity: 0.6; box-shadow: 0 0 8px rgba(201,169,97,0.5); transform: rotate(45deg) scale(1); }
      50% { opacity: 1; box-shadow: 0 0 20px rgba(201,169,97,0.9); transform: rotate(45deg) scale(1.25); }
    }
    @keyframes star-twinkle {
      0%, 100% { opacity: 0.2; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    .window-glow { animation-name: window-glow; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
    .antenna-blink { animation: antenna-blink 1.6s ease-in-out infinite; }
    .birds-fly { animation: birds-drift 9s ease-in-out infinite; }
    @keyframes birds-drift {
      0% { transform: translate(0, 0); opacity: 0.7; }
      45% { transform: translate(26px, -10px); opacity: 0.9; }
      55% { transform: translate(26px, -10px); opacity: 0.9; }
      100% { transform: translate(0, 0); opacity: 0.7; }
    }
    .flag-wave { animation: flag-wave 2.2s ease-in-out infinite; transform-origin: 130px 22px; }
    @keyframes flag-wave {
      0%, 100% { transform: scaleX(1) skewY(0deg); }
      50% { transform: scaleX(0.92) skewY(-4deg); }
    }

    .animate-fade-up { animation: fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
    .animate-fade-in { animation: fade-in 0.6s ease forwards; opacity: 0; }
    .animate-pulse-glow { animation: pulse-glow 6s ease-in-out infinite; }
    .animate-float-card { animation: float-card 7s ease-in-out infinite; }
    .animate-nav-slide { animation: nav-slide-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }

    .btn-discover .shimmer-layer {
      background: linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%);
      background-size: 200% 100%;
    }
    .btn-discover:hover .shimmer-layer {
      animation: shimmer 2.5s linear infinite;
    }
    .btn-discover:hover .arrow-icon { animation: arrow-bounce 0.8s ease-in-out infinite; }

    .diamond-pulse { animation: diamond-pulse 2.4s ease-in-out infinite; }
    .star-twinkle { animation: star-twinkle 2s ease-in-out infinite; }

    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-400 { animation-delay: 0.4s; }
    .delay-500 { animation-delay: 0.5s; }
  `;

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-gray-700" style={{ background: '#ffffff' }}>
      <style>{customStyles}</style>

      <section id="accueil" className="relative min-h-screen w-full overflow-hidden flex flex-col" style={{ background: '#ffffff' }}>

        <div className="absolute inset-0 -z-10" style={{ background: '#ffffff' }} />

        {/* Halos de fond — opacité réduite pour laisser voir les particules */}
        <div className="absolute inset-0 pointer-events-none">
          <ParticleField />
          <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] sm:w-[50vw] sm:h-[50vw] bg-[#f5edd8]/40 rounded-full blur-[150px] animate-pulse-glow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] sm:w-[40vw] sm:h-[40vw] bg-[#e0d8c4]/40 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[20%] right-[15%] w-[26vw] h-[26vw] bg-[#c9a961]/10 rounded-full blur-[130px] animate-pulse-glow" style={{ animationDelay: '3.5s' }} />
        </div>

        {/* ===== LOGOS AUX EXTREMITES — GAUCHE / DROITE ===== */}
        {/* En flux normal (plus en absolute) : ne chevauche jamais le texte, même sur petits écrans */}
        <div className="relative z-30 flex justify-between items-center px-4 sm:px-6 md:px-12 lg:px-16 pt-5 sm:pt-6 md:pt-8 shrink-0">
          <PremiumLogo src={logoISPM} alt="ISPM" label="ISPM" delay={0.1} />
          <PremiumLogo src={logoAce} alt="ACE" label="ACE" delay={0.2} />
        </div>

        {/* Illustration flottante — visible uniquement à partir des tablettes pour ne pas encombrer le mobile */}
        <div
          className="hidden md:block absolute z-20 animate-float-card"
          style={{ top: '14%', right: 'clamp(3rem, 8vw, 10rem)' }}
        >
          <div
            className="w-40 md:w-56 lg:w-64"
            style={{ filter: 'drop-shadow(0 30px 55px rgba(201,169,97,0.3))' }}
            role="img"
            aria-label="Illustration du bâtiment de l'entreprise"
          >
            <BuildingIllustration />
          </div>
        </div>

        {/* Texte hero + bouton — poussé en bas via mt-auto, jamais en absolute : s'adapte à toute hauteur d'écran */}
        <div className="relative z-20 mt-auto px-4 sm:px-6 md:px-12 lg:px-20 pt-10 pb-28 sm:pb-24 md:pb-24 lg:pb-28">
          <div className="max-w-xl lg:max-w-2xl animate-fade-up delay-300">
            <svg viewBox="0 0 120 16" className="w-20 sm:w-24 h-4 mb-3 sm:mb-4" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="flourishGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c9a961" />
                  <stop offset="100%" stopColor="#d4b878" />
                </linearGradient>
              </defs>
              <line x1="0" y1="8" x2="45" y2="8" stroke="url(#flourishGrad)" strokeWidth="1" />
              <circle cx="60" cy="8" r="3" fill="none" stroke="url(#flourishGrad)" strokeWidth="1" />
              <line x1="75" y1="8" x2="120" y2="8" stroke="url(#flourishGrad)" strokeWidth="1" />
            </svg>
            <p className="text-[#b8954a] text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-3 tracking-[0.25em] sm:tracking-[0.3em] uppercase font-semibold">
              Excellence & Partenariat
            </p>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-800 mb-3 sm:mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
            >
              L'Excellence au cœur de vos{" "}
              <span className="bg-gradient-to-r from-[#b8954a] via-[#c9a961] to-[#d4b878] bg-clip-text text-transparent">
                Réussites
              </span>
            </h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-lg mb-6 sm:mb-8">
              L'union de l'éducation (ISPM) et du service d'élite (Ace Services) pour transformer votre vision en réalité
            </p>

            {/* BOUTON DÉCOUVRIR L'ENTREPRISE — lumière atténuée */}
            <a
              href="#apropos"
              className="btn-discover group relative inline-flex items-center gap-2 sm:gap-3 pl-5 sm:pl-7 pr-4 sm:pr-6 py-3 sm:py-4 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer max-w-full"
              style={{
                background: 'linear-gradient(135deg, #c9a961 0%, #d4b878 100%)',
                boxShadow: '0 4px 14px rgba(201,169,97,0.25)',
              }}
            >
              <span className="shimmer-layer absolute inset-0 rounded-full pointer-events-none" />
              <span className="relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 shrink-0">
                <Sparkles size={16} style={{ color: '#ffffff' }} />
              </span>
              <span
                className="relative text-xs sm:text-sm md:text-base font-bold tracking-[0.06em] sm:tracking-[0.08em] text-white whitespace-nowrap"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Découvrir l'entreprise
              </span>
              <span className="relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-all duration-500 group-hover:bg-white/15 shrink-0">
                <ArrowRight
                  size={16}
                  className="arrow-icon transition-transform duration-300"
                  style={{ color: '#ffffff' }}
                />
              </span>
            </a>
          </div>
        </div>

        {/* NAVBAR DESKTOP */}
        <nav
          className="hidden lg:flex flex-col items-end fixed right-6 top-1/2 -translate-y-1/2 z-30 gap-3 animate-nav-slide"
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
                    background: 'rgba(255,255,255,0.98)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(201,169,97,0.4)',
                    boxShadow: isHovered
                      ? '0 8px 32px rgba(201,169,97,0.2), 0 0 0 1px rgba(201,169,97,0.2), inset 0 1px 0 rgba(255,255,255,0.9)'
                      : '0 4px 16px rgba(201,169,97,0.12)',
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateX(0) scale(1)' : 'translateX(12px) scale(0.92)',
                  }}
                >
                  <item.icon size={14} style={{ color: '#c9a961' }} />
                  <span
                    className="text-[11px] tracking-[0.2em] uppercase font-semibold"
                    style={{ fontFamily: "'Playfair Display', serif", color: '#4a4a4a' }}
                  >
                    {item.label}
                  </span>
                  <ArrowRight
                    size={11}
                    className="transition-transform duration-300"
                    style={{
                      color: '#c9a961',
                      transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
                    }}
                  />
                </span>

                <span
                  className="relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-400 ease-out overflow-hidden"
                  style={{
                    background: isHovered
                      ? 'linear-gradient(135deg, rgba(201,169,97,0.95), rgba(212,184,120,0.9))'
                      : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(16px)',
                    border: isHovered
                      ? '1px solid rgba(255,255,255,0.5)'
                      : '1px solid rgba(201,169,97,0.3)',
                    boxShadow: isHovered
                      ? '0 0 20px rgba(201,169,97,0.25), 0 8px 24px rgba(201,169,97,0.15), inset 0 1px 0 rgba(255,255,255,0.4)'
                      : '0 4px 16px rgba(201,169,97,0.1)',
                    transform: isHovered ? 'scale(1.08) rotate(-4deg)' : 'scale(1) rotate(0deg)',
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-2xl transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 70%)',
                      opacity: isHovered ? 1 : 0,
                    }}
                  />
                  <item.icon
                    size={20}
                    className="relative transition-all duration-400"
                    style={{
                      color: isHovered ? '#ffffff' : '#c9a961',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                  />
                </span>

                <span
                  className="absolute -right-1.5 w-1.5 h-1.5 rounded-full transition-all duration-400"
                  style={{
                    background: isHovered ? '#c9a961' : 'rgba(201,169,97,0.35)',
                    boxShadow: isHovered ? '0 0 8px rgba(201,169,97,0.8)' : 'none',
                    transform: isHovered ? 'scale(1.5)' : 'scale(1)',
                  }}
                />
              </button>
            );
          })}

          <div className="absolute right-5 top-1/2 -translate-y-1/2 h-32 w-[2px] bg-gradient-to-b from-transparent via-[#c9a961]/25 to-transparent pointer-events-none -z-10" />
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
                  background: 'rgba(255,255,255,0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(201,169,97,0.4)',
                  boxShadow: '0 8px 32px rgba(201,169,97,0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
                  animationDelay: `${i * 0.06}s`,
                }}
              >
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(201,169,97,0.2), rgba(212,184,120,0.15))',
                    border: '1px solid rgba(201,169,97,0.3)',
                  }}
                >
                  <item.icon size={14} style={{ color: '#c9a961' }} />
                </span>
                <span
                  className="text-[12px] tracking-[0.12em] text-gray-700"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
                >
                  {item.label}
                </span>
                <ArrowRight size={12} className="text-[#c9a961] ml-1" />
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setMobileNavOpen((o) => !o)}
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-400 overflow-hidden group"
          style={{
            background: mobileNavOpen
              ? 'linear-gradient(135deg, #f5edd8, #e0d8c4)'
              : 'linear-gradient(135deg, #c9a961, #d4b878)',
            boxShadow: mobileNavOpen
              ? '0 4px 20px rgba(201,169,97,0.2)'
              : '0 4px 18px rgba(201,169,97,0.3)',
            transform: mobileNavOpen ? 'rotate(90deg) scale(0.95)' : 'rotate(0deg) scale(1)',
          }}
        >
          {mobileNavOpen ? (
            <X size={20} style={{ color: '#b8954a' }} className="relative" />
          ) : (
            <Menu size={20} style={{ color: '#ffffff' }} className="relative" />
          )}
        </button>
      </div>

      {/* MODAL */}
      {activePage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setActivePage(null)}>
          <div className="absolute inset-0 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.7)' }} />
          <div
            className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 text-center animate-fade-up overflow-hidden"
            style={{
              background: '#ffffff',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(201,169,97,0.35)',
              boxShadow: '0 25px 60px rgba(201,169,97,0.15), 0 0 0 1px rgba(255,255,255,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #c9a961, transparent)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,97,0.4), transparent)' }} />

            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'rgba(201,169,97,0.1)',
                border: '1px solid rgba(201,169,97,0.35)',
                boxShadow: '0 0 20px rgba(201,169,97,0.1)',
              }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b878)', boxShadow: '0 4px 15px rgba(201,169,97,0.3)' }}>
                <span className="text-2xl">🚧</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Page "{activePage}"
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Cette page n'est pas encore disponible.<br />
              Elle sera bientôt accessible.
            </p>

            <button
              onClick={() => setActivePage(null)}
              className="px-6 py-3 rounded-xl text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #c9a961, #d4b878)',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(201,169,97,0.25)',
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