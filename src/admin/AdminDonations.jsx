import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import { DollarSign, Search, Download, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [manualForm, setManualForm] = useState({ donorName: '', email: '', amount: '', method: 'Cash' });

  // Stats
  const [stats, setStats] = useState({ today: 0, month: 0, total: 0 });
  
  // Charts
  const [chartData, setChartData] = useState(new Array(12).fill(0));

  useEffect(() => {
    const q = query(collection(db, 'donations'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const allDonations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDonations(allDonations);
      
      let tot = 0, today = 0, month = 0;
      const monthly = new Array(12).fill(0);
      const now = new Date();
      
      allDonations.forEach(d => {
         const amt = Number(d.amount) || 0;
         tot += amt;
         
         if (d.timestamp) {
            const date = d.timestamp.toDate();
            // Check Today
            if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
               today += amt;
            }
            // Check This Month
            if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
               month += amt;
            }
            
            // Populate Last 12 months chart
            const monthDiff = now.getMonth() - date.getMonth() + (12 * (now.getFullYear() - date.getFullYear()));
            if (monthDiff >= 0 && monthDiff < 12) {
               monthly[11 - monthDiff] += amt;
            }
         }
      });
      
      setStats({ today, month, total: tot });
      setChartData(monthly);
      setLoading(false);
    });
    
    return () => unsub();
  }, []);

  const handleExportCSV = () => {
    if (donations.length === 0) {
      toast.info('No data to export.'); return;
    }
    
    const headers = ["Donor Name", "Email", "Amount", "Method", "Campaign", "Date"];
    const rows = donations.map(d => [
      (d.donorName || "Anonymous").replace(/,/g, ''),
      (d.email || "N/A").replace(/,/g, ''),
      d.amount || 0,
      (d.method || "N/A").toUpperCase(),
      d.campaignId || "general",
      d.timestamp ? d.timestamp.toDate().toLocaleString().replace(/,/g, '') : "N/A"
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Lakshmi_Donations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CSV Export Successful");
  };

  const handlePrintLedger = () => {
    window.print();
  };

  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!manualForm.amount || manualForm.amount <= 0) {
      toast.error('Amount must be greater than zero.'); return;
    }
    
    try {
      await addDoc(collection(db, 'donations'), {
         donorName: manualForm.donorName || "Anonymous",
         email: manualForm.email,
         amount: Number(manualForm.amount),
         method: manualForm.method,
         campaignId: 'manual_entry',
         timestamp: serverTimestamp()
      });
      toast.success('Manual donation recorded.');
      setManualForm({ donorName: '', email: '', amount: '', method: 'Cash' });
      setShowModal(false);
    } catch (e) {
      console.error(e);
      toast.error('Failed to add manual donation.');
    }
  };

  const filtered = donations.filter(d => {
    const term = searchTerm.toLowerCase();
    return (d.donorName || "").toLowerCase().includes(term) || (d.email || "").toLowerCase().includes(term);
  });

  const getMonthLabels = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const current = new Date().getMonth();
    return Array.from({length: 12}, (_, i) => months[(current - 11 + i + 12) % 12]);
  };

  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.05)' } } }
  };

  return (
    <div className="font-body animate-in fade-in z-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div>
          <h1 className="text-3xl font-heading font-black text-white uppercase tracking-wider flex items-center gap-3">
            <DollarSign className="text-primary-gold" /> Financial Tracker
          </h1>
          <p className="text-gray-400 text-sm mt-1">Real-time ledger and historic campaign performance.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full xl:w-auto">
           <button onClick={handlePrintLedger} className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-white/30 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all">
              Print Ledger
           </button>
           <button onClick={() => setShowModal(true)} className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-white/30 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all">
             <Plus size={16} /> Manual Entry
           </button>
           <button onClick={handleExportCSV} className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary-gold text-primary-navy font-bold rounded-xl hover:bg-white transition-all text-[10px] uppercase tracking-widest shadow-lg shadow-primary-gold/20">
             <Download size={16} /> Export CSV
           </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-green-500/10 to-transparent border-l-4 border-l-green-500 shadow-xl shadow-green-500/5">
           <p className="text-gray-400 uppercase tracking-widest text-[10px] font-black mb-1">Today's Total</p>
           <p className="text-3xl font-heading font-black text-white bg-clip-text">₹{stats.today.toLocaleString('en-IN')}</p>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-primary-gold/10 to-transparent border-l-4 border-l-primary-gold shadow-xl shadow-primary-gold/5">
           <p className="text-gray-400 uppercase tracking-widest text-[10px] font-black mb-1">This Month</p>
           <p className="text-3xl font-heading font-black text-white">₹{stats.month.toLocaleString('en-IN')}</p>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-blue-500/10 to-transparent border-l-4 border-l-blue-500 shadow-xl shadow-blue-500/5">
           <p className="text-gray-400 uppercase tracking-widest text-[10px] font-black mb-1">Global All Time</p>
           <p className="text-3xl font-heading font-black text-white">₹{stats.total.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Chart Row */}
      <div className="glass p-8 rounded-3xl border border-white/5 w-full h-[350px]">
        <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Revenue Trajectory (Last 12 Months)</h3>
        <div className="h-64 w-full">
           <Bar 
              data={{
                labels: getMonthLabels(),
                datasets: [{ data: chartData, backgroundColor: '#C9933A', borderRadius: 8 }]
              }} 
              options={barOptions} 
            />
        </div>
      </div>

      {/* Table Section */}
      <div className="glass rounded-3xl border border-white/5 overflow-hidden w-full relative pt-24 md:pt-20">
        <div className="absolute top-0 left-0 right-0 p-6 bg-white/5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <h3 className="text-white font-black uppercase tracking-widest text-sm leading-none">Donation Ledger</h3>
           <div className="relative group w-full sm:w-auto">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
             <input 
                type="text" 
                placeholder="Search ledger..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#0A0F1E] border border-white/10 focus:border-primary-gold outline-none rounded-xl text-xs font-bold text-white w-full sm:w-64 transition-all"
             />
           </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-[#0A0F1E] sticky top-0 z-20">
              <tr>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-white/5">Donor Identity</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-white/5">Funds (₹)</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-white/5">Mechanism</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-white/5">Mission/Campaign</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-white/5 text-right w-48">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan="5" className="py-20 text-center text-gray-500">Syncing ledger...</td></tr>
              ) : filtered.length === 0 ? (
                 <tr><td colSpan="5" className="py-20 text-center text-gray-500">No records matched your search.</td></tr>
              ) : (
                 filtered.map((d) => (
                    <tr key={d.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer font-body">
                      <td className="px-8 py-4">
                         <p className="text-white font-bold text-sm uppercase tracking-tight">{d.donorName || "Anonymous"}</p>
                         <p className="text-[10px] text-primary-gold font-bold uppercase tracking-widest mt-1 opacity-60">{d.email || "Verification Pending"}</p>
                      </td>
                      <td className="px-8 py-4 font-black text-primary-gold tracking-widest text-lg">
                         ₹{d.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-8 py-4">
                         <span className="text-[10px] px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white font-black uppercase tracking-widest">
                            {d.method || "System Gate"}
                         </span>
                      </td>
                      <td className="px-8 py-4">
                         <span className="text-[10px] border border-primary-gold/30 bg-primary-gold/5 px-3 py-1 rounded-full text-primary-gold font-black uppercase tracking-widest">
                            {d.campaignId || "Global Welfare"}
                         </span>
                      </td>
                      <td className="px-8 py-4 text-xs text-gray-400 font-bold text-right font-mono uppercase">
                         {d.timestamp ? d.timestamp.toDate().toLocaleString('en-IN', { hour12: true }) : 'Processing...'}
                      </td>
                    </tr>
                 ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass w-full max-w-md p-8 rounded-3xl border-2 border-primary-gold relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X /></button>
            <h2 className="text-2xl font-heading font-black text-white mb-6 uppercase tracking-wider">Manual Entry</h2>
            
            <form onSubmit={handleManualAdd} className="space-y-4 text-sm font-bold">
               <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 block">Full Name</label>
                  <input type="text" value={manualForm.donorName} onChange={e=>setManualForm({...manualForm, donorName: e.target.value})} className="w-full bg-[#0A0F1E] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary-gold" />
               </div>
               <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 block">Email (Optional)</label>
                  <input type="email" value={manualForm.email} onChange={e=>setManualForm({...manualForm, email: e.target.value})} className="w-full bg-[#0A0F1E] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-primary-gold" />
               </div>
               <div>
                  <label className="text-[10px] text-primary-gold uppercase tracking-widest mb-1 block">Amount (₹)</label>
                  <input type="number" required value={manualForm.amount} onChange={e=>setManualForm({...manualForm, amount: e.target.value})} className="w-full bg-primary-gold/10 border border-primary-gold p-3 rounded-xl text-white font-black text-xl outline-none" />
               </div>
               <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 block">Tender Type</label>
                  <select value={manualForm.method} onChange={e=>setManualForm({...manualForm, method: e.target.value})} className="w-full bg-[#0A0F1E] border border-white/10 p-3 rounded-xl text-white outline-none appearance-none">
                     <option>Cash</option>
                     <option>Cheque</option>
                     <option>Direct Wire</option>
                     <option>Other</option>
                  </select>
               </div>
               <button type="submit" className="w-full py-4 bg-primary-gold text-primary-navy font-black rounded-xl hover:bg-white uppercase tracking-widest transition-all mt-4">Record Transaction</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDonations;
