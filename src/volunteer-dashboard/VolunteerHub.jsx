import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Sparkles, MapPin, Calendar, Clock, Star, ArrowRight, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { toast } from 'react-toastify';

const VolunteerHub = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [joinedCampaigns, setJoinedCampaigns] = useState(new Set());
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync existing RSVPs on load
  useEffect(() => {
    const fetchRSVPs = async () => {
      if (!currentUser?.uid) return;
      try {
        const q = query(collection(db, 'campaign_rsvps'), where('volunteerId', '==', currentUser.uid));
        const snap = await getDocs(q);
        const joinedSet = new Set(snap.docs.map(doc => doc.data().campaignId));
        setJoinedCampaigns(joinedSet);
      } catch (err) {
        console.warn("Failed to fetch RSVPs (Mock mode active)");
      }
    };
    fetchRSVPs();
  }, [currentUser]);

  const handleRSVP = async (campaign) => {
    if (joinedCampaigns.has(campaign.id)) {
      toast.info("You've already joined this mission!");
      return;
    }

    setIsSyncing(true);
    try {
      // 1. Log RSVP in Firestore
      await addDoc(collection(db, 'campaign_rsvps'), {
        volunteerId: currentUser.uid,
        volunteerName: currentUser.name,
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        status: 'joined',
        timestamp: serverTimestamp()
      });

      // 2. Mock: Update Impact Points in Firestore if user doc exists
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          impactPoints: increment(50)
        });
      } catch (e) { /* user doc might not exist yet */ }

      setJoinedCampaigns(prev => new Set([...prev, campaign.id]));
      toast.success(`Success! Joining ${campaign.title}`);
    } catch (err) {
      console.error("RSVP Error:", err);
      toast.error("Network error. Syncing mission failed.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLocationClick = (loc) => {
    // Advanced: Use coordinates for 'exact' location if possible, otherwise descriptive strings
    const exactLocMap = {
      'Dharavi Sector 4': 'Dharavi+Sector+4,Mumbai,Maharashtra',
      'Juhu Beach': 'Juhu+Beach,Mumbai,Maharashtra',
      'Kandivali East': 'Kandivali+East,Mumbai,Maharashtra',
      'Worli Koliwada': 'Worli+Koliwada,Mumbai,Maharashtra'
    };
    const query = exactLocMap[loc] || encodeURIComponent(loc + ", Mumbai");
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const [selectedDetails, setSelectedDetails] = useState(null);

  const handleViewMap = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=NGO+vulnerable+areas+Mumbai`, '_blank');
  };

  const activeCampaigns = [
    { id: 1, title: 'Slum Education Drive', loc: 'Dharavi Sector 4', date: 'Tomorrow, 09:00 AM', slot: '4/10 slots left', iconColor: 'text-emerald-500', iconBg: 'bg-emerald-500/10 border-emerald-500/20', isUrgent: false },
    { id: 2, title: 'Coastal Cleanup', loc: 'Juhu Beach', date: 'Sunday, 06:00 AM', slot: '22/50 slots left', iconColor: 'text-blue-500', iconBg: 'bg-blue-500/10 border-blue-500/20', isUrgent: false },
    { id: 3, title: 'Ration Distribution', loc: 'Kandivali East', date: 'Nov 5, 12:00 PM', slot: 'Urgent: 12 Needed', iconColor: 'text-rose-500', iconBg: 'bg-rose-500/10 border-rose-500/20', isUrgent: true },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <SEO title="Volunteer Hub" />
      
      {/* Welcome & Status Banner */}
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-orange-500 to-rose-600 p-10 md:p-16 text-white shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
         
         <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div>
               <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30 backdrop-blur-md flex items-center gap-1">
                     <Sparkles size={12} /> Priority Volunteer
                  </span>
               </div>
               <h2 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tight mb-4 leading-tight">
                 Hello, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Volunteer'}
               </h2>
               <p className="text-white/80 font-body leading-relaxed max-w-md">
                 Thank you for being part of the Lakshmi NGO network. Your dedication has consistently made a difference across our critical outreach sectors.
               </p>
            </div>
            
            <div className="flex justify-end">
               <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] text-center w-full max-w-xs shadow-2xl ring-1 ring-black/5">
                  <Star size={40} className="mx-auto text-yellow-300 mb-4 drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]" />
                  <p className="text-4xl font-black font-heading tracking-widest mb-1">{currentUser?.impactPoints || 120}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-white/70">Lifetime Impact Points</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* My Commitments */}
         <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-heading font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 pb-4 border-b border-gray-200 dark:border-white/10">
               My Commitments
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200 dark:bg-[#0A0A0F] dark:border-white/10 shadow-lg group hover:border-orange-500/50 transition-colors">
                 <div className="flex gap-4">
                    <div className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl h-fit">
                       <Calendar size={24} className="text-orange-500" />
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-black text-orange-500 tracking-widest mb-1">Upcoming Shift</p>
                       <h4 className="font-heading font-black text-gray-900 dark:text-white uppercase mb-2 leading-tight">Orphanage Tech Drive</h4>
                       <p className="text-xs font-bold text-gray-500 dark:text-primary-offwhite/50 tracking-widest uppercase mb-4 flex items-center gap-1">
                          <Clock size={12}/> SAT 10:00 AM
                       </p>
                       <button 
                         onClick={() => setSelectedDetails({
                           title: 'Orphanage Tech Drive',
                           desc: 'A monthly initiative to teach digital skills to 50+ children at the local municipal orphanage.',
                           date: 'SAT 10:00 AM',
                           loc: 'Mumbai Central Hub'
                         })}
                         className="w-full py-2 bg-orange-500/10 text-orange-600 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-orange-500 hover:text-white transition-colors"
                       >
                          View Details
                       </button>
                    </div>
                 </div>
              </div>

              <div className="p-8 rounded-3xl bg-gray-100 dark:bg-white/5 border border-transparent shadow-inner text-center flex flex-col justify-center">
                 <Shield size={32} className="mx-auto text-gray-400 mb-4" />
                 <p className="text-sm font-bold text-gray-500 dark:text-primary-offwhite/50 mb-4 leading-relaxed">Complete your safety certification to unlock critical response missions.</p>
                  <button 
                    onClick={() => navigate('/volunteer-dashboard/modules')}
                    className="px-5 py-3 glass border border-gray-300 dark:border-white/20 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-900 dark:text-white hover:bg-white transition-all"
                  >
                     Begin Module
                  </button>
              </div>
            </div>
         </div>

         {/* Local Campaigns Feed */}
         <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-white/10">
                <h3 className="text-xl font-heading font-black text-gray-900 dark:text-white uppercase tracking-widest">
                   Local Initiatives Open
                </h3>
                <button 
                  onClick={handleViewMap}
                  className="text-[10px] uppercase font-black tracking-widest text-primary-gold hover:text-orange-500 transition-colors flex items-center gap-1"
                >
                   View Map <ArrowRight size={12} />
                </button>
            </div>

            <div className="space-y-4">
               {activeCampaigns.map((camp) => (
                  <div key={camp.id} className="flex flex-col sm:flex-row p-6 rounded-[2rem] bg-white border border-gray-200 dark:bg-[#0A0A0F] dark:border-white/10 hover:shadow-xl transition-all hover:-translate-y-1">
                     <div className="flex items-center gap-6 flex-1">
                        <div className={"w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border " + camp.iconBg}>
                           <MapPin size={24} className={camp.iconColor} />
                        </div>
                        <div className="flex-1">
                           <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
                              <h4 className="text-lg font-heading font-black uppercase text-gray-900 dark:text-white leading-tight">{camp.title}</h4>
                              <span className={camp.isUrgent ? 'text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-md bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-md bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-primary-offwhite/60'}>
                                 {camp.slot}
                              </span>
                           </div>
                           <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-gray-500 dark:text-primary-offwhite/50 tracking-widest">
                              <button 
                                onClick={() => handleLocationClick(camp.loc)}
                                className="hover:text-primary-gold transition-colors underline decoration-dotted underline-offset-4"
                              >
                                {camp.loc}
                              </button>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Calendar size={12}/> {camp.date}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center mt-6 sm:mt-0 sm:pl-6 sm:border-l border-gray-200 dark:border-white/10">
                        <button 
                          onClick={() => handleRSVP(camp)}
                          disabled={isSyncing || joinedCampaigns.has(camp.id)}
                          className={`w-full sm:w-auto px-8 py-4 font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg ${
                            joinedCampaigns.has(camp.id) 
                            ? 'bg-emerald-500 text-white cursor-default' 
                            : 'bg-gray-900 text-white dark:bg-white dark:text-[#0A0A0F] hover:scale-105 active:scale-95'
                          }`}
                        >
                          {joinedCampaigns.has(camp.id) ? (
                            <span className="flex items-center gap-2 tracking-tighter"><CheckCircle size={14}/> Mission Joined</span>
                          ) : 'RSVP Now'}
                          View Details
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Details Modal */}
      {selectedDetails && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-lg bg-white dark:bg-[#0A0A0F] rounded-[3rem] border border-gray-200 dark:border-white/10 p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary-gold/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                 <div className="flex justify-between items-start mb-6">
                    <h3 className="text-3xl font-heading font-black text-gray-900 dark:text-white uppercase leading-tight">{selectedDetails.title}</h3>
                    <button onClick={() => setSelectedDetails(null)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors">✕</button>
                 </div>
                 <p className="text-sm text-gray-500 dark:text-primary-offwhite/70 font-body mb-8 leading-relaxed">{selectedDetails.desc}</p>
                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                       <p className="text-[10px] font-black uppercase text-primary-gold mb-1">Time & Date</p>
                       <p className="text-xs font-bold text-gray-900 dark:text-white">{selectedDetails.date}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                       <p className="text-[10px] font-black uppercase text-primary-gold mb-1">Location</p>
                       <p className="text-xs font-bold text-gray-900 dark:text-white">{selectedDetails.loc}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => { handleRSVP(selectedDetails); setSelectedDetails(null); }} 
                   className="w-full py-4 bg-primary-gold text-primary-navy font-black text-sm uppercase tracking-widest rounded-2xl"
                 >
                   Confirm Mission
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerHub;
