import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Lightbulb, Target, BarChart3, Sparkles, ArrowLeft, Building2 } from 'lucide-react';

const steps = [
  {
    id: "01",
    period: "Service 1",
    title: "Étude de Faisabilité",
    subtitle: "Vérifiez que votre projet est réalisable",
    description: "Évaluez les conditions nécessaires à la réalisation de votre projet.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop",
    icon: <Lightbulb className="w-8 h-8" />,
    color: "bg-[#F3F4F6]",
    accentColor: "text-gray-800",
    etapes: [
      { num: "01", titre: "Échange initial", desc: "Nous discutons avec vous pour comprendre votre idée, vos objectifs et les caractéristiques de votre projet." },
      { num: "02", titre: "Collecte des informations", desc: "Nous réunissons les informations nécessaires sur votre secteur, votre environnement et les ressources nécessaires." },
      { num: "03", titre: "Analyse", desc: "Nous évaluons le projet sous différents angles : économique, technique, commercial et financier." },
      { num: "04", titre: "Restitution", desc: "Nous vous présentons les résultats et les principaux éléments à prendre en considération avant de vous lancer." }
    ]
  },
  {
    id: "02",
    period: "Service 2",
    title: "Étude Marketing",
    subtitle: "Comprenez votre marché avant de vendre",
    description: "Identifiez votre clientèle cible, ses besoins et analysez la concurrence.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop",
    icon: <Target className="w-8 h-8" />,
    color: "bg-[#c9a961]",
    accentColor: "text-white",
    etapes: [
      { num: "01", titre: "Définition de la cible", desc: "Nous identifions les consommateurs auxquels votre produit ou service s'adresse." },
      { num: "02", titre: "Enquête de terrain", desc: "Nous préparons les questionnaires et recueillons les informations auprès de la clientèle ciblée." },
      { num: "03", titre: "Analyse du marché", desc: "Nous analysons la demande, les comportements des consommateurs et les offres déjà présentes." },
      { num: "04", titre: "Analyse de la concurrence", desc: "Nous étudions les concurrents, leurs prix, leurs avantages et leurs limites." },
      { num: "05", titre: "Positionnement", desc: "Nous vous aidons à définir une offre et un prix cohérents avec votre marché." }
    ]
  },
  {
    id: "03",
    period: "Service 3",
    title: "Étude Financière",
    subtitle: "Transformez votre projet en chiffres",
    description: "Prévisions chiffrées pour prendre des décisions financières éclairées.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop",
    icon: <BarChart3 className="w-8 h-8" />,
    color: "bg-[#2a2a2a]",
    accentColor: "text-white",
    etapes: [
      { num: "01", titre: "Identification des besoins", desc: "Nous recensons les dépenses nécessaires à la création et au lancement de votre activité." },
      { num: "02", titre: "Évaluation financière", desc: "Nous estimons les investissements, les charges et les ressources nécessaires." },
      { num: "03", titre: "Construction des prévisions", desc: "Nous établissons les principaux documents financiers prévisionnels de votre projet." },
      { num: "04", titre: "Analyse de la rentabilité", desc: "Nous déterminons notamment le seuil de rentabilité et les conditions nécessaires pour atteindre l'équilibre." },
      { num: "05", titre: "Présentation des résultats", desc: "Nous vous présentons les résultats afin de vous aider à évaluer la viabilité financière de votre projet." }
    ]
  },
  {
    id: "04",
    period: "Service 4",
    title: "Formalisation de l'Entreprise",
    subtitle: "Donnez une existence officielle à votre projet",
    description: "Accompagnement dans les démarches de création officielle de votre entreprise.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2670&auto=format&fit=crop",
    icon: <Building2 className="w-8 h-8" />,
    color: "bg-[#F3F4F6]",
    accentColor: "text-gray-800",
    etapes: [
      { num: "01", titre: "Analyse de votre projet", desc: "Nous prenons en compte votre activité, le nombre d'associés, le capital disponible et vos objectifs." },
      { num: "02", titre: "Orientation juridique", desc: "Nous vous aidons à comprendre les différentes formes juridiques pouvant correspondre à votre projet." },
      { num: "03", titre: "Préparation du dossier", desc: "Nous vous aidons à identifier et organiser les documents nécessaires." },
      { num: "04", titre: "Accompagnement administratif", desc: "Nous vous orientons vers les organismes compétents et vous aidons à comprendre les principales démarches." },
      { num: "05", titre: "Formalisation", desc: "Pour les sociétés, nous vous accompagnons dans les démarches liées au Guichet Unique de l'EDBM." }
    ]
  }
];

const AnimatedText = ({ text, className }) => {
  const words = text.split(" ");
  return (
    <motion.h1
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08, delayChildren: 0.2 }
        }
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-4"
          variants={{
            hidden: { opacity: 0, y: 50, rotateX: -90 },
            visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
};

const MagneticButton = ({ children, className, onClick }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

export default function ProcessPage({ onBack, onGoToService, initialStep = 0 }) {
  const [activeStep, setActiveStep] = useState(initialStep);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const headerRef = useRef(null);
  const { scrollYProgress: headerScroll } = useScroll({ target: headerRef, offset: ["start start", "end start"] });
  const yHeader = useTransform(headerScroll, [0, 1], ["0%", "50%"]);
  const opacityHeader = useTransform(headerScroll, [0, 0.8], [1, 0]);

  const currentService = steps[activeStep];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-[#c9a961] selection:text-white overflow-x-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#c9a961] origin-left z-[100]"
        style={{ scaleX }}
      />

      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-30">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Retour</span>
          </button>
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase">Ace Services.</span>
        </motion.div>
      </nav>

      <motion.header
        ref={headerRef}
        style={{ y: yHeader, opacity: opacityHeader }}
        className="max-w-7xl mx-auto px-6 pt-16 pb-8 md:pt-20 md:pb-10 relative"
      >

        <div className="relative">
          <AnimatedText
            text="Nos services, étape par étape."
            className="text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.9] tracking-tight max-w-5xl"
          />
        </div>
      </motion.header>

      {/* Sélecteur de service - décalé vers le bas */}
      <section className="max-w-[1400px] mx-auto px-4 pt-4 md:pt-8 pb-12 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-2 md:gap-3"
        >
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(index)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 border-2 cursor-pointer
                ${activeStep === index
                  ? 'bg-[#c9a961] text-white border-[#c9a961] shadow-lg shadow-[#c9a961]/30'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#d4b878] hover:text-[#c9a961]'
                }`}
            >
              {step.id} — {step.title}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Détail du service actif */}
      <section className="max-w-[1400px] mx-auto px-4 pb-24 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Carte service */}
            <div className="lg:col-span-5">
              <div className={`relative overflow-hidden rounded-2xl md:rounded-3xl ${currentService.color} ${currentService.accentColor} p-8 md:p-10 h-full`}>
                <div className="flex justify-between items-start mb-8">
                  <span className="text-sm font-mono font-bold opacity-70">[{currentService.id}]</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="opacity-80"
                  >
                    {currentService.icon}
                  </motion.div>
                </div>

                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-3">{currentService.period}</p>
                   <h2 className="text-xl md:text-2xl font-black uppercase leading-tight mb-4">
                    {currentService.title}
                  </h2>
                  <p className="text-base md:text-lg opacity-80 font-medium leading-relaxed">
                    {currentService.description}
                  </p>
                </div>

                <div className="w-full h-40 md:h-56 rounded-xl overflow-hidden shadow-lg relative group">
                  <img
                    src={currentService.image}
                    alt={currentService.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <MagneticButton
                  className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:gap-4 transition-all group cursor-pointer"
                  onClick={() => onGoToService(activeStep)}
                >
                  Découvrir ce service
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </MagneticButton>
              </div>
            </div>

            {/* Étapes "Comment ça marche" */}
            <div className="lg:col-span-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-[2px] w-12 bg-[#c9a961]" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Comment ça marche ?</h3>
              </div>

              <div className="space-y-3">
                {currentService.etapes.map((etape, i) => (
                  <motion.div
                    key={etape.num}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative bg-white rounded-2xl p-5 md:p-6 border border-gray-100 hover:border-[#e0d5c0] hover:shadow-lg hover:shadow-[#c9a961]/5 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 md:gap-6">
                      <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gray-50 group-hover:bg-[#c9a961] flex items-center justify-center transition-colors duration-300">
                        <span className="text-sm md:text-base font-black text-gray-900 group-hover:text-white transition-colors duration-300">
                          {etape.num}
                        </span>
                      </div>
                      <div className="flex-1 pt-0.5">
                        <h4 className="text-base md:text-lg font-black uppercase tracking-tight mb-1 group-hover:text-[#c9a961] transition-colors duration-300">
                          {etape.titre}
                        </h4>
                        <p className="text-base text-gray-500 leading-relaxed">
                          {etape.desc}
                        </p>
                      </div>
                      <ArrowRight className="flex-shrink-0 w-5 h-5 text-gray-300 group-hover:text-[#c9a961] group-hover:translate-x-1 transition-all duration-300 mt-1" />
                    </div>

                    {i < currentService.etapes.length - 1 && (
                      <div className="absolute left-[2.1rem] md:left-[2.6rem] top-full w-[2px] h-3 bg-gray-200" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}