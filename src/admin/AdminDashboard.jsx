import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { useTheme } from '../context/ThemeContext';
import VolunteerLiveMap from './VolunteerLiveMap';
import { Mail, MapPin, Briefcase } from 'lucide-react';

const AdminDashboard = () => {
  const { isDarkMode } = useTheme();
  const [recentVolunteers, setRecentVolunteers] = useState([]);

  useEffect(() => {
    // Fetch Recent Volunteers instantly for the list
    const volQ = query(collection(db, 'volunteers'), orderBy('createdAt', 'desc'), limit(15));
    const unsubRecentVol = onSnapshot(volQ, (snap) => setRecentVolunteers(snap.docs.map(d => ({id: d.id, ...d.data()}))));

    return () => unsubRecentVol();
  }, []);

  return (
    <div className="font-body space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className={`${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'} border p-6 rounded-3xl backdrop-blur-md flex justify-between items-center`}>
        <div>
          <h1 className={`text-3xl font-heading font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} uppercase tracking-wider`}>Mission <span className="text-primary-gold">Control</span></h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1 font-bold`}>Simplified Volunteer & Deployment Logistics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simplified Volunteer List */}
        <div className={`glass p-8 rounded-3xl border ${isDarkMode ? 'border-white/5 bg-[#0A0A0F]' : 'border-gray-200 bg-white shadow-sm'}`}>
           <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-black uppercase tracking-widest text-sm text-primary-gold mb-6`}>New Agent Registry</h3>
           <div className="space-y-4 max-h-[600px] overflow-y-auto no-scrollbar pr-2">
             {recentVolunteers.length === 0 ? (
                <p className="text-gray-500 text-center py-10 font-bold uppercase tracking-widest text-xs">No volunteers enrolled yet</p>
             ) : (
                recentVolunteers.map(vol => (
                  <div key={vol.id} className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'} transition-colors group cursor-default`}>
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold font-black border border-primary-gold/20">
                              {vol.fullName?.charAt(0) || 'V'}
                           </div>
                           <div>
                              <h4 className={`text-base font-black uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{vol.fullName}</h4>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1"><Mail size={10}/> {vol.email}</p>
                           </div>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-2 mt-4 bg-black/5 dark:bg-black/20 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                           <MapPin size={12} className="text-emerald-500 shrink-0" />
                           <span className="truncate">{vol.city || vol.availability || 'Mumbai Base'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                           <Briefcase size={12} className="text-primary-gold shrink-0" />
                           <span className="truncate">{vol.skills || vol.interest || 'Field Work'}</span>
                        </div>
                     </div>
                  </div>
                ))
             )}
           </div>
        </div>

        {/* Live Map & Work (Radar) */}
        <div className="space-y-4 flex flex-col h-full">
           <div className="flex items-center justify-between px-2">
             <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-black uppercase tracking-widest text-sm`}>
               Agent Work & <span className="text-primary-gold">Radar</span>
             </h3>
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
               <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Live GPS Tracking</span>
             </div>
           </div>
           
           <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-600'} text-xs italic leading-relaxed`}>
              Interact with the map below to check your volunteers' locations and their currently assigned work/impact areas.
           </div>

           <div className="flex-1 min-h-[500px] w-full relative z-0">
             <VolunteerLiveMap />
           </div>
           
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
