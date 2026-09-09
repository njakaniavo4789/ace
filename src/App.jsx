import React, { useEffect, useRef, useState } from 'react';
import { Home, Briefcase, Building2, Phone, ArrowRight, X } from 'lucide-react';

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
        ctx.fillStyle = 'rgba(212, 175, 55, 0.55)';
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
            ctx.strokeStyle = `rgba(212, 175, 55, ${0.12 * (1 - dist / 130)})`;
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

/* NAV ITEMS */
const NAV_ITEMS = [
  { icon: Building2, label: 'À propos', href: '#apropos' },
  { icon: Briefcase, label: 'Services', href: '#services' },
  { icon: Home, label: 'Accueil', href: '#accueil' },
  { icon: Phone, label: 'Contact', href: '#contact' },
];

const HomePage = () => {
  const [activePage, setActivePage] = useState(null);

  const customStyles = `
    @keyframes float-slow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
    @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes fade-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse-glow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
    @keyframes border-glow { 0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); } 50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.6); } }
    @keyframes aurora-drift {
      0%, 100% { transform: translate(-8%, -8%) rotate(0deg) scale(1); }
      33% { transform: translate(8%, 4%) rotate(120deg) scale(1.15); }
      66% { transform: translate(-4%, 8%) rotate(240deg) scale(1.05); }
    }
    @keyframes grid-pan {
      from { background-position: 0 0; }
      to { background-position: 40px 40px; }
    }

    .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
    .animate-spin-slower { animation: spin-slow 15s linear infinite; }
    .animate-fade-up { animation: fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
    .animate-pulse-glow { animation: pulse-glow 5s ease-in-out infinite; }
    .animate-border-glow { animation: border-glow 3s ease-in-out infinite; }
    .animate-aurora { animation: aurora-drift 25s ease-in-out infinite; }
    .animate-grid-pan { animation: grid-pan 8s linear infinite; }

    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-400 { animation-delay: 0.4s; }
    .delay-500 { animation-delay: 0.5s; }
    .delay-600 { animation-delay: 0.6s; }
  `;

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-white" style={{ background:'#dddddd' }}>
      <style>{customStyles}</style>

      {/* FOND ANIMÉ */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ParticleField />

        {/* NOUVELLE COUCHE AURORA — halo doré conique qui tourne/dérive */}
        <div
          className="absolute inset-0 -z-10 opacity-40 animate-aurora"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, rgba(212,175,55,0.18), transparent 30%, rgba(212,175,55,0.12) 60%, transparent 90%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#D4AF37]/5 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#D4AF37]/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

        {/* Grille désormais animée (dérive douce en boucle) */}
        <div className="absolute inset-0 opacity-[0.02] animate-grid-pan" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-transparent to-gray-900/50" />
      </div>

      {/* CONTENU */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex flex-col min-h-screen">

        <main className="flex-1 flex items-center justify-center relative">
          <div className="relative w-full max-w-5xl group animate-float-slow">

            {/* Cercles décoratifs */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] h-[80%] rounded-full border border-[#D4AF37]/10 animate-spin-slower" />
              <div className="absolute w-[90%] h-[90%] rounded-full border border-white/5 animate-spin-slower" style={{ animationDirection: 'reverse', animationDuration: '20s' }} />
            </div>

            {/* IMAGE HERO */}
            <div className="animate-fade-up bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-[2rem] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.5)] relative overflow-hidden border border-gray-700/50 group-hover:border-[#D4AF37]/30 transition-all duration-500">

              <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-[2rem] border-2 border-[#D4AF37]/20 animate-border-glow" />
              </div>

              <div className="relative overflow-hidden rounded-[1.5rem] h-[500px] w-full">
                <img
                  src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2500&auto=format&fit=crop"
                  alt="Bureau d'entreprise moderne"
                  className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent pointer-events-none" />
              </div>

              {/* LOGOS en haut — fondu avec l'image */}
              <div className="absolute top-6 inset-x-0 z-30 flex justify-between items-center px-6 md:px-10 pointer-events-none">
                <div className="pointer-events-auto rounded-2xl p-2.5 transition-all duration-500 hover:scale-105" style={{ background:'rgba(0,0,0,0.3)', backdropFilter:'blur(12px)', border:'1px solid rgba(212,175,55,0.2)', boxShadow:'0 4px 20px rgba(0,0,0,0.25)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden" style={{ background:'rgba(0,0,0,0.4)', border:'1px solid rgba(212,175,55,0.15)' }}>
                    <img src={logoISPM} alt="ISPM" className="w-full h-full object-contain p-1" />
                  </div>
                </div>
                <div className="pointer-events-auto rounded-2xl p-2.5 transition-all duration-500 hover:scale-105" style={{ background:'rgba(0,0,0,0.3)', backdropFilter:'blur(12px)', border:'1px solid rgba(212,175,55,0.2)', boxShadow:'0 4px 20px rgba(0,0,0,0.25)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden" style={{ background:'rgba(0,0,0,0.4)', border:'1px solid rgba(212,175,55,0.15)' }}>
                    <img src={logoAce} alt="ACE" className="w-full h-full object-contain p-1" />
                  </div>
                </div>
              </div>

              {/* TEXT HERO à gauche */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-8 md:p-12 lg:p-16">
                <div className="max-w-2xl">
                  <div className="mb-6 animate-fade-up delay-300 mt-20 md:mt-24">
                    <p className="text-[#D4AF37] text-xs md:text-sm mb-3 tracking-[0.3em] uppercase font-semibold">
                      Excellence & Partenariat
                    </p>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                      L'Excellence au cœur de vos{" "}
                      <span className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] bg-clip-text text-transparent">
                        Réussites
                      </span>
                    </h1>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                      L'union de l'éducation (ISPM) et du service d'élite (Ace Services) pour transformer votre vision en réalité
                    </p>
                  </div>
                </div>
              </div>

              {/* BOUTONS À DROITE — fondu avec l'image */}
              <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
                {NAV_ITEMS.map((item, i) => (
                  <button
                    key={item.label}
                    onClick={() => setActivePage(item.label)}
                    className="animate-fade-up group/btn flex items-center gap-3 pl-3 pr-5 py-2.5 rounded-full transition-all duration-500 hover:scale-105 cursor-pointer"
                    style={{
                      background:'rgba(0,0,0,0.35)',
                      backdropFilter:'blur(12px)',
                      border:'1px solid rgba(212,175,55,0.2)',
                      boxShadow:'0 4px 20px rgba(0,0,0,0.25)',
                      animationDelay:`${0.1 + i * 0.1}s`,
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 group-hover/btn:scale-110 group-hover/btn:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      style={{
                        background:'linear-gradient(135deg, rgba(212,175,55,0.3) 0%, rgba(212,175,55,0.1) 100%)',
                        border:'1px solid rgba(212,175,55,0.35)',
                      }}
                    >
                      <item.icon size={14} style={{ color:'#D4AF37' }} strokeWidth={2} />
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-white/90 group-hover/btn:text-[#D4AF37] transition-colors duration-300 drop-shadow-lg">
                      {item.label}
                    </span>
                    <ArrowRight size={11} className="text-[#D4AF37] opacity-0 group-hover/btn:opacity-100 transition-all duration-300 group-hover/btn:translate-x-1" />
                  </button>
                ))}
              </div>

            </div>
          </div>
        </main>

        {/* Menu mobile — fondu avec l'image */}
        <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex gap-2 p-2 rounded-full" style={{ background:'rgba(0,0,0,0.4)', backdropFilter:'blur(16px)', border:'1px solid rgba(212,175,55,0.15)' }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => setActivePage(item.label)}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                background:'rgba(212,175,55,0.15)',
                border:'1px solid rgba(212,175,55,0.25)',
              }}
            >
              <item.icon size={15} style={{ color:'#D4AF37' }} />
            </button>
          ))}
        </div>

      </div>

      {/* MODAL — PAS ENCORE DISPONIBLE */}
      {activePage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setActivePage(null)}>
          <div className="absolute inset-0 backdrop-blur-md" style={{ background:'rgba(0,0,0,0.6)' }} />
          <div
            className="relative w-full max-w-md rounded-3xl p-8 text-center animate-fade-up overflow-hidden"
            style={{
              background:'rgba(30,30,30,0.9)',
              backdropFilter:'blur(20px)',
              border:'1px solid rgba(212,175,55,0.2)',
              boxShadow:'0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Shimmer decoratif */}
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background:'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background:'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)' }} />

            {/* Icone */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background:'rgba(212,175,55,0.1)',
                border:'1px solid rgba(212,175,55,0.25)',
                boxShadow:'0 0 30px rgba(212,175,55,0.15)',
              }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background:'linear-gradient(135deg, #D4AF37, #C9A233)', boxShadow:'0 4px 15px rgba(212,175,55,0.4)' }}>
                <span className="text-2xl">🚧</span>
              </div>
            </div>

            {/* Titre */}
            <h2 className="text-xl font-bold text-white mb-2">
              Page "{activePage}"
            </h2>

            {/* Message */}
            <p className="text-sm text-gray-400 mb-6">
              Cette page n'est pas encore disponible.<br />
              Elle sera bientôt accessible.
            </p>

            {/* Bouton fermer */}
            <button
              onClick={() => setActivePage(null)}
              className="px-6 py-3 rounded-xl text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                background:'linear-gradient(135deg, #D4AF37, #C9A233)',
                color:'#1a1a1a',
                boxShadow:'0 4px 20px rgba(212,175,55,0.3)',
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