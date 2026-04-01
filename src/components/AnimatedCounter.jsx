import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Baby, Shield, Home, Trees } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Counter = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let startTime = null;
      const endVal = parseInt(end);
      
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * endVal));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count}</span>;
};

const AnimatedCounter = () => {
  const { isDarkMode } = useTheme();
  const stats = [
    { label: "Children Saved", value: "500", suffix: "+", icon: <Baby className="text-primary-gold" /> },
    { label: "Women Supported", value: "1000", suffix: "+", icon: <Shield className="text-rose-500" /> },
    { label: "Orphans Sheltered", value: "200", suffix: "+", icon: <Home className="text-blue-500" /> },
    { label: "Trees Planted", value: "5000", suffix: "+", icon: <Trees className="text-green-500" /> },
  ];

  return (
    <section className={`py-24 transition-colors duration-500 ${isDarkMode ? 'bg-secondary/30' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className={`relative group p-8 rounded-3xl border ${isDarkMode ? 'border-primary-gold/10' : 'border-gray-200'} hover:border-primary-gold/30 transition-all duration-500 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} overflow-hidden shadow-sm hover:shadow-md`}
            >
              {/* Card Top Border Accent */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-primary-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              
              <div className="flex flex-col items-center text-center">
                <div className={`mb-6 p-4 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-primary-gold/5'} group-hover:scale-110 group-hover:bg-primary-gold/10 transition-all duration-500`}>
                  {stat.icon}
                </div>
                
                <div className={`text-5xl md:text-6xl font-heading font-black ${isDarkMode ? 'text-white' : 'text-primary-navy'} mb-2 tracking-tighter`}>
                  <Counter end={stat.value} />
                  <span className="text-primary-gold italic">{stat.suffix}</span>
                </div>
                
                <div className={`font-body uppercase tracking-[0.3em] text-[10px] font-bold ${isDarkMode ? 'text-primary-offwhite/50' : 'text-gray-500'}`}>
                  {stat.label}
                </div>
              </div>

              {/* Decorative Background Blob */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-gold/5 blur-3xl rounded-full group-hover:bg-primary-gold/10 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedCounter;
