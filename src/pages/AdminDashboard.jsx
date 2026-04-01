import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  MessageSquareWarning, 
  Settings, 
  LogOut, 
  Plus, 
  TrendingUp, 
  Users, 
  Heart,
  Search,
  Bell,
  Edit,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  X as CloseIcon
} from 'lucide-react';
// react-quill removed: incompatible with React 19 (uses removed findDOMNode API)
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  
  // Local state for demo purposes (Ideally fetched from Firebase)
  const [projects, setProjects] = useState([
    { id: 1, title: "Eco-Friendly Village", category: "Environment", impact: "2,000 Houses" },
    { id: 2, title: "Future Leaders Program", category: "Education", impact: "15k Students" },
  ]);

  const [blogPosts, setBlogPosts] = useState([
    { id: 1, title: "How Education is Breaking Poverty", category: "Education", author: "Elena Rodriguez", date: "Oct 24" },
  ]);

  const [newProject, setNewProject] = useState({ title: '', category: 'Education', impact: '', image: '' });
  const [newBlog, setNewBlog] = useState({ title: '', category: 'Education', content: '', author: 'Admin' });

  const addProject = () => {
    setProjects([...projects, { ...newProject, id: Date.now() }]);
    setShowProjectModal(false);
    setNewProject({ title: '', category: 'Education', impact: '', image: '' });
  };

  const addBlog = () => {
    setBlogPosts([...blogPosts, { ...newBlog, id: Date.now(), date: 'Now' }]);
    setShowBlogModal(false);
    setNewBlog({ title: '', category: 'Education', content: '', author: 'Admin' });
  };

  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'projects', label: 'Manage Projects', icon: <Briefcase size={20} /> },
    { id: 'blogs', label: 'Blog Posts', icon: <FileText size={20} /> },
    { id: 'complaints', label: 'Complaints', icon: <MessageSquareWarning size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const stats = [
    { label: 'Total Donations', value: '$124,500', growth: '+12%', icon: <TrendingUp className="text-emerald-500" /> },
    { label: 'Active Volunteers', value: '1,240', growth: '+5%', icon: <Users className="text-primary-teal" /> },
    { label: 'Lives Impacted', value: '52,000', growth: '+18%', icon: <Heart className="text-primary-rose" /> },
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Donations',
        data: [12000, 19000, 15000, 22000, 30000, 25000],
        borderColor: '#C9933A',
        backgroundColor: 'rgba(201, 147, 58, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0A0A0F] border-r border-white/5 p-8 flex flex-col fixed h-full z-20">
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-black text-primary-gold uppercase tracking-tighter">LAKSHMI <span className="text-white italic">ADMIN</span></h2>
          <p className="text-[10px] text-primary-offwhite/30 uppercase tracking-[0.3em] font-bold mt-1">Management Portal</p>
        </div>

        <nav className="flex-grow space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-body text-sm font-bold ${
                activeTab === link.id 
                  ? 'bg-primary-gold text-primary-navy shadow-xl shadow-primary-gold/10' 
                  : 'text-primary-offwhite/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-500 font-bold hover:bg-rose-500/10 transition-all mt-auto border border-rose-500/20">
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-72 p-12">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-heading font-black uppercase text-white">Welcome back, Admin</h1>
            <p className="text-primary-offwhite/40 font-body text-sm italic">Reporting session for Oct 2025</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative h-12 w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-offwhite/30" size={18} />
              <input 
                type="text" 
                placeholder="Search analytics..." 
                className="w-full h-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm focus:border-primary-gold outline-none"
              />
            </div>
            <button className="relative p-3 bg-white/5 rounded-xl border border-white/10 hover:border-primary-gold transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-gold rounded-full" />
            </button>
            <div className="w-12 h-12 rounded-xl bg-gold-gradient p-[1px]">
              <div className="w-full h-full bg-primary-navy rounded-[11px] flex items-center justify-center font-black">A</div>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="glass p-8 rounded-[2.5rem] border-primary-gold/10 relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-white/5 rounded-xl">{stat.icon}</div>
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">{stat.growth}</span>
                    </div>
                    <p className="text-primary-offwhite/40 text-[10px] uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-heading font-black text-white">{stat.value}</h3>
                  </div>
                  {/* Decorative Glow */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-gold/5 blur-3xl group-hover:bg-primary-gold/10 transition-all" />
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border-primary-gold/10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-heading font-black uppercase">Revenue Overview</h3>
                  <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-[10px] font-bold outline-none">
                    <option className="bg-primary-navy">Last 6 Months</option>
                    <option className="bg-primary-navy">Last Year</option>
                  </select>
                </div>
                <div className="h-[300px]">
                  <Line data={chartData} options={{ maintainAspectRatio: false, scales: { x: { display: false }, y: { display: false } }, plugins: { legend: { display: false } } }} />
                </div>
              </div>
              
              <div className="glass p-8 rounded-[2.5rem] border-primary-gold/10 flex flex-col justify-center text-center">
                <Heart className="text-primary-rose mx-auto mb-6 scale-150 animate-pulse" size={40} />
                <h4 className="text-primary-gold font-body text-xs uppercase tracking-widest font-black mb-2">Campaign Goal</h4>
                <div className="text-5xl font-heading font-black mb-4">84%</div>
                <p className="text-primary-offwhite/50 text-xs italic leading-relaxed">We are close to hitting our emergency shelter fund goal for the winter project.</p>
              </div>
            </div>

            {/* Recent Activities Table */}
            <div className="glass rounded-[2.5rem] border-primary-gold/10 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-heading font-black uppercase tracking-tight">Recent Log Submissions</h3>
                <button className="flex items-center gap-2 bg-primary-gold text-primary-navy px-6 py-2 rounded-xl text-[10px] font-black hover:scale-105 transition-all">
                  <Plus size={14} /> NEW ENTRY
                </button>
              </div>
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-primary-offwhite/40 font-bold">
                  <tr>
                    <th className="px-8 py-4">Title</th>
                    <th className="px-8 py-4">Category</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm font-body">
                  {[
                    { title: 'Food Drive @ Mumbai Slums', cat: 'Outreach', date: 'Oct 14', status: 'Published' },
                    { title: 'Legal Awareness Camp', cat: 'Women Safety', date: 'Oct 12', status: 'Draft' },
                    { title: 'Tree Plantation Drive', cat: 'Environment', date: 'Oct 10', status: 'Published' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer group">
                      <td className="px-8 py-6 font-bold group-hover:text-primary-gold transition-colors">{row.title}</td>
                      <td className="px-8 py-6 text-primary-offwhite/50">{row.cat}</td>
                      <td className="px-8 py-6 text-primary-offwhite/30">{row.date}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                          row.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary-gold/10 text-primary-gold'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-black uppercase">Active Projects</h2>
              <button 
                onClick={() => setShowProjectModal(true)}
                className="flex items-center gap-2 bg-primary-gold text-primary-navy px-8 py-3 rounded-2xl font-black text-xs hover:scale-105 transition-all"
              >
                <Plus size={16} /> ADD NEW PROJECT
              </button>
            </div>

            <div className="grid gap-4">
              {projects.map(p => (
                <div key={p.id} className="glass p-6 rounded-3xl border-white/5 flex items-center justify-between group hover:border-primary-gold/30 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary-gold">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{p.title}</h4>
                      <p className="text-xs text-primary-offwhite/40 uppercase tracking-widest">{p.category} · {p.impact}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"><Edit size={16} /></button>
                    <button className="p-3 bg-white/5 rounded-xl text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'blogs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-black uppercase">Impact Stories</h2>
              <button 
                onClick={() => setShowBlogModal(true)}
                className="flex items-center gap-2 bg-primary-gold text-primary-navy px-8 py-3 rounded-2xl font-black text-xs hover:scale-105 transition-all"
              >
                <Plus size={16} /> CREATE NEW STORY
              </button>
            </div>

            <div className="grid gap-4">
              {blogPosts.map(b => (
                <div key={b.id} className="glass p-6 rounded-3xl border-white/5 flex items-center justify-between group hover:border-primary-gold/30 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary-gold">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{b.title}</h4>
                      <p className="text-xs text-primary-offwhite/40 uppercase tracking-widest">{b.category} · By {b.author} · {b.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"><Edit size={16} /></button>
                    <button className="p-3 bg-white/5 rounded-xl text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'complaints' && (
          <div className="text-center py-24 glass rounded-[3rem] border-primary-gold/10">
            <MessageSquareWarning className="mx-auto text-primary-gold/20 mb-6" size={64} />
            <h2 className="text-2xl font-heading font-black mb-4">VOICE COMPLAINTS</h2>
            <p className="text-primary-offwhite/50 italic mb-10">Listen to transcribed audio files submitted via the portal.</p>
            <div className="max-w-xl mx-auto space-y-4">
               <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="text-left">
                     <p className="font-black text-sm">"I witnessed an incident at the bus stop..."</p>
                     <p className="text-[10px] text-primary-offwhite/30">Submitted: 2 hours ago · Transcribed by AI</p>
                  </div>
                  <button className="px-6 py-2 bg-primary-gold text-primary-navy rounded-xl text-[10px] font-black">VIEW</button>
               </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {showProjectModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#0D0D12] w-full max-w-xl rounded-[3rem] p-12 border border-white/10 relative overflow-hidden">
                <button onClick={() => setShowProjectModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><CloseIcon size={24} /></button>
                <h3 className="text-3xl font-heading font-black uppercase mb-10">Add <span className="text-primary-gold">Project</span></h3>
                <div className="space-y-6">
                  <input type="text" placeholder="Project Title" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-primary-gold" onChange={e => setNewProject({...newProject, title: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <select className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-primary-gold" onChange={e => setNewProject({...newProject, category: e.target.value})}>
                      <option className="bg-primary-navy">Education</option>
                      <option className="bg-primary-navy">Environment</option>
                      <option className="bg-primary-navy">Health</option>
                      <option className="bg-primary-navy">Women Empowerment</option>
                    </select>
                    <input type="text" placeholder="Impact (e.g. 10k Lives)" className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-primary-gold" onChange={e => setNewProject({...newProject, impact: e.target.value})} />
                  </div>
                  <button onClick={addProject} className="w-full py-5 bg-primary-gold text-primary-navy font-black rounded-2xl hover:bg-white transition-all">PUBLISH PROJECT</button>
                </div>
              </div>
            </motion.div>
          )}

          {showBlogModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#0D0D12] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-12 border border-white/10 relative no-scrollbar">
                <button onClick={() => setShowBlogModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><CloseIcon size={24} /></button>
                <h3 className="text-3xl font-heading font-black uppercase mb-10">Write <span className="text-primary-gold">Impact Story</span></h3>
                <div className="space-y-6">
                  <input type="text" placeholder="Story Title" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-primary-gold text-xl font-bold" onChange={e => setNewBlog({...newBlog, title: e.target.value})} />
                  <select className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-primary-gold" onChange={e => setNewBlog({...newBlog, category: e.target.value})}>
                    <option className="bg-primary-navy">Education</option>
                    <option className="bg-primary-navy">Empowerment</option>
                    <option className="bg-primary-navy">Environment</option>
                    <option className="bg-primary-navy">Health</option>
                  </select>
                  <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 min-h-[300px]">
                    <textarea
                      value={newBlog.content}
                      onChange={e => setNewBlog({...newBlog, content: e.target.value})}
                      placeholder="Write your impact story here..."
                      rows={12}
                      className="w-full h-full min-h-[300px] bg-transparent p-6 text-white text-sm outline-none resize-none font-body placeholder:text-primary-offwhite/20"
                    />
                  </div>
                  <button onClick={addBlog} className="w-full py-5 bg-primary-gold text-primary-navy font-black rounded-2xl hover:bg-white transition-all uppercase tracking-widest transform">SHARE STORY FOREVER</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
