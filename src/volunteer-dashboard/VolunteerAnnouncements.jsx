import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Info, AlertTriangle, CheckCircle, ArrowRight, Calendar, Bookmark } from 'lucide-react';
import SEO from '../components/SEO';

const VolunteerAnnouncements = () => {
  const announcements = [
    { 
      id: 1, title: 'Annual Gala Night: Volunteers Needed!', type: 'Update', 
      date: 'Oct 28, 2024', status: 'Priority',
      desc: 'We are seeking 20 volunteers to help manage guests and registration for our Annual Charity Gala. Dinner and transportation provided.',
      icon: <Info className="text-blue-500" />
    },
    { 
      id: 2, title: 'Safety Training Refresh Mandatory', type: 'Alert', 
      date: 'Oct 25, 2024', status: 'Urgent',
      desc: 'All field volunteers must complete the Q4 safety refresher module by the end of this month to remain eligible for active missions.',
      icon: <AlertTriangle size={24} className="text-rose-500" />
    },
    { 
      id: 3, title: 'Lakshmi NGO X Global Outreach Partnership', type: 'News', 
      date: 'Oct 15, 2024', status: 'General',
      desc: 'We are thrilled to announce our partnership with Global Outreach! This will bring more resources to our local slum education drives.',
      icon: <Bell className="text-emerald-500" />
    },
    { 
      id: 4, title: 'Dharavi Slum Drive: Achievement Unlocked!', type: 'Update', 
      date: 'Oct 10, 2024', status: 'Success',
      desc: 'Congratulations to everyone who participated in the Dharavi drive! We reached 500+ children in just 2 days.',
      icon: <CheckCircle className="text-emerald-500" />
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SEO title="Volunteer Announcements" />
      
      <div className="flex justify-between items-end border-b border-gray-100 dark:border-white/5 pb-8">
        <div>
           <h1 className="text-4xl font-heading font-black text-gray-900 dark:text-white uppercase tracking-wider">Mission <span className="text-primary-gold">Broadcast</span></h1>
           <p className="text-gray-500 dark:text-primary-offwhite/50 text-sm mt-2 uppercase tracking-widest font-bold font-body">Latest Updates & Priority Action Items</p>
        </div>
        <div className="p-3 bg-primary-gold/10 text-primary-gold rounded-2xl relative">
           <Bell size={28} />
           <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-[#0A0A0F] animate-pulse" />
        </div>
      </div>

      <div className="space-y-4">
        {announcements.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group grid md:grid-cols-12 gap-8 p-8 bg-white dark:bg-[#0A0A0F] border border-gray-200 dark:border-white/10 rounded-[2.5rem] hover:border-primary-gold/40 shadow-xl transition-all"
          >
            <div className="md:col-span-1 flex items-start justify-center pt-2">
               <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
               </div>
            </div>

            <div className="md:col-span-9">
               <div className="flex gap-3 items-center mb-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-widest ${
                    item.status === 'Urgent' ? 'bg-rose-500/20 text-rose-500' :
                    item.status === 'Priority' ? 'bg-blue-500/20 text-blue-500' : 'bg-emerald-500/20 text-emerald-500'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1">
                     <Calendar size={12} /> {item.date}
                  </span>
               </div>
               <h3 className="text-xl font-heading font-black text-gray-900 dark:text-white uppercase mb-3 leading-tight marker:">{item.title}</h3>
               <p className="text-gray-500 dark:text-primary-offwhite/50 text-sm leading-relaxed">{item.desc}</p>
            </div>

            <div className="md:col-span-2 flex flex-col justify-center items-end gap-3 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 dark:border-white/5">
                <button className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors">
                   <Bookmark size={18} />
                </button>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-gold hover:text-orange-500 group">
                   Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerAnnouncements;
