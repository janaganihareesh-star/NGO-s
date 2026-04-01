import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TeamCard from '../components/TeamCard';
import SEO from '../components/SEO';
import { Target, Eye, Globe, Zap, Heart, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const itemsRef = useRef([]);

  const milestones = [
    { year: "2016", title: "The Inception", desc: "Started with a small group of 5 volunteers in a garage with a big vision." },
    { year: "2018", title: "First 10 Projects", desc: "Successfully completed our first clean water and local education programs." },
    { year: "2020", title: "Global Expansion", desc: "Partnered with 20 international NGOs to expand our reach to 3 continents." },
    { year: "2022", title: "1M Lives Impacted", desc: "Reached a massive milestone of serving 1 million individuals globally." },
    { year: "2024", title: "Technology Vanguard", desc: "Launched our AI-driven resource matching platform for disaster relief." },
  ];

  const teamMembers = [
    { name: "Dr. Aarav Sharma", role: "Chief Impact Researcher", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" },
    { name: "Dr. Meenakshi Iyer", role: "Director of Rural Studies", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" },
    { name: "Dr. Vikram Malhotra", role: "Head of Tech Innovation", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop" },
    { name: "Saira Khan", role: "Lead Field Ethnographer", image: "/saira.jpg" },
  ];

  const values = [
    { icon: <Heart />, title: "Compassion", text: "We lead with empathy in every interaction and decision." },
    { icon: <Shield />, title: "Integrity", text: "Transparency and accountability are our bedrock." },
    { icon: <Globe />, title: "Inclusion", text: "We believe in a world where everyone has a seat at the table." },
    { icon: <Zap />, title: "Innovation", text: "Constant evolution to solve modern challenges efficiently." },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((el, index) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-primary-navy font-body"
    >
      <SEO 
        title="About Us" 
        description="Learn about the journey, mission, and the global team behind Nexus Global NGO."
      />
      {/* Header */}
      <section className="pt-40 pb-20 bg-secondary/50 border-b border-white/5">
        <div className="container mx-auto px-6 text-center">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary-gold uppercase tracking-[0.4em] text-xs font-bold mb-4"
          >
            OUR JOURNEY & MISSION
          </motion.h4>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-heading font-black text-white"
          >
            WHO WE <span className="italic text-primary-gold">ARE?</span>
          </motion.h1>
        </div>
      </section>

      {/* Story & Timeline Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Story Timeline */}
            <div className="relative">
              <div className="absolute left-[20px] top-0 bottom-0 w-[2px] bg-primary-gold/20" />
              <div className="space-y-16">
                {milestones.map((item, idx) => (
                  <div
                    key={idx}
                    ref={(el) => (itemsRef.current[idx] = el)}
                    className="relative pl-12"
                  >
                    <div className="absolute left-0 top-2 w-[40px] h-[40px] rounded-full border-2 border-primary-gold bg-primary-navy flex items-center justify-center z-10">
                      <div className="w-2 h-2 bg-primary-gold rounded-full" />
                    </div>
                    <span className="text-primary-gold font-black text-2xl font-heading mb-2 block">
                      {item.year}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission/Vision Cards (Glassmorphism) */}
            <div className="space-y-8 sticky top-32 h-fit">
              <div className="glass p-10 rounded-[2rem] border-primary-gold/20 flex gap-6">
                <div className="p-4 bg-primary-gold/10 rounded-2xl h-fit text-primary-gold">
                  <Target size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-heading font-bold mb-4 uppercase">OUR MISSION</h3>
                  <p className="text-gray-400 leading-relaxed">
                    To implement sustainable programs that improve access to education, clean water, and healthcare while preserving the environment for future generations.
                  </p>
                </div>
              </div>

              <div className="glass-gold p-10 rounded-[2rem] border-white/5 flex gap-6">
                <div className="p-4 bg-white/5 rounded-2xl h-fit text-white">
                  <Eye size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-heading font-bold mb-4 uppercase">OUR VISION</h3>
                  <p className="text-gray-400 leading-relaxed">
                    A world where poverty is eradicated, and every individual is empowered to reach their full potential through collective human effort and tech innovation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-3xl hover:bg-primary-navy/50 transition-colors group"
              >
                <div className="p-4 bg-primary-gold/10 rounded-2xl w-fit mx-auto mb-6 text-primary-gold group-hover:scale-110 transition-transform">
                  {v.icon}
                </div>
                <h4 className="text-xl font-heading font-bold mb-4">{v.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 uppercase">
            THE MINDS BEHIND <span className="text-primary-gold font-bold">CHANGE</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-16">
            Meet the dedicated individuals working day and night to ensure our missions reach those who need it most.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <TeamCard key={idx} member={member} index={idx} />
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
