import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Mic, CheckCircle, Clock, MapPin, User as UserIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';

const OfficerComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'complaints'), orderBy('timestamp', 'desc'));
    
    // Listen to real-time changes
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComplaints(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to sync queue");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleVerify = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Verified' ? 'Pending Tracker' : 'Verified';
      await updateDoc(doc(db, 'complaints', id), {
        status: newStatus
      });
      toast.success(`Marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Verification failed");
    }
  };

  const priorityColors = {
    'Critical': 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    'Urgent': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    'Normal': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <SEO title="Complaints Verification" />
      
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-heading font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">
            Verification Queue
          </h2>
          <p className="text-sm font-bold tracking-widest uppercase text-gray-500 dark:text-primary-offwhite/50">
            Review and deploy field action
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0A0F1E] rounded-[3rem] p-8 border border-gray-200 dark:border-white/5 shadow-2xl">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-primary-offwhite/50">
             <CheckCircle size={48} className="mx-auto mb-4 text-emerald-500 opacity-50" />
             <p className="font-bold text-sm tracking-widest uppercase">Zero pending complaints</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {complaints.map((c) => (
              <div 
                key={c.id} 
                className={`flex flex-col md:flex-row gap-6 p-6 rounded-3xl border transition-all ${
                  c.status === 'Verified' 
                  ? 'border-emerald-500/30 bg-emerald-500/5' 
                  : c.priority === 'Critical' ? 'border-rose-500/30 bg-rose-500/5' : 'border-gray-200 dark:border-white/10 dark:bg-white/5'
                }`}
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${priorityColors[c.priority] || priorityColors['Normal']}`}>
                      {c.priority || 'Normal'}
                    </span>
                    {c.source === 'voice' && (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-black text-blue-500 tracking-widest bg-blue-500/10 px-3 py-1 rounded-md">
                        <Mic size={12} /> Voice Transcript
                      </span>
                    )}
                    {c.source === 'chatbot' && (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-black text-blue-400 tracking-widest bg-blue-400/10 px-3 py-1 rounded-md">
                        <Sparkles size={12} /> AI Submission
                      </span>
                    )}
                    <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-primary-offwhite/40 tracking-widest">
                       {c.timestamp ? c.timestamp.toDate().toLocaleString() : 'Recent'}
                    </span>
                  </div>

                  <p className="text-sm font-body text-gray-700 dark:text-primary-offwhite/80 leading-relaxed italic">
                    "{c.transcript}"
                  </p>

                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200 dark:border-white/10 text-[10px] uppercase font-black text-gray-500 dark:text-primary-offwhite/50 tracking-widest">
                    <span className="flex items-center gap-2"><UserIcon size={14} className="text-primary-gold" /> Name Hidden for Auth</span>
                  </div>
                </div>

                <div className="flex md:flex-col justify-end gap-3 md:items-end md:pl-6 md:border-l border-gray-200 dark:border-white/10">
                  <span className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${c.status === 'Verified' ? 'text-emerald-500' : 'text-orange-500'}`}>
                     {c.status === 'Verified' ? <CheckCircle size={16} /> : <Clock size={16} />}
                     {c.status || "Pending Tracker"}
                  </span>
                  
                  <button
                    onClick={() => handleVerify(c.id, c.status)}
                    className={`mt-auto px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 ${
                      c.status === 'Verified' 
                      ? 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white border border-transparent' 
                      : 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    }`}
                  >
                    {c.status === 'Verified' ? 'Revert to Pending' : 'Verify & Dispatch'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerComplaints;
