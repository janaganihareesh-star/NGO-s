import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Clock, Play, CheckCircle, Award, Star, ListChecks } from 'lucide-react';
import SEO from '../components/SEO';

const VolunteerModules = () => {
  const [activeModule, setActiveModule] = React.useState(null);
  const [showProgress, setShowProgress] = React.useState(false);
  
  const modules = [
    { 
      id: 1, title: 'Slum Outreach Safety 101', type: 'Certification', 
      duration: '45 mins', status: 'In Progress', progress: 45,
      desc: 'Essential safety protocols for urban slum environments, child protection, and medical emergency basics.',
      points: 200, icon: <Shield className="text-rose-500" />,
      videoId: 'Xh7o8G9D_N8'
    },
    { 
      id: 2, title: 'Laksmi NGO: Global Ethics', type: 'Compliance', 
      duration: '20 mins', status: 'Locked', progress: 0,
      desc: 'Understanding the NGO charter, ethical reporting, and community interaction guidelines.',
      points: 100, icon: <BookOpen className="text-blue-500" />,
      videoId: 'pDkY-Rz287I'
    },
    { 
      id: 3, title: 'Advanced Disaster Response', type: 'Course', 
      duration: '2.5 hrs', status: 'Locked', progress: 0,
      desc: 'Specialized training for flood, fire, and earthquake relief operations in high-risk zones.',
      points: 500, icon: <ListChecks className="text-purple-500" />,
      videoId: 'SjB-z-0J6n8'
    },
    { 
      id: 4, title: 'Digital Literacy Facilitator', type: 'Certification', 
      duration: '60 mins', status: 'Completed', progress: 100,
      desc: 'Certification to lead tech-drives and teach basic computer skills to orphans and slum youth.',
      points: 300, icon: <CheckCircle className="text-emerald-500" />,
      videoId: 'p2K3fZOCn0k'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SEO title="Certification Modules" />
      
      <div className="grid md:grid-cols-3 gap-10">
         <div className="md:col-span-2">
            <h1 className="text-4xl font-heading font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2">Training <span className="text-primary-gold">Nexus</span></h1>
            <p className="text-gray-500 dark:text-primary-offwhite/50 text-sm uppercase tracking-widest font-bold mb-10">Master the skills needed to make a difference</p>
            
            <div className="space-y-6">
              {modules.map((mod, idx) => (
                <motion.div 
                  key={mod.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-8 rounded-[2.5rem] border ${mod.status === 'Completed' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white dark:bg-[#0A0A0F] border-gray-200 dark:border-white/10'} shadow-xl transition-all relative overflow-hidden`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
                     <div className="flex gap-6 items-center flex-1">
                        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                           {mod.icon}
                        </div>
                        <div>
                           <div className="flex gap-3 items-center mb-1">
                              <span className="text-[10px] font-black uppercase text-primary-gold tracking-widest">{mod.type}</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full" />
                              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1"><Clock size={12}/> {mod.duration}</span>
                           </div>
                           <h3 className="text-xl font-heading font-black text-gray-900 dark:text-white uppercase mb-2 leading-tight">{mod.title}</h3>
                           <p className="text-[10px] font-medium text-gray-400 max-w-sm line-clamp-2">{mod.desc}</p>
                        </div>
                     </div>

                     <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                        <div className="text-right">
                           <div className="text-primary-gold font-black uppercase text-[8px] tracking-widest mb-1 flex items-center justify-end gap-1">
                              <Star size={10} /> {mod.points} Pts Reward
                           </div>
                           <div className="w-24 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-primary-gold" style={{ width: `${mod.progress}%` }} />
                           </div>
                        </div>
                        {mod.status === 'Locked' ? (
                           <button disabled className="px-6 py-2 bg-gray-200 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl opacity-50 flex items-center gap-2">
                              Locked
                           </button>
                        ) : (
                           <button 
                             onClick={() => setActiveModule(mod)}
                             className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-2 group ${
                               mod.status === 'Completed' 
                               ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                               : 'bg-gray-900 text-white dark:bg-white dark:text-[#0A0A0F] hover:bg-primary-gold hover:text-gray-900'
                             }`}
                           >
                              {mod.status === 'Completed' ? 'Review Content' : 'Continue Module'}
                              <Play size={10} className="fill-current group-hover:scale-125 transition-transform" />
                           </button>
                        )}
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
         </div>

         <div className="space-y-8">
            <div className="p-8 rounded-[3rem] bg-gradient-to-br from-primary-gold to-orange-500 text-gray-900 shadow-2xl">
               <Award size={40} className="mb-6 opacity-80" />
               <h3 className="text-2xl font-heading font-black mb-2 uppercase leading-tight">Master Elite Certificate</h3>
               <p className="text-xs font-bold text-black/60 mb-8 uppercase tracking-widest leading-loose">Complete all 4 master-level foundation modules to unlock your digital certificate & priority status.</p>
               <div className="p-4 bg-black/10 rounded-2xl border border-black/5 flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                     <CheckCircle size={16} />
                     <CheckCircle size={16} />
                     <Star size={16} className="text-black/20" />
                     <Star size={16} className="text-black/20" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">2 / 4 Modules</span>
               </div>
               <button 
                  onClick={() => setShowProgress(true)}
                  className="w-full py-4 bg-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 transition-all shadow-lg text-black"
                >
                  View Certificate Progress
                </button>
            </div>
         </div>
      </div>

      {/* Module Viewer Modal */}
      {activeModule && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 md:p-10 animate-in zoom-in duration-300">
           <div className="w-full max-w-5xl bg-[#050508] rounded-[3rem] overflow-hidden border border-white/20 relative shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto">
              {/* Sidebar Info */}
              <div className="w-full md:w-80 p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between order-2 md:order-1 overflow-y-auto">
                 <div>
                    <div className="p-3 bg-primary-gold/10 rounded-xl w-fit mb-6">
                       {activeModule.icon}
                    </div>
                    <h3 className="text-2xl font-heading font-black text-white uppercase mb-4 leading-tight">{activeModule.title}</h3>
                    <p className="text-xs text-primary-offwhite/50 leading-relaxed font-body mb-8">{activeModule.desc}</p>
                    
                    <div className="space-y-4">
                       <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-gray-500">Reward</span>
                          <span className="text-sm font-black text-primary-gold">{activeModule.points} Pts</span>
                       </div>
                       <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-gray-400">Duration</span>
                          <span className="text-xs font-bold text-white tracking-widest uppercase">{activeModule.duration}</span>
                       </div>
                    </div>
                 </div>
                 
                 <button 
                   onClick={() => setActiveModule(null)}
                   className="w-full py-4 mt-8 bg-white/5 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-rose-500 transition-all border border-white/10"
                 >
                    Close Session
                 </button>
              </div>

              {/* Video Player Area */}
              <div className="flex-1 bg-black relative order-1 md:order-2 group min-h-[300px]">
                 <iframe 
                   className="w-full h-full absolute inset-0"
                   src={`https://www.youtube.com/embed/${activeModule.videoId || 'S2H_A9E198A'}?autoplay=1&modestbranding=1&rel=0`}
                   title="NGO Training Video"
                   frameBorder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                 ></iframe>
                 
                 {/* Close Overlay */}
                 <button 
                   onClick={() => setActiveModule(null)} 
                   className="absolute top-6 right-6 z-30 p-4 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                 >
                    ✕
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Progress Modal */}
      {showProgress && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
           <div className="w-full max-w-lg glass p-10 rounded-[3rem] border border-white/20 relative animate-in slide-in-from-bottom-8">
              <h3 className="text-3xl font-heading font-black text-white uppercase mb-8 text-center">Certificate <span className="text-primary-gold">Path</span></h3>
              <div className="space-y-6">
                 {modules.map(m => (
                   <div key={m.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <CheckCircle size={20} className={m.status === 'Completed' ? 'text-emerald-500' : 'text-white/20'} />
                      <span className={`text-xs font-black uppercase tracking-widest ${m.status === 'Completed' ? 'text-white' : 'text-white/40'}`}>{m.title}</span>
                   </div>
                 ))}
              </div>
              <button onClick={() => setShowProgress(false)} className="w-full py-4 mt-10 bg-primary-gold text-primary-navy font-black text-xs uppercase tracking-widest rounded-2xl">Return to Training</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerModules;
