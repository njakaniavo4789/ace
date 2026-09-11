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
    <div className="min-h-screen w-full bg-white text-gray-800" style={{ fontFamily: "Manrope, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Syne:wght@500;600;700;800&family=Instrument+Serif:ital@1&display=swap');
        .font-display { font-family: 'Syne', sans-serif; letter-spacing: -0.01em; }
        .font-logo { font-family: 'Instrument Serif', serif; font-style: italic; }
      `}</style>

      <div className="px-6 md:px-12 pt-8">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors cursor-pointer group">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 group-hover:border-black transition-colors">
            <ArrowLeft size={16} />
          </span>
          Retour a l'accueil
        </button>
      </div>

      <section id="accueil-about" className="relative overflow-hidden px-6 md:px-12 pt-16 pb-24">
        <div className="pointer-events-none absolute -top-24 left-1/4 h-[420px] w-[420px] rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #c9a961 0%, transparent 70%)" }}></div>

        <h1 className="relative font-display font-extrabold uppercase leading-[0.82] text-[22vw] md:text-[9rem] -ml-1 select-none text-gray-900">
          A propos
        </h1>

        <div className="relative mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <p className="max-w-xl text-lg md:text-xl leading-snug text-gray-600">
            Nous guidons vos idees vers une entreprise concrete, avec un accompagnement pas a pas jusqu a son lancement.
          </p>
          <a href="#contact-about" className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-xs tracking-[0.15em] text-gray-700 hover:bg-black hover:text-white hover:border-black transition-colors self-start md:self-auto">
            PRENDRE CONTACT <ArrowUpRight size={14} />
          </a>
        </div>
      </section>

      <section id="apropos-about" className="border-t border-gray-200">
        {SECTIONS.map((s, i) => {
          const isOpen = open === i;
          return (
            <div key={s.n} className="border-b border-gray-200">
              <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full grid grid-cols-[auto_1fr_auto] items-center gap-6 px-6 md:px-12 py-8 text-left cursor-pointer">
                <span className="font-display text-[20vw] md:text-[7rem] leading-none text-gray-200 select-none">
                  {s.n}
                </span>
                <span className="font-display text-xl md:text-2xl text-gray-900">{s.title}</span>
                <span className="flex-shrink-0 rounded-full border border-gray-300 p-2 text-gray-700">
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>

              {isOpen && (
                <div className="px-6 md:px-12 pb-10 md:pl-[13rem]">
                  {s.body && s.body.map((p, idx) => (
                    <p key={idx} className="max-w-xl text-sm text-gray-500 leading-relaxed mb-4">
                      {p}
                    </p>
                  ))}

                  {s.values && (
                    <div id="valeurs-about" className="grid sm:grid-cols-2 gap-6 max-w-2xl">
                      {s.values.map((v) => (
                        <div key={v.label} className="border-l border-gray-200 pl-4">
                          <p className="font-display text-base mb-1 text-[#c9a961]">{v.label}</p>
                          <p className="text-sm text-gray-500 leading-relaxed">{v.text}</p>
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
        <div className="rounded-2xl min-h-[280px] w-full" style={{ background: "linear-gradient(135deg, #faf7f2 0%, #f3ede3 40%, #ffffff 100%)", border: "1px solid rgba(201,169,97,0.25)" }}></div>
        <div className="flex flex-col justify-center">
          <p className="font-display text-2xl md:text-3xl leading-snug mb-6 text-gray-900">
            Rendre la creation d entreprise plus simple, accessible et securisee pour tous.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed max-w-md">
            Notre expertise et notre ecoute se mettent au service de vos idees, pour vous guider a chaque etape de l administratif a l orientation financiere.
          </p>
        </div>
      </section>
    </div>
  );
}