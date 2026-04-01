import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ExternalLink, MapPin, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const ProjectsData = [
  {
    id: 1,
    title: "Eco-Friendly Village",
    category: "Environment",
    description: "Building sustainable living models in coastal areas through local waste management and renewable energy.",
    impact: "2,000 Houses",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
    fullDesc: "This project focuses on transforming traditional coastal villages into self-sustaining ecosystems. We implemented solar grids, water desalination plants, and a comprehensive plastic recycling chain that provides livelihoods to over 500 locals.",
    location: "Indonesia",
    status: "Active"
  },
  {
    id: 2,
    title: "Future Leaders Program",
    category: "Education",
    description: "Empowering next-generation leaders through tech-focused education and mentorship.",
    impact: "15k Students",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
    fullDesc: "We believe that the digital divide is the new frontier of inequality. This program provides laptops, high-speed internet, and coding curricula to rural schools, paired with monthly mentorship from silicon valley veterans.",
    location: "Global",
    status: "Growing"
  },
  {
    id: 3,
    title: "Healthy Mothers, Healthy Babies",
    category: "Health",
    description: "Reducing maternal mortality through mobile clinic units and prenatal care access.",
    impact: "8k Births",
    image: "https://images.unsplash.com/photo-1505751172107-16723223075c?auto=format&fit=crop&q=80&w=800",
    fullDesc: "Our mobile clinics travel to remote mountainous regions where hospitals are non-existent. We provide regular checkups, vitamins, and emergency transport services for high-risk pregnancies.",
    location: "Bolivia",
    status: "Stable"
  },
  {
    id: 4,
    title: "Women Entrepreneurs Hub",
    category: "Women Empowerment",
    description: "Micro-loans and business training for women starting small businesses in local markets.",
    impact: "500 Businesses",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
    fullDesc: "By providing small-scale financial support and business literacy, we help women achieve financial independence. These businesses range from agricultural startups to artisanal textile workshops.",
    location: "Ghana",
    status: "Expanding"
  },
  {
    id: 5,
    title: "Forest Recovery AI",
    category: "Environment",
    description: "Using drone tech and AI to map deforestation and plant native tree species efficiently.",
    impact: "1M Trees",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
    fullDesc: "Drones are used to identify critical areas of forest loss. Seed pods are then dropped in optimal patterns to ensure maximum survival rates of native species, monitored via satellite imagery.",
    location: "Amazon Basin",
    status: "High Tech"
  },
  {
    id: 6,
    title: "SkillUp Academy",
    category: "Education",
    description: "Vocational training for refugees to integrate into local job markets with high-demand skills.",
    impact: "3k Alumini",
    image: "https://images.unsplash.com/photo-1524178232363-1fb28f74b573?auto=format&fit=crop&q=80&w=800",
    fullDesc: "Providing intensive 6-month courses in plumbing, electrical work, and digital marketing. We also partner with local companies to ensure a 90% job placement rate for graduates.",
    location: "Berlin",
    status: "Impactful"
  }
];

const Works = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ["All", "Education", "Health", "Environment", "Women Empowerment"];

  const filteredProjects = activeTab === "All" 
    ? ProjectsData 
    : ProjectsData.filter(p => p.category === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-primary-navy pt-32 pb-24 min-h-screen"
    >
      <SEO 
        title="Our Works" 
        description="Explore our global projects in Education, Health, Environment, and Women Empowerment."
      />
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 uppercase">
            OUR <span className="text-primary-gold">IMPACT</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 font-body mb-12">
            Detailed tracking of our active initiatives across the globe. We believe in transparency and measurable results.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-8 py-3 rounded-full font-body text-sm font-bold tracking-widest transition-all ${
                  activeTab === cat 
                    ? "bg-primary-gold text-primary-navy shadow-lg shadow-primary-gold/20" 
                    : "border border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProject(project)}
                className="glass-gold rounded-3xl overflow-hidden group cursor-pointer hover:border-primary-gold/40 transition-colors"
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary-navy/80 text-primary-gold font-bold text-[10px] rounded-full uppercase tracking-tighter">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-heading font-bold mb-3">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">{project.description}</p>
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-black">Impact Reach</p>
                      <p className="text-primary-gold font-bold">{project.impact}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 overflow-hidden"
          >
            <div 
              className="absolute inset-0 bg-primary-navy/95 backdrop-blur-md" 
              onClick={() => setSelectedProject(null)} 
            />
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="relative w-full max-w-5xl bg-secondary rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 flex flex-col md:flex-row h-full max-h-[85vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-8 right-8 z-20 p-3 bg-primary-navy rounded-full text-white hover:bg-primary-gold hover:text-primary-navy transition-colors"
              >
                <X size={24} />
              </button>

              {/* Photo Side */}
              <div className="md:w-1/2 h-64 md:h-auto relative">
                <img src={selectedProject.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-transparent" />
              </div>

              {/* Content Side */}
              <div className="md:w-1/2 p-12 overflow-y-auto no-scrollbar scroll-smooth">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-5 py-2 bg-primary-gold text-primary-navy font-black text-xs rounded-full uppercase italic">
                    {selectedProject.category}
                  </span>
                  <span className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin size={16} /> {selectedProject.location}
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-heading font-black mb-8 text-white leading-tight">
                  {selectedProject.title}
                </h2>

                <p className="text-gray-300 font-body text-lg leading-relaxed mb-10">
                  {selectedProject.fullDesc}
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-primary-gold transition-colors">
                    <Target className="text-primary-gold mb-4" />
                    <p className="text-[10px] uppercase text-gray-500 mb-1">CUMULATIVE IMPACT</p>
                    <p className="text-2xl font-heading font-black text-white">{selectedProject.impact}</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-primary-gold transition-colors">
                    <ExternalLink className="text-primary-gold mb-4" />
                    <p className="text-[10px] uppercase text-gray-500 mb-1">PROJECT STATUS</p>
                    <p className="text-2xl font-heading font-black text-white">{selectedProject.status}</p>
                  </div>
                </div>

                <Link 
                  to="/donate"
                  className="w-full py-5 bg-white text-primary-navy font-black rounded-3xl hover:bg-primary-gold transition-colors text-lg text-center block"
                >
                  DONATE TO THIS MISSION
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Works;
