import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, MapPin, Send, PlusCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';

const OfficerFieldWorks = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([
     { id: 1, title: 'Slum Relief Camp Day 2', location: 'Navi Mumbai', description: 'Distributed 400 ration kits. Documentation complete.', date: 'Oct 24, 2025', status: 'Approved' },
     { id: 2, rural: true, title: 'Solar Panel Inspection', location: 'Village Ward 9', description: 'All 15 panels installed yesterday are functioning at 98% efficiency.', date: 'Oct 22, 2025', status: 'Pending Review' }
  ]);

  const [form, setForm] = useState({ title: '', desc: '', loc: '' });

  const submitReport = (e) => {
     e.preventDefault();
     if(!form.title) return;
     
     const newReport = {
        id: Date.now(),
        title: form.title,
        location: form.loc || currentUser?.region || 'Mumbai',
        description: form.desc,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Just Uploaded'
     };
     setReports([newReport, ...reports]);
     setForm({ title: '', desc: '', loc: '' });
     toast.success("Field Report Uploaded to HQ");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <SEO title="Field Operations Hub" />
      
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-heading font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">
            Field Records
          </h2>
          <p className="text-sm font-bold tracking-widest uppercase text-gray-500 dark:text-primary-offwhite/50">
            Log your ground operations and site visits
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
         {/* Form */}
         <div className="lg:col-span-1 glass p-8 rounded-[3rem] border border-gray-200 dark:border-white/5 shadow-2xl h-fit">
            <h3 className="flex items-center gap-3 text-lg font-heading font-black uppercase text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-4 mb-6">
               <PlusCircle size={20} className="text-primary-gold" /> New Entry
            </h3>

            <form onSubmit={submitReport} className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-500 dark:text-white tracking-widest">Operation Title</label>
                 <input 
                   type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                   className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-primary-gold placeholder:text-gray-400 dark:placeholder:text-white/20" 
                   placeholder="e.g. Village Camp Delivery"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-500 dark:text-white tracking-widest flex items-center gap-2"><MapPin size={12}/> GPS / Location Tracker</label>
                 <input 
                   type="text" value={form.loc} onChange={e => setForm({...form, loc: e.target.value})}
                   className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-primary-gold" 
                   placeholder={currentUser?.region || 'Enter location'}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-500 dark:text-white tracking-widest">Ground Status / Summary</label>
                 <textarea 
                   rows="4" required value={form.desc} onChange={e => setForm({...form, desc: e.target.value})}
                   className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm font-body text-gray-900 dark:text-white outline-none focus:border-primary-gold resize-none" 
                   placeholder="Enter details of the field mission..."
                 />
               </div>
               
               <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 bg-primary-gold text-[#0A0A0F] font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all text-xs tracking-widest uppercase">
                  <Send size={16} /> Broadcast Report
               </button>
            </form>
         </div>

         {/* Log Array */}
         <div className="lg:col-span-2 space-y-6">
            {reports.map((item) => (
               <div key={item.id} className="p-8 rounded-[3rem] bg-white dark:bg-[#0A0F1E] border border-gray-200 dark:border-white/5 shadow-xl transition-transform hover:-translate-y-1">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
                     <div>
                        <h4 className="text-xl font-heading font-black text-gray-900 dark:text-white uppercase leading-none mb-2">{item.title}</h4>
                        <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-gray-500 dark:text-primary-offwhite/50 tracking-widest">
                           <span className="flex items-center gap-1"><MapPin size={12} className="text-primary-gold" /> {item.location}</span>
                           <span>{item.date}</span>
                        </div>
                     </div>
                     <span className={`mt-4 sm:mt-0 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        item.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                     }`}>
                        {item.status}
                     </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-primary-offwhite/80 font-body text-sm leading-relaxed mb-8">
                     {item.description}
                  </p>

                  <div className="flex items-center gap-4">
                     <button className="flex items-center gap-2 px-5 py-2 glass rounded-lg text-[10px] font-black uppercase tracking-widest text-primary-navy dark:text-white border border-gray-300 dark:border-white/20 hover:border-primary-gold transition-colors">
                        <Camera size={14} className="text-primary-gold" /> Attach Photographic Evidence
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default OfficerFieldWorks;
