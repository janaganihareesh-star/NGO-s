import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Mic, CheckCircle, Clock, MapPin, User as UserIcon, Search, Filter, Shield, Send, X, AlertTriangle, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';

const OfficerComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  
  // Dispatch Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [dispatchForm, setDispatchForm] = useState({ agentName: '', notes: '' });

  useEffect(() => {
    const q = query(collection(db, 'complaints'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComplaints(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!dispatchForm.agentName) return toast.error("Agent name required");

    try {
      await updateDoc(doc(db, 'complaints', selectedComplaint.id), {
        status: 'In Transit',
        agent: dispatchForm.agentName,
        dispatchNotes: dispatchForm.notes,
        dispatchedAt: serverTimestamp()
      });
      toast.success(`Agent ${dispatchForm.agentName} Dispatched`);
      setSelectedComplaint(null);
      setDispatchForm({ agentName: '', notes: '' });
    } catch (err) {
      toast.error("Dispatch failed");
    }
  };

  const updateStatus = async (id, status) => {
     try {
        await updateDoc(doc(db, 'complaints', id), { status });
        toast.info(`Status updated to ${status}`);
     } catch (e) { toast.error("Update failed"); }
  };

  const filtered = complaints.filter(c => {
     const matchesSearch = c.transcript?.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesFilter = filterPriority === 'All' || c.priority === filterPriority;
     return matchesSearch && matchesFilter;
  });

  const priorityColors = {
    'Critical': 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    'Urgent': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    'Normal': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <SEO title="Operational Queue" />
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-heading font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2 leading-none">
             Verification <span className="text-primary-gold">Nexus</span>
          </h2>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 dark:text-primary-offwhite/50">
             Real-time distress signals & field deployment
          </p>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
           <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                 type="text" 
                 placeholder="Search transcripts..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:border-primary-gold text-xs font-bold w-full sm:w-64"
              />
           </div>
           <div className="flex items-center gap-2 bg-white dark:bg-white/5 px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10">
              <Filter size={14} className="text-primary-gold" />
              <select 
                 value={filterPriority} 
                 onChange={(e) => setFilterPriority(e.target.value)}
                 className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-white"
              >
                 <option>All</option>
                 <option>Critical</option>
                 <option>Urgent</option>
                 <option>Normal</option>
              </select>
           </div>
        </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="py-20 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-gold mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="glass p-20 text-center rounded-[3rem] border border-dashed border-gray-300 dark:border-white/10">
             <CheckCircle size={40} className="mx-auto mb-4 text-emerald-500 opacity-30" />
             <p className="text-xs font-black uppercase tracking-widest text-gray-400">Tactical Queue Empty</p>
          </div>
        ) : (
          filtered.map((c) => (
            <motion.div 
               layout
               key={c.id} 
               className={`glass p-8 rounded-[2.5rem] border transition-all flex flex-col md:flex-row gap-8 ${
                 c.status === 'Resolved' ? 'opacity-50 grayscale' : 
                 c.priority === 'Critical' ? 'border-rose-500/30' : 'border-gray-200 dark:border-white/5'
               }`}
            >
               <div className="flex-1 space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                     <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] border ${priorityColors[c.priority] || priorityColors['Normal']}`}>
                        {c.priority || 'Normal'}
                     </span>
                     <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] ${
                        c.status === 'In Transit' ? 'bg-blue-500/10 text-blue-500' : 
                        c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-100 dark:bg-white/5 text-gray-400'
                     }`}>
                        {c.status || 'Pending'}
                     </span>
                     <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Clock size={12}/> {c.timestamp?.toDate().toLocaleString()}</span>
                  </div>

                  <div className="relative">
                     <p className="text-lg font-body text-gray-800 dark:text-primary-offwhite/90 leading-relaxed italic">
                        "{c.transcript}"
                     </p>
                     {c.source === 'chatbot' && <Sparkles size={20} className="absolute -left-10 top-1 text-primary-gold opacity-20 hidden md:block" />}
                  </div>

                  {c.agent && (
                     <div className="flex items-center gap-4 p-4 bg-primary-gold/5 border border-primary-gold/10 rounded-2xl w-fit">
                        <Shield size={16} className="text-primary-gold" />
                        <div>
                           <p className="text-[8px] font-black uppercase text-primary-gold tracking-widest">Active Agent</p>
                           <p className="text-xs font-bold dark:text-white uppercase">{c.agent}</p>
                        </div>
                     </div>
                  )}
               </div>

               <div className="md:w-64 flex flex-col gap-3 justify-center md:pl-8 md:border-l border-gray-100 dark:border-white/5">
                  {c.status !== 'Resolved' ? (
                     <>
                        <button 
                           onClick={() => setSelectedComplaint(c)}
                           className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-primary-navy font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl hover:scale-105 transition-all"
                        >
                           Deploy Dispatch
                        </button>
                        <button 
                           onClick={() => updateStatus(c.id, 'Resolved')}
                           className="w-full py-3 border border-gray-200 dark:border-white/10 text-gray-500 hover:text-emerald-500 hover:border-emerald-500 transition-all font-black text-[9px] uppercase tracking-widest rounded-xl"
                        >
                           Close Mission
                        </button>
                     </>
                  ) : (
                     <p className="text-[10px] font-black uppercase text-emerald-500 text-center tracking-widest flex items-center justify-center gap-2">
                        <CheckCircle size={14}/> Mission Resolved
                     </p>
                  )}
               </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Dispatch Modal */}
      <AnimatePresence>
         {selectedComplaint && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-md"
                  onClick={() => setSelectedComplaint(null)}
               />
               <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="relative w-full max-w-lg glass bg-white dark:bg-[#0A0A0F] border-2 border-primary-gold rounded-[3rem] p-10 overflow-hidden"
               >
                  <button onClick={() => setSelectedComplaint(null)} className="absolute top-8 right-8 text-gray-400 hover:text-white"><X/></button>
                  
                  <div className="flex items-center gap-4 mb-8 border-b border-gray-100 dark:border-white/5 pb-6">
                     <div className="p-3 bg-primary-gold/10 rounded-2xl text-primary-gold"><Shield size={24}/></div>
                     <div>
                        <h3 className="text-xl font-heading font-black text-gray-900 dark:text-white uppercase">Field Dispatch</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Complaints Node: {selectedComplaint.id.slice(0,8)}</p>
                     </div>
                  </div>

                  <form onSubmit={handleDispatch} className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Assigned Agent</label>
                        <input 
                           required
                           type="text" 
                           placeholder="e.g. Officer Vikram K."
                           value={dispatchForm.agentName}
                           onChange={(e) => setDispatchForm({...dispatchForm, agentName: e.target.value})}
                           className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-2xl outline-none focus:border-primary-gold text-sm font-bold dark:text-white"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Dispatch Notes</label>
                        <textarea 
                           rows={3}
                           placeholder="Operational details for the field agent..."
                           value={dispatchForm.notes}
                           onChange={(e) => setDispatchForm({...dispatchForm, notes: e.target.value})}
                           className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-2xl outline-none focus:border-primary-gold text-sm font-bold dark:text-white resize-none"
                        />
                     </div>
                     
                     <button type="submit" className="w-full py-5 bg-primary-gold text-primary-navy font-black uppercase tracking-widest text-xs rounded-2xl shadow-[0_0_30px_rgba(201,147,58,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                        <Send size={18}/> Initiate Deployment
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default OfficerComplaints;
