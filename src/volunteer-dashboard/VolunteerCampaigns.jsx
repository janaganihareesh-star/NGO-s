import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Star, Users, ArrowRight, CheckCircle, Info } from 'lucide-react';
import SEO from '../components/SEO';

const VolunteerCampaigns = () => {
  const campaigns = [
    { 
      id: 1, title: 'Slum Education Drive', loc: 'Dharavi Sector 4', date: 'Tomorrow, 09:00 AM', 
      slot: '4/10 slots left', iconColor: 'text-emerald-500', 
      iconBg: 'bg-emerald-500/10 border-emerald-500/20', isUrgent: false,
      desc: 'Teaching primary school children basic literacy and numbering. All materials provided.',
      impact: '50 Points', volunteers: 6
    },
    { 
      id: 2, title: 'Coastal Cleanup', loc: 'Juhu Beach', date: 'Sunday, 06:00 AM', 
      slot: '22/50 slots left', iconColor: 'text-blue-500', 
      iconBg: 'bg-blue-500/10 border-blue-500/20', isUrgent: false,
      desc: 'Cleaning the shorelines and segregating waste. In partnership with local authorities.',
      impact: '120 Points', volunteers: 28
    },
    { 
      id: 3, title: 'Ration Distribution', loc: 'Kandivali East', date: 'Nov 5, 12:00 PM', 
      slot: 'Urgent: 12 Needed', iconColor: 'text-rose-500', 
      iconBg: 'bg-rose-500/10 border-rose-500/20', isUrgent: true,
      desc: 'Distributing essential food items to underprivileged families in the Kandivali region.',
      impact: '200 Points', volunteers: 4
    },
    { 
      id: 4, title: 'Medical Health Camp', loc: 'Worli Koliwada', date: 'Nov 12, 10:00 AM', 
      slot: 'Full', iconColor: 'text-purple-500', 
      iconBg: 'bg-purple-500/10 border-purple-500/20', isUrgent: false,
      desc: 'Assisting medical staff during a free eye-checkup and health screening camp.',
      impact: '150 Points', volunteers: 15
    }
  ];

  const handleMapRedirect = (loc) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc + ", Mumbai")}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SEO title="Local Campaigns Hub" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black text-gray-900 dark:text-white uppercase tracking-wider">Local <span className="text-primary-gold">Campaigns</span></h1>
          <p className="text-gray-500 dark:text-primary-offwhite/50 text-sm mt-2 uppercase tracking-widest font-bold font-body">Active & Upcoming Missions Near You</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 border-gray-200 dark:border-white/10 flex-1 md:flex-none">
             <Info className="text-primary-gold" size={20} />
             <span className="text-[10px] font-black uppercase text-gray-600 dark:text-primary-offwhite/70">Points reset in 22 days</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {campaigns.map((camp, idx) => (
          <motion.div 
            key={camp.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-[3rem] bg-white border border-gray-200 dark:bg-[#0A0A0F] dark:border-white/10 hover:border-primary-gold/50 transition-all shadow-xl shadow-black/5 flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-6">
               <div className={"w-16 h-16 rounded-2xl flex items-center justify-center border " + camp.iconBg}>
                  <MapPin size={24} className={camp.iconColor} />
               </div>
               <div className="text-right">
                  <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-md ${camp.isUrgent ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-primary-offwhite/60'}`}>
                    {camp.slot}
                  </span>
                  <div className="flex items-center gap-1 mt-2 text-primary-gold font-black uppercase text-[10px]">
                     <Star size={12} /> {camp.impact}
                  </div>
               </div>
            </div>

            <h3 className="text-2xl font-heading font-black text-gray-900 dark:text-white uppercase mb-4 leading-tight">{camp.title}</h3>
            <p className="text-gray-500 dark:text-primary-offwhite/60 text-sm mb-6 leading-relaxed flex-1">
              {camp.desc}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-gray-100 dark:border-white/5">
               <button onClick={() => handleMapRedirect(camp.loc)} className="flex items-center gap-3 group text-left">
                  <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg group-hover:bg-primary-gold/10 transition-colors">
                     <MapPin size={14} className="text-primary-gold" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase text-gray-900 dark:text-white tracking-widest">{camp.loc}</p>
                     <p className="text-[8px] uppercase font-bold text-gray-400">View Map</p>
                  </div>
               </button>
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg">
                     <Calendar size={14} className="text-primary-gold" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase text-gray-900 dark:text-white tracking-widest">{camp.date}</p>
                     <p className="text-[8px] uppercase font-bold text-gray-400">Date & Time</p>
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
               <div className="flex -space-x-3 overflow-hidden">
                  {[1,2,3].map(i => (
                     <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#0A0A0F]" src={`https://i.pravatar.cc/100?u=${camp.id+i}`} alt="vol" />
                  ))}
                  <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#0A0A0F] bg-gray-100 dark:bg-white/10 text-[8px] font-black uppercase">
                     +{camp.volunteers - 3}
                  </div>
               </div>
               <button className="px-8 py-3 bg-gray-900 text-white dark:bg-white dark:text-[#0A0A0F] font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-primary-gold hover:text-gray-900 transition-all flex items-center gap-2">
                  Join Campaign <ArrowRight size={14} />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerCampaigns;
