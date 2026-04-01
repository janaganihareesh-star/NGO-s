import React, { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { motion } from 'framer-motion';

const ProjectCard = ({ project, index }) => {
  const tiltRef = useRef(null);

  useEffect(() => {
    VanillaTilt.init(tiltRef.current, {
      max: 15,
      speed: 400,
      glare: true,
      'max-glare': 0.2,
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      viewport={{ once: true }}
      className="p-1" // Wrapper for tilt
    >
      <div
        ref={tiltRef}
        className="glass-gold rounded-2xl overflow-hidden group h-full flex flex-col p-6 transition-all duration-300 hover:border-primary-gold/50"
      >
        <div className="relative h-64 w-full rounded-xl overflow-hidden mb-6">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <span className="px-4 py-1 bg-primary-gold text-primary-navy font-bold text-xs rounded-full uppercase tracking-widest">
              {project.category}
            </span>
          </div>
        </div>

        <h3 className="text-2xl font-heading font-bold mb-3 group-hover:text-primary-gold transition-colors">
          {project.title}
        </h3>
        
        <p className="text-gray-400 font-body text-sm mb-6 flex-grow leading-relaxed">
          {project.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-primary-gold font-bold text-lg">{project.impact}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Impact</span>
          </div>
          <button className="text-white hover:text-primary-gold font-bold text-sm flex items-center gap-2 transition-colors">
            READ MORE <span>→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
