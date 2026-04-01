import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Info, Mail, Star } from 'lucide-react';

const TeamCard = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-3xl aspect-[4/5] bg-secondary border border-white/5 transition-all duration-500 group-hover:border-primary-gold/50 group-hover:-translate-y-2 shadow-2xl shadow-black/40">
        {/* Member Photo */}
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
        />

        {/* Overlay Info (Static) */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-navy via-transparent to-transparent opacity-90" />
        
        <div className="absolute bottom-0 inset-x-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-4">
          <p className="text-primary-gold font-body font-bold text-xs uppercase tracking-widest mb-2">
            {member.role}
          </p>
          <h3 className="text-2xl font-heading font-bold text-white tracking-tight">
            {member.name}
          </h3>
        </div>

        {/* Hover Social Links Modal-like overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-10 bg-primary-gold/90 backdrop-blur-sm">
          <div className="flex gap-6">
            <a href="#" className="p-3 bg-primary-navy rounded-full text-white hover:bg-white hover:text-primary-gold transition-colors">
              <Globe size={20} />
            </a>
            <a href="#" className="p-3 bg-primary-navy rounded-full text-white hover:bg-white hover:text-primary-gold transition-colors">
              <Star size={20} />
            </a>
            <a href="#" className="p-3 bg-primary-navy rounded-full text-white hover:bg-white hover:text-primary-gold transition-colors">
              <Info size={20} />
            </a>
          </div>
          <p className="text-primary-navy font-body font-bold uppercase tracking-widest text-xs">
            Connect with {member.name.split(' ')[0]}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCard;
