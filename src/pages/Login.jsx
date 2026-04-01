import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError('');

    try {
      const user = await login(email, password);
      toast.success("Welcome back, " + user.name + "!");
      
      if (from) {
        navigate(from);
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'officer') {
        navigate('/officer');
      } else {
        navigate('/volunteer-dashboard');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const prefill = (eField, pField) => {
    setEmail(eField);
    setPassword(pField);
  };

  const cardClass = isDarkMode
    ? 'glass border-white/10'
    : 'bg-white border-gray-200';

  const labelClass = isDarkMode
    ? 'text-white'
    : 'text-gray-900';

  const inputClass = isDarkMode
    ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/20'
    : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400';

  const credBtnClass = isDarkMode
    ? 'border-white/10 text-white/70 hover:bg-white/5'
    : 'border-gray-200 text-gray-600 hover:bg-gray-50';

  return (
    <div className={isDarkMode ? 'min-h-screen pt-32 pb-24 flex items-center justify-center font-body bg-[#050508]' : 'min-h-screen pt-32 pb-24 flex items-center justify-center font-body bg-[#F5F0E8]'}>
      <SEO title="Secure Portal Access" description="Staff and Volunteer Login Portal" />
      
      <div className="container mx-auto px-6 w-full max-w-6xl flex items-center justify-center">
        
        <div className={"w-full max-w-xl rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden " + cardClass}>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-gold/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="text-center mb-10 relative z-10">
            <div className={isDarkMode ? 'w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 bg-white/5 border border-white/10' : 'w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 bg-gray-100 border border-gray-200'}>
               <Shield className="text-primary-gold" size={32} />
            </div>
            <h1 className={"text-4xl font-heading font-black mb-2 uppercase tracking-tight " + labelClass}>Portal Access</h1>
            <p className={isDarkMode ? 'text-sm font-bold tracking-widest uppercase text-primary-offwhite/40' : 'text-sm font-bold tracking-widest uppercase text-gray-500'}>Secure Staff & Volunteer Login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold flex items-center gap-3">
                 <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="space-y-2">
              <label className={"text-xs font-black uppercase tracking-widest " + labelClass}>Account Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={"w-full p-4 rounded-xl outline-none font-bold placeholder:font-normal focus:ring-2 ring-primary-gold transition-all " + inputClass}
                placeholder="name@lakshmi.org"
              />
            </div>

            <div className="space-y-2">
              <label className={"text-xs font-black uppercase tracking-widest " + labelClass}>Passcode</label>
              <div className="relative">
                 <input
                   type="password"
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className={"w-full p-4 rounded-xl outline-none font-bold placeholder:font-normal focus:ring-2 ring-primary-gold transition-all pl-12 " + inputClass}
                   placeholder="••••••••"
                 />
                 <KeyRound size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-gold" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isAuthenticating}
              className={isAuthenticating 
                ? 'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all bg-primary-gold/50 cursor-not-allowed text-[#0A0A0F]/50' 
                : 'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all bg-primary-gold text-[#0A0A0F] hover:shadow-[0_0_20px_#C9933A40] hover:-translate-y-1'
              }
            >
              {isAuthenticating ? 'Verifying...' : 'Authorize Access'} <ArrowRight size={16} />
            </button>
            <div className="text-center pt-2">
               <p className={isDarkMode ? 'text-xs font-bold uppercase tracking-widest text-primary-offwhite/30' : 'text-xs font-bold uppercase tracking-widest text-gray-500'}>
                  New to the system? <Link to="/register" className="text-primary-gold hover:underline">Register for Portal Access</Link>
               </p>
            </div>
          </form>

          {/* Test Credentials Sandbox */}
          <div className={isDarkMode ? 'mt-10 pt-8 border-t border-white/10' : 'mt-10 pt-8 border-t border-gray-200'}>
             <p className={isDarkMode ? 'text-xs text-center font-bold uppercase tracking-widest mb-6 text-primary-offwhite/50' : 'text-xs text-center font-bold uppercase tracking-widest mb-6 text-gray-500'}>Test Credentials Matrix</p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button onClick={() => prefill('admin@lakshmi.org', 'adminpass')} className={"p-3 rounded-lg border text-xs font-bold text-center hover:border-primary-gold transition-all " + credBtnClass}>
                   Admin Root
                </button>
                <button onClick={() => prefill('officer@lakshmi.org', 'secure123')} className={"p-3 rounded-lg border text-xs font-bold text-center hover:border-primary-gold transition-all " + credBtnClass}>
                   Field Officer
                </button>
                <button onClick={() => prefill('user@lakshmi.org', 'volunteer')} className={"p-3 rounded-lg border text-xs font-bold text-center hover:border-primary-gold transition-all " + credBtnClass}>
                   Volunteer
                </button>
             </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default Login;
