import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero3D from '../components/Hero3D';
import AnimatedCounter from '../components/AnimatedCounter';
import ImpactCharts from '../components/ImpactCharts';
import WhatWeDo from '../components/WhatWeDo';
import BlogGrid from '../components/BlogGrid';
import GetInvolved from '../components/GetInvolved';
import ContactSection from '../components/ContactSection';
import SEO from '../components/SEO';
import { Heart, Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return; // Skip heavy GSAP animations on mobile for performance

    // GSAP ScrollTrigger Animations
    const ctx = gsap.context(() => {
      // Fade in sections on scroll
      const sections = gsap.utils.toArray('section').filter(s => s.id !== 'hero'); 
      sections.forEach((section) => {
        gsap.fromTo(section, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            }
          }
        );
      });

      // Special animation for the Mission Statement
      gsap.from(".mission-text", {
        scrollTrigger: {
          trigger: ".mission-section",
          start: "top center",
        },
        duration: 1.5,
        opacity: 0,
        y: 100,
        skewY: 10,
        stagger: 0.2,
        ease: "power4.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-primary-navy"
    >
      <SEO 
        title="Home" 
        description="Lakshmi NGO is dedicated to protecting the vulnerable — from the girl child to the environment. Join our mission."
        image="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200"
      />
      
      <section id="hero">
        <Hero3D />
      </section>
      
      <section id="stats">
        <AnimatedCounter />
      </section>
      
      <section className="mission-section relative py-32 overflow-hidden bg-fixed bg-cover bg-center" 
        style={{ backgroundImage: `linear-gradient(rgba(10, 10, 15, 0.95), rgba(10, 10, 15, 0.95)), url('/indian_mission_collage_1775031301797.png')` }}>
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto glass p-16 rounded-[4rem] border-primary-gold/10">
            <Heart className={`mx-auto text-primary-gold mb-8 ${window.innerWidth >= 768 ? 'animate-pulse' : ''}`} size={64} />
            <h2 className="mission-text text-4xl md:text-6xl font-heading font-black mb-10 tracking-tight">OUR SACRED <span className="text-primary-gold italic">MISSION</span></h2>
            <p className="mission-text text-xl md:text-2xl font-body text-primary-offwhite/70 leading-relaxed mb-12 italic">
              "We believe that every human being deserves a chance to thrive. Our mission is to bridge the gap between resources and results, empowering communities through radical kindness and systemic change."
            </p>
            <div className="mission-text flex justify-center items-center gap-6">
              <div className="h-[1px] w-16 bg-primary-gold/30"></div>
              <span className="font-heading text-primary-gold uppercase tracking-[0.5em] font-bold text-xs font-black">Lakshmi NGO Leadership</span>
              <div className="h-[1px] w-16 bg-primary-gold/30"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="charts">
        <ImpactCharts />
      </section>

      <section id="what-we-do">
        <WhatWeDo />
      </section>

      <section id="get-involved">
        <GetInvolved />
      </section>

      <section id="blog">
        <BlogGrid />
      </section>

      <section id="contact">
        <ContactSection />
      </section>

      <footer className="py-24 bg-primary-navy text-center border-t border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-10 tracking-tighter uppercase">
              Protecting life. <span className="text-primary-gold italic">Restoring hope.</span>
            </h2>
            <p className="text-primary-offwhite/40 font-body text-sm tracking-[0.5em] uppercase font-bold mb-16">
              © 2026 LAKSHMI NGO. REGISTERED UNDER NGO ACT 2014.
            </p>
            
            <div className="flex justify-center gap-10">
              {[
                { name: 'Facebook', icon: <Facebook size={22} />, color: 'hover:text-[#1877F2]' },
                { name: 'Instagram', icon: <Instagram size={22} />, color: 'hover:text-[#E4405F]' },
                { name: 'Twitter', icon: <Twitter size={22} />, color: 'hover:text-[#1DA1F2]' },
                { name: 'YouTube', icon: <Youtube size={22} />, color: 'hover:text-[#FF0000]' },
                { name: 'LinkedIn', icon: <Linkedin size={22} />, color: 'hover:text-[#0A66C2]' }
              ].map((social) => (
                <a 
                  key={social.name} 
                  href="#" 
                  className={`group relative p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 transition-all duration-500 hover:scale-125 hover:-translate-y-2 ${social.color} hover:border-gray-400/30 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)]`}
                  aria-label={social.name}
                >
                  <div className="relative z-10 transition-transform duration-500 group-hover:rotate-[360deg]">
                    {social.icon}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-64 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary-gold/5 blur-[150px] rounded-full pointer-events-none" />
      </footer>
    </motion.div>
  );
};

export default Home;
