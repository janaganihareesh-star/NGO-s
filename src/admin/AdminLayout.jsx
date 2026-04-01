import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-primary-navy font-body text-white">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 border-b border-white/5 flex items-center px-6 shrink-0">
           <button 
             onClick={() => setIsSidebarOpen(true)}
             className="p-2 bg-white/5 border border-white/10 rounded-xl text-primary-gold"
           >
             <Menu size={20} />
           </button>
           <span className="ml-4 font-heading font-black uppercase tracking-widest text-sm">Nexus Control</span>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
