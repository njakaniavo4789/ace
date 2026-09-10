import React, { useEffect, useRef, useState } from 'react';
import { Briefcase, Building2, Phone, ArrowRight, Plus, X, Menu, Sparkles } from 'lucide-react';

import logoISPM from './assets/logo_ispm.png';
import logoAce from './assets/ace.png';

/* PARTICLES CANVAS */
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
      const count = Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 14000);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
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
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180, 186, 177, 0.6)';
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(180, 186, 177, ${0.14 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
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
          <stop offset="0%" stopColor="#494c44" />
          <stop offset="100%" stopColor="#17180f" />
        </linearGradient>
        <linearGradient id="towerSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0c0d0a" />
          <stop offset="100%" stopColor="#282a22" />
        </linearGradient>
        <linearGradient id="wingBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#383b33" />
          <stop offset="100%" stopColor="#121310" />
        </linearGradient>
        <linearGradient id="glassSheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="65%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="4" y="352" width="232" height="10" rx="2" fill="#1c1d18" />
      <ellipse cx="118" cy="360" rx="92" ry="13" fill="url(#groundShadow)" />

      <g opacity="0.9">
        <rect x="46" y="336" width="4" height="16" fill="#3a2c22" />
        <circle cx="48" cy="330" r="10" fill="#7c8a72" />
        <rect x="190" y="336" width="4" height="16" fill="#3a2c22" />
        <circle cx="192" cy="330" r="10" fill="#7c8a72" />
      </g>

      <rect x="150" y="210" width="58" height="126" rx="3" fill="url(#wingBody)" />
      <rect x="158" y="228" width="14" height="16" rx="1.5" fill="#E7C98F" className="window-glow" style={{ animationDelay: '1.1s', animationDuration: '5s' }} />
      <rect x="184" y="228" width="14" height="16" rx="1.5" fill="#B4BAB1" opacity="0.55" className="window-glow" style={{ animationDelay: '2.4s', animationDuration: '4.5s' }} />
      <rect x="158" y="256" width="14" height="16" rx="1.5" fill="#1a1b16" />
      <rect x="184" y="256" width="14" height="16" rx="1.5" fill="#E7C98F" className="window-glow" style={{ animationDelay: '3s', animationDuration: '4.8s' }} />

      <rect x="20" y="46" width="146" height="290" rx="4" fill="url(#towerBody)" />
      <rect x="166" y="46" width="16" height="290" fill="url(#towerSide)" />
      <rect x="20" y="46" width="146" height="290" rx="4" fill="url(#glassSheen)" />

      <rect x="34" y="30" width="30" height="16" rx="2" fill="#2a2c25" />
      <rect x="37" y="34" width="4" height="8" fill="#151610" />
      <rect x="45" y="34" width="4" height="8" fill="#151610" />
      <rect x="53" y="34" width="4" height="8" fill="#151610" />
      <rect x="20" y="42" width="162" height="6" fill="#B4BAB1" opacity="0.2" />
      <line x1="49" y1="30" x2="49" y2="8" stroke="#B4BAB1" strokeWidth="2" />
      <circle cx="49" cy="8" r="2.5" fill="#D4AF37" className="antenna-blink" />
      <line x1="130" y1="46" x2="130" y2="16" stroke="#9a9284" strokeWidth="2" />
      <path d="M130,16 L154,22 L130,28 Z" fill="#D4AF37" className="flag-wave" />

      {[112, 166, 220, 274].map((y, i) => (
        <rect key={i} x="20" y={y} width="146" height="3" fill="#B4BAB1" opacity="0.12" />
      ))}

      {windows.map((w, i) => (
        <rect
          key={i}
          x={w.x}
          y={w.y}
          width="15"
          height="19"
          rx="1.5"
          fill={w.kind === 'warm' ? '#E7C98F' : w.kind === 'cool' ? '#B4BAB1' : '#1a1b16'}
          opacity={w.kind === 'dark' ? 1 : 0.95}
          className={w.kind === 'dark' ? '' : 'window-glow'}
          style={w.kind === 'dark' ? undefined : { animationDelay: `${w.delay}s`, animationDuration: `${w.duration}s` }}
        />
      ))}

      <path d="M74,296 L132,296 L124,286 L82,286 Z" fill="#D4AF37" opacity="0.85" />
      <line x1="80" y1="296" x2="80" y2="306" stroke="#D4AF37" strokeWidth="1.5" />
      <line x1="126" y1="296" x2="126" y2="306" stroke="#D4AF37" strokeWidth="1.5" />

      <rect x="82" y="300" width="42" height="32" rx="2" fill="#B4BAB1" opacity="0.5" />
      <line x1="103" y1="300" x2="103" y2="332" stroke="#0c0d0a" strokeWidth="1.5" />

      <g className="birds-fly" fill="none" stroke="#B4BAB1" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
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
/* COMPOSANT LOGO PREMIUM — verre, halo, orbite  */
/* ============================================= */
const PremiumLogo = ({ src, alt, label, delay = 0 }) => {
  return (
    <div
      className="group relative animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Halo extérieur pulsant (permanent) */}
      <div
        className="absolute -inset-6 rounded-full blur-2xl pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-700 logo-halo"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.35), rgba(224,175,165,0.18) 45%, transparent 75%)',
        }}
      />

      {/* Couronne conique rotative au survol */}
      <div
        className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0%, rgba(212,175,55,0.7) 15%, transparent 30%, transparent 70%, rgba(224,175,165,0.7) 85%, transparent 100%)',
          animation: 'logo-spin 6s linear infinite',
          maskImage: 'radial-gradient(circle, transparent 58%, black 60%, black 65%, transparent 67%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 58%, black 60%, black 65%, transparent 67%)',
        }}
      />

      {/* Conteneur principal (verre dépoli) */}
      <div
        className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl transition-all duration-500 group-hover:scale-[1.08] group-hover:-translate-y-1 logo-glass"
        style={{
          background:
            'linear-gradient(145deg, rgba(30,28,24,0.75), rgba(12,11,9,0.85))',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(212,175,55,0.35)',
          boxShadow:
            '0 10px 30px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.4)',
        }}
      >
        {/* Reflet supérieur */}
        <div
          className="absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.08), transparent)',
          }}
        />

        {/* Éclat traversant (shine sweep) */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 logo-shine"
            style={{
              background:
                'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)',
              backgroundSize: '250% 100%',
            }}
          />
        </div>

        {/* Image du logo */}
        <img
          src={src}
          alt={alt}
          className="relative w-10 h-10 md:w-12 md:h-12 object-contain transition-transform duration-500 group-hover:scale-110"
          style={{
            filter:
              'drop-shadow(0 2px 6px rgba(0,0,0,0.6)) drop-shadow(0 0 12px rgba(212,175,55,0.15))',
          }}
        />
      </div>

      {/* Libellé sous le logo */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-7 flex flex-col items-center pointer-events-none">
        <span
          className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-semibold transition-all duration-500 group-hover:tracking-[0.45em]"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#D4AF37',
            opacity: 0.75,
            textShadow: '0 0 12px rgba(212,175,55,0.4)',
          }}
        >
          {label}
        </span>
        <span
          className="mt-1 h-[1.5px] w-0 group-hover:w-10 transition-all duration-500 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
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

    @keyframes ken-burns {
      0% { transform: scale(1.06) translate(0, 0); }
      100% { transform: scale(1.16) translate(-1.5%, -1%); }
    }
    @keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pulse-glow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
    @keyframes aurora-drift {
      0%, 100% { transform: translate(-8%, -8%) rotate(0deg) scale(1); }
      33% { transform: translate(8%, 4%) rotate(120deg) scale(1.15); }
      66% { transform: translate(-4%, 8%) rotate(240deg) scale(1.05); }
    }
    @keyframes float-card {
      0%, 100% { transform: translateY(0px) rotate(-1.2deg); }
      50% { transform: translateY(-16px) rotate(1deg); }
    }
    @keyframes window-glow {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 0.95; }
    }
    @keyframes antenna-blink {
      0%, 100% { opacity: 0.3; }
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
    @keyframes btn-pulse {
      0%, 100% { box-shadow: 0 8px 30px rgba(212,175,55,0.35), 0 0 0 0 rgba(212,175,55,0.4); }
      50% { box-shadow: 0 8px 30px rgba(212,175,55,0.45), 0 0 0 12px rgba(212,175,55,0); }
    }
    @keyframes arrow-bounce {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(4px); }
    }
    /* NOUVELLES ANIMATIONS LOGOS */
    @keyframes logo-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes logo-halo-pulse {
      0%, 100% { opacity: 0.55; transform: scale(1); }
      50% { opacity: 0.95; transform: scale(1.08); }
    }
    @keyframes logo-shine-sweep {
      0% { background-position: 200% 0; }
      60%, 100% { background-position: -100% 0; }
    }
    @keyframes diamond-pulse {
      0%, 100% { opacity: 0.6; box-shadow: 0 0 8px rgba(212,175,55,0.5); transform: rotate(45deg) scale(1); }
      50% { opacity: 1; box-shadow: 0 0 20px rgba(212,175,55,0.9); transform: rotate(45deg) scale(1.25); }
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

    .animate-kenburns { animation: ken-burns 22s ease-in-out infinite alternate; }
    .animate-fade-up { animation: fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
    .animate-fade-in { animation: fade-in 0.6s ease forwards; opacity: 0; }
    .animate-pulse-glow { animation: pulse-glow 5s ease-in-out infinite; }
    .animate-aurora { animation: aurora-drift 25s ease-in-out infinite; }
    .animate-float-card { animation: float-card 7s ease-in-out infinite; }
    .animate-nav-slide { animation: nav-slide-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }

    .btn-discover { animation: btn-pulse 3s ease-in-out infinite; }
    .btn-discover:hover .arrow-icon { animation: arrow-bounce 0.8s ease-in-out infinite; }
    .btn-discover .shimmer-layer {
      background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%);
      background-size: 200% 100%;
    }
    .btn-discover:hover .shimmer-layer {
      animation: shimmer 1.5s linear infinite;
    }

    /* Logo animations */
    .logo-halo { animation: logo-halo-pulse 4s ease-in-out infinite; }
    .logo-shine { animation: logo-shine-sweep 5s ease-in-out infinite; }
    .diamond-pulse { animation: diamond-pulse 2.4s ease-in-out infinite; }
    .star-twinkle { animation: star-twinkle 2s ease-in-out infinite; }

    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-400 { animation-delay: 0.4s; }
    .delay-500 { animation-delay: 0.5s; }
  `;

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-white" style={{ background: '#0a0908' }}>
      <style>{customStyles}</style>

      <section id="accueil" className="relative min-h-screen w-full overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2500&auto=format&fit=crop"
            alt="Bureau d'entreprise moderne"
            className="w-full h-full object-cover animate-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/15 to-transparent" />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <ParticleField />
          <div
            className="absolute inset-0 opacity-30 animate-aurora"
            style={{
              background: 'conic-gradient(from 0deg at 50% 50%, rgba(180,186,177,0.2), transparent 30%, rgba(180,186,177,0.14) 60%, transparent 90%)',
              filter: 'blur(60px)',
            }}
          />
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#B4BAB1]/5 rounded-full blur-[150px] animate-pulse-glow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#B4BAB1]/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[20%] right-[15%] w-[26vw] h-[26vw] bg-[#E0AFA5]/[0.06] rounded-full blur-[130px] animate-pulse-glow" style={{ animationDelay: '3.5s' }} />
        </div>

        {/* ===== LOGOS CENTRÉS — DESIGN PREMIUM ===== */}
        <div className="absolute top-0 inset-x-0 z-30 h-40 md:h-44 bg-gradient-to-b from-black/60 via-black/15 to-transparent pointer-events-none" />
        <div className="absolute top-6 md:top-8 inset-x-0 z-30 flex justify-center items-center gap-10 md:gap-20 px-6">
          <PremiumLogo src={logoISPM} alt="ISPM" label="ISPM" delay={0.1} />

          {/* Séparateur central enrichi */}
          <div className="relative hidden md:flex items-center gap-3">
            {/* Étoiles scintillantes */}
            <span
              className="star-twinkle absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
              style={{ background: '#E0AFA5', animationDelay: '0.3s' }}
            />
            <span
              className="star-twinkle absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
              style={{ background: '#D4AF37', animationDelay: '1.1s' }}
            />

            {/* Ligne gauche */}
            <span
              className="w-10 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.7))' }}
            />
            {/* Losange central pulsant */}
            <span
              className="diamond-pulse w-1.5 h-1.5 rotate-45"
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #E0AFA5)',
              }}
            />
            {/* Ligne droite */}
            <span
              className="w-10 h-[1px]"
              style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.7), transparent)' }}
            />
          </div>

          <PremiumLogo src={logoAce} alt="ACE" label="ACE" delay={0.2} />
        </div>

        {/* Illustration flottante */}
        <div
          className="hidden md:block absolute z-20 animate-float-card"
          style={{ top: '14%', right: 'clamp(5rem, 10.5vw, 10rem)' }}
        >
          <div
            className="w-48 md:w-56 lg:w-64"
            style={{ filter: 'drop-shadow(0 30px 55px rgba(0,0,0,0.6))' }}
            role="img"
            aria-label="Illustration du bâtiment de l'entreprise"
          >
            <BuildingIllustration />
          </div>
        </div>

        {/* Texte hero + bouton */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-6 md:px-12 lg:px-20 pb-20 md:pb-24 lg:pb-28">
          <div className="max-w-2xl animate-fade-up delay-300">
            <svg viewBox="0 0 120 16" className="w-24 h-4 mb-4" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="flourishGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#E0AFA5" />
                </linearGradient>
              </defs>
              <line x1="0" y1="8" x2="45" y2="8" stroke="url(#flourishGrad)" strokeWidth="1" />
              <circle cx="60" cy="8" r="3" fill="none" stroke="url(#flourishGrad)" strokeWidth="1" />
              <line x1="75" y1="8" x2="120" y2="8" stroke="url(#flourishGrad)" strokeWidth="1" />
            </svg>
            <p className="text-[#D4AF37] text-xs md:text-sm mb-3 tracking-[0.3em] uppercase font-semibold">
              Excellence & Partenariat
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
            >
              L'Excellence au cœur de vos{" "}
              <span className="bg-gradient-to-r from-white via-[#E0AFA5] to-[#D4AF37] bg-clip-text text-transparent">
                Réussites
              </span>
            </h1>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-lg mb-8">
              L'union de l'éducation (ISPM) et du service d'élite (Ace Services) pour transformer votre vision en réalité
            </p>

            {/* BOUTON DÉCOUVRIR L'ENTREPRISE */}
            <a
              href="#apropos"
              className="btn-discover group relative inline-flex items-center gap-3 pl-7 pr-6 py-4 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #E0AFA5 100%)',
                boxShadow: '0 8px 30px rgba(212,175,55,0.35)',
              }}
            >
              <span className="shimmer-layer absolute inset-0 rounded-full pointer-events-none" />
              <span className="relative flex items-center justify-center w-6 h-6">
                <Sparkles size={16} style={{ color: '#1a1a1a' }} />
              </span>
              <span
                className="relative text-sm md:text-base font-bold tracking-[0.08em] text-[#1a1a1a]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Découvrir l'entreprise
              </span>
              <span className="relative flex items-center justify-center w-7 h-7 rounded-full transition-all duration-500 group-hover:bg-[#1a1a1a]/10">
                <ArrowRight
                  size={16}
                  className="arrow-icon transition-transform duration-300"
                  style={{ color: '#1a1a1a' }}
                />
              </span>
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.4)' }}
              />
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
                    background: 'rgba(15,14,12,0.85)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    boxShadow: isHovered
                      ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
                      : '0 4px 16px rgba(0,0,0,0.3)',
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateX(0) scale(1)' : 'translateX(12px) scale(0.92)',
                  }}
                >
                  <item.icon size={14} style={{ color: '#D4AF37' }} />
                  <span
                    className="text-[11px] tracking-[0.2em] uppercase font-semibold"
                    style={{ fontFamily: "'Playfair Display', serif", color: '#f5f0e8' }}
                  >
                    {item.label}
                  </span>
                  <ArrowRight
                    size={11}
                    className="transition-transform duration-300"
                    style={{
                      color: '#E0AFA5',
                      transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
                    }}
                  />
                </span>

                <span
                  className="relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-400 ease-out overflow-hidden"
                  style={{
                    background: isHovered
                      ? 'linear-gradient(135deg, rgba(212,175,55,0.95), rgba(224,175,165,0.9))'
                      : 'rgba(15,14,12,0.7)',
                    backdropFilter: 'blur(16px)',
                    border: isHovered
                      ? '1px solid rgba(255,255,255,0.3)'
                      : '1px solid rgba(212,175,55,0.2)',
                    boxShadow: isHovered
                      ? '0 0 30px rgba(212,175,55,0.35), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                      : '0 4px 16px rgba(0,0,0,0.3)',
                    transform: isHovered ? 'scale(1.08) rotate(-4deg)' : 'scale(1) rotate(0deg)',
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-2xl transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 70%)',
                      opacity: isHovered ? 1 : 0,
                    }}
                  />
                  <span
                    className="absolute inset-0 rounded-2xl transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
                      backgroundSize: '200% 200%',
                      opacity: isHovered ? 1 : 0,
                      animation: isHovered ? 'shimmer 2s linear infinite' : 'none',
                    }}
                  />
                  <item.icon
                    size={20}
                    className="relative transition-all duration-400"
                    style={{
                      color: isHovered ? '#1a1a1a' : '#D4AF37',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                  />
                </span>

                <span
                  className="absolute -right-1.5 w-1.5 h-1.5 rounded-full transition-all duration-400"
                  style={{
                    background: isHovered ? '#D4AF37' : 'rgba(212,175,55,0.3)',
                    boxShadow: isHovered ? '0 0 8px rgba(212,175,55,0.8)' : 'none',
                    transform: isHovered ? 'scale(1.5)' : 'scale(1)',
                  }}
                />
              </button>
            );
          })}

          <div className="absolute right-5 top-1/2 -translate-y-1/2 h-32 w-[2px] bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent pointer-events-none -z-10" />
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
                  background: 'rgba(15,14,12,0.85)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
                  animationDelay: `${i * 0.06}s`,
                }}
              >
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(224,175,165,0.15))',
                    border: '1px solid rgba(212,175,55,0.2)',
                  }}
                >
                  <item.icon size={14} style={{ color: '#D4AF37' }} />
                </span>
                <span
                  className="text-[12px] tracking-[0.12em] text-white/90"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
                >
                  {item.label}
                </span>
                <ArrowRight size={12} className="text-[#E0AFA5] ml-1" />
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setMobileNavOpen((o) => !o)}
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-400 overflow-hidden group"
          style={{
            background: mobileNavOpen
              ? 'linear-gradient(135deg, #1a1a1a, #2a2520)'
              : 'linear-gradient(135deg, #D4AF37, #E0AFA5)',
            boxShadow: mobileNavOpen
              ? '0 4px 20px rgba(0,0,0,0.5)'
              : '0 6px 28px rgba(212,175,55,0.4)',
            transform: mobileNavOpen ? 'rotate(90deg) scale(0.95)' : 'rotate(0deg) scale(1)',
          }}
        >
          <span
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
              backgroundSize: '200% 200%',
              animation: 'shimmer 2s linear infinite',
            }}
          />
          {mobileNavOpen ? (
            <X size={20} style={{ color: '#D4AF37' }} className="relative" />
          ) : (
            <Menu size={20} style={{ color: '#1a1a1a' }} className="relative" />
          )}
        </button>
      </div>

      {/* MODAL */}
      {activePage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setActivePage(null)}>
          <div className="absolute inset-0 backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.6)' }} />
          <div
            className="relative w-full max-w-md rounded-3xl p-8 text-center animate-fade-up overflow-hidden"
            style={{
              background: 'rgba(30,30,30,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(180,186,177,0.25)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #B4BAB1, transparent)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(180,186,177,0.4), transparent)' }} />

            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'rgba(180,186,177,0.12)',
                border: '1px solid rgba(180,186,177,0.3)',
                boxShadow: '0 0 30px rgba(180,186,177,0.18)',
              }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #B4BAB1, #8B9285)', boxShadow: '0 4px 15px rgba(180,186,177,0.4)' }}>
                <span className="text-2xl">🚧</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">
              Page "{activePage}"
            </h2>

            <p className="text-sm text-gray-400 mb-6">
              Cette page n'est pas encore disponible.<br />
              Elle sera bientôt accessible.
            </p>

            <button
              onClick={() => setActivePage(null)}
              className="px-6 py-3 rounded-xl text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #B4BAB1, #8B9285)',
                color: '#1a1a1a',
                boxShadow: '0 4px 20px rgba(180,186,177,0.35)',
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