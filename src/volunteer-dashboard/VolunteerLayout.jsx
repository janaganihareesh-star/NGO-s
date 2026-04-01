import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Award, Bell, LogOut, Menu, HeartHandshake, Settings, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VolunteerSidebar = ({ isOpen, setIsOpen }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "My Hub", path: "/volunteer-dashboard", end: true },
    { icon: <Users size={20} />, label: "Local Campaigns", path: "/volunteer-dashboard/campaigns" },
    { icon: <Award size={20} />, label: "Impact Tiers", path: "/volunteer-dashboard/impact" },
    { icon: <Bell size={20} />, label: "Announcements", path: "/volunteer-dashboard/announcements" },
    { icon: <BookOpen size={20} />, label: "Training Modules", path: "/volunteer-dashboard/modules" },
    { icon: <Settings size={20} />, label: "Settings", path: "/volunteer-dashboard/settings" }
  ];

  const getNavClass = (isActive) => {
    const base = 'flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm tracking-widest uppercase';
    if (isActive) {
      return base + ' bg-orange-500/10 text-orange-600 dark:text-orange-500 border border-orange-500/20';
    }
    return base + ' text-gray-600 dark:text-primary-offwhite/60 hover:bg-black/5 dark:hover:bg-white/5 dark:hover:text-white border border-transparent';
  };

  const avatarUrl = "https://ui-avatars.com/api/?name=" + (currentUser?.name || 'Volunteer').replace(' ', '+') + "&background=EA580C&color=FFF&size=100";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#F5F0E8] dark:bg-[#0A0A0F] border-r border-gray-200 dark:border-white/10 dark:text-white p-6 relative">
      <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-200 dark:border-white/10">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500 flex items-center justify-center">
           <HeartHandshake size={20} className="text-orange-500" />
        </div>
        <div>
           <h2 className="font-heading font-black text-xl uppercase tracking-widest text-orange-500 leading-none">Volunteer</h2>
           <span className="text-[10px] text-gray-500 dark:text-primary-offwhite/50 uppercase tracking-widest font-bold">Community Hub</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.end}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => getNavClass(isActive)}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-10 pt-6 border-t border-gray-200 dark:border-white/10">
         <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full border border-gray-300 dark:border-white/10 flex items-center justify-center overflow-hidden">
               <img src={avatarUrl} className="w-full h-full object-cover" alt="avatar" />
            </div>
            <div>
               <p className="text-xs font-black uppercase text-gray-900 dark:text-white leading-tight">{currentUser?.name}</p>
               <p className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-500 tracking-widest leading-tight">Tier 2 Supporter</p>
            </div>
         </div>
        
         <button 
           onClick={handleLogout}
           className="flex items-center w-full gap-4 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors font-bold text-sm tracking-widest uppercase border border-transparent hover:border-rose-500/20"
         >
           <LogOut size={20} />
           Sign Out
         </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-72 h-screen fixed left-0 top-0 z-40 shadow-2xl">
        {sidebarContent}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden shadow-2xl"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

const VolunteerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050508] font-body flex transition-colors">
      <VolunteerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen relative overflow-x-hidden">
        <header className="h-20 bg-white/80 dark:bg-[#0A0A0F]/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10 border-b border-gray-200 dark:border-white/5">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-white/10"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-heading font-black uppercase tracking-widest text-gray-900 dark:text-white hidden sm:block">
              Community Engagement Hub
            </h1>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group">
                <button className="p-3 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-white/10 hover:border-primary-gold/50 transition-all relative">
                   <Bell size={20} />
                   <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-[#0A0A0F]" />
                </button>
                
                {/* Notifications Dropdown */}
                <div className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-[#0A0A0F] rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-2xl opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all p-6 z-[100]">
                   <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6 flex justify-between items-center">
                      Mission Updates
                      <span className="text-[8px] bg-rose-500 text-white px-2 py-0.5 rounded-full">3 New</span>
                   </h4>
                   <div className="space-y-4">
                      <div className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                         <div className="w-2 h-2 bg-rose-500 rounded-full mt-1.5 shrink-0" />
                         <div>
                            <p className="text-xs font-bold text-gray-900 dark:text-white">Safety Refresh Mandatory</p>
                            <p className="text-[10px] text-gray-500 dark:text-primary-offwhite/50">Complete Q4 module by Oct 31.</p>
                         </div>
                      </div>
                      <div className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                         <div className="w-2 h-2 bg-primary-gold rounded-full mt-1.5 shrink-0" />
                         <div>
                            <p className="text-xs font-bold text-gray-900 dark:text-white">Campaign Update: Juhu Beach</p>
                            <p className="text-[10px] text-gray-500 dark:text-primary-offwhite/50">Mission starting in 4 hours.</p>
                         </div>
                      </div>
                      <div className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                         <div>
                            <p className="text-xs font-bold text-gray-900 dark:text-white">Impact Points Earned</p>
                            <p className="text-[10px] text-gray-500 dark:text-primary-offwhite/50">Received 120 points for Coastal Mission.</p>
                         </div>
                      </div>
                   </div>
                   <button className="w-full py-3 mt-6 border-t border-gray-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-primary-gold hover:text-orange-500 transition-colors">
                      Clear All Notifications
                   </button>
                </div>
             </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VolunteerLayout;
