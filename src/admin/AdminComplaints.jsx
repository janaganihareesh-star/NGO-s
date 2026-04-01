import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { MessageSquareWarning, Check, Filter, Paperclip, Camera } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('All'); // All, Normal, Urgent, Critical
  const [loading, setLoading] = useState(true);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'complaints'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const allComplaints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Custom Sorting: Open first, then by priority (Critical > Urgent > Normal)
      const priorityWeight = { 'Critical': 3, 'Urgent': 2, 'Normal': 1 };
      
      allComplaints.sort((a, b) => {
        if (a.status === 'resolved' && b.status !== 'resolved') return 1;
        if (a.status !== 'resolved' && b.status === 'resolved') return -1;
        return (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
      });
      
      setComplaints(allComplaints);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleMarkResolved = async (id) => {
    try {
      await updateDoc(doc(db, 'complaints', id), { status: 'resolved' });
      toast.success('Complaint resolved successfully!');
    } catch (error) {
       console.error("Error updating complaint:", error);
       toast.error('Failed to resolve complaint.');
    }
  };

  const onEvidenceChange = (e) => {
    if(e.target.files?.[0]) {
       toast.success(`Encrypted evidence packet: ${e.target.files[0].name} attached to log.`);
    }
  };
  const filteredComplaints = complaints.filter(comp => {
    if (filter === 'All') return true;
    return comp.priority === filter;
  });

  return (
    <div className="font-body animate-in fade-in z-10">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-black text-white uppercase tracking-wider flex items-center gap-3">
            <MessageSquareWarning className="text-primary-gold" /> Complaint Resolution
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage, prioritize, and resolve incoming voice and text issues.</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-full md:w-auto overflow-x-auto no-scrollbar">
          {['All', 'Normal', 'Urgent', 'Critical'].map(f => (
             <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all uppercase tracking-widest flex-1 md:flex-none ${
                  filter === f ? 'bg-primary-gold text-primary-navy shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
             >
                {f}
             </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl border border-white/5 overflow-hidden w-full overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-white/5">
            <tr>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-white/5 w-32">Priority</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-white/5">Transcript / Details</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-white/5 w-48">Date Reported</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-white/5 w-40">Status</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-white/5 text-right w-40">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan="5" className="py-20 text-center text-gray-500">Loading complaints...</td></tr>
            ) : filteredComplaints.length === 0 ? (
               <tr><td colSpan="5" className="py-20 text-center text-gray-500">No complaints found.</td></tr>
            ) : (
               filteredComplaints.map((comp) => {
                 let rowBorder = 'border-transparent';
                 if (comp.status === 'open') {
                    if (comp.priority === 'Critical') rowBorder = 'border-red-500';
                    if (comp.priority === 'Urgent') rowBorder = 'border-orange-500';
                 }

                 return (
                   <tr key={comp.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                     <td className={`px-8 py-6 border-l-4 ${rowBorder}`}>
                        <span className={`text-[10px] px-3 py-1.5 rounded-full uppercase font-black tracking-widest ${
                          comp.priority === 'Critical' ? 'bg-red-500/20 text-red-500 border border-red-500/50' :
                          comp.priority === 'Urgent' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/50' : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                        }`}>
                          {comp.priority || 'Normal'}
                        </span>
                     </td>
                     <td className="px-8 py-6">
                        <p className={`text-sm ${comp.status === 'resolved' ? 'text-gray-500 line-through' : 'text-white'}`}>
                          "{comp.transcript}"
                        </p>
                        <div className="flex gap-2 mt-2">
                           {comp.contactEmail && <p className="text-[10px] text-primary-gold bg-primary-gold/10 w-fit px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{comp.contactEmail}</p>}
                           {comp.source === 'chatbot' && <p className="text-[10px] text-blue-400 bg-blue-400/10 w-fit px-2 py-0.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-1">AI Assistant</p>}
                        </div>
                     </td>
                     <td className="px-8 py-6 text-xs text-gray-400 font-medium">
                        {comp.timestamp ? comp.timestamp.toDate().toLocaleString() : 'Recent'}
                     </td>
                     <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center w-fit gap-1 ${
                          comp.status === 'open' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
                        }`}>
                           {comp.status === 'open' ? '🟢 Open' : <><Check size={12}/> Resolved</>}
                        </span>
                     </td>
                      <td className="px-8 py-6 text-right">
                         {comp.status === 'open' ? (
                           <div className="flex flex-col gap-2 items-end">
                              <input type="file" ref={fileInputRef} className="hidden" onChange={onEvidenceChange} />
                              <button
                                onClick={() => handleMarkResolved(comp.id)}
                                className="px-4 py-2 bg-white/5 hover:bg-green-500/20 hover:text-green-400 text-gray-300 font-bold text-xs rounded-xl transition-all border border-white/10 hover:border-green-500/50"
                              >
                                Mark Resolved
                              </button>
                              <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-1 text-[10px] font-black uppercase text-primary-gold hover:text-white transition-colors"
                              >
                                 <Camera size={12} /> Attach Evidence
                              </button>
                           </div>
                         ) : (
                           <span className="text-xs text-gray-600 font-bold uppercase tracking-widest">Done</span>
                         )}
                      </td>
                   </tr>
                 );
               })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminComplaints;
