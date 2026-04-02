import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Baby, Users, Trees, Shield, Heart, ArrowRight, Quote, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';
import ImpactCTA from '../components/ImpactCTA';

const causeData = {
  'education': {
    title: "Educational Excellence",
    subtitle: "Breaking the cycle of poverty through literacy.",
    quote: "Education is the most powerful weapon which you can use to change the world.",
    quoteAuthor: "Nelson Mandela",
    image: "/indian_education_1775031032479.png",
    icon: <Baby className="text-primary-gold" size={48} />,
    color: "#C9933A",
    details: "Our educational initiative focuses on rural India's most underserved regions. We don't just build schools; we build futures. By providing digital learning labs, trained educators, and safe learning environments, we ensure that every child, regardless of their background, has access to world-class education.",
    impacts: [
      "Over 50,000 students enrolled in our partner schools.",
      "95% graduation rate in our rural learning centers.",
      "150+ Digital Literacy Labs established."
    ],
    mission: "To eliminate illiteracy in rural India by 2040 through technology-driven and community-led educational programs."
  },
  'empowerment': {
    title: "Women Empowerment",
    subtitle: "Fueling the next generation of female leaders.",
    quote: "There is no tool for development more effective than the empowerment of women.",
    quoteAuthor: "Kofi Annan",
    image: "/indian_empowerment_1775031117062.png",
    icon: <Users className="text-rose-500" size={48} />,
    color: "#f43f5e",
    details: "When you empower a woman, you empower a whole community. We provide micro-loans, vocational training, and mentorship to women in rural sectors, helping them start small businesses and gain financial independence.",
    impacts: [
      "12,000+ women entrepreneurs supported with micro-loans.",
      "Average household income increased by 40% for our beneficiaries.",
      "Formed 500+ Self-Help Groups across 3 states."
    ],
    mission: "To foster financial independence and leadership among 1 million Indian women by providing them with the tools and resources for sustainable self-employment."
  },
  'environment': {
    title: "Environmental Protection",
    subtitle: "Restoring the lungs of our planet.",
    quote: "The earth does not belong to us; we belong to the earth.",
    quoteAuthor: "Marlee Matlin",
    image: "/indian_environment_1775031152562.png",
    icon: <Trees className="text-green-500" size={48} />,
    color: "#22c55e",
    details: "Our environmental projects focus on reforestation in the Western Ghats and implementing sustainable farming practices. We work with local farmers to transition to regenerative agriculture, preserving biodiversity while ensuring food security.",
    impacts: [
      "1.2 million+ trees planted in the last 3 years.",
      "Restored 5,000 hectares of degraded forest land.",
      "Implemented water harvesting systems in 200+ villages."
    ],
    mission: "To plant 100 million trees and restore ecological balance in India's most vulnerable biodiversity hotspots by 2050."
  },
  'protection': {
    title: "Safety & Justice",
    subtitle: "A shield for the vulnerable and marginalized.",
    quote: "Justice will not be served until those who are unaffected are as outraged as those who are.",
    quoteAuthor: "Benjamin Franklin",
    image: "/indian_protection_1775031202860.png",
    icon: <Shield className="text-blue-500" size={48} />,
    color: "#3b82f6",
    details: "No one should live in fear. We provide legal aid to survivors of trafficking, safe shelters for those fleeing domestic violence, and a 24/7 helpline for children in distress. Our mission is to ensure every citizen lives with dignity.",
    impacts: [
      "Successfully rescued 3,000+ children from labor and trafficking.",
      "Provided free legal aid to 5,000+ marginalized families.",
      "Operate 10 emergency response shelters with 24/7 care."
    ],
    mission: "To create a fear-free society where every individual is protected by law and has immediate access to safety and justice."
  },
  'tech-for-good': {
    title: "Tech For Good",
    subtitle: "Bridging the digital divide for rural youth.",
    quote: "Technology is best when it brings people together.",
    quoteAuthor: "Matt Mullenweg",
    image: "/indian_tech_1775031255974.png",
    icon: <Heart className="text-purple-500" size={48} />,
    color: "#a855f7",
    details: "We believe technology is the ultimate equalizer. By bringing AI and coding labs to remote villages, we are preparing the next generation for the global economy. Our tech-hubs provide high-speed internet and mentorship from industry experts.",
    impacts: [
      "Trained 15,000+ youth in AI, coding, and digital marketing.",
      "80% of our graduates secured jobs in the formal tech sector.",
      "Bridging the gender gap in STEM within rural communities."
    ],
    mission: "To equip every rural Indian school with high-tech labs by 2045, ensuring no child is left behind in the digital revolution."
  }
};

const CauseDetail = () => {
  const { id } = useParams();
  const cause = causeData[id];
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!cause) {
    return (
      <div className="min-h-screen bg-primary-navy flex flex-col items-center justify-center p-6 pt-32">
        <h1 className="text-4xl font-heading font-black text-white mb-6 uppercase">Cause Not Found</h1>
        <Link to="/" className="px-8 py-3 bg-primary-gold text-primary-navy font-bold rounded-full">BACK TO HOME</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-navy selection:bg-primary-gold selection:text-primary-navy">
      <SEO 
        title={`${cause.title} - Our Mission`} 
        description={cause.details}
      />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
          <img 
            src={cause.image} 
            alt={cause.title} 
            className="w-full h-full object-cover grayscale-[30%] opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-navy via-primary-navy/80 to-transparent" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 glass-gold rounded-full mb-8 border-primary-gold/30">
              <span className="w-2 h-2 bg-primary-gold rounded-full animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-gold">Mission Pillar</span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-heading font-black text-white mb-6 uppercase leading-tight">
              {cause.title.split(' ')[0]} <br />
              <span className="text-primary-gold italic">{cause.title.split(' ').slice(1).join(' ')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-offwhite/60 font-body mb-12 italic">
              "{cause.subtitle}"
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/donate"
                className="px-10 py-5 bg-gold-gradient text-primary-navy font-black rounded-2xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2"
              >
                SUPPORT THIS CAUSE <ArrowRight size={20} />
              </Link>
              <button 
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="px-10 py-5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all"
              >
                EXPLORE IMPACT
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary-gold opacity-50"
        >
          <div className="w-6 h-10 border-2 border-primary-gold rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-primary-gold rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Details Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="p-6 bg-white/5 rounded-3xl w-fit">
                {cause.icon}
              </div>
              
              <h2 className="text-5xl md:text-6xl font-heading font-black text-white leading-[0.95] uppercase">
                THE DEPTH OF OUR <span className="text-primary-gold italic">COMMITMENT</span>
              </h2>
              
              <p className="text-xl text-primary-offwhite/50 leading-relaxed font-body">
                {cause.details}
              </p>

              <div className="grid sm:grid-cols-2 gap-8">
                {cause.impacts.map((impact, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="mt-1 flex-shrink-0">
                      <CheckCircle2 className="text-primary-gold" size={20} />
                    </div>
                    <p className="text-sm font-bold text-primary-offwhite/80 uppercase tracking-widest leading-loose">
                      {impact}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 glass p-12 md:p-16 rounded-[4rem] border-primary-gold/10">
                <Quote className="text-primary-gold/20 mb-8" size={64} fill="currentColor" />
                <h3 className="text-4xl md:text-5xl font-heading font-black text-white mb-10 leading-tight italic">
                  "{cause.quote}"
                </h3>
                <div className="flex items-center gap-6">
                   <div className="h-[1px] w-12 bg-primary-gold/30"></div>
                   <p className="font-heading text-primary-gold uppercase tracking-[0.5em] font-black text-sm">
                     {cause.quoteAuthor}
                   </p>
                </div>
              </div>
              {/* Background Accent */}
              <div className="absolute -top-10 -right-10 w-full h-full bg-primary-gold/5 blur-[80px] rounded-full -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Vision */}
      <section className="py-24 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-6 text-center max-w-4xl">
           <TrendingUp className="mx-auto text-primary-gold mb-8" size={48} />
           <h4 className="text-primary-gold font-black uppercase tracking-[0.4em] text-xs mb-4">The Long Term Vision</h4>
           <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-10 uppercase">OUR 2050 <span className="italic">MANIFESTO</span></h2>
           <p className="text-2xl md:text-3xl font-body text-primary-offwhite/70 leading-relaxed italic">
             "{cause.mission}"
           </p>
        </div>
      </section>

      {/* Global Impact CTA */}
      <ImpactCTA />

      <footer className="py-20 text-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">© 2026 LAKSHMI NGO TRUST • RADICAL TRANSPARENCY</p>
      </footer>
    </div>
  );
};

export default CauseDetail;
