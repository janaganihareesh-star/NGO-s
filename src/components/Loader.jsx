import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-primary-navy flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex flex-col items-center"
          >
            <div className="text-6xl md:text-8xl font-heading font-black text-white mb-4 tracking-tighter logo-preloader">
              LAKSHMI <span className="text-primary-gold underline decoration-primary-gold/30 underline-offset-8">NGO</span>
            </div>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-[1px] bg-primary-gold/50"
            />
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="font-body text-primary-gold mt-4 text-xs tracking-[0.5em] uppercase font-bold"
            >
              Protecting Life • Restoring Hope
            </motion.p>
          </motion.div>

          {/* Background Decorative Element */}
          <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary-gold/20 rounded-full animate-pulse" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
