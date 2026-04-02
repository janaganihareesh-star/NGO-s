import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, BookOpen, Clock, Play, CheckCircle, Award, Star, ListChecks, ArrowLeft, Book, Info, MapPin, AlertTriangle, Lightbulb } from 'lucide-react';
import SEO from '../components/SEO';

const VolunteerModules = () => {
  const [activeModule, setActiveModule] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  
  const modules = [
    { 
      id: 1, title: 'Slum Outreach Safety 101', type: 'Certification', 
      duration: '45 mins', status: 'In Progress', progress: 45,
      desc: 'Essential safety protocols for urban slum environments, child protection, and medical emergency basics.',
      points: 200, icon: <Shield className="text-rose-500" />,
      image: '/assets/training/safety.png',
      content: {
        intro: "Outreach in urban slum environments requires a high level of situational awareness. Your safety and the safety of the community are our primary objectives.",
        sections: [
          {
            title: "1. Situational Awareness & Presence",
            text: "Always travel in pairs. Maintain an open but professional posture. Identify local 'Safe Hubs' (clinics, police posts) before entering a new cluster.",
            icon: <MapPin className="text-primary-gold" size={18} />
          },
          {
            title: "2. Child Safeguarding Protocols",
            text: "Interactions with minors must occur in public view. Never photograph children without a signed Lakshmi NGO 'Visual Release Form'. Report any signs of distress immediately to the Field Director.",
            icon: <Shield className="text-emerald-500" size={18} />
          },
          {
            title: "3. Sanitation & Health Precautions",
            text: "Slum environments often have complex sanitation issues. Use field-issued sanitizers and boots. Do not consume open-source water; carry your Nexus-issued hydration pack.",
            icon: <Info className="text-blue-500" size={18} />
          }
        ],
        emergency: "Nexus Emergency Line: 1800-LAKSHMI-SAFE"
      }
    },
    { 
      id: 2, title: 'Laksmi NGO: Global Ethics', type: 'Compliance', 
      duration: '20 mins', status: 'Locked', progress: 0,
      desc: 'Understanding the NGO charter, ethical reporting, and community interaction guidelines.',
      points: 100, icon: <BookOpen className="text-blue-500" />,
      image: '/assets/training/ethics.png',
      content: {
        intro: "Laksmi NGO operates on a 'Community-First' model. Ethics isn't just about rules; it's about building lasting trust through respect.",
        sections: [
          {
            title: "1. The Respect Protocol",
            text: "When entering a household, greet the elders first. Listen more than you speak. We are here as facilitators, not 'saviors'. Always ask permission before entering private spaces.",
            icon: <Star className="text-primary-gold" size={18} />
          },
          {
            title: "2. Transparent Data Collection",
            text: "When recording impact stories for the Nexus Portal, explain why the data is being taken. Ensure every community member understands their right to withhold information or withdraw a story.",
            icon: <Book className="text-emerald-500" size={18} />
          },
          {
            title: "3. Financial Integrity",
            text: "Volunteers must never accept cash donations in the field. Redirect all donors to the secure Nexus QR code or the official Laksmi NGO website.",
            icon: <AlertTriangle className="text-rose-500" size={18} />
          }
        ],
        emergency: "Ethics Hotline (Internal): +91 99999-ETHIC"
      }
    },
    { 
      id: 3, title: 'Advanced Disaster Response', type: 'Course', 
      duration: '2.5 hrs', status: 'Locked', progress: 0,
      desc: 'Specialized training for flood, fire, and earthquake relief operations in high-risk zones.',
      points: 500, icon: <ListChecks className="text-purple-500" />,
      image: '/assets/training/disaster.png',
      content: {
        intro: "In disaster scenarios, every second matters. Our response team is trained to provide stability during chaos with calculated logistics.",
        sections: [
          {
            title: "1. Rapid Field Assessment",
            text: "Identify critical needs: Water, Medical, Shelter. Use the Nexus 'Disaster Compass' tool to log real-time geolocation of crises. Prioritize the elderly and differently-abled.",
            icon: <MapPin className="text-primary-gold" size={18} />
          },
          {
            title: "2. Safe-Zone Operations",
            text: "Establish 'Relief Perimeters'. Ensure all aid distribution is orderly. If a zone is compromised by rising water or fire risk, evacuate all personnel to 'Point Zero' immediately.",
            icon: <AlertTriangle className="text-rose-500" size={18} />
          },
          {
            title: "3. Trauma-Informed Care",
            text: "Speak calmly and clearly. Provide 'Psychological First Aid' while waiting for professional medical backup. Reassure victims that specialized help (NGO Doctors) is en route.",
            icon: <Lightbulb className="text-emerald-500" size={18} />
          }
        ],
        emergency: "Rapid Response Dispatch (Sat-Comm): AGL-Z-99"
      }
    },
    { 
      id: 4, title: 'Digital Literacy Facilitator', type: 'Certification', 
      duration: '60 mins', status: 'Completed', progress: 100,
      desc: 'Certification to lead tech-drives and teach basic computer skills to orphans and slum youth.',
      points: 300, icon: <CheckCircle className="text-emerald-500" />,
      image: '/assets/training/digital.png',
      content: {
        intro: "Empower the next generation by bridging the digital divide. Teaching code is teaching a language of opportunity.",
        sections: [
          {
            title: "1. Curriculum Navigation",
            text: "Use the 'Nexus Kids' pre-installed modules. Focus on logic first before syntax. Start with visual-block coding for younger students to build confidence.",
            icon: <Book className="text-primary-gold" size={18} />
          },
          {
            title: "2. Internet Safety First",
            text: "Before teaching browsing, teach digital boundaries. Ensure children know never to share personal data or passwords. Install Nexus-Guard on all training laptops.",
            icon: <Shield className="text-emerald-500" size={18} />
          },
          {
            title: "3. Hardware Stewardship",
            text: "Teach the 10-minute 'Device Health' routine: dust removal, battery cycling, and secure storage techniques for high-humidity environments.",
            icon: <Info className="text-blue-500" size={18} />
          }
        ],
        emergency: "IT Support Desk: it-help@lakshmi.org"
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-body">
      <SEO title="Certification Modules | Training Nexus" />
      
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
                  className={`p-8 rounded-[2.5rem] border ${mod.status === 'Completed' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white dark:bg-[#0A0A0F] border-gray-200 dark:border-white/10'} shadow-xl transition-all relative overflow-hidden group`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
                     <div className="flex gap-6 items-center flex-1">
                        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 group-hover:scale-105 transition-transform">
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
                           <div className="text-primary-gold font-black uppercase text-[8px] tracking-widest mb-1 flex items-center justify-end gap-1 font-heading">
                              <Star size={10} /> {mod.points} Pts Reward
                           </div>
                           <div className="w-24 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-primary-gold transition-all duration-1000" style={{ width: `${mod.progress}%` }} />
                           </div>
                        </div>
                        {mod.status === 'Locked' ? (
                           <button disabled className="px-6 py-2 bg-gray-200 dark:bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl opacity-50 flex items-center gap-2 cursor-not-allowed">
                              <Award size={10} /> Locked
                           </button>
                        ) : (
                           <button 
                             onClick={() => setActiveModule(mod)}
                             className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-2 group ${
                               mod.status === 'Completed' 
                               ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                               : 'bg-primary-gold text-primary-navy hover:bg-white hover:text-primary-gold'
                             }`}
                           >
                              {mod.status === 'Completed' ? 'Review Content' : 'Continue Module'}
                              <Play size={10} className="fill-current group-hover:translate-x-1 transition-transform" />
                           </button>
                        )}
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
         </div>

         <div className="space-y-8">
            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-primary-gold to-orange-500 text-primary-navy shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                  <Award size={120} />
               </div>
               <Award size={40} className="mb-6 opacity-80" />
               <h3 className="text-2xl font-heading font-black mb-2 uppercase leading-tight">Master Elite Certificate</h3>
               <p className="text-xs font-bold text-primary-navy/70 mb-8 uppercase tracking-wider leading-loose">Secure your foundation credentials and unlock priority deployment status.</p>
               <div className="p-5 bg-black/10 rounded-3xl border border-black/5 flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                     <CheckCircle size={18} className="text-emerald-600" />
                     <CheckCircle size={18} className="text-emerald-600" />
                     <Star size={18} className="text-black/10" />
                     <Star size={18} className="text-black/10" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">2 / 4 Modules</span>
               </div>
               <button 
                  onClick={() => setShowProgress(true)}
                  className="w-full py-4 bg-primary-navy text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white hover:text-primary-navy transition-all shadow-xl"
                >
                  View My Credentials
                </button>
            </div>
         </div>
      </div>

      {/* Module Viewer (Manual Format) */}
      <AnimatePresence>
        {activeModule && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050508]/98 backdrop-blur-xl p-4 md:p-10 overflow-hidden"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="w-full max-w-6xl bg-[#0A0A0F] rounded-[3.5rem] overflow-hidden border border-white/10 relative shadow-2xl flex flex-col md:flex-row h-full max-h-[90vh]"
             >
                {/* Manual Sidebar */}
                <div className="w-full md:w-96 p-10 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between overflow-y-auto no-scrollbar bg-white/[0.02]">
                   <div>
                      <button 
                        onClick={() => setActiveModule(null)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary-gold transition-colors mb-10"
                      >
                         <ArrowLeft size={14} /> Back to Nexus
                      </button>
                      
                      <div className="p-4 bg-primary-gold/10 rounded-2xl w-fit mb-8 border border-primary-gold/10">
                         {activeModule.icon}
                      </div>
                      
                      <h3 className="text-3xl font-heading font-black text-white uppercase mb-6 leading-tight">{activeModule.title}</h3>
                      
                      <div className="space-y-4 mb-10">
                         <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center group hover:border-primary-gold/30 transition-all">
                            <span className="text-[10px] font-black uppercase text-gray-400">Merit Status</span>
                            <span className="text-sm font-black text-primary-gold">{activeModule.points} XP</span>
                         </div>
                         <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center group hover:border-blue-500/30 transition-all">
                            <span className="text-[10px] font-black uppercase text-gray-400">Time Est.</span>
                            <span className="text-xs font-bold text-white tracking-widest uppercase">{activeModule.duration}</span>
                         </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                         <h4 className="text-[10px] font-black uppercase text-rose-500 tracking-widest mb-3 flex items-center gap-2">
                           <AlertTriangle size={14} /> Emergency Manual
                         </h4>
                         <p className="text-[11px] font-bold text-white/50 leading-relaxed uppercase tracking-tighter">
                           {activeModule.content.emergency}
                         </p>
                      </div>
                   </div>
                   
                   <button 
                     onClick={() => setActiveModule(null)}
                     className="w-full py-5 mt-10 bg-white text-primary-navy font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-primary-gold transition-all shadow-xl active:scale-95"
                   >
                      Complete Module Session
                   </button>
                </div>

                {/* Main Content Area (Manual) */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-8 md:p-16 space-y-12">
                   <div className="relative rounded-[2.5rem] overflow-hidden aspect-[16/9] mb-12 border border-white/10 group">
                      <img 
                        src={activeModule.image} 
                        alt={activeModule.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-10 left-10">
                         <div className="bg-primary-gold text-primary-navy px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 w-fit">Training Field Asset</div>
                         <p className="text-xs font-bold text-white uppercase tracking-[0.2em]">{activeModule.type} Reference Image</p>
                      </div>
                   </div>

                   <div className="max-w-2xl">
                      <p className="text-xl font-body italic text-white/80 leading-relaxed mb-12 border-l-4 border-primary-gold pl-6">
                        {activeModule.content.intro}
                      </p>

                      <div className="space-y-12">
                         {activeModule.content.sections.map((section, sidx) => (
                           <div key={sidx} className="space-y-4">
                              <div className="flex items-center gap-4">
                                 <div className="p-2 bg-white/5 rounded-lg border border-white/10">{section.icon}</div>
                                 <h4 className="text-lg font-heading font-black text-white uppercase tracking-wider">{section.title}</h4>
                              </div>
                              <p className="text-sm font-medium text-gray-400 leading-loose border-l border-white/5 pl-14">
                                {section.text}
                              </p>
                           </div>
                         ))}
                      </div>

                      <div className="mt-16 p-10 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-[2.5rem] border border-emerald-500/20">
                         <div className="flex items-center gap-3 mb-6">
                            <Lightbulb className="text-emerald-500" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Volunteers Pro-Tip</h4>
                         </div>
                         <p className="text-sm font-bold text-white/70 leading-relaxed">
                           "The quality of our data is the currency of our credibility. Ensure every transcript recorded in the field is clear, unbiased, and follows our ethical framing guidelines."
                         </p>
                      </div>
                   </div>
                   
                   <div className="h-20" /> {/* Spacer */}
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Modal */}
      <AnimatePresence>
        {showProgress && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="w-full max-w-lg glass p-12 rounded-[3.5rem] border border-white/20 relative shadow-2xl"
             >
                <button 
                  onClick={() => setShowProgress(false)}
                  className="absolute top-8 right-8 p-3 text-gray-500 hover:text-white transition-colors"
                >
                   ✕
                </button>
                <Award size={48} className="mx-auto mb-6 text-primary-gold" />
                <h3 className="text-3xl font-heading font-black text-white uppercase mb-2 text-center">Your <span className="text-primary-gold">Path</span></h3>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center mb-10">Credential verification in progress</p>
                <div className="space-y-4">
                   {modules.map(m => (
                     <div key={m.id} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${m.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/5'}`}>
                        <div className="flex items-center gap-4">
                           <CheckCircle size={20} className={m.status === 'Completed' ? 'text-emerald-500' : 'text-white/10'} />
                           <span className={`text-[10px] font-black uppercase tracking-widest ${m.status === 'Completed' ? 'text-white' : 'text-white/20'}`}>{m.title}</span>
                        </div>
                        {m.status === 'Completed' && <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md">Verified</span>}
                     </div>
                   ))}
                </div>
                <button 
                  onClick={() => setShowProgress(false)}
                  className="w-full py-4 mt-10 bg-white text-primary-navy font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-primary-gold transition-all shadow-xl"
                >
                  Return to Dashboard
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VolunteerModules;
