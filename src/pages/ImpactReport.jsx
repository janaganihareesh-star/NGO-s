import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Users, Heart, Shield, Globe, Award, Briefcase } from 'lucide-react';
import SEO from '../components/SEO';

const ImpactReport = () => {
  return (
    <div className="min-h-screen bg-primary-navy pt-40 pb-24 font-body text-primary-offwhite">
      <SEO 
        title="Impact Report 2025" 
        description="Detailed accountability and transparency report of Lakshmi NGO Trust. See how your donations are transforming lives across India."
      />

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header Section */}
        <div className="mb-24 text-center">
          <h4 className="text-primary-gold font-black uppercase tracking-[0.5em] text-xs mb-6">Accountability & Results</h4>
          <h1 className="text-6xl md:text-8xl font-heading font-black mb-8 leading-tight">
            FULL IMPACT <br />
            <span className="italic text-primary-gold underline decoration-white/10">REPORT 2025</span>
          </h1>
          <p className="max-w-3xl mx-auto text-primary-offwhite/50 text-xl leading-relaxed italic">
            "Transparency is the foundation of trust. At Lakshmi NGO Trust, we ensure every rupee is accounted for and every project is measured by the smiles it creates."
          </p>
        </div>

        {/* Global Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {[
            { icon: <Users className="text-primary-gold" />, label: 'Total Beneficiaries', value: '1.2M+' },
            { icon: <TrendingUp className="text-rose-500" />, label: 'Yearly Growth', value: '142%' },
            { icon: <Shield className="text-emerald-500" />, label: 'Villages Covered', value: '450+' },
            { icon: <Globe className="text-blue-500" />, label: 'Projects Completed', value: '1,200+' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[3rem] border-white/5 text-center"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-heading font-black mb-2">{stat.value}</h3>
              <p className="text-[10px] uppercase tracking-widest text-primary-offwhite/40 font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Detailed Breakdown */}
        <div className="grid lg:grid-cols-2 gap-20 mb-40">
           <div>
              <h2 className="text-4xl font-heading font-black mb-12 uppercase tracking-tight">Our <span className="text-primary-gold text-5xl">Achievement</span> Pillars</h2>
              <div className="space-y-12">
                 {[
                   { title: 'Education Excellence', desc: 'Established 25 smart schools in tribal belt regions, providing 50,000+ students with tablet-based learning.', icon: <Award /> },
                   { title: 'Economic Empowerment', desc: 'Distributed ₹5 Crore in interest-free micro-loans to 12,000+ women entrepreneurs.', icon: <Briefcase /> },
                   { title: 'Sustainability First', desc: '1.2 Million trees planted across the Western Ghats with a 92% survival rate.', icon: <Heart /> },
                   { title: 'Crisis Response', desc: 'Provided emergency medical aid and safe shelter to 8,000+ individuals facing displacement.', icon: <CheckCircle2 /> }
                 ].map((pill, i) => (
                   <div key={i} className="flex gap-8 group">
                      <div className="w-12 h-12 bg-primary-gold/5 border border-primary-gold/20 rounded-xl flex items-center justify-center shrink-0 text-primary-gold group-hover:bg-primary-gold group-hover:text-primary-navy transition-all">
                        {pill.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-heading font-bold mb-3">{pill.title}</h4>
                        <p className="text-primary-offwhite/50 leading-relaxed text-sm italic">"{pill.desc}"</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="relative">
              <div className="glass p-12 rounded-[4rem] border-primary-gold/10 relative z-10">
                 <h2 className="text-3xl font-heading font-black mb-8 uppercase text-primary-gold">Financial Transparency</h2>
                 <p className="text-primary-offwhite/60 mb-10 leading-relaxed">
                   Lakshmi NGO Trust operates with a 92% program efficiency rate. Only 8% of donations are used for administrative costs.
                 </p>
                 <div className="space-y-8">
                    {[
                      { l: 'Grassroots Programs', p: '85%' },
                      { l: 'Field Operations', p: '7%' },
                      { l: 'Administration', p: '5%' },
                      { l: 'Fundraising', p: '3%' }
                    ].map((item, i) => (
                      <div key={i}>
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                           <span>{item.l}</span>
                           <span className="text-primary-gold">{item.p}</span>
                         </div>
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: item.p }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-primary-gold" 
                            />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-gold/10 blur-[100px] rounded-full" />
           </div>
        </div>

        {/* Closing Action */}
        <div className="text-center bg-white/5 p-20 rounded-[5rem] border border-white/5 relative overflow-hidden">
           <div className="relative z-10">
             <h2 className="text-4xl md:text-6xl font-heading font-black mb-10 text-white uppercase italic">Be Part Of The <span className="text-primary-gold">Progress.</span></h2>
             <p className="text-primary-offwhite/40 mb-12 max-w-xl mx-auto font-body text-lg italic">
               Every achievement on this page was made possible by donors like you. Help us scale our impact in 2026.
             </p>
             <button 
              onClick={() => window.location.href = '/donate'}
              className="px-16 py-6 bg-gold-gradient text-primary-navy font-black rounded-3xl hover:scale-105 transition-all shadow-2xl tracking-widest uppercase"
             >
               INVEST IN HUMANITY
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactReport;
