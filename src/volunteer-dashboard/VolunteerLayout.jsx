import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Award, Bell, LogOut, Menu, HeartHandshake } from 'lucide-react';
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
    { icon: <Bell size={20} />, label: "Announcements", path: "/volunteer-dashboard/announcements" }
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
        </header>

        <main className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VolunteerLayout;
