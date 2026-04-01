import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { X, ChevronLeft, ChevronRight, Maximize2, Download, Image as ImageIcon } from 'lucide-react';

const GalleryData = [
  { id: 1, category: "Events", image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800", title: "Global Summit 2024" },
  { id: 2, category: "Projects", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200", title: "Clean Water Liberia" },
  { id: 3, category: "Team", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800", title: "Internal Training" },
  { id: 4, category: "Awards", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800", title: "UN Impact Award" },
  { id: 5, category: "Projects", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200", title: "Education India" },
  { id: 6, category: "Events", image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1200", title: "Local Outreach" },
  { id: 7, category: "Team", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800", title: "Meet The Leaders" },
  { id: 8, category: "Projects", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800", title: "Green Planet Mission" },
  { id: 9, category: "Awards", image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=800", title: "Sustainability Prize" },
];

const Gallery = () => {
  const [filter, setFilter] = useState("All");
  const [selectedImg, setSelectedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = ["All", "Events", "Projects", "Team", "Awards"];

  const filteredImages = filter === "All" 
    ? GalleryData 
    : GalleryData.filter(img => img.category === filter);

  const openLightbox = (img, index) => {
    setSelectedImg(img);
    setCurrentIndex(index);
  };

  const nextImage = () => {
    const nextIdx = (currentIndex + 1) % filteredImages.length;
    setSelectedImg(filteredImages[nextIdx]);
    setCurrentIndex(nextIdx);
  };

  const prevImage = () => {
    const prevIdx = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImg(filteredImages[prevIdx]);
    setCurrentIndex(prevIdx);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-primary-navy pt-32 pb-24 min-h-screen font-body"
    >
      <SEO 
        title="Photo Gallery" 
        description="A visual journey through our global initiatives and community impact."
      />
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h4 className="text-primary-gold uppercase tracking-[0.4em] text-xs font-black mb-4">Capturing Change</h4>
          <h1 className="text-5xl md:text-7xl font-heading font-black mb-8 uppercase">PHOTO <span className="text-primary-gold italic">GALLERY</span></h1>
          
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-2 rounded-full font-bold text-sm tracking-widest transition-all ${
                  filter === cat 
                  ? "bg-primary-gold text-primary-navy" 
                  : "border border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, index) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="relative group cursor-pointer break-inside-avoid rounded-[2rem] overflow-hidden border border-white/5"
                onClick={() => openLightbox(img, index)}
              >
                <img 
                  src={img.image} 
                  alt={img.title}
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-primary-navy/70 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6">
                  <div className="p-4 bg-primary-gold text-primary-navy rounded-full mb-4 scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                    <Maximize2 size={24} />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-2">{img.title}</h3>
                  <span className="text-primary-gold uppercase tracking-widest text-[10px] font-black">{img.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-primary-navy/98 flex items-center justify-center backdrop-blur-xl p-4 md:p-12"
          >
            {/* Controls */}
            <button 
              onClick={() => setSelectedImg(null)}
              className="absolute top-8 right-8 z-[501] p-4 bg-white/5 rounded-full text-white hover:bg-red-500 transition-colors"
            >
              <X size={28} />
            </button>

            <button 
              onClick={prevImage}
              className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 p-4 bg-white/5 rounded-full text-white hover:bg-primary-gold hover:text-primary-navy transition-colors z-[501]"
            >
              <ChevronLeft size={32} />
            </button>

            <button 
              onClick={nextImage}
              className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 p-4 bg-white/5 rounded-full text-white hover:bg-primary-gold hover:text-primary-navy transition-colors z-[501]"
            >
              <ChevronRight size={32} />
            </button>

            {/* Content */}
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <motion.img
                key={selectedImg.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={selectedImg.image}
                className="max-w-full max-h-[75vh] object-contain rounded-3xl shadow-2xl"
              />
              <div className="mt-8 text-center">
                <h2 className="text-3xl font-heading font-bold text-white mb-2">{selectedImg.title}</h2>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-primary-gold uppercase tracking-[0.3em] font-black text-xs">{selectedImg.category}</span>
                  <div className="w-[1px] h-4 bg-white/20" />
                  <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase">
                    <Download size={14} /> Download HD
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Gallery;
