import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, FileText, CheckCircle, Clock, X, Send } from 'lucide-react';
import SEO from '../components/SEO';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp, onSnapshot, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';

const OfficerDashboard = () => {
  const { currentUser } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({ title: '', details: '', location: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({ pending: 0, verified: 0, reports: 0 });

  // Fetch Live Metrics
  useEffect(() => {
    const qComplaints = query(collection(db, 'complaints'));
    const unsubComplaints = onSnapshot(qComplaints, (snap) => {
      let p = 0, v = 0;
      snap.forEach(doc => {
        if (doc.data().status === 'open') p++;
        else if (doc.data().status === 'Verified') v++;
      });
      setLiveMetrics(prev => ({ ...prev, pending: p, verified: v }));
    });

    const qReports = query(collection(db, 'field_reports'), where('officerId', '==', currentUser?.uid || ''));
    const unsubReports = onSnapshot(qReports, (snap) => {
      setLiveMetrics(prev => ({ ...prev, reports: snap.size }));
    });

    return () => { unsubComplaints(); unsubReports(); };
  }, [currentUser]);

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'field_reports'), {
        ...reportData,
        officerId: currentUser.uid,
        officerName: currentUser.name,
        timestamp: serverTimestamp()
      });
      toast.success("Field Report Synchronized");
      setShowReportModal(false);
      setReportData({ title: '', details: '', location: '' });
    } catch (err) {
      toast.error("Failed to sync report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const metrics = [
    { label: "Pending Complaints", value: liveMetrics.pending || "14", icon: <AlertCircle size={24} className="text-rose-500" /> },
    { label: "Verified Cases", value: liveMetrics.verified || "86", icon: <CheckCircle size={24} className="text-emerald-500" /> },
    { label: "My Field Reports", value: liveMetrics.reports || "32", icon: <FileText size={24} className="text-blue-500" /> },
    { label: "Hours Logged", value: "140", icon: <Clock size={24} className="text-purple-500" /> }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <SEO title="Officer Dashboard" />
      
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-3xl font-heading font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">
              Welcome, {currentUser?.name.split(' ')[0]}
            </h2>
            <p className="text-sm font-bold tracking-widest uppercase text-gray-500 dark:text-primary-offwhite/50">
              Region: {currentUser?.region} | Status: Online
            </p>
         </div>
          <button 
            onClick={() => setShowReportModal(true)}
            className="px-6 py-3 bg-primary-gold text-[#0A0A0F] font-black rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-primary-gold/20"
          >
            Submit New Field Report
          </button>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
           <div className="glass w-full max-w-lg p-10 rounded-[3rem] border-white/10 relative">
              <button 
                onClick={() => setShowReportModal(false)}
                className="absolute top-8 right-8 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-2xl font-heading font-black text-white uppercase mb-8">Mission Field Report</h3>
              
              <form onSubmit={handleSubmitReport} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Report Title</label>
                    <input 
                      required
                      value={reportData.title}
                      onChange={e => setReportData({...reportData, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary-gold" 
                      placeholder="e.g. Community Health Survey"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Location / Sector</label>
                    <input 
                      required
                      value={reportData.location}
                      onChange={e => setReportData({...reportData, location: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary-gold" 
                      placeholder="e.g. Dharavi Block C"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Mission Details</label>
                    <textarea 
                      required
                      rows={4}
                      value={reportData.details}
                      onChange={e => setReportData({...reportData, details: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary-gold" 
                      placeholder="Provide specific field observations..."
                    />
                 </div>
                 
                 <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full py-4 bg-primary-gold text-primary-navy font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2"
                 >
                   {isSubmitting ? 'Syncing...' : <><Send size={18}/> Push to Nexus</>}
                 </button>
              </form>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="glass p-6 rounded-3xl border border-gray-200 dark:border-white/5 flex items-center shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center mr-6 shadow-sm">
              {metric.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-500 dark:text-primary-offwhite/40 tracking-widest mb-1">{metric.label}</p>
              <p className="text-4xl font-heading font-black text-gray-900 dark:text-white">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-10">
         {/* Recent Field Works Overview */}
         <div className="glass p-8 rounded-[3rem] border border-gray-200 dark:border-white/5 shadow-xl">
            <h3 className="text-lg font-heading font-black uppercase tracking-widest text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
               Recent Field Activities
            </h3>
            
            <div className="space-y-6">
               {[
                  { title: "Legal Aid Camp Audit", loc: "Pune District", date: "Today, 10:00 AM" },
                  { title: "School Connectivity Check", loc: "Village 4A", date: "Yesterday, 2:30 PM" },
                  { title: "Domestic Violence Intervention", loc: "Sector 9", date: "Oct 24, 08:15 AM" }
               ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 dark:bg-white/5 bg-gray-50 p-4 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-primary-gold/50 transition-colors">
                     <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 font-black flex items-center justify-center text-xs">{(i+1).toString().padStart(2,'0')}</div>
                     <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-1">{item.title}</h4>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-primary-offwhite/50 uppercase tracking-widest">{item.loc} • {item.date}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         
         {/* Urgent Complaints Mini Queue */}
         <div className="bg-rose-500/5 p-8 rounded-[3rem] border border-rose-500/20 shadow-xl">
            <h3 className="text-lg font-heading font-black uppercase tracking-widest text-rose-500 mb-8 border-b border-rose-500/20 pb-4 flex items-center gap-3">
               <AlertCircle size={20} /> Action Required
            </h3>
            <p className="text-gray-700 dark:text-primary-offwhite/70 italic mb-8 font-body leading-relaxed text-sm">
               You have urgent and critical voice complaints originating from your region that require immediate verification. Please visit the Complaints Queue.
            </p>
         </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
