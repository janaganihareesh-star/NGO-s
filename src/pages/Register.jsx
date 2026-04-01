import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserPlus, Mail, Lock, User, Briefcase, MapPin, Sparkles, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    region: '',
    interest: 'Education'
  });
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { register } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);

    try {
      const user = await register(formData);
      toast.success(`Welcome to the mission, ${user.name}!`);
      
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'officer') navigate('/officer');
      else navigate('/volunteer-dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const cardClass = isDarkMode ? 'glass border-white/10' : 'bg-white border-gray-200';
  const labelClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const inputClass = isDarkMode 
    ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/20' 
    : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400';

  return (
    <div className={isDarkMode ? 'min-h-screen pt-32 pb-24 flex items-center justify-center font-body bg-[#050508]' : 'min-h-screen pt-32 pb-24 flex items-center justify-center font-body bg-[#F5F0E8]'}>
      <SEO title="Join the Mission" description="Register for Lakshmi NGO Portals" />
      
      <div className="container mx-auto px-6 w-full max-w-6xl flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={"w-full max-w-2xl rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden " + cardClass}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-gold/10 blur-[80px] rounded-full pointer-events-none" />
          
          <Link to="/login" className="inline-flex items-center gap-2 text-primary-gold hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-8">
            <ArrowLeft size={14} /> Back to Login
          </Link>

          <div className="text-center mb-10">
            <h1 className={"text-4xl font-heading font-black mb-2 uppercase tracking-tight " + labelClass}>Join the Mission</h1>
            <p className={isDarkMode ? 'text-sm font-bold tracking-widest uppercase text-primary-offwhite/40' : 'text-sm font-bold tracking-widest uppercase text-gray-500'}>Register for Portal Access</p>
          </div>

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            
            <div className="space-y-2">
              <label className={"text-[10px] font-black uppercase tracking-widest " + labelClass}>Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={"w-full p-4 rounded-xl outline-none font-bold pl-12 " + inputClass}
                  placeholder="Aarav Sharma"
                />
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-gold" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={"text-[10px] font-black uppercase tracking-widest " + labelClass}>Account Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={"w-full p-4 rounded-xl outline-none font-bold pl-12 " + inputClass}
                  placeholder="name@lakshmi.org"
                />
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-gold" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={"text-[10px] font-black uppercase tracking-widest " + labelClass}>Secret Passcode</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={"w-full p-4 rounded-xl outline-none font-bold pl-12 " + inputClass}
                  placeholder="••••••••"
                />
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-gold" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={"text-[10px] font-black uppercase tracking-widest " + labelClass}>System Role</label>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className={"w-full p-4 rounded-xl outline-none font-bold pl-12 appearance-none cursor-pointer " + inputClass}
                >
                  <option value="user" className="bg-[#0A0A0F]">Volunteer / Citizen</option>
                  <option value="officer" className="bg-[#0A0A0F]">Field Officer</option>
                  <option value="admin" className="bg-[#0A0A0F]">System Admin</option>
                </select>
                <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-gold pointer-events-none" />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {formData.role === 'officer' && (
                <motion.div 
                  key="officer-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 md:col-span-2"
                >
                  <label className={"text-[10px] font-black uppercase tracking-widest " + labelClass}>Assigned Region</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      className={"w-full p-4 rounded-xl outline-none font-bold pl-12 " + inputClass}
                      placeholder="e.g. Maharashtra East"
                    />
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-gold" />
                  </div>
                </motion.div>
              )}

              {formData.role === 'user' && (
                <motion.div 
                  key="volunteer-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 md:col-span-2"
                >
                  <label className={"text-[10px] font-black uppercase tracking-widest " + labelClass}>Core Interest</label>
                  <div className="relative">
                    <select
                      value={formData.interest}
                      onChange={(e) => setFormData({...formData, interest: e.target.value})}
                      className={"w-full p-4 rounded-xl outline-none font-bold pl-12 appearance-none cursor-pointer " + inputClass}
                    >
                      <option value="Education" className="bg-[#0A0A0F]">Slum Education</option>
                      <option value="Health" className="bg-[#0A0A0F]">Health & Nutrition</option>
                      <option value="Environment" className="bg-[#0A0A0F]">Environment</option>
                      <option value="Protection" className="bg-[#0A0A0F]">Women Safety</option>
                    </select>
                    <Sparkles size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-gold pointer-events-none" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={isRegistering}
              className="md:col-span-2 mt-4 overflow-hidden relative group w-full flex items-center justify-center gap-2 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all bg-primary-gold text-[#0A0A0F] hover:shadow-[0_0_30px_#C9933A60] active:scale-95 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10">{isRegistering ? 'Initializing Identity...' : 'Confirm Registration'}</span>
              {!isRegistering && <UserPlus size={18} className="relative z-10 group-hover:scale-125 transition-transform" />}
            </button>
          </form>

          <p className={"mt-10 text-center text-xs font-bold uppercase tracking-[0.2em] " + (isDarkMode ? 'text-white/30' : 'text-gray-400')}>
            By registering, you agree to our 
            <span className="text-primary-gold cursor-pointer hover:underline mx-1">Nexus Security Protocol</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
