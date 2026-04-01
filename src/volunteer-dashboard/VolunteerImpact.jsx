import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Star, Shield, Trophy, Target, ArrowRight, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

const VolunteerImpact = () => {
  const tiers = [
    { level: 1, title: 'Aspiring Guardian', range: '0 - 500 Pts', color: 'text-gray-400', bg: 'bg-gray-400/10', icon: <Zap size={24} /> },
    { level: 2, title: 'Dedicated Advocate', range: '501 - 2000 Pts', color: 'text-orange-500', bg: 'bg-orange-500/10', icon: <Star size={24} />, isCurrent: true },
    { level: 3, title: 'Community Pillar', range: '2001 - 5000 Pts', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: <Shield size={24} /> },
    { level: 4, title: 'Lighthouse Leader', range: '5001+ Pts', color: 'text-primary-gold', bg: 'bg-primary-gold/10', icon: <Award size={24} /> }
  ];

  const accomplishments = [
    { title: 'Consistency King', desc: 'Attended 5 campaigns in 30 days', date: 'Aug 14, 2024', icon: <CheckCircle /> },
    { title: 'Top Responder', desc: 'Responded to 3 urgent missions', date: 'Sept 02, 2024', icon: <Trophy /> },
    { title: 'Donor Champion', desc: 'Referral of massive donations', date: 'Oct 22, 2024', icon: <Target /> }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SEO title="My Impact Tiers" />
      
      <div>
        <h1 className="text-4xl font-heading font-black text-gray-900 dark:text-white uppercase tracking-wider">Impact <span className="text-primary-gold">Matrix</span></h1>
        <p className="text-gray-500 dark:text-primary-offwhite/50 text-sm mt-2 uppercase tracking-widest font-bold font-body">Your contributions translated to real-world change</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {tiers.map((tier, idx) => (
          <motion.div 
            key={tier.level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-8 rounded-[3rem] border ${tier.isCurrent ? 'border-primary-gold bg-primary-gold/5 shadow-2xl shadow-primary-gold/10' : 'border-gray-200 dark:border-white/10 dark:bg-white/5 bg-white shadow-xl shadow-black/5'}`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-gray-200 dark:border-white/10 mb-6 ${tier.bg} ${tier.color}`}>
               {tier.icon}
            </div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Level {tier.level}</p>
            <h3 className={`text-xl font-heading font-black mb-1 uppercase tracking-tight ${tier.isCurrent ? 'text-primary-gold' : 'text-gray-900 dark:text-white'}`}>{tier.title}</h3>
            <p className="text-xs font-bold text-gray-400 mb-6">{tier.range}</p>
            {tier.isCurrent && (
               <div className="px-4 py-1 bg-primary-gold text-gray-900 text-[8px] font-black uppercase rounded-full w-fit tracking-widest">
                  Current Status
               </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
         {/* Accomplishments Feed */}
         <div className="space-y-6">
            <h3 className="text-xl font-heading font-black text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-4">Digital Badges Earned</h3>
            <div className="space-y-4">
               {accomplishments.map((acc, i) => (
                  <div key={i} className="flex gap-6 items-center p-6 bg-white dark:bg-[#0A0A0F] border border-gray-200 dark:border-white/10 rounded-3xl shadow-lg">
                     <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl">
                        {acc.icon}
                     </div>
                     <div className="flex-1">
                        <h4 className="font-heading font-black uppercase text-gray-900 dark:text-white mb-1 leading-tight">{acc.title}</h4>
                        <p className="text-xs font-bold text-gray-500 dark:text-primary-offwhite/50">{acc.desc}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{acc.date}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Impact Scoreboard */}
         <div className="p-10 rounded-[3rem] bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-gold/20 rounded-full blur-[80px]" />
            <h3 className="text-2xl font-heading font-black mb-8 uppercase tracking-widest leading-tight">Your Year In <span className="text-primary-gold">Vision</span></h3>
            <div className="grid grid-cols-2 gap-10 relative z-10">
               <div>
                  <p className="text-5xl font-black font-heading text-primary-gold mb-2">1,200</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Mission Points</p>
               </div>
               <div>
                  <p className="text-5xl font-black font-heading text-primary-gold mb-2">42</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Hours Volunteered</p>
               </div>
               <div>
                  <p className="text-5xl font-black font-heading text-primary-gold mb-2">18</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Lives Influenced</p>
               </div>
               <div>
                  <p className="text-5xl font-black font-heading text-primary-gold mb-2">3</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Cities Covered</p>
               </div>
            </div>
            <button 
              onClick={() => {
                toast.info("Generating your Annual Impact Summary...");
                setTimeout(() => {
                  const content = "LAKSHMI NGO - IMPACT REPORT 2024\n\nPoints: 1200\nHours: 42\nStatus: Dedicated Advocate";
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Impact_Report_${currentUser?.name || 'Volunteer'}.txt`;
                  a.click();
                  toast.success("Impact Report Downloaded Successfully!");
                }, 2000);
              }}
              className="mt-12 px-10 py-4 bg-primary-gold text-gray-900 font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 transition-all w-fit flex items-center gap-2"
            >
               Download Impact Report <ArrowRight size={14} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default VolunteerImpact;
