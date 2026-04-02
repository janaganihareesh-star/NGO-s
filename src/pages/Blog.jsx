import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, User, ArrowRight, Share2, Heart, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';

const BlogPostsData = [
  {
    id: 1,
    title: "How Education is Breaking the Cycle of Poverty in Rural Schools",
    excerpt: "We visited our recent school activation in the Himalayan foothills to see the real-world impact of our digital literacy program.",
    category: "Education",
    author: "Elena Rodriguez",
    date: "Oct 24, 2025",
    image: "/assets/blog/edu_main.png",
    readTime: "6 min read",
    likes: 124,
    comments: 18
  },
  {
    id: 2,
    title: "Women Entrepreneurs: Transforming Local Markets through Micro-loans",
    excerpt: "Story of how local women in rural Rajasthan started their own textile businesses with just ₹15,000 each and a vision for their community.",
    category: "Empowerment",
    author: "Shanti Devi",
    date: "Oct 20, 2025",
    image: "/assets/blog/emp_main.png",
    readTime: "8 min read",
    likes: 342,
    comments: 29
  },
  {
    id: 3,
    title: "The Green Revolution: Reforestation Drives in the Western Ghats",
    excerpt: "Documenting our journey of planting 50,000 saplings in a month and training locals in sustainable agro-forestry.",
    category: "Environment",
    author: "Dr. Mahesh Kumar",
    date: "Oct 15, 2025",
    image: "/assets/blog/env_main.png",
    readTime: "12 min read",
    likes: 850,
    comments: 54
  },
  {
    id: 4,
    title: "Protection for All: Our New Legal Aid Center in Bihar",
    excerpt: "Behind the scenes of our new shelter opening, providing a haven and legal aid for domestic violence survivors in rural sectors.",
    category: "Protection",
    author: "Saira Khan",
    date: "Oct 12, 2025",
    image: "/assets/blog/pro_main.png",
    readTime: "5 min read",
    likes: 560,
    comments: 42
  },
  {
    id: 5,
    title: "Bridging the Divide: AI and Coding Labs for Village Youth",
    excerpt: "Our tech-for-good initiative is turning rural villages into tech hubs, teaching coding and AI to the next generation of Indian innovators.",
    category: "Tech",
    author: "Dr. Vikram Malhotra",
    date: "Oct 10, 2025",
    image: "/indian_tech_1775031255974.png",
    readTime: "10 min read",
    likes: 920,
    comments: 65
  }
];

const categoryDescriptions = {
  All: "Explore our diverse range of impact stories across all our core pillars.",
  Education: "Primary and digital education for rural Indian children, breaking barriers to success.",
  Empowerment: "Supporting women entrepreneurs and self-help groups to build sustainable livelihoods.",
  Environment: "Committed to reforestation, clean water, and sustainable farming practices in India.",
  Protection: "Emergency response, safe shelters, and legal aid for people facing systemic abuse.",
  Tech: "Leveraging modern technology and digital skills to transform rural communities."
};

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Education", "Empowerment", "Environment", "Protection", "Tech"];

  const filteredPosts = activeCategory === "All" 
    ? BlogPostsData 
    : BlogPostsData.filter(post => post.category === activeCategory);

  const handleShare = async (e, post) => {
    e.stopPropagation();
    e.preventDefault();
    const shareUrl = `${window.location.origin}/blog/${post.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Check out this Indian Impact Story: ${post.title}`,
          url: shareUrl
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] pt-40 pb-24 font-body">
      <SEO 
        title="Impact Stories" 
        description="Voices from the field. Read about our progress, challenges, and the lives we've changed together."
      />

      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-20">
          <h4 className="text-primary-gold font-black uppercase tracking-[0.4em] text-xs mb-4">Voices From The Field</h4>
          <h2 className="text-6xl md:text-8xl font-heading font-black text-white uppercase leading-[0.9] mb-8">
            IMPACT <br />
            <span className="italic text-primary-gold">STORIES</span>
          </h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
            <div className="max-w-2xl">
              <p className="text-primary-offwhite/50 text-xl leading-relaxed mb-4">
                We don't just share news; we share lives. Explore the journeys of those whose worlds have been transformed through your support.
              </p>
              <motion.p 
                key={activeCategory}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-primary-gold text-sm font-bold tracking-widest uppercase italic"
              >
                {categoryDescriptions[activeCategory]}
              </motion.p>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest border transition-all ${
                    activeCategory === cat 
                    ? "bg-primary-gold border-primary-gold text-primary-navy" 
                    : "border-white/10 text-gray-500 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <Link to={`/blog/${filteredPosts[0].id}`} className="block mb-24 group">
            <div className="relative h-[600px] rounded-[4rem] overflow-hidden">
              <img 
                 src={filteredPosts[0].image} 
                 alt={filteredPosts[0].title}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-12 md:p-20 w-full max-w-4xl">
                <span className="px-5 py-2 bg-primary-gold text-primary-navy font-black text-xs rounded-full uppercase italic mb-6 inline-block">
                  FEATURED STORY
                </span>
                <h3 className="text-4xl md:text-6xl font-heading font-black text-white mb-6 uppercase leading-tight group-hover:text-primary-gold transition-colors">
                  {filteredPosts[0].title}
                </h3>
                <div className="flex items-center gap-6 text-primary-offwhite/60 text-sm font-bold uppercase tracking-widest">
                   <div className="flex items-center gap-2"><User size={16} className="text-primary-gold" /> {filteredPosts[0].author}</div>
                   <div className="flex items-center gap-2"><Calendar size={16} className="text-primary-gold" /> {filteredPosts[0].date}</div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
           <AnimatePresence mode="popLayout">
              {filteredPosts.slice(1).map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass p-4 rounded-[3rem] border-white/5 flex flex-col group cursor-pointer hover:border-primary-gold/20 transition-all"
                >
                  <div className="h-64 rounded-[2.5rem] overflow-hidden mb-8 relative">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <button 
                      onClick={(e) => handleShare(e, post)}
                      className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-2xl text-white hover:bg-primary-gold hover:text-primary-navy transition-all z-20"
                    >
                       <Share2 size={16} />
                    </button>
                  </div>
                  <div className="px-6 pb-8 flex-grow">
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary-gold mb-3 block">
                        {post.category}
                     </span>
                     <Link to={`/blog/${post.id}`} className="block">
                        <h4 className="text-2xl font-heading font-black text-white mb-4 line-clamp-2 hover:text-primary-gold transition-colors uppercase leading-tight">
                          {post.title}
                        </h4>
                     </Link>
                     <p className="text-primary-offwhite/40 text-sm font-body line-clamp-3 mb-8 leading-relaxed italic">
                       "{post.excerpt}"
                     </p>
                     
                     <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-1 text-[10px] font-black text-primary-offwhite/30 uppercase">
                              <Heart size={14} className="text-rose-500" /> {post.likes}
                           </div>
                           <div className="flex items-center gap-1 text-[10px] font-black text-primary-offwhite/30 uppercase">
                              <MessageSquare size={14} className="text-primary-gold" /> {post.comments}
                           </div>
                        </div>
                        <Link to={`/blog/${post.id}`} className="text-primary-gold hover:translate-x-2 transition-transform">
                           <ArrowRight size={24} />
                        </Link>
                     </div>
                  </div>
                </motion.div>
              ))}
           </AnimatePresence>
        </div>

        {/* Newsletter Subsection */}
        <div className="mt-40 p-20 glass rounded-[4rem] border-primary-gold/10 relative overflow-hidden text-center">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-gold/10 blur-[100px] rounded-full" />
           <h3 className="text-4xl md:text-5xl font-heading font-black text-white mb-6 uppercase italic">Never Miss A <span className="text-primary-gold">Miracle.</span></h3>
           <p className="text-primary-offwhite/50 text-lg mb-12 max-w-xl mx-auto italic font-body">
             Get monthly updates from our field directors directly to your inbox. No spam, just impact.
           </p>
           <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                className="flex-grow bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-primary-gold text-white font-bold tracking-widest text-sm"
              />
              <button className="px-12 py-5 bg-white text-primary-navy font-black rounded-2xl hover:bg-primary-gold transition-all uppercase tracking-widest text-sm">
                SUBSCRIBE
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
