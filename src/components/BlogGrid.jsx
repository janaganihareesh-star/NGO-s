import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogCard = ({ post, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      viewport={{ once: true }}
      className="group flex flex-col glass rounded-[2.5rem] border-primary-gold/10 hover:border-primary-gold/40 transition-all duration-500 overflow-hidden"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-6 left-6">
          <span className="px-4 py-1.5 bg-primary-gold text-primary-navy font-bold text-[10px] uppercase tracking-widest rounded-full shadow-xl">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-4 mb-4 text-[10px] text-primary-offwhite/40 font-bold uppercase tracking-widest font-body">
          <span className="flex items-center gap-1"><Calendar size={12} className="text-primary-gold" /> {post.date}</span>
          <span className="flex items-center gap-1"><User size={12} className="text-primary-gold" /> {post.author}</span>
        </div>

        <h3 className="text-2xl font-heading font-black mb-4 group-hover:text-primary-gold transition-colors leading-tight">
          {post.title}
        </h3>
        
        <p className="text-primary-offwhite/50 font-body text-sm mb-8 leading-relaxed line-clamp-3 italic">
          "{post.excerpt}"
        </p>
        
        <Link
          to={`/blog/${post.id}`}
          className="mt-auto flex items-center gap-2 text-primary-gold text-[10px] uppercase tracking-[0.3em] font-black group-hover:gap-4 transition-all"
        >
          Read Full Article <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

const BlogGrid = () => {
  const posts = [
    {
      id: 1,
      title: "How Education is Breaking the Cycle of Poverty in Rural Schools",
      excerpt: "We visited our recent school activation in the Himalayan foothills to see the real-world impact of our digital literacy program.",
      category: "Education",
      date: "Oct 24, 2025",
      author: "Lakshmi Admin",
      image: "/indian_education_1775031032479.png",
    },
    {
      id: 2,
      title: "Women Entrepreneurs: Transforming Local Markets through Micro-loans",
      excerpt: "Story of how local women in rural Rajasthan started their own textile businesses with just ₹15,000 each and a vision for their community.",
      category: "Empowerment",
      date: "Oct 20, 2025",
      author: "Sarah Jenkins",
      image: "/indian_empowerment_1775031117062.png",
    },
    {
      id: 3,
      title: "The Green Revolution: Reforestation Drives in the Western Ghats",
      excerpt: "Documenting our journey of planting 50,000 saplings in a month and training locals in sustainable agro-forestry.",
      category: "Environment",
      date: "Oct 15, 2025",
      author: "Dr. Marc Chen",
      image: "/indian_environment_1775031152562.png",
    },
  ];

  return (
    <section className="py-24 bg-primary-navy relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-primary-gold font-body uppercase tracking-[0.5em] text-xs font-bold mb-4 block">Our Journal</span>
            <h2 className="text-5xl md:text-6xl font-heading font-black text-white">LATEST <span className="text-gold-gradient italic">INSIGHTS</span></h2>
          </div>
          <Link
            to="/blog"
            className="px-8 py-3 border border-primary-gold/20 text-primary-gold font-bold rounded-full hover:bg-primary-gold/5 transition-all text-sm uppercase tracking-widest"
          >
            Explore All Articles
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <BlogCard key={post.id} post={post} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;
