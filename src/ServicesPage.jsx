import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, ArrowLeft, Lightbulb, Target, BarChart3, Building2, Check, Sparkles, X, Send, Calendar, User, Mail, Phone, MessageSquare } from 'lucide-react';

const RESERVATION_EMAIL = "ranaivosonmurielle18@gmail.com";

const services = [
  {
    id: "01",
    title: "Étude de Faisabilité",
    subtitle: "Vérifiez que votre projet est réalisable",
    description: "Une bonne idée doit être étudiée avant de devenir une entreprise. Nous évaluons les conditions nécessaires à la réalisation de votre projet et identifions les opportunités, contraintes et risques à prendre en compte.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop",
    icon: <Lightbulb className="w-6 h-6" />,
    tags: ["Analyse économique", "Étude de secteur", "Risques", "Faisabilité globale"],
    price: "300 000 Ar",
    duration: "5 à 10 jours",
    features: ["Analyse économique", "Étude du secteur", "Analyse des risques", "Rapport synthétique", "Recommandations"]
  },
  {
    id: "02",
    title: "Étude Marketing",
    subtitle: "Comprenez votre marché avant de vendre",
    description: "Connaître ses futurs clients est essentiel pour construire une offre adaptée. Nous vous aidons à comprendre votre clientèle cible, ses besoins, ses habitudes et ses attentes, tout en analysant la concurrence.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop",
    icon: <Target className="w-6 h-6" />,
    tags: ["Clientèle cible", "Sondages", "Concurrence", "Positionnement"],
    price: "400 000 Ar",
    duration: "7 à 14 jours",
    features: ["Définition de la cible", "Analyse de la demande", "Enquête de terrain", "Analyse concurrentielle", "Stratégie de positionnement"]
  },
  {
    id: "03",
    title: "Étude Financière",
    subtitle: "Transformez votre projet en chiffres",
    description: "Combien faut-il investir ? De combien avez-vous besoin pour démarrer ? Votre activité peut-elle être rentable ? Nous transformons votre projet en prévisions chiffrées pour des décisions éclairées.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop",
    icon: <BarChart3 className="w-6 h-6" />,
    tags: ["Investissement", "Plan de financement", "Trésorerie", "Rentabilité"],
    price: "450 000 Ar",
    duration: "10 à 15 jours",
    features: ["Besoins financiers", "Plan de financement", "Compte de résultat", "Plan de trésorerie", "Bilan prévisionnel", "Seuil de rentabilité"]
  },
  {
    id: "04",
    title: "Accompagnement à la formalisation et au démarrage",
    subtitle: "Donnez une existence officielle à votre projet",
    description: "Une fois votre projet validé, nous vous accompagnons dans la préparation de sa création officielle. Nous vous aidons à comprendre les démarches et à préparer les éléments nécessaires.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2670&auto=format&fit=crop",
    icon: <Building2 className="w-6 h-6" />,
    tags: ["Forme juridique", "Documents", "EDBM", "Démarches"],
    price: "550 000 Ar",
    duration: "5 à 12 jours",
    features: ["Orientation juridique", "Liste des documents", "Préparation du dossier", "Accompagnement administratif", "Démarches EDBM", "Suivi post-création"]
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

/* ---------- MODAL DE RÉSERVATION ---------- */
function ReservationModal({ service, onClose }) {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    date: "",
    message: ""
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${RESERVATION_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          _subject: `Nouvelle réservation — ${service.title}`,
          _template: "table",
          _captcha: "false",
          Service: service.title,
          Tarif: service.price,
          Délai: service.duration,
          Nom: form.nom,
          Email: form.email,
          Téléphone: form.telephone,
          "Date souhaitée": form.date,
          Message: form.message
        })
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => onClose(), 2500);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-black text-white p-8 rounded-t-3xl overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-[#c9a961]/30 blur-[80px]" />
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <p className="relative text-[10px] font-black uppercase tracking-[0.3em] text-[#c9a961] mb-2">
            Réservation
          </p>
          <h3 className="relative text-2xl md:text-3xl font-black uppercase leading-tight">
            {service.title}
          </h3>
          <div className="relative flex items-center gap-4 mt-4 text-sm">
            <span className="px-3 py-1 rounded-full bg-[#c9a961] text-black font-bold text-xs">
              {service.price}
            </span>
            <span className="text-white/60 text-xs">Délai : {service.duration}</span>
          </div>
        </div>

        {/* Form */}
        {status === "success" ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-xl font-black uppercase mb-2">Demande envoyée !</h4>
            <p className="text-sm text-gray-500">
              Nous vous contacterons très bientôt à l'adresse {form.email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                  <User size={13} /> Nom complet *
                </label>
                <input
                  type="text"
                  name="nom"
                  required
                  value={form.nom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-none transition-all text-sm"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                  <Mail size={13} /> Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-none transition-all text-sm"
                  placeholder="vous@exemple.com"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                  <Phone size={13} /> Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-none transition-all text-sm"
                  placeholder="+261 ..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                  <Calendar size={13} /> Date souhaitée *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={form.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                <MessageSquare size={13} /> Message (optionnel)
              </label>
              <textarea
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-none transition-all text-sm resize-none"
                placeholder="Décrivez brièvement votre projet..."
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">
                Une erreur est survenue. Veuillez réessayer ou nous écrire directement à {RESERVATION_EMAIL}.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full inline-flex items-center justify-center gap-3 bg-[#c9a961] hover:bg-[#b8954a] disabled:opacity-60 text-black px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer"
            >
              {status === "sending" ? (
                "Envoi en cours..."
              ) : (
                <>
                  Envoyer la réservation
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-gray-400 leading-relaxed">
              Votre demande sera envoyée à <span className="font-bold">{RESERVATION_EMAIL}</span>
            </p>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function ServicesPage({ onBack, onGoToProcess, initialService = 0 }) {
  const [activeService, setActiveService] = useState(initialService);
  const [reserveService, setReserveService] = useState(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const headerRef = useRef(null);
  const { scrollYProgress: headerScroll } = useScroll({ target: headerRef, offset: ["start start", "end start"] });
  const yHeader = useTransform(headerScroll, [0, 1], ["0%", "30%"]);
  const opacityHeader = useTransform(headerScroll, [0, 0.8], [1, 0]);

  const service = services[activeService];

  // Bloque le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (reserveService) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [reserveService]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-[#c9a961] selection:text-white overflow-x-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#c9a961] origin-left z-[100]"
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
        className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20 text-center"
      >
        <AnimatedText
          text="Services que nous offrons."
          className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tight max-w-5xl mx-auto"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="text-base md:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mt-8"
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-20">
              <div className="lg:col-span-6 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative rounded-3xl overflow-hidden aspect-[4/5] group"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.2s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

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
              </div>

              <div className="lg:col-span-6 lg:pt-8">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs font-bold uppercase tracking-[0.25em] text-[#c9a961] mb-4"
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
                  className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mb-8"
                >
                  {service.description}
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => onGoToProcess && onGoToProcess(activeService)}
                  className="inline-flex items-center gap-3 bg-[#c9a961] text-white px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#b8954a] transition-all duration-300 cursor-pointer group"
                >
                  Voir le processus
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="h-[2px] w-10 bg-[#c9a961]" />
                <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Notre tarif</h3>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[2rem] bg-black text-white"
              >
                <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#c9a961]/25 blur-[120px]" />
                <div className="pointer-events-none absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full bg-[#c9a961]/15 blur-[120px]" />

                <div className="relative grid grid-cols-1 lg:grid-cols-5">
                  <div className="lg:col-span-2 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="w-4 h-4 text-[#c9a961]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c9a961]">
                          Offre unique
                        </span>
                      </div>

                      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40 mb-3">
                        Tarif tout compris
                      </p>

                      <div className="flex items-end gap-3 mb-2">
                        <span className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none">
                          {service.price}
                        </span>
                      </div>

                      <p className="text-sm text-white/50 mt-4">
                        Un seul tarif, aucune surprise. Tout ce dont vous avez besoin pour cette étape.
                      </p>
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="uppercase tracking-widest text-white/40 font-bold">Délai</span>
                        <span className="font-bold text-white">{service.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-3 p-8 md:p-12">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40 mb-6">
                      Ce qui est inclus
                    </p>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-10">
                      {service.features.map((feat, j) => (
                        <motion.li
                          key={j}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + j * 0.06 }}
                          className="flex items-start gap-3 text-sm text-white/80"
                        >
                          <span className="mt-0.5 w-5 h-5 rounded-full bg-[#c9a961]/20 border border-[#c9a961]/40 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-[#c9a961]" />
                          </span>
                          <span>{feat}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <button
                      onClick={() => setReserveService(service)}
                      className="group inline-flex items-center gap-3 bg-[#c9a961] hover:bg-[#b8954a] text-black px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer"
                    >
                      Réserver ce service — {service.price}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
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

      {/* MODAL DE RÉSERVATION */}
      <AnimatePresence>
        {reserveService && (
          <ReservationModal
            service={reserveService}
            onClose={() => setReserveService(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}