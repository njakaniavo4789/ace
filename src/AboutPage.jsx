import React, { useState } from "react";
import { Plus, Minus, ArrowUpRight, ArrowLeft } from "lucide-react";

const SECTIONS = [
  {
    n: "01",
    title: "A propos de nous",
    body: [
      "ACE Services est un service specialise dans l accompagnement a la creation d entreprise. Nous aidons les futurs entrepreneurs et porteurs de projets a transformer leurs idees en projets concrets et realisables.",
      "Nous proposons un accompagnement personnalise tout au long des differentes etapes de la creation d entreprise : demarches administratives, organisation du projet et orientation financiere.",
      "Notre ambition est de rendre la creation d entreprise plus simple, accessible et securisee pour tous."
    ]
  },
  {
    n: "02",
    title: "Qui sommes-nous ?",
    body: [
      "ACE Services est une entreprise specialisee dans l accompagnement a la creation d entreprise et le conseil aux porteurs de projets a Madagascar.",
      "Nous mettons notre expertise et notre ecoute au service de vos idees, pour vous guider a chaque etape de votre projet."
    ]
  },
  {
    n: "03",
    title: "Notre mission",
    body: [
      "Accompagner et conseiller les entrepreneurs dans la creation et la gestion de leur entreprise."
    ]
  },
  {
    n: "04",
    title: "Nos valeurs",
    values: [
      { label: "Ecoute", text: "Comprendre vos besoins pour mieux vous conseiller." },
      { label: "Professionnalisme", text: "Des solutions fiables et adaptees a votre projet." },
      { label: "Confiance", text: "Une relation durable et transparente." },
      { label: "Engagement", text: "Votre reussite est notre moteur." }
    ]
  }
];

export default function AboutPage({ onBack }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-[#f2efe9]" style={{ fontFamily: "Manrope, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Syne:wght@500;600;700;800&family=Instrument+Serif:ital@1&display=swap');
        .font-display { font-family: 'Syne', sans-serif; letter-spacing: -0.01em; }
        .font-logo { font-family: 'Instrument Serif', serif; font-style: italic; }
      `}</style>

      <div className="px-6 md:px-12 pt-8">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors cursor-pointer group">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 group-hover:border-white/50 transition-colors">
            <ArrowLeft size={16} />
          </span>
          Retour a l accueil
        </button>
      </div>

      <section id="accueil-about" className="relative overflow-hidden px-6 md:px-12 pt-16 pb-24">
        <div className="pointer-events-none absolute -top-24 left-1/4 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, #c1440e 0%, transparent 70%)" }}></div>

        <p className="relative text-xs tracking-[0.3em] text-[#d9a441] mb-4 uppercase">
          Main / <span className="italic">A propos</span>
        </p>

        <h1 className="relative font-display font-extrabold uppercase leading-[0.82] text-[22vw] md:text-[9rem] -ml-1 select-none">
          A propos
        </h1>

        <div className="relative mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <p className="max-w-xl text-lg md:text-xl leading-snug text-white/85">
            Nous guidons vos idees vers une entreprise concrete, avec un accompagnement pas a pas jusqu a son lancement.
          </p>
          <a href="#contact-about" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-xs tracking-[0.15em] hover:bg-white hover:text-black transition-colors self-start md:self-auto">
            PRENDRE CONTACT <ArrowUpRight size={14} />
          </a>
        </div>
      </section>

      <section id="apropos-about" className="border-t border-white/10">
        {SECTIONS.map((s, i) => {
          const isOpen = open === i;
          return (
            <div key={s.n} className="border-b border-white/10">
              <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full grid grid-cols-[auto_1fr_auto] items-center gap-6 px-6 md:px-12 py-8 text-left cursor-pointer">
                <span className="font-display text-[20vw] md:text-[7rem] leading-none text-white/10 select-none">
                  {s.n}
                </span>
                <span className="font-display text-xl md:text-2xl">{s.title}</span>
                <span className="flex-shrink-0 rounded-full border border-white/20 p-2">
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>

              {isOpen && (
                <div className="px-6 md:px-12 pb-10 md:pl-[13rem]">
                  {s.body && s.body.map((p, idx) => (
                    <p key={idx} className="max-w-xl text-sm text-white/60 leading-relaxed mb-4">
                      {p}
                    </p>
                  ))}

                  {s.values && (
                    <div id="valeurs-about" className="grid sm:grid-cols-2 gap-6 max-w-2xl">
                      {s.values.map((v) => (
                        <div key={v.label} className="border-l border-white/15 pl-4">
                          <p className="font-display text-base mb-1 text-[#d9a441]">{v.label}</p>
                          <p className="text-sm text-white/60 leading-relaxed">{v.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>

      <section className="grid md:grid-cols-2 gap-8 px-6 md:px-12 py-20">
        <div className="rounded-2xl min-h-[280px] w-full" style={{ background: "linear-gradient(135deg, #1a1310 0%, #2a1a10 40%, #0a0a0c 100%)", border: "1px solid rgba(255,255,255,0.08)" }}></div>
        <div className="flex flex-col justify-center">
          <p className="font-display text-2xl md:text-3xl leading-snug mb-6">
            Rendre la creation d entreprise plus simple, accessible et securisee pour tous.
          </p>
          <p className="text-sm text-white/60 leading-relaxed max-w-md">
            Notre expertise et notre ecoute se mettent au service de vos idees, pour vous guider a chaque etape de l administratif a l orientation financiere.
          </p>
        </div>
      </section>

      <section id="contact-about" className="relative overflow-hidden px-6 md:px-12 py-28 text-center border-t border-white/10">
        <div className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 h-[420px] w-[600px] opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, #c1440e 0%, transparent 70%)" }}></div>
        <a href="mailto:contact@aceservices.mg" className="relative inline-flex items-center gap-4 font-display text-[12vw] md:text-6xl hover:text-[#d9a441] transition-colors">
          CONTACTEZ-NOUS <ArrowUpRight size={44} />
        </a>
      </section>
    </div>
  );
}