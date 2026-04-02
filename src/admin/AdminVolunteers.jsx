import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Users, Mail, MapPin, Trash2, ShieldCheck, UserCheck, Search, Filter, Radio } from 'lucide-react';
import { toast } from 'react-toastify';
import VolunteerLiveMap from './VolunteerLiveMap';

const AdminVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All'); // All, Active, Pending

  useEffect(() => {
    const q = query(collection(db, 'volunteers'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setVolunteers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this volunteer?")) {
      try {
        await deleteDoc(doc(db, 'volunteers', id));
        toast.success("Volunteer removed successfully");
      } catch {
        toast.error("Failed to remove volunteer");
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Pending' : 'Active';
    try {
      await updateDoc(doc(db, 'volunteers', id), { status: newStatus });
      toast.info(`Volunteer status set to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filteredVolunteers = volunteers.filter(v => {
    const nameMatch = v.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      v.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filter === 'All' || v.status === filter;
    return nameMatch && statusMatch;
  });

  return (
    <div className="font-body animate-in fade-in duration-700 space-y-8">
      <div className="glass p-8 rounded-3xl border border-white/5 bg-gradient-to-r from-emerald-500/10 to-transparent">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-heading font-black text-white uppercase tracking-wider flex items-center gap-3">
              <Users className="text-emerald-500" /> Volunteer Registry
            </h1>
            <p className="text-gray-400 text-sm mt-1">Manage global mission participants and security clearances.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search Nexus..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs focus:outline-none focus:border-emerald-500/50 transition-all text-white min-w-[250px]"
              />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* NEXUS LIVE RADAR */}
      <div className="glass rounded-[3rem] border border-white/5 relative overflow-hidden shadow-2xl">
         <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
            <div>
               <h3 className="text-xl font-heading font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <Radio className="text-primary-gold animate-pulse" /> NEXUS LIVE RADAR
               </h3>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Real-time deployment tracking for active agents.</p>
            </div>
         </div>
         <div className="p-2">
            <VolunteerLiveMap />
         </div>
      </div>

      <div className="glass rounded-3xl border border-white/5 overflow-hidden w-full overflow-x-auto no-scrollbar shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-white/5">
            <tr>
              <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-white/5">Volunteer Identity</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-white/5">Deployment & Date</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-white/5">Clearance Status</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-white/5 text-right">Nexus Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="py-20 text-center text-gray-500 font-bold uppercase text-xs tracking-widest animate-pulse">Scanning Registry...</td></tr>
            ) : filteredVolunteers.length === 0 ? (
              <tr><td colSpan="4" className="py-20 text-center text-gray-500 font-bold uppercase text-xs tracking-widest">No matching agents found</td></tr>
            ) : (
              filteredVolunteers.map((vol) => (
                <tr key={vol.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black text-xl group-hover:bg-emerald-500 group-hover:text-primary-navy transition-all duration-500">
                        {vol.fullName?.charAt(0) || 'V'}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors">{vol.fullName}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                          <Mail size={10} className="text-emerald-500/50" /> {vol.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase">
                      <MapPin size={12} className="text-primary-gold" /> {vol.city || 'Global'}
                    </div>
                    <p className="text-[9px] text-gray-600 font-medium mt-1 uppercase tracking-tighter">
                      Joined: {vol.createdAt ? (vol.createdAt.toDate ? vol.createdAt.toDate().toLocaleDateString() : new Date(vol.createdAt).toLocaleDateString()) : 'N/A'}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => handleToggleStatus(vol.id, vol.status)}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                        vol.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white' 
                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500 hover:text-white'
                      }`}
                    >
                      {vol.status === 'Active' ? <UserCheck size={14}/> : <ShieldCheck size={14}/>}
                      {vol.status || 'Active'}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleDelete(vol.id)}
                      className="p-3 text-gray-500 hover:text-red-500 bg-white/5 hover:bg-red-500/10 rounded-xl border border-white/10 hover:border-red-500/30 transition-all shadow-lg active:scale-90"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVolunteers;
