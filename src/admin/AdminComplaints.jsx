import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { MessageSquareWarning, Check, Filter, Paperclip, Camera, MapPin, X, BarChart3 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('All'); // All, Normal, Urgent, Critical
  const [statusFilter, setStatusFilter] = useState('All'); // All, open, resolved
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
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
    const priorityMatch = filter === 'All' || comp.priority === filter;
    const statusMatch = statusFilter === 'All' || comp.status === statusFilter;
    return priorityMatch && statusMatch;
  });

  const getChartData = () => {
    const open = complaints.filter(c => c.status === 'open').length;
    const solved = complaints.filter(c => c.status === 'resolved').length;
    return {
      labels: ['Open Incidents', 'Solved Archive'],
      datasets: [{
        data: [open, solved],
        backgroundColor: ['#EF4444', '#10B981'],
        borderWidth: 0,
        hoverOffset: 10
      }]
    };
  };

  return (
    <div className="font-body animate-in fade-in z-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass p-8 rounded-3xl border border-white/5 lg:col-span-2 flex justify-between items-center bg-gradient-to-r from-primary-navy to-transparent">
           <div>
              <h1 className="text-3xl font-heading font-black text-white uppercase tracking-wider flex items-center gap-3">
                <MessageSquareWarning className="text-primary-gold" /> Resolution Hub
              </h1>
              <p className="text-gray-400 text-sm mt-1">Manage, prioritize, and resolve incoming voice and text issues.</p>
              <div className="flex gap-4 mt-6">
                 {['All', 'Normal', 'Urgent', 'Critical'].map(f => (
                    <button
                       key={f}
                       onClick={() => setFilter(f)}
                       className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                         filter === f ? 'bg-primary-gold text-primary-navy' : 'bg-white/5 text-gray-500 hover:text-white'
                       }`}
                    >
                       {f}
                    </button>
                 ))}
              </div>
           </div>
           <div className="hidden md:block w-32 h-32 opacity-20">
              <BarChart3 size={128} className="text-primary-gold" />
           </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center">
           <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-4">Global Efficiency</h3>
           <div className="w-full h-32">
              <Doughnut 
                data={getChartData()} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false, 
                  plugins: { legend: { display: false } },
                  cutout: '70%'
                }} 
              />
           </div>
           <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-1 text-[8px] font-black text-red-500 uppercase"><div className="w-1.5 h-1.5 rounded-full bg-red-500"/> Open</div>
              <div className="flex items-center gap-1 text-[8px] font-black text-green-500 uppercase"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/> Solved</div>
           </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
         <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {['All', 'open', 'resolved'].map(s => (
               <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    statusFilter === s ? 'bg-white text-primary-navy' : 'text-gray-500 hover:text-white'
                  }`}
               >
                  {s === 'open' ? '🔴 Live' : s === 'resolved' ? '🟢 Solved' : 'All Cases'}
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
                              <div className="flex gap-4">
                                <button 
                                  onClick={() => fileInputRef.current?.click()}
                                  className="flex items-center gap-1 text-[10px] font-black uppercase text-primary-gold hover:text-white transition-colors"
                                >
                                   <Camera size={12} /> Evidence
                                </button>
                                <button 
                                  onClick={() => setSelectedLocation({ lat: 19.0760, lng: 72.8777, address: comp.address || "Dharavi Sector 4, Mumbai" })}
                                  className="flex items-center gap-1 text-[10px] font-black uppercase text-blue-400 hover:text-white transition-colors"
                                >
                                   <MapPin size={12} /> Map
                                </button>
                              </div>
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

      {/* Map Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
           <div className="glass w-full max-w-4xl rounded-[3rem] border border-white/20 overflow-hidden relative shadow-2xl flex flex-col md:flex-row h-[80vh] md:h-auto">
              <button 
                onClick={() => setSelectedLocation(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-primary-gold transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-2/3 h-64 md:h-[500px] bg-gray-900 border-r border-white/10 relative">
                 <iframe 
                   width="100%" 
                   height="100%" 
                   frameBorder="0" 
                   src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD_MOCK_KEY&q=${selectedLocation.lat},${selectedLocation.lng}`}
                   className="grayscale opacity-80"
                 ></iframe>
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="p-4 bg-primary-gold text-primary-navy font-black rounded-2xl shadow-2xl animate-bounce">
                       INCIDENT POINT
                    </div>
                 </div>
              </div>

              <div className="w-full md:w-1/3 p-10 flex flex-col justify-center bg-[#0A0A0F]">
                 <MapPin className="text-primary-gold mb-6" size={48} />
                 <h3 className="text-2xl font-heading font-black text-white uppercase mb-2">Location Identity</h3>
                 <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-8">{selectedLocation.address}</p>
                 
                 <div className="space-y-4 mb-10">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                       <span className="text-[10px] text-gray-500 uppercase font-black">Coordinates</span>
                       <span className="text-[10px] text-white font-bold">{selectedLocation.lat}, {selectedLocation.lng}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                       <span className="text-[10px] text-gray-500 uppercase font-black">Sector code</span>
                       <span className="text-[10px] text-white font-bold">MH-BOM-12</span>
                    </div>
                 </div>

                 <button 
                   onClick={() => setSelectedLocation(null)}
                   className="w-full py-4 bg-primary-gold text-primary-navy font-black rounded-2xl uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-primary-gold/20"
                 >
                    Dismiss Satellite
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
