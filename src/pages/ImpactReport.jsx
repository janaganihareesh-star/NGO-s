import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, TrendingUp, Users, Heart, Shield, Globe, Award, Briefcase, ArrowRight, X, Zap, Target } from 'lucide-react';
import SEO from '../components/SEO';
import { useNavigate } from 'react-router-dom';

const ImpactReport = () => {
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const navigate = useNavigate();

  const investmentTiers = [
    { 
      id: 1, title: 'CHILD LITERACY SEED', amount: '₹5,000', 
      desc: 'Provides full digital learning kits and 1-on-1 tutoring for 2 tribal children for a whole academic year.',
      icon: <Award className="text-primary-gold" />
    },
    { 
      id: 2, title: 'WOMEN EMPOWERMENT FUND', amount: '₹15,000', 
      desc: 'Starts interest-free micro-loans for 3 women to launch sustainable small-scale tailoring or farming businesses.',
      icon: <Briefcase className="text-emerald-500" />
    },
    { 
      id: 3, title: 'VILLAGE INFRASTRUCTURE', amount: '₹50,000', 
      desc: 'Installs 1 high-yield solar community light or 1 clean water filtration system in an off-grid village zone.',
      icon: <Zap className="text-orange-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-primary-navy pt-40 pb-24 font-body text-primary-offwhite overflow-hidden">
      <SEO 
        title="Impact Report 2025" 
        description="Detailed accountability and transparency report of Lakshmi NGO Trust. See how your donations are transforming lives across India."
      />

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header Section */}
        <div className="mb-24 text-center">
          <h4 className="text-primary-gold font-black uppercase tracking-[0.5em] text-xs mb-6">Accountability & Results</h4>
          <h1 className="text-6xl md:text-8xl font-heading font-black mb-8 leading-tight animate-in slide-in-from-top-12 duration-700">
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
              <div className="glass p-12 rounded-[4rem] border-primary-gold/10 relative z-10 box-glow">
                 <h2 className="text-3xl font-heading font-black mb-8 uppercase text-primary-gold">Financial Transparency</h2>
                 <p className="text-primary-offwhite/60 mb-10 leading-relaxed italic text-sm">
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
                              className="h-full bg-primary-gold shadow-[0_0_10px_rgba(201,147,58,0.5)]" 
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
             <p className="text-primary-offwhite/40 mb-12 max-w-xl mx-auto font-body text-lg italic uppercase tracking-widest">
               Every achievement on this page was made possible by donors like you. Help us scale our impact in 2026.
             </p>
             <button 
              onClick={() => setShowInvestmentModal(true)}
              className="px-16 py-6 bg-gold-gradient text-primary-navy font-black rounded-3xl hover:scale-110 active:scale-95 transition-all shadow-2xl tracking-[0.3em] uppercase group flex items-center gap-4 mx-auto"
             >
               INVEST IN HUMANITY 
               <ArrowRight className="group-hover:translate-x-2 transition-transform" />
             </button>
           </div>
           {/* Decorative background element */}
           <div className="absolute top-0 right-0 w-80 h-80 bg-primary-gold/10 blur-[120px] rounded-full" />
        </div>

        {/* Investment Impact Modal */}
        <AnimatePresence>
          {showInvestmentModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-10 pointer-events-auto">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setShowInvestmentModal(false)}
                 className="absolute inset-0 bg-primary-navy/90 backdrop-blur-xl"
               />
               
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 50 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 50 }}
                 className="relative w-full max-w-2xl bg-[#0A0A0F] border border-white/10 p-10 rounded-[4rem] shadow-2xl overflow-hidden"
               >
                  {/* Close Button */}
                  <button 
                    onClick={() => setShowInvestmentModal(false)}
                    className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-rose-500 text-white rounded-full transition-colors z-20"
                  >
                     <X size={20} />
                  </button>

                  <div className="relative z-10 flex flex-col items-center">
                     <div className="w-16 h-16 bg-primary-gold/10 rounded-2xl flex items-center justify-center text-primary-gold mb-8">
                        <Target size={32} />
                     </div>
                     <h3 className="text-3xl font-heading font-black text-white uppercase text-center mb-4 tracking-tighter">Choose Your <span className="text-primary-gold">Impact Area</span></h3>
                     <p className="text-center text-primary-offwhite/50 text-sm mb-12 uppercase tracking-[0.2em] font-bold">Select a verified investment tier for 2026</p>

                     <div className="w-full space-y-4">
                        {investmentTiers.map((tier) => (
                           <div 
                             key={tier.id}
                             onClick={() => navigate('/donate')}
                             className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-primary-gold transition-all group flex items-start gap-6 cursor-pointer"
                           >
                              <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                                 {tier.icon}
                              </div>
                              <div className="flex-1">
                                 <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-sm font-black text-white tracking-widest">{tier.title}</h4>
                                    <span className="text-xs font-black text-primary-gold">{tier.amount}</span>
                                 </div>
                                 <p className="text-[10px] text-primary-offwhite/40 leading-relaxed uppercase font-bold italic">{tier.desc}</p>
                              </div>
                           </div>
                        ))}
                     </div>

                     <button 
                       onClick={() => navigate('/donate')}
                       className="w-full py-5 mt-12 bg-white text-primary-navy font-black rounded-2xl hover:bg-primary-gold transition-colors text-xs tracking-widest uppercase flex items-center justify-center gap-3"
                     >
                        Proceed to Secure Contribution <ArrowRight size={16} />
                     </button>
                  </div>

                  {/* Decorative mesh gradient */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary-gold/5 blur-[80px] rounded-full pointer-events-none" />
               </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImpactReport;
