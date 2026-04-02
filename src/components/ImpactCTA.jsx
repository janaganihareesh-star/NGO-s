import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelpCircle, ArrowRight } from 'lucide-react';

/**
 * ImpactCTA - A high-conversion, professional donation section.
 * Used at the bottom of major impact and story pages.
 */
const ImpactCTA = ({ 
  title = "Ready to make an Impact?", 
  subtitle = "Your contribution directly funds our operations in rural India. Join us in building a more equitable and sustainable world.",
  buttonText = "DONATE TO THIS CAUSE" 
}) => {
  return (
    <section className="py-24 md:py-32 bg-primary-navy relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-gold/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 text-center relative z-10">
         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto glass p-12 md:p-20 rounded-[3rem] md:rounded-[4rem] border-primary-gold/10 relative overflow-hidden group"
         >
            {/* Animated Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gold-gradient opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000" />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <HelpCircle className="mx-auto text-primary-gold mb-8 opacity-80" size={64} />
            </motion.div>

            <h2 className="text-4xl md:text-7xl font-heading font-black text-white mb-8 uppercase leading-[0.9] tracking-tighter">
              {title.split(' ')[0]} {title.split(' ')[1]} <br /> 
              {title.split(' ').slice(2).join(' ').includes('Impact?') ? (
                <>an <span className="text-primary-gold italic">Impact?</span></>
              ) : title.split(' ').slice(2).join(' ')}
            </h2>

            <p className="text-primary-offwhite/50 text-base md:text-xl mb-12 max-w-2xl mx-auto font-body italic leading-relaxed">
              {subtitle}
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/donate"
                className="inline-flex items-center gap-4 px-10 md:px-16 py-5 md:py-7 bg-white text-primary-navy font-black text-lg md:text-xl rounded-2xl md:rounded-[1.5rem] hover:bg-primary-gold transition-all shadow-2xl relative z-20 group/btn"
              >
                {buttonText} 
                <ArrowRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
              </Link>
            </motion.div>

            {/* Sub-text decorative element */}
            <div className="mt-12 flex items-center justify-center gap-3 opacity-20">
               <div className="h-[1px] w-12 bg-white" />
               <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white">Radical Transparency</span>
               <div className="h-[1px] w-12 bg-white" />
            </div>
         </motion.div>
      </div>
    </section>
  );
};

export default ImpactCTA;
