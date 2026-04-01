import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, MessageSquareWarning, FolderOpen } from 'lucide-react';
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
        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-bold uppercase tracking-widest text-xs`}>{title}</div>
        <div className={`p-3 ${isDarkMode ? 'bg-white/5' : 'bg-primary-gold/5'} rounded-2xl text-primary-gold group-hover:scale-110 transition-transform`}>{icon}</div>
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
  const [metrics, setMetrics] = useState({ volunteers: 0, donations: 0, openComplaints: 0, projects: 5 });
  
  // Tables
  const [recentVolunteers, setRecentVolunteers] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);

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
      let total = 0;
      const monthlyData = new Array(6).fill(0);
      const currentMonth = new Date().getMonth();
      
      snapshot.forEach(doc => {
        const data = doc.data();
        total += Number(data.amount) || 0;
        
        if (data.timestamp) {
           const date = data.timestamp.toDate();
           const monthDiff = currentMonth - date.getMonth() + (12 * (new Date().getFullYear() - date.getFullYear()));
           if (monthDiff >= 0 && monthDiff < 6) {
              monthlyData[5 - monthDiff] += Number(data.amount) || 0;
           }
        }
      });
      setMetrics(prev => ({ ...prev, donations: total }));
      setDonationsChartData(monthlyData);
    });

    // 3. Fetch live Complaints
    const unsubComplaints = onSnapshot(collection(db, 'complaints'), (snapshot) => {
      let openCount = 0;
      let normal = 0, urgent = 0, critical = 0;
      
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === 'open') openCount++;
        
        if (data.priority === 'Critical') critical++;
        else if (data.priority === 'Urgent') urgent++;
        else normal++;
      });
      
      setMetrics(prev => ({ ...prev, openComplaints: openCount }));
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: isDarkMode ? '#9CA3AF' : '#4B5563', font: { weight: 'bold' } } } },
    scales: {
      x: { grid: { color: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: isDarkMode ? '#9CA3AF' : '#4B5563' } },
      y: { grid: { color: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: isDarkMode ? '#9CA3AF' : '#4B5563' } }
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
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mt-1`}>Real-time platform analytics & administration.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-2 bg-primary-gold text-primary-navy font-bold rounded-full text-xs uppercase tracking-widest hover:bg-white hover:text-primary-gold transition-all shadow-lg shadow-primary-gold/20">Generate Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <MetricCard title="Total Volunteers" value={metrics.volunteers} icon={<Users />} trend="+12%" />
        <MetricCard title="Total Donations" value={`₹${metrics.donations.toLocaleString('en-IN')}`} icon={<DollarSign />} trend="+8%" />
        <MetricCard title="Open Complaints" value={metrics.openComplaints} icon={<MessageSquareWarning />} trend={metrics.openComplaints > 0 ? 'Action Req' : '-5%'} />
        <MetricCard title="Active Projects" value={metrics.projects} icon={<FolderOpen />} trend="Stable" />
        <div className={`glass p-6 rounded-3xl border-t-2 border-emerald-500 xl:col-span-1 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'} flex flex-col justify-between shadow-xl`}>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Annual Goal Progress</p>
              <h4 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>64%</h4>
           </div>
           <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '64%' }} />
           </div>
           <p className="text-[8px] font-bold text-gray-400 mt-2 uppercase tracking-tight">₹1.2M / ₹2.0M Target</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[400px]">
        <div className={`glass p-6 rounded-3xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200 bg-white shadow-sm'} lg:col-span-1 h-full flex flex-col`}>
          <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold mb-4 uppercase text-sm tracking-widest`}>Monthly Donations (₹)</h3>
          <div className="flex-1 min-h-[250px] lg:min-h-0">
            <Line 
              data={{
                labels: getMonthLabels(),
                datasets: [{
                  label: 'Donations', 
                  data: donationsChartData, 
                  borderColor: '#C9933A', 
                  backgroundColor: 'rgba(201, 147, 58, 0.1)', 
                  fill: true,
                  tension: 0.4, 
                  borderWidth: 4,
                  pointBackgroundColor: '#C9933A',
                  pointBorderColor: '#fff',
                  pointHoverRadius: 6
                }]
              }} 
              options={chartOptions} 
            />
          </div>
        </div>
        
        <div className={`glass p-6 rounded-3xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200 bg-white shadow-sm'} lg:col-span-1 h-full flex flex-col`}>
          <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold mb-4 uppercase text-sm tracking-widest`}>Volunteers by City</h3>
          <div className="flex-1 min-h-[250px] lg:min-h-0">
            <Bar 
              data={{
                labels: volunteerCityData.labels.length ? volunteerCityData.labels : ['No Data'],
                datasets: [{
                  label: 'Volunteers', data: volunteerCityData.data.length ? volunteerCityData.data : [1], backgroundColor: '#C9933A', borderRadius: 6
                }]
              }} 
              options={chartOptions} 
            />
          </div>
        </div>

        <div className={`glass p-6 rounded-3xl border ${isDarkMode ? 'border-white/5' : 'border-gray-200 bg-white shadow-sm'} lg:col-span-1 h-full flex flex-col`}>
          <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold mb-4 uppercase text-sm tracking-widest`}>Complaints by Priority</h3>
          <div className="flex-1 min-h-[250px] lg:min-h-0">
            <Doughnut 
              data={{
                labels: ['Normal', 'Urgent', 'Critical'],
                datasets: [{
                  data: complaintPriorityData.reduce((a, b) => a + b, 0) === 0 ? [1,1,1] : complaintPriorityData,
                  backgroundColor: ['#6B7280', '#F97316', '#EF4444'],
                  borderWidth: 0,
                  hoverOffset: 4
                }]
              }} 
              options={donutOptions} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`glass p-8 rounded-3xl border-t-4 border-primary-gold ${isDarkMode ? 'border-x-white/5 border-b-white/5' : 'border-x-gray-200 border-b-gray-200 bg-white shadow-sm'}`}>
           <div className="flex justify-between items-center mb-6">
             <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-black uppercase tracking-widest text-sm`}>Recent Volunteers</h3>
             <a href="#" className="text-xs text-primary-gold hover:text-white transition-colors uppercase font-bold">View All →</a>
           </div>
           <div className="overflow-x-auto no-scrollbar">
             <table className="w-full text-left border-collapse min-w-[500px]">
               <thead>
                 <tr className={`${isDarkMode ? 'border-b border-white/10' : 'border-b border-gray-100'}`}>
                   <th className="py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Name</th>
                   <th className="py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Priority</th>
                   <th className="py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Date</th>
                 </tr>
               </thead>
               <tbody>
                  {recentVolunteers.map(vol => (
                    <tr key={vol.id} className={`${isDarkMode ? 'border-b border-white/5 hover:bg-white/5' : 'border-b border-gray-50 hover:bg-gray-50'} transition-colors group`}>
                      <td className="py-4 flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold font-black text-[10px] border border-primary-gold/20">
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
                      <td className="py-4 text-xs text-gray-500 font-medium">{vol.createdAt ? vol.createdAt.toDate().toLocaleDateString() : 'Just now'}</td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
        </div>

        <div className={`glass p-8 rounded-3xl border-t-4 border-primary-gold ${isDarkMode ? 'border-x-white/5 border-b-white/5' : 'border-x-gray-200 border-b-gray-200 bg-white shadow-sm'}`}>
           <div className="flex justify-between items-center mb-6">
             <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-black uppercase tracking-widest text-sm`}>Recent Complaints</h3>
             <a href="/admin/complaints" className="text-xs text-primary-gold hover:text-white transition-colors uppercase font-bold">View All →</a>
           </div>
           <div className="overflow-x-auto no-scrollbar">
             <table className="w-full text-left border-collapse min-w-[500px]">
               <thead>
                 <tr className={`${isDarkMode ? 'border-b border-white/10' : 'border-b border-gray-100'}`}>
                   <th className="py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Priority</th>
                   <th className="py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Transcript</th>
                   <th className="py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Status</th>
                 </tr>
               </thead>
               <tbody>
                 {recentComplaints.map(comp => (
                   <tr key={comp.id} className={`${isDarkMode ? 'border-b border-white/5 hover:bg-white/5' : 'border-b border-gray-50 hover:bg-gray-50'} transition-colors`}>
                     <td className="py-4">
                        <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-black tracking-widest ${
                          comp.priority === 'Critical' ? 'bg-red-500/20 text-red-500' :
                          comp.priority === 'Urgent' ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {comp.priority || 'Normal'}
                        </span>
                     </td>
                     <td className={`py-4 text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'} max-w-[200px] truncate pr-4 italic`}>"{comp.transcript}"</td>
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
    </div>
  );
};

export default AdminDashboard;
