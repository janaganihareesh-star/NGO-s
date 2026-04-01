import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Sun, Moon, ChevronDown, Heart, Shield, Home, Users, BookOpen, Trees, Baby } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'What We Do', path: '#', hasDropdown: true },
    { name: 'Our Impact', path: '/impact', icon: <Users size={18} /> },
    { name: 'Who We Are', path: '/about', icon: <Heart size={18} /> },
    { name: 'Blog', path: '/blog', icon: <BookOpen size={18} /> },
    { name: 'Portal', path: '/login', icon: <Shield size={18} /> },
  ];

  const causes = [
    { name: 'Education', icon: <Baby className="text-primary-gold" />, desc: 'Rural schools & digital labs.', slug: 'education' },
    { name: 'Empowerment', icon: <Users className="text-rose-500" />, desc: 'Women-led micro-enterprises.', slug: 'empowerment' },
    { name: 'Environment', icon: <Trees className="text-green-500" />, desc: 'Reforestation & sustainable farming.', slug: 'environment' },
    { name: 'Protection', icon: <Shield className="text-blue-500" />, desc: 'Legal aid & emergency response.', slug: 'protection' },
    { name: 'Tech for Good', icon: <Trees className="text-purple-500" />, desc: 'Rural tech centers for youth.', slug: 'tech-for-good' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isScrolled ? (isDarkMode ? 'glass py-3' : 'bg-white/80 backdrop-blur-xl border-b border-gray-200 py-3 shadow-sm') : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className={`text-2xl font-heading font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            LAKSHMI <span className="text-primary-gold">NGO</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => link.hasDropdown && setIsMegaMenuOpen(true)}
              onMouseLeave={() => link.hasDropdown && setIsMegaMenuOpen(false)}
            >
              <Link
                to={link.path}
                className={`font-body text-[13px] uppercase tracking-[0.2em] font-bold transition-all hover:text-primary-gold flex items-center gap-1 ${
                  location.pathname === link.path 
                    ? 'text-primary-gold' 
                    : isDarkMode ? 'text-primary-offwhite/80' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {link.name}
                {link.hasDropdown && <ChevronDown size={14} className={`transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />}
              </Link>

              {/* Mega Dropdown Panel */}
              <AnimatePresence>
                {link.hasDropdown && isMegaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[600px]"
                  >
                    <div className={`p-8 rounded-3xl grid grid-cols-2 gap-6 shadow-2xl ${isDarkMode ? 'glass border-primary-gold/20' : 'bg-white border border-gray-100'}`}>
                      {causes.map((cause) => (
                        <Link
                          key={cause.name}
                          to={`/cause/${cause.slug}`}
                          onClick={() => setIsMegaMenuOpen(false)}
                          className={`flex items-start gap-4 p-4 rounded-2xl transition-colors group/item ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                        >
                          <div className={`p-3 rounded-xl transition-transform group-hover/item:scale-110 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                            {cause.icon}
                          </div>
                          <div>
                            <h4 className={`font-heading text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900 font-bold'}`}>{cause.name}</h4>
                            <p className={`text-xs font-body ${isDarkMode ? 'text-primary-offwhite/50' : 'text-gray-500'}`}>{cause.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-primary-offwhite' : 'hover:bg-black/5 text-gray-700'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                to={currentUser.role === 'admin' ? '/admin' : '/volunteer-dashboard'}
                className="px-6 py-2 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-primary-gold hover:text-primary-navy transition-all text-xs uppercase tracking-widest"
              >
                Dashboard
              </Link>
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-rose-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`font-body text-[13px] uppercase tracking-[0.2em] font-bold transition-all hover:text-primary-gold ${isDarkMode ? 'text-primary-offwhite/80' : 'text-gray-700'}`}
            >
              Login
            </Link>
          )}

          <Link
            to="/donate"
            className="px-8 py-3 bg-primary-gold text-[#0A0A0F] font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary-gold/20"
          >
            Donate Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-4">
          <button onClick={toggleTheme} className={`p-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-xl ${isDarkMode ? 'text-white glass' : 'text-gray-900 border border-gray-200'}`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-0 z-[99] lg:hidden flex flex-col p-8 pt-32 ${isDarkMode ? 'bg-primary-navy/95 backdrop-blur-2xl' : 'bg-white/95 backdrop-blur-2xl'}`}
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-4xl font-heading font-black tracking-tighter ${
                    location.pathname === link.path ? 'text-primary-gold' : (isDarkMode ? 'text-white' : 'text-gray-900')
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="mt-auto flex flex-col gap-4">
              {currentUser ? (
                <Link
                  to={currentUser.role === 'admin' ? '/admin' : '/volunteer-dashboard'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-5 bg-white/5 border border-white/20 text-white font-black text-center rounded-2xl text-xl"
                >
                  DASHBOARD
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-5 bg-white/5 border border-white/20 text-white font-black text-center rounded-2xl text-xl"
                >
                  LOGIN PORTAL
                </Link>
              )}
              <Link
                to="/donate"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-5 bg-primary-gold text-[#0A0A0F] font-black text-center rounded-2xl text-xl"
              >
                DONATE NOW
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
