import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, DollarSign, MessageSquareWarning, FolderOpen, X, FileText, MapPin, Calendar, ShieldCheck, BarChart3, Download } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const MetricCard = ({ title, value, icon, trend }) => {
  const { isDarkMode } = useTheme();
  return (
    <div className={`glass p-6 rounded-3xl border-t-2 border-primary-gold ${isDarkMode ? 'border-x-white/5 border-b-white/5 bg-white/5' : 'border-x-gray-200 border-b-gray-200 bg-white shadow-sm'} font-body relative overflow-hidden group transition-all`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-black uppercase tracking-widest text-xs`}>{title}</div>
        <div className={`p-3 ${isDarkMode ? 'bg-primary-gold/10' : 'bg-primary-gold/5'} rounded-2xl text-primary-gold group-hover:scale-110 transition-transform`}>{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <h3 className={`text-4xl font-heading font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</h3>
        <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-xl">{trend}</span>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { isDarkMode } = useTheme();
  // Metrics
  const [metrics, setMetrics] = useState({ 
    volunteers: 0, 
    donationsToday: 0, 
    donationsMonth: 0, 
    donationsTotal: 0, 
    openComplaints: 0, 
    resolvedComplaints: 0,
    projects: 5 
  });
  
  // Tables
  const [recentVolunteers, setRecentVolunteers] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Charts
  const [donationsChartData, setDonationsChartData] = useState([]);
  const [complaintPriorityData, setComplaintPriorityData] = useState([0, 0, 0]); // Normal, Urgent, Critical
  const [volunteerCityData, setVolunteerCityData] = useState({ labels: [],  data: [] });

  useEffect(() => {
    // 1. Fetch live Volunteers
    const unsubVolunteers = onSnapshot(collection(db, 'volunteers'), (snapshot) => {
      setMetrics(prev => ({ ...prev, volunteers: snapshot.size }));
      
      const cities = {};
      snapshot.forEach(doc => {
         const city = doc.data().city || 'Global';
         cities[city] = (cities[city] || 0) + 1;
      });
      const sortedCities = Object.entries(cities).sort((a, b) => b[1] - a[1]).slice(0, 5);
      setVolunteerCityData({
        labels: sortedCities.map(c => c[0]),
        data: sortedCities.map(c => c[1])
      });
    });

    // 2. Fetch live Donations
    const unsubDonations = onSnapshot(collection(db, 'donations'), (snapshot) => {
      let total = 0, today = 0, month = 0;
      const monthlyData = new Array(6).fill(0);
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      snapshot.forEach(doc => {
        const data = doc.data();
        const amt = Number(data.amount) || 0;
        total += amt;
        
        if (data.timestamp) {
           const date = data.timestamp.toDate();
           // Today
           if (date.toDateString() === now.toDateString()) today += amt;
           // Month
           if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) month += amt;

           const monthDiff = (currentYear - date.getFullYear()) * 12 + (currentMonth - date.getMonth());
           if (monthDiff >= 0 && monthDiff < 6) {
              monthlyData[5 - monthDiff] += amt;
           }
        }
      });
      setMetrics(prev => ({ 
        ...prev, 
        donationsTotal: total, 
        donationsToday: today, 
        donationsMonth: month 
      }));
      setDonationsChartData(monthlyData);
    });

    // 3. Fetch live Complaints
    const unsubComplaints = onSnapshot(collection(db, 'complaints'), (snapshot) => {
      let openCount = 0;
      let resolvedCount = 0;
      let normal = 0, urgent = 0, critical = 0;
      
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === 'open') openCount++;
        else resolvedCount++;
        
        if (data.priority === 'Critical') critical++;
        else if (data.priority === 'Urgent') urgent++;
        else normal++;
      });
      
      setMetrics(prev => ({ ...prev, openComplaints: openCount, resolvedComplaints: resolvedCount }));
      setComplaintPriorityData([normal, urgent, critical]);
    });

    // 4. Fetch Recent Tables
    const volQ = query(collection(db, 'volunteers'), orderBy('createdAt', 'desc'), limit(5));
    const unsubRecentVol = onSnapshot(volQ, (snap) => setRecentVolunteers(snap.docs.map(d => ({id: d.id, ...d.data()}))));

    const compQ = query(collection(db, 'complaints'), orderBy('timestamp', 'desc'), limit(5));
    const unsubRecentComp = onSnapshot(compQ, (snap) => setRecentComplaints(snap.docs.map(d => ({id: d.id, ...d.data()}))));

    return () => {
      unsubVolunteers(); unsubDonations(); unsubComplaints(); unsubRecentVol(); unsubRecentComp();
    };
  }, []);

  const handleGenerateReport = () => {
    const reportDate = new Date().toLocaleString();
    const reportContent = `
=========================================
      LAKSHMI NGO - NEXUS REPORT
        Generated: ${reportDate}
=========================================

--- MISSION SUMMARY ---
Total Volunteers: ${metrics.volunteers}
Today's Funding: ₹${metrics.donationsToday.toLocaleString('en-IN')}
Monthly Revenue: ₹${metrics.donationsMonth.toLocaleString('en-IN')}
Grand Total Funding: ₹${metrics.donationsTotal.toLocaleString('en-IN')}
Resolution Rate: ${metrics.resolvedComplaints} / ${metrics.openComplaints + metrics.resolvedComplaints}

--- RECENT AGENTS ---
${recentVolunteers.map(v => `- ${v.fullName} (${v.email}) | ${v.city || 'Global'}`).join('\n')}

--- INCIDENT LOG ---
${recentComplaints.map(c => `- [${c.priority || 'Normal'}] ${c.status.toUpperCase()}: "${c.transcript}"`).join('\n')}

=========================================
      END OF TRANSMISSION
=========================================
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NGO_Nexus_Report_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Nexus Intelligence Report generated and saved.");
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: isDarkMode ? '#F3F4F6' : '#111827', font: { weight: 'bold' } } } },
    scales: {
      x: { grid: { color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }, ticks: { color: isDarkMode ? '#D1D5DB' : '#374151' } },
      y: { grid: { color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }, ticks: { color: isDarkMode ? '#D1D5DB' : '#374151' } }
    }
  };

  const donutOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: isDarkMode ? '#9CA3AF' : '#4B5563', font: { weight: 'bold' } } } }
  };

  const getMonthLabels = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const current = new Date().getMonth();
    return Array.from({length: 6}, (_, i) => months[(current - 5 + i + 12) % 12]);
  };

  return (
    <div className="font-body space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className={`${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'} border p-6 rounded-3xl backdrop-blur-md flex justify-between items-center`}>
        <div>
          <h1 className={`text-3xl font-heading font-black ${isDarkMode ? 'text-white' : 'text-gray-900'} uppercase tracking-wider`}>Mission <span className="text-primary-gold">Control</span></h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1 font-bold`}>Real-time platform analytics & administration.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleGenerateReport}
             className="px-6 py-2 bg-primary-gold text-primary-navy font-black rounded-full text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-primary-gold transition-all shadow-lg shadow-primary-gold/20 flex items-center gap-2 group"
           >
             <Download size={14} className="group-hover:bounce" /> Generate Report
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <MetricCard title="Total Volunteers" value={metrics.volunteers} icon={<Users />} trend="+12%" />
        <MetricCard title="Today's Funding" value={`₹${metrics.donationsToday.toLocaleString('en-IN')}`} icon={<DollarSign />} trend="Today" />
        <MetricCard title="Monthly Revenue" value={`₹${metrics.donationsMonth.toLocaleString('en-IN')}`} icon={<BarChart3 />} trend="Month" />
        <MetricCard title="Global AllTime" value={`₹${metrics.donationsTotal.toLocaleString('en-IN')}`} icon={<DollarSign />} trend="All Time" />
        <div className={`glass p-6 rounded-3xl border-t-2 border-emerald-500 xl:col-span-1 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-xl shadow-emerald-500/5'} flex flex-col justify-between`}>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Resolution Archive</p>
              <h4 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {metrics.resolvedComplaints} / {metrics.openComplaints + metrics.resolvedComplaints}
              </h4>
           </div>
           <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full" 
                style={{ width: `${(metrics.resolvedComplaints / (metrics.openComplaints + metrics.resolvedComplaints || 1)) * 100}%` }} 
              />
           </div>
           <p className="text-[8px] font-bold text-gray-400 mt-2 uppercase tracking-tight">Resolved Issues vs Open Cases</p>
        </div>
      </div>

      {/* COMPLAINTS SECTION HIGHER AS REQUESTED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`glass p-8 rounded-3xl border-t-4 border-primary-gold lg:col-span-2 ${isDarkMode ? 'border-x-white/5 border-b-white/5' : 'border-x-gray-200 border-b-gray-200 bg-white shadow-sm'}`}>
           <div className="flex justify-between items-center mb-6">
             <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-black uppercase tracking-widest text-sm text-primary-gold`}>Intelligence Feed (Complaints)</h3>
             <Link to="/admin/complaints" className="text-[10px] text-primary-gold hover:text-white transition-colors uppercase font-black tracking-widest bg-primary-gold/10 px-3 py-1 rounded-full border border-primary-gold/20">View Detailed Log →</Link>
           </div>
           <div className="overflow-x-auto no-scrollbar">
             <table className="w-full text-left border-collapse min-w-[500px]">
               <thead>
                 <tr className={`${isDarkMode ? 'border-b border-white/20' : 'border-b border-gray-200'}`}>
                   <th className="py-4 text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/60 font-black">Priority</th>
                   <th className="py-4 text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/60 font-black">Transcript</th>
                   <th className="py-4 text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/60 font-black">Status</th>
                 </tr>
               </thead>
               <tbody>
                 {recentComplaints.map(comp => (
                   <tr 
                     key={comp.id} 
                     onClick={() => setSelectedComplaint(comp)}
                     className={`${isDarkMode ? 'border-b border-white/5 hover:bg-white/5' : 'border-b border-gray-50 hover:bg-gray-50'} transition-colors cursor-pointer group`}
                   >
                     <td className="py-4">
                        <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-black tracking-widest ${
                          comp.priority === 'Critical' ? 'bg-red-500/20 text-red-500' :
                          comp.priority === 'Urgent' ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {comp.priority || 'Normal'}
                        </span>
                     </td>
                     <td className={`py-4 text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'} max-w-[200px] truncate pr-4 italic group-hover:text-primary-gold transition-colors font-body italic`}>"{comp.transcript}"</td>
                     <td className="py-4 text-xs font-black uppercase">
                        <span className={`px-3 py-1 rounded-full text-[10px] border ${comp.status === 'open' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                           {comp.status === 'open' ? '🔴 Open' : '🟢 Solved'}
                        </span>
                     </td>
                   </tr>
                 ))}
                 {recentComplaints.length === 0 && <tr><td colSpan="3" className="py-8 text-center text-gray-500">No recent incidents.</td></tr>}
               </tbody>
             </table>
           </div>
        </div>

        <div className={`glass p-6 rounded-3xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200 bg-white shadow-sm'} lg:col-span-1 h-full flex flex-col`}>
          <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold mb-4 uppercase text-sm tracking-widest`}>Incident Weight (Priority)</h3>
          <div className="flex-1 min-h-[250px]">
            <Doughnut 
              data={{
                labels: ['Normal', 'Urgent', 'Critical'],
                datasets: [{
                  data: complaintPriorityData.reduce((a, b) => a + b, 0) === 0 ? [1,1,1] : complaintPriorityData,
                  backgroundColor: ['#6B7280', '#F97316', '#EF4444'],
                  offset: 15,
                  hoverOffset: 20
                }]
              }} 
              options={donutOptions} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:min-h-[400px]">
        <div className={`glass p-6 rounded-3xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200 bg-white shadow-sm'} lg:col-span-2 flex flex-col`}>
          <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold mb-4 uppercase text-sm tracking-widest`}>Monthly Donations Bar (₹)</h3>
          <div className="flex-1 min-h-[300px]">
             <Bar 
              data={{
                labels: getMonthLabels(),
                datasets: [{
                  label: 'Funding', 
                  data: donationsChartData, 
                  backgroundColor: '#C9933A', 
                  borderRadius: 8,
                  hoverBackgroundColor: '#fff'
                }]
              }} 
              options={chartOptions} 
            />
          </div>
        </div>

        <div className={`glass p-6 rounded-3xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200 bg-white shadow-sm'} lg:col-span-1 flex flex-col`}>
          <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold mb-4 uppercase text-sm tracking-widest`}>Regions Performance</h3>
          <div className="flex-1 min-h-[300px]">
            <Bar 
              data={{
                labels: volunteerCityData.labels.length ? volunteerCityData.labels : ['No Data'],
                datasets: [{
                  label: 'Activity', 
                  data: volunteerCityData.data.length ? volunteerCityData.data : [1], 
                  backgroundColor: ['#C9933A', '#EF4444', '#F97316', '#10B981', '#3B82F6'],
                  borderRadius: 12
                }]
              }} 
              options={chartOptions} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`glass p-8 rounded-3xl border-t-4 border-emerald-500 ${isDarkMode ? 'border-x-white/5 border-b-white/5' : 'border-x-gray-200 border-b-gray-200 bg-white shadow-sm'}`}>
           <div className="flex justify-between items-center mb-6">
             <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-black uppercase tracking-widest text-sm text-emerald-500`}>Active Agent Registry</h3>
             <Link to="/admin/volunteers" className="text-[10px] text-emerald-500 hover:text-white transition-colors uppercase font-black tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">View Agent Directory →</Link>
           </div>
           <div className="overflow-x-auto no-scrollbar">
             <table className="w-full text-left border-collapse min-w-[500px]">
               <thead>
                 <tr className={`${isDarkMode ? 'border-b border-white/20' : 'border-b border-gray-200'}`}>
                   <th className="py-4 text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/60 font-black">Name</th>
                   <th className="py-4 text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/60 font-black">Priority</th>
                   <th className="py-4 text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/60 font-black">Date</th>
                 </tr>
               </thead>
               <tbody>
                  {recentVolunteers.map(vol => (
                    <tr 
                      key={vol.id} 
                      onClick={() => setSelectedVolunteer(vol)}
                      className={`${isDarkMode ? 'border-b border-white/5 hover:bg-white/5' : 'border-b border-gray-50 hover:bg-gray-50'} transition-colors group cursor-pointer`}
                    >
                      <td className="py-4 flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold font-black text-[10px] border border-primary-gold/20 group-hover:bg-primary-gold group-hover:text-primary-navy transition-colors">
                            {vol.fullName?.charAt(0) || 'V'}
                         </div>
                         <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold`}>{vol.fullName}</span>
                      </td>
                      <td className="py-4">
                         <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-black tracking-widest ${
                           vol.priority === 'Critical' ? 'bg-red-500/20 text-red-500' :
                           vol.priority === 'Urgent' ? 'bg-orange-500/20 text-orange-500' : 'bg-emerald-500/20 text-emerald-500'
                         }`}>
                           {vol.priority || 'Active'}
                         </span>
                      </td>
                      <td className="py-4 text-xs text-gray-500 font-medium">{vol.createdAt ? (vol.createdAt.toDate ? vol.createdAt.toDate().toLocaleDateString() : new Date(vol.createdAt).toLocaleDateString()) : 'Just now'}</td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
        </div>

        <div className={`glass p-8 rounded-3xl border-t-4 border-primary-gold ${isDarkMode ? 'border-x-white/5 border-b-white/5' : 'border-x-gray-200 border-b-gray-200 bg-white shadow-sm'}`}>
           <div className="flex justify-between items-center mb-6">
             <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-black uppercase tracking-widest text-sm text-primary-gold`}>Global Resolution Status</h3>
             <Link to="/admin/complaints" className="text-[10px] text-primary-gold hover:text-white transition-colors uppercase font-black tracking-widest bg-primary-gold/10 px-3 py-1 rounded-full border border-primary-gold/20">View Detailed Log →</Link>
           </div>
           <div className="overflow-x-auto no-scrollbar">
             <table className="w-full text-left border-collapse min-w-[500px]">
               <thead>
                 <tr className={`${isDarkMode ? 'border-b border-white/20' : 'border-b border-gray-200'}`}>
                   <th className="py-4 text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/60 font-black">Priority</th>
                   <th className="py-4 text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/60 font-black">Transcript</th>
                   <th className="py-4 text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/60 font-black">Status</th>
                 </tr>
               </thead>
               <tbody>
                 {recentComplaints.map(comp => (
                   <tr 
                     key={comp.id} 
                     onClick={() => setSelectedComplaint(comp)}
                     className={`${isDarkMode ? 'border-b border-white/5 hover:bg-white/5' : 'border-b border-gray-50 hover:bg-gray-50'} transition-colors cursor-pointer group`}
                   >
                     <td className="py-4">
                        <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-black tracking-widest ${
                          comp.priority === 'Critical' ? 'bg-red-500/20 text-red-500' :
                          comp.priority === 'Urgent' ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {comp.priority || 'Normal'}
                        </span>
                     </td>
                     <td className={`py-4 text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'} max-w-[200px] truncate pr-4 italic group-hover:text-primary-gold transition-colors`}>"{comp.transcript}"</td>
                     <td className="py-4 text-xs font-black uppercase">
                        <span className={`px-2 py-1 rounded-md text-[10px] ${comp.status === 'open' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                           {comp.status}
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      {/* Volunteer Detail Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className={`glass w-full max-w-lg p-10 rounded-[3rem] border border-white/20 relative shadow-2xl animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-[#0A0A0F]' : 'bg-white'}`}>
              <button onClick={() => setSelectedVolunteer(null)} className="absolute top-8 right-8 text-gray-500 hover:text-primary-gold transition-colors"><X size={24} /></button>
              
              <div className="flex items-center gap-6 mb-10">
                 <div className="w-20 h-20 rounded-full bg-primary-gold flex items-center justify-center text-primary-navy text-3xl font-black shadow-xl shadow-primary-gold/20">
                    {selectedVolunteer.fullName?.charAt(0)}
                 </div>
                 <div>
                    <h3 className={`text-2xl font-heading font-black uppercase leading-none mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedVolunteer.fullName}</h3>
                    <p className="text-[10px] font-black text-primary-gold uppercase tracking-[0.3em]">{selectedVolunteer.email}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                    <p className="text-[8px] font-black uppercase text-gray-400 mb-1 flex items-center gap-1"><MapPin size={10}/> Base Region</p>
                    <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedVolunteer.city || 'Mumbai'}</p>
                 </div>
                 <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                    <p className="text-[8px] font-black uppercase text-gray-400 mb-1 flex items-center gap-1"><Calendar size={10}/> Join Date</p>
                    <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                       {selectedVolunteer.createdAt ? (selectedVolunteer.createdAt.toDate ? selectedVolunteer.createdAt.toDate().toLocaleDateString() : new Date(selectedVolunteer.createdAt).toLocaleDateString()) : 'N/A'}
                    </p>
                 </div>
              </div>

              <div className={`p-6 rounded-2xl border mb-10 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                 <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /> Security Clearing</h4>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                       <span className="text-gray-500">Identity Verification</span>
                       <span className="text-emerald-500">Passed</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                       <span className="text-gray-500">Background Audit</span>
                       <span className="text-emerald-500">Complete</span>
                    </div>
                 </div>
              </div>

              <button onClick={() => setSelectedVolunteer(null)} className="w-full py-4 bg-primary-gold text-primary-navy font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-primary-gold/20 hover:scale-[1.02] active:scale-95 transition-all">Close Profile</button>
           </div>
        </div>
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className={`glass w-full max-w-lg p-10 rounded-[3rem] border border-white/20 relative shadow-2xl animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-[#0A0A0F]' : 'bg-white'}`}>
              <button onClick={() => setSelectedComplaint(null)} className="absolute top-8 right-8 text-gray-500 hover:text-primary-gold transition-colors"><X size={24} /></button>
              
              <div className="flex items-center gap-4 mb-8">
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${
                    selectedComplaint.priority === 'Critical' ? 'bg-red-500/20 text-red-500 border-red-500/20' : 
                    'bg-primary-gold/20 text-primary-gold border-primary-gold/20'
                 }`}>
                    <MessageSquareWarning size={32} />
                 </div>
                 <div>
                    <h3 className={`text-2xl font-heading font-black uppercase leading-none mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Case Details</h3>
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                       selectedComplaint.priority === 'Critical' ? 'text-red-500' : 'text-primary-gold'
                    }`}>Priority: {selectedComplaint.priority || 'Normal'}</p>
                 </div>
              </div>

              <div className={`p-8 rounded-[2rem] border min-h-[150px] mb-8 flex flex-col justify-center ${isDarkMode ? 'bg-white/5 border-white/10 text-primary-offwhite/80' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
                 <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Transcript Narrative</h4>
                 <p className="text-sm font-body italic leading-relaxed">"{selectedComplaint.transcript}"</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                 <div className={`px-4 py-3 rounded-xl border text-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                    <p className="text-[8px] font-black uppercase text-gray-500 mb-1">Source</p>
                    <p className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedComplaint.source || 'Direct Portal'}</p>
                 </div>
                 <div className={`px-4 py-3 rounded-xl border text-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                    <p className="text-[8px] font-black uppercase text-gray-500 mb-1">Status</p>
                    <p className={`text-[10px] font-bold uppercase ${selectedComplaint.status === 'open' ? 'text-yellow-500' : 'text-emerald-500'}`}>{selectedComplaint.status}</p>
                 </div>
              </div>

              <button onClick={() => setSelectedComplaint(null)} className="w-full py-4 bg-primary-navy dark:bg-white text-white dark:text-primary-navy font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all">Dismiss Oversight</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

