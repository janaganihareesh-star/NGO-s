import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Shield, Bell, Moon, Sun, Save, Camera, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import SEO from './SEO';

const GeneralSettings = () => {
  const { currentUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const fileInputRef = React.useRef(null);
  const [profilePic, setProfilePic] = useState(null);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    region: currentUser?.region || 'Maharashtra',
    notifications: true
  });

  const handlePicClick = () => {
    fileInputRef.current?.click();
  };

  const onPicChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      toast.success("Profile imagery updated. Finalize changes to sync.");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Profile updated in local session. (Cloud sync pending dashboard role permissions)");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SEO title="Account Settings" />
      
      <div>
        <h1 className="text-3xl font-heading font-black text-gray-900 dark:text-white uppercase tracking-wider">System <span className="text-primary-gold">Settings</span></h1>
        <p className="text-sm font-bold text-gray-500 dark:text-primary-offwhite/50 uppercase tracking-widest mt-1">Configure your mission profile and portal preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
         {/* Profile Card */}
         <div className="md:col-span-1 space-y-6">
            <div className="glass p-8 rounded-[2.5rem] border border-gray-200 dark:border-white/5 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-24 bg-primary-gold/10" />
               <div className="relative z-10">
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onPicChange} />
                  <div 
                    onClick={handlePicClick}
                    className="w-24 h-24 mx-auto rounded-full border-4 border-white dark:border-[#0A0A0F] overflow-hidden shadow-2xl mb-4 group cursor-pointer relative"
                  >
                     <img 
                       src={profilePic || `https://ui-avatars.com/api/?name=${formData.name.replace(' ', '+')}&background=C9933A&color=fff`} 
                       className="w-full h-full object-cover" 
                       alt="avatar" 
                     />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={20} className="text-white" />
                     </div>
                  </div>
                  <h3 className="text-lg font-heading font-black text-gray-900 dark:text-white uppercase truncate">{formData.name}</h3>
                  <p className="text-[10px] font-black uppercase text-primary-gold tracking-widest">{currentUser?.role || 'Volunteer'}</p>
               </div>
            </div>

            <div className="glass p-6 rounded-3xl border border-gray-200 dark:border-white/5 space-y-4">
               <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 dark:border-white/5 pb-3 flex items-center gap-2">
                  <Shield size={14} /> Security Status
               </h4>
               <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                  <p className="text-emerald-500">2FA Active</p>
                  <p className="text-gray-400">Since Oct 2024</p>
               </div>
            </div>
         </div>

         {/* Settings Form */}
         <div className="md:col-span-2 space-y-8">
            <form onSubmit={handleSave} className="glass p-10 rounded-[3rem] border border-gray-200 dark:border-white/5 space-y-8 shadow-xl">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                        <User size={14} /> Full Legal Name
                     </label>
                     <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-primary-gold transition-all" 
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                        <Mail size={14} /> Communication Email
                     </label>
                     <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-primary-gold transition-all" 
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                        <Globe size={14} /> Operations Region
                     </label>
                     <select 
                        value={formData.region} 
                        onChange={(e) => setFormData({...formData, region: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-primary-gold transition-all appearance-none"
                     >
                        <option>Dharavi</option>
                        <option>Bandra East</option>
                        <option>Worli</option>
                        <option>Maharashtra (Global)</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                        <Bell size={14} /> Push Notifications
                     </label>
                     <div className="flex items-center gap-4 h-12">
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" className="sr-only peer" checked={formData.notifications} onChange={() => setFormData({...formData, notifications: !formData.notifications})} />
                           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-gold"></div>
                        </label>
                        <span className="text-xs font-bold text-gray-500">Missions & Alerts</span>
                     </div>
                  </div>
               </div>

               <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-6">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                     <Moon size={14} /> Interface Preference
                  </h4>
                  <div className="flex gap-4">
                     <button 
                        type="button"
                        onClick={() => isDarkMode && toggleTheme()}
                        className={`flex-1 p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all ${!isDarkMode ? 'bg-primary-gold text-primary-navy border-primary-gold shadow-lg shadow-primary-gold/20' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400'}`}
                     >
                        <Sun size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">Light Lux</span>
                     </button>
                     <button 
                        type="button"
                        onClick={() => !isDarkMode && toggleTheme()}
                        className={`flex-1 p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all ${isDarkMode ? 'bg-primary-gold text-primary-navy border-primary-gold shadow-lg shadow-primary-gold/20' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400'}`}
                     >
                        <Moon size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">Dark Nexus</span>
                     </button>
                  </div>
               </div>

               <button type="submit" className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-[#0A0A0F] font-black uppercase tracking-widest text-xs rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  <Save size={16} /> Finalize Changes
               </button>
            </form>
         </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
