import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, ArrowLeft, Lightbulb, Target, BarChart3, Building2, Check, X, Sparkles } from 'lucide-react';

const services = [
  {
    id: "01",
    title: "Étude de Faisabilité",
    subtitle: "Vérifiez que votre projet est réalisable",
    description: "Une bonne idée doit être étudiée avant de devenir une entreprise. Nous évaluons les conditions nécessaires à la réalisation de votre projet et identifions les opportunités, contraintes et risques à prendre en compte.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop",
    icon: <Lightbulb className="w-6 h-6" />,
    tags: ["Analyse économique", "Étude de secteur", "Risques", "Faisabilité globale"],
    price: "À partir de 250 000 Ar",
    duration: "5 à 10 jours",
    models: [
      { name: "Essentiel", price: "250 000 Ar", features: ["Analyse économique", "Étude du secteur", "Rapport synthétique"], highlighted: false },
      { name: "Standard", price: "450 000 Ar", features: ["Tout Essentiel", "Analyse des risques", "Recommandations"], highlighted: true },
      { name: "Premium", price: "750 000 Ar", features: ["Tout Standard", "Scénarios alternatifs", "Accompagnement 1 mois"], highlighted: false }
    ]
  },
  {
    id: "02",
    title: "Étude Marketing",
    subtitle: "Comprenez votre marché avant de vendre",
    description: "Connaître ses futurs clients est essentiel pour construire une offre adaptée. Nous vous aidons à comprendre votre clientèle cible, ses besoins, ses habitudes et ses attentes, tout en analysant la concurrence.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop",
    icon: <Target className="w-6 h-6" />,
    tags: ["Clientèle cible", "Sondages", "Concurrence", "Positionnement"],
    price: "À partir de 300 000 Ar",
    duration: "7 à 14 jours",
    models: [
      { name: "Essentiel", price: "300 000 Ar", features: ["Définition de la cible", "Analyse de la demande", "Rapport de marché"], highlighted: false },
      { name: "Standard", price: "550 000 Ar", features: ["Tout Essentiel", "Enquête de terrain", "Analyse concurrentielle"], highlighted: true },
      { name: "Premium", price: "900 000 Ar", features: ["Tout Standard", "Politique tarifaire", "Stratégie de positionnement"], highlighted: false }
    ]
  },
  {
    id: "03",
    title: "Étude Financière",
    subtitle: "Transformez votre projet en chiffres",
    description: "Combien faut-il investir ? De combien avez-vous besoin pour démarrer ? Votre activité peut-elle être rentable ? Nous transformons votre projet en prévisions chiffrées pour des décisions éclairées.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop",
    icon: <BarChart3 className="w-6 h-6" />,
    tags: ["Investissement", "Plan de financement", "Trésorerie", "Rentabilité"],
    price: "À partir de 400 000 Ar",
    duration: "10 à 15 jours",
    models: [
      { name: "Essentiel", price: "400 000 Ar", features: ["Besoins financiers", "Plan de financement", "Compte de résultat"], highlighted: false },
      { name: "Standard", price: "700 000 Ar", features: ["Tout Essentiel", "Plan de trésorerie", "Bilan prévisionnel"], highlighted: true },
      { name: "Premium", price: "1 200 000 Ar", features: ["Tout Standard", "Seuil de rentabilité", "Tableau d'amortissement"], highlighted: false }
    ]
  },
  {
    id: "04",
    title: "Formalisation de l'Entreprise",
    subtitle: "Donnez une existence officielle à votre projet",
    description: "Une fois votre projet validé, nous vous accompagnons dans la préparation de sa création officielle. Nous vous aidons à comprendre les démarches et à préparer les éléments nécessaires.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2670&auto=format&fit=crop",
    icon: <Building2 className="w-6 h-6" />,
    tags: ["Forme juridique", "Documents", "EDBM", "Démarches"],
    price: "À partir de 350 000 Ar",
    duration: "5 à 12 jours",
    models: [
      { name: "Essentiel", price: "350 000 Ar", features: ["Orientation juridique", "Liste des documents", "Guide des démarches"], highlighted: false },
      { name: "Standard", price: "600 000 Ar", features: ["Tout Essentiel", "Préparation du dossier", "Accompagnement administratif"], highlighted: true },
      { name: "Premium", price: "1 000 000 Ar", features: ["Tout Standard", "Démarches EDBM", "Suivi post-création"], highlighted: false }
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
        visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-3"
          variants={{
            hidden: { opacity: 0, y: 60, rotateX: -90 },
            visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default function ServicesPage({ onBack }) {
  const [activeService, setActiveService] = useState(0);
  const [selectedModel, setSelectedModel] = useState(1);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const headerRef = useRef(null);
  const { scrollYProgress: headerScroll } = useScroll({ target: headerRef, offset: ["start start", "end start"] });
  const yHeader = useTransform(headerScroll, [0, 1], ["0%", "30%"]);
  const opacityHeader = useTransform(headerScroll, [0, 0.8], [1, 0]);

  const service = services[activeService];

  useEffect(() => {
    setSelectedModel(1);
  }, [activeService]);

  return (
    <div className="min-h-screen bg-[#F7F6F3] font-sans text-gray-900 selection:bg-red-500 selection:text-white overflow-x-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-red-600 origin-left z-[100]"
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

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500"
        >
          <a href="#" onClick={onBack} className="hover:text-black transition-colors">Accueil</a>
          <a href="#" className="text-black relative">
            Services
            <motion.span layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-black" />
          </a>
          <a href="#" className="hover:text-black transition-colors">À propos</a>
          <a href="#" className="hover:text-black transition-colors">Contact</a>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          Prendre RDV
        </motion.button>
      </nav>

      <motion.header
        ref={headerRef}
        style={{ y: yHeader, opacity: opacityHeader }}
        className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-300 bg-white/50 backdrop-blur text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600 mb-8"
        >
          <Sparkles className="w-3 h-3 text-red-600" />
          Nos Services
        </motion.div>

        <AnimatedText
          text="Services que nous offrons."
          className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tight max-w-5xl mx-auto"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="text-sm md:text-base text-gray-500 leading-relaxed max-w-2xl mx-auto mt-8"
        >
          De l'idée à la création, nous vous accompagnons à chaque étape. Évaluez votre projet, comprenez votre marché, préparez son financement et accomplissez les démarches de création.
        </motion.p>
      </motion.header>

      <section className="max-w-7xl mx-auto px-6 pb-12 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3"
        >
          {services.map((s, index) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveService(index)}
              className={`px-5 py-2.5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 border cursor-pointer
                ${activeService === index
                  ? 'bg-black text-white border-black shadow-lg shadow-black/20'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                }`}
            >
              {s.id} — {s.title}
            </button>
          ))}
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeService}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
              <div className="lg:col-span-6 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[4/5] group"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.2s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute top-6 left-6 text-white/90">
                    <span className="text-xs font-mono font-bold tracking-widest">[{service.id}]</span>
                  </div>

                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-black">
                    {service.icon}
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                    {service.tags.map((tag, i) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider border border-white/30"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute -bottom-6 -right-4 md:right-6 bg-white rounded-2xl shadow-2xl p-5 border border-gray-100"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Tarif</p>
                  <p className="text-lg md:text-xl font-black text-black">{service.price}</p>
                  <p className="text-[10px] font-medium text-gray-400 mt-1">Délai : {service.duration}</p>
                </motion.div>
              </div>

              <div className="lg:col-span-6 lg:pt-8">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs font-bold uppercase tracking-[0.25em] text-red-600 mb-4"
                >
                  Service {service.id}
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.95] tracking-tight mb-6"
                >
                  {service.title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 max-w-xl"
                >
                  {service.description}
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-3 bg-black text-white px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:gap-5 transition-all duration-300 cursor-pointer group"
                >
                  Demander ce service
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="h-[2px] w-10 bg-red-600" />
                <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Nos formules</h3>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {service.models.map((model, i) => {
                  const isSelected = selectedModel === i;
                  const isHighlighted = model.highlighted;
                  return (
                    <motion.div
                      key={model.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                      onClick={() => setSelectedModel(i)}
                      className={`relative cursor-pointer rounded-2xl p-6 md:p-7 border-2 transition-all duration-300
                        ${isSelected
                          ? 'border-black bg-white shadow-2xl scale-[1.02]'
                          : 'border-gray-200 bg-white/60 hover:border-gray-400 hover:bg-white'
                        }
                      `}
                    >
                      {isHighlighted && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-widest">
                          Populaire
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{model.name}</p>
                          <p className="text-2xl md:text-3xl font-black text-black">{model.price}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                          ${isSelected ? 'bg-black border-black' : 'border-gray-300'}
                        `}>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>

                      <ul className="space-y-2.5">
                        {model.features.map((feat, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-black text-white rounded-2xl p-6 md:p-8"
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Formule sélectionnée</p>
                  <p className="text-xl md:text-2xl font-black">
                    {service.models[selectedModel].name} — {service.models[selectedModel].price}
                  </p>
                </div>
                <button className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer group whitespace-nowrap">
                  Réserver cette formule
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      <footer className="border-t border-gray-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <span>Ace Services © {new Date().getFullYear()}</span>
          <span>Tous droits réservés</span>
        </div>
      </footer>
    </div>
  );
}
