import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Baby, Home, Heart, Users, Trees, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CauseCard = ({ cause, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      onClick={() => onClick(cause)}
      className="glass group p-8 rounded-[2rem] border-primary-gold/10 hover:border-primary-gold/40 transition-all duration-500 cursor-pointer overflow-hidden relative"
    >
      {/* Hover Background Accent */}
      <div className="absolute top-0 left-0 w-full h-full bg-primary-gold/5 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
      
      <div className="relative z-10">
        <div className="mb-8 p-5 rounded-2xl bg-white/5 w-fit group-hover:scale-110 group-hover:bg-primary-gold/10 transition-all duration-500 shadow-xl shadow-black/20">
          {cause.icon}
        </div>
        
        <h3 className="text-2xl font-heading font-black mb-4 group-hover:text-primary-gold transition-colors">
          {cause.title}
        </h3>
        
        <p className="text-primary-offwhite/50 font-body text-sm mb-8 leading-relaxed line-clamp-2">
          {cause.description}
        </p>
        
        <div className="flex items-center gap-2 text-primary-gold text-[10px] uppercase tracking-[0.2em] font-black group-hover:gap-4 transition-all">
          Learn More <ArrowRight size={14} />
        </div>
      </div>
      
      {/* Bottom Border Accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
};

const CauseModal = ({ cause, onClose }) => {
  if (!cause) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary-navy/90 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 50, opacity: 0 }}
        className="glass w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] border-primary-gold/20 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-full glass-gold hover:scale-110 transition-all z-20"
        >
          <X className="text-primary-gold" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Side */}
          <div className="relative h-64 md:h-auto overflow-hidden">
            <img
              src={cause.image}
              alt={cause.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-navy via-transparent to-transparent" />
          </div>

          {/* Content Side */}
          <div className="p-10 md:p-16 flex flex-col justify-center">
            <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit">
              {cause.icon}
            </div>
            
            <h2 className="text-4xl font-heading font-black mb-6 text-white uppercase tracking-tight">
              {cause.title}
            </h2>
            
            <p className="text-primary-offwhite/70 font-body text-lg mb-8 leading-relaxed italic">
              {cause.fullDescription}
            </p>
            
            <div className="p-6 rounded-2xl bg-primary-gold/5 border border-primary-gold/10 mb-10">
              <h4 className="text-primary-gold font-heading text-xl mb-2 italic">IMPACT DATA</h4>
              <p className="text-3xl font-black text-white">{cause.impactStat}</p>
            </div>
            
            <Link 
              to={`/donate?cause=${encodeURIComponent(cause.title)}`}
              className="w-full py-5 bg-gold-gradient text-primary-navy font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary-gold/20 flex items-center justify-center"
            >
              SUPPORT THIS CAUSE
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const WhatWeDo = () => {
  const [selectedCause, setSelectedCause] = useState(null);

  const causes = [
    {
      title: "Education",
      description: "Breaking the cycle of poverty through quality schooling and digital literacy in rural India.",
      fullDescription: "Education is the most powerful tool for change. We operate 25+ schools and mobile learning centers, ensuring every child in remote villages has access to modern education and a chance for a brighter future.",
      icon: <Baby className="text-primary-gold" size={32} />,
      image: "/indian_education_1775031032479.png",
      impactStat: "50,000+ Students Educated",
    },
    {
      title: "Empowerment",
      description: "Fueling Indian women entrepreneurs and small businesses with capital and mentorship.",
      fullDescription: "When you empower a woman, you empower a community. Our micro-finance and vocational training programs help thousands of Indian women start self-sustaining businesses and lead with confidence.",
      icon: <Users className="text-rose-500" size={32} />,
      image: "/indian_empowerment_1775031117062.png",
      impactStat: "12,000+ Women Entrepreneurs",
    },
    {
      title: "Environment",
      description: "Restoring India's green cover and implementing sustainable farming for local farmers.",
      fullDescription: "Our mission is to plant 10 million trees by 2030. We partner with village panchayats to create community forests and train farmers in regenerative agriculture to combat climate change.",
      icon: <Trees className="text-green-500" size={32} />,
      image: "/indian_environment_1775031152562.png",
      impactStat: "1.2M+ Trees Planted",
    },
    {
      title: "Protection",
      description: "Legal aid, safety shelters, and emergency response for India's most vulnerable.",
      fullDescription: "No one should live in fear. Lakshmi NGO Trust provides 24/7 emergency response, safe houses for those in crisis, and free legal aid to ensure justice for every citizen.",
      icon: <Shield className="text-blue-500" size={32} />,
      image: "/indian_protection_1775031202860.png",
      impactStat: "8,500+ Lives Protected",
    },
    {
      title: "Tech for Good",
      description: "Bringing high-tech labs and digital skills to India's rural youth.",
      fullDescription: "The digital divide stops here. We build world-class computer labs in villages, teaching coding, AI, and digital marketing to ensure rural Indian youth are ready for the global economy.",
      icon: <Heart className="text-purple-500" size={32} />,
      image: "/indian_tech_1775031255974.png",
      impactStat: "150+ Rural Tech Labs",
    },
  ];

  return (
    <section className="py-24 bg-primary-navy relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-primary-gold font-body uppercase tracking-[0.5em] text-xs font-bold mb-4 block">Our 6 Core Causes</span>
            <h2 className="text-5xl md:text-6xl font-heading font-black text-white leading-tight">CHAMPIONING THE <span className="text-primary-gold underline decoration-primary-gold/20 italic">VULNERABLE</span></h2>
          </div>
          <p className="max-w-md text-primary-offwhite/50 font-body text-sm italic">
            Each cause represents a pillar of our mission to create a safer, kinder, and greener world for generations to come.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {causes.map((cause, idx) => (
            <CauseCard
              key={idx}
              cause={cause}
              index={idx}
              onClick={setSelectedCause}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCause && (
          <CauseModal
            cause={selectedCause}
            onClose={() => setSelectedCause(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default WhatWeDo;
