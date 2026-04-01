import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquareWarning, DollarSign, LogOut, ArrowLeft, X, Settings } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const [hasCriticalComplaint, setHasCriticalComplaint] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    // Listen for unresolved critical complaints
    const q = query(
      collection(db, 'complaints'),
      where('status', '==', 'open'),
      where('priority', '==', 'Critical')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHasCriticalComplaint(!snapshot.empty);
    });

    return () => unsubscribe();
  }, []);

  const links = [
    { to: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/admin/donations", icon: <DollarSign size={20} />, label: "Donations" },
    { to: "/admin/complaints", icon: <MessageSquareWarning size={20} />, label: "Complaints", alert: hasCriticalComplaint },
    { to: "/admin/settings", icon: <Settings size={20} />, label: "Settings" }
  ];

  const sidebarContent = (
    <div className="w-64 h-screen bg-[#0A0F1E] border-r border-white/5 fixed left-0 top-0 flex flex-col font-body z-50">
      <div className="p-8 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-2xl font-heading font-black text-white uppercase tracking-widest leading-none">
          NEXUS <span className="text-primary-gold">ADMIN</span>
        </h2>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-white/50 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 py-8 px-4 flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin'}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all
              ${isActive ? 'bg-primary-gold text-primary-navy font-bold shadow-[0_0_20px_rgba(201,147,58,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            {link.icon}
            <span className="text-sm font-bold tracking-wide uppercase">{link.label}</span>
            {link.alert && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
            )}
            {link.alert && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 flex flex-col gap-2">
        <NavLink to="/" className="flex items-center gap-3 px-6 py-4 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Site
        </NavLink>
        <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all text-sm font-bold uppercase tracking-widest">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">
        {sidebarContent}
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-64 z-[100] lg:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
