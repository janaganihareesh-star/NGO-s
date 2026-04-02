import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Star, Users, ArrowRight, CheckCircle, Info } from 'lucide-react';
import SEO from '../components/SEO';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { toast } from 'react-toastify';

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

  const { currentUser } = useAuth();
  const [joinedCampaigns, setJoinedCampaigns] = React.useState(new Set());
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [selectedCampaign, setSelectedCampaign] = React.useState(null);

  React.useEffect(() => {
    const fetchRSVPs = async () => {
      if (!currentUser?.uid) return;
      try {
        const q = query(collection(db, 'campaign_rsvps'), where('volunteerId', '==', currentUser.uid));
        const snap = await getDocs(q);
        const joinedSet = new Set(snap.docs.map(doc => doc.data().campaignId));
        setJoinedCampaigns(joinedSet);
      } catch { console.warn("RSVP fetch failed."); }
    };
    fetchRSVPs();
  }, [currentUser]);

  const handleJoinCampaign = async (camp) => {
    if (joinedCampaigns.has(camp.id)) return;
    setIsSyncing(true);
    try {
      if (currentUser?.uid) {
        await addDoc(collection(db, 'campaign_rsvps'), {
          volunteerId: currentUser.uid,
          volunteerName: currentUser.name || 'Volunteer',
          campaignId: camp.id,
          campaignTitle: camp.title,
          status: 'joined',
          timestamp: serverTimestamp()
        });
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, { impactPoints: increment(100) });
      }
    } catch {
       console.warn("Mock mode active. Skipping Firebase DB writes.");
    } finally {
      // Visually join instantly
      setJoinedCampaigns(prev => new Set([...prev, camp.id]));
      setIsSyncing(false);
      toast.success(`Mission Active: Joining ${camp.title}`);
      
      // Redirect to external contact/mail to finalize join (per user request)
      setTimeout(() => {
        window.location.href = `mailto:volunteer@lakshmingo.org?subject=Joining%20Campaign:%20${encodeURIComponent(camp.title)}`;
      }, 1000);
    }
  };

  const handleMapRedirect = (loc) => {
    const exactLocMap = {
      'Dharavi Sector 4': 'Dharavi+Sector+4,Mumbai,Maharashtra',
      'Juhu Beach': 'Juhu+Beach,Mumbai,Maharashtra',
      'Kandivali East': 'Kandivali+East,Mumbai,Maharashtra',
      'Worli Koliwada': 'Worli+Koliwada,Mumbai,Maharashtra'
    };
    const query = exactLocMap[loc] || encodeURIComponent(loc + ", Mumbai");
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
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
                 <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleJoinCampaign(camp)}
                      disabled={isSyncing || joinedCampaigns.has(camp.id)}
                      className={`px-8 py-3 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                        joinedCampaigns.has(camp.id)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-900 text-white dark:bg-white dark:text-[#0A0A0F] hover:bg-primary-gold hover:text-gray-900'
                      }`}
                    >
                       {joinedCampaigns.has(camp.id) ? (
                         <><CheckCircle size={14} /> Mission Joined</>
                       ) : (
                         <>Join Campaign <ArrowRight size={14} /></>
                       )}
                    </button>
                    <button 
                      onClick={() => setSelectedCampaign(camp)}
                      className="px-8 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary-gold transition-colors border border-transparent hover:border-primary-gold/20 rounded-xl"
                    >
                       View Details
                    </button>
                 </div>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-lg bg-white dark:bg-[#0A0A0F] rounded-[3rem] border border-gray-200 dark:border-white/10 p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary-gold/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                 <div className="flex justify-between items-start mb-6">
                    <h3 className="text-3xl font-heading font-black text-gray-900 dark:text-white uppercase leading-tight">{selectedCampaign.title}</h3>
                    <button onClick={() => setSelectedCampaign(null)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors">✕</button>
                 </div>
                 <p className="text-sm text-gray-500 dark:text-primary-offwhite/70 font-body mb-8 leading-relaxed">{selectedCampaign.desc}</p>
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                       <MapPin size={20} className="text-primary-gold" />
                       <div>
                          <p className="text-[10px] font-black uppercase text-gray-400">Target Zone</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{selectedCampaign.loc}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                       <Calendar size={20} className="text-primary-gold" />
                       <div>
                          <p className="text-[10px] font-black uppercase text-gray-400">Scheduled Time</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{selectedCampaign.date}</p>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={() => { handleJoinCampaign(selectedCampaign); setSelectedCampaign(null); }} 
                   className={`w-full py-4 font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl ${
                     joinedCampaigns.has(selectedCampaign.id)
                     ? 'bg-emerald-500 text-white cursor-default'
                     : 'bg-primary-gold text-primary-navy hover:scale-105 active:scale-95'
                   }`}
                 >
                   {joinedCampaigns.has(selectedCampaign.id) ? 'Already Enrolled' : 'Confirm Mission Participation'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerCampaigns;
