import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight, Lightbulb, Rocket, BarChart3, Target, Sparkles, ArrowLeft } from 'lucide-react';

const steps = [
  {
    id: "01",
    period: "Phase 1",
    title: "Idéation & Vision",
    subtitle: "De l'idée au concept",
    description: "Nous vous aidons à clarifier votre vision, à valider votre idée sur le marché et à définir votre proposition de valeur unique.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop",
    icon: <Lightbulb className="w-8 h-8" />,
    color: "bg-[#F3F4F6]",
    accentColor: "text-gray-900"
  },
  {
    id: "02",
    period: "Phase 2",
    title: "Stratégie & Business Plan",
    subtitle: "La structure solide",
    description: "Élaboration d'un business plan solide, étude de marché approfondie, stratégie marketing et prévisions financières réalistes.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop",
    icon: <Target className="w-8 h-8" />,
    color: "bg-[#D32F2F]",
    accentColor: "text-white"
  },
  {
    id: "03",
    period: "Phase 3",
    title: "Lancement & Exécution",
    subtitle: "Le passage à l'action",
    description: "Accompagnement juridique, administratif et opérationnel. Nous vous aidons à structurer votre équipe et à lancer vos premières opérations.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop",
    icon: <Rocket className="w-8 h-8" />,
    color: "bg-[#111827]",
    accentColor: "text-white"
  },
  {
    id: "04",
    period: "Phase 4",
    title: "Croissance & Scale",
    subtitle: "Vers la pérennité",
    description: "Optimisation des processus, recherche de financements et stratégies d'expansion pour faire passer votre entreprise au niveau supérieur.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2670&auto=format&fit=crop",
    icon: <BarChart3 className="w-8 h-8" />,
    color: "bg-[#F3F4F6]",
    accentColor: "text-gray-900"
  }
];

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full bg-red-600 mix-blend-difference pointer-events-none z-[9999] hidden md:block"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    />
  );
};

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

const MagneticButton = ({ children, className }) => {
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

export default function ProcessPage({ onBack }) {
  const [activeStep, setActiveStep] = useState(1);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const headerRef = useRef(null);
  const { scrollYProgress: headerScroll } = useScroll({ target: headerRef, offset: ["start start", "end start"] });
  const yHeader = useTransform(headerScroll, [0, 1], ["0%", "50%"]);
  const opacityHeader = useTransform(headerScroll, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-red-500 selection:text-white overflow-x-hidden cursor-none md:cursor-none">
      <CustomCursor />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-red-600 origin-left z-[100]"
        style={{ scaleX }}
      />

      <motion.header
        ref={headerRef}
        style={{ y: yHeader, opacity: opacityHeader }}
        className="max-w-7xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16 relative"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

        <div className="relative flex justify-between items-center mb-16">
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
            <span className="text-2xl font-black tracking-tighter uppercase">Ace Services.</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-500"
          >
            <a href="#" onClick={onBack} className="hover:text-black transition-colors">Accueil</a>
            <a href="#" className="text-red-600 relative">
              Notre Processus
              <motion.span layoutId="underline" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-red-600" />
            </a>
            <a href="#" className="hover:text-black transition-colors">Contact</a>
          </motion.div>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <AnimatedText
              text="Comment nous bâtissons votre succès."
              className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tight"
            />
          </div>
          <div className="md:col-span-4 pb-2">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-sm md:text-base text-gray-500 leading-relaxed max-w-sm ml-auto"
            >
              De la simple idée à la réalité commerciale. Nous naviguons avec vous à travers les complexités de la création d'entreprise pour garantir une croissance durable.
            </motion.p>
          </div>
        </div>
      </motion.header>

      <section className="max-w-[1400px] mx-auto px-4 pb-24 perspective-1000">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-4 gap-2 h-auto md:h-[650px]"
        >
          {steps.map((step, index) => {
            const isActive = activeStep === index;

            return (
              <motion.div
                key={step.id}
                layout
                onClick={() => setActiveStep(index)}
                whileHover={!isActive ? { scale: 1.02, y: -5 } : {}}
                transition={{ layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                className={`relative cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl
                  ${isActive ? 'md:col-span-2 row-span-1 shadow-2xl z-10' : 'md:col-span-1 opacity-90 hover:opacity-100'}
                  ${step.color}
                `}
                style={{ minHeight: '300px' }}
              >
                {!isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 -translate-x-full"
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                )}

                <div className={`relative p-8 h-full flex flex-col justify-between ${step.accentColor}`}>
                  <div className="flex justify-between items-start">
                    <motion.span
                      layout
                      className="text-sm font-mono font-bold opacity-70"
                    >
                      [{step.id}]
                    </motion.span>
                    <motion.div
                      animate={isActive ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      className="opacity-80"
                    >
                      {step.icon}
                    </motion.div>
                  </div>

                  <div className="mt-auto">
                    <AnimatePresence mode='wait'>
                      {isActive ? (
                        <motion.div
                          key="active-content"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -30 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="flex flex-col gap-6"
                        >
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-lg mb-4 relative group"
                          >
                            <img
                              src={step.image}
                              alt={step.title}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          </motion.div>

                          <div>
                            <motion.h3
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                              className="text-3xl md:text-4xl font-black uppercase mb-2"
                            >
                              {step.title}
                            </motion.h3>
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              className="text-sm md:text-base opacity-90 max-w-md font-medium leading-relaxed"
                            >
                              {step.description}
                            </motion.p>

                            <MagneticButton className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:gap-4 transition-all group">
                              Découvrir cette étape
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </MagneticButton>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="inactive-content"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col h-full justify-end"
                        >
                          <motion.h3
                            layout
                            className="text-2xl font-black uppercase mb-2"
                          >
                            {step.title}
                          </motion.h3>
                          <motion.p
                            layout
                            className="text-xs font-bold uppercase tracking-wider opacity-60"
                          >
                            {step.period}
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <section className="relative bg-gray-900 text-white py-24 px-6 text-center overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/20 blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-12 h-12 text-red-500" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black uppercase mb-8">
            Prêt à démarrer ?
          </h2>

          <MagneticButton className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all flex items-center gap-3 mx-auto shadow-lg shadow-red-600/50">
            Réserver un appel <ArrowRight className="w-5 h-5" />
          </MagneticButton>
        </motion.div>
      </section>
    </div>
  );
}
