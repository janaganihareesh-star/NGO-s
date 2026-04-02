import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ChevronLeft, Share2, Heart, MessageSquare, Send, Trash2 } from 'lucide-react';
import SEO from '../components/SEO';
import ImpactCTA from '../components/ImpactCTA';
import { toast } from 'react-toastify';

const BlogPostsData = [
  {
    id: 1,
    title: "How Education is Breaking the Cycle of Poverty in Rural Schools",
    content: `
      <p className="text-xl leading-relaxed text-primary-offwhite/80 mb-8 italic">
        We visited our recent school activation in the Himalayan foothills to see the real-world impact of our digital literacy program.
      </p>
      <p className="mb-6 leading-relaxed">
        The air in the village of Upper Kali was crisp and cold, but the excitement in the small repurposed community center was palpable. 
        For the first time, 50 children from the surrounding valleys were sitting in front of high-performance laptops, connected to the global internet.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 my-16">
        <img src="/assets/blog/edu_v1.png" className="w-full h-80 object-cover rounded-[3rem] shadow-2xl" alt="Students learning" />
        <img src="/assets/blog/edu_v2.png" className="w-full h-80 object-cover rounded-[3rem] shadow-2xl" alt="Classroom environment" />
      </div>

      <h3 className="text-3xl font-heading font-black mt-12 mb-6 uppercase">The Digital Divide</h3>
      <p className="mb-6 leading-relaxed">
        For years, education in these remote areas was limited to traditional textbooks that were often outdated by a decade. 
        Through our <strong>Future Leaders Program</strong>, we've introduced interactive coding curricula and satellite-based internet access.
      </p>
      <div className="bg-primary-gold/5 p-8 border-l-4 border-primary-gold rounded-r-3xl my-12 italic text-lg text-primary-gold">
        "I want to build an app that tells my father when it's going to rain too much for the crops," says 12-year-old Arjun, his eyes glued to the screen. 
        He represents a generation that will no longer be limited by their geography.
      </div>
      
      <img src="/assets/blog/edu_main.png" className="w-full h-96 object-cover rounded-[3rem] my-16 shadow-2xl" alt="Tech education" />

      <p className="mb-6 leading-relaxed">
        Our impact isn't just about the hardware. We've trained four local teachers to become mentors, ensuring the sustainability of the project. 
        The results are already showing—enrollment in the local school has increased by 40% since the program's inception.
      </p>
    `,
    category: "Education",
    author: "Elena Rodriguez",
    date: "Oct 24, 2025",
    image: "/assets/blog/edu_main.png",
    authorImage: "/assets/authors/elena.png",
    readTime: "6 min read",
    likes: 124,
    comments: [],
    authorTitle: "Field Director",
    authorBio: "Elena has spent the last 15 years developing sustainable education models across Rural India. She leads our on-the-ground efforts in the Himalayan region."
  },
  {
    id: 2,
    title: "Women Entrepreneurs: Transforming Local Markets through Micro-loans",
    content: `
      <p className="text-xl leading-relaxed text-primary-offwhite/80 mb-8 italic">
        Story of how local women in rural Rajasthan started their own textile businesses with just ₹15,000 each and a vision for their community.
      </p>
      <p className="mb-6 leading-relaxed">
        When Lakshmi NGO zeroed in on the artisans of Rajasthan, we didn't just see a heritage art form; we saw a scalable economic engine. By distributing targeted micro-loans, we allowed dozens of women to purchase their own weaving looms rather than constantly renting them at exorbitant rates.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 my-16">
        <img src="/assets/blog/emp_v1.png" className="w-full h-80 object-cover rounded-[3rem] shadow-2xl" alt="Woman artisan" />
        <img src="/assets/blog/emp_v2.png" className="w-full h-80 object-cover rounded-[3rem] shadow-2xl" alt="Women collaborating" />
      </div>

      <h3 className="text-3xl font-heading font-black mt-12 mb-6 uppercase">The Ripple Effect</h3>
      <p className="mb-6 leading-relaxed">
        A single ₹15,000 micro-loan to a matriarch often means three children can now attend secondary school. These artisans are not just paying back their loans at a 99% success rate; they are hiring neighboring women and creating hyper-local consortiums. 
      </p>
      <div className="bg-primary-gold/5 p-8 border-l-4 border-primary-gold rounded-r-3xl my-12 italic text-lg text-primary-gold">
        "I used to work 12 hours a day and still have nothing to eat. Today, I employ three women from my village, and we ship our fabrics directly to boutique stores in Mumbai." — Sunita Devi
      </div>
      
      <img src="/assets/blog/emp_main.png" className="w-full h-96 object-cover rounded-[3rem] my-16 shadow-2xl" alt="Market selling" />

      <p className="mb-6 leading-relaxed">
        This is what true empowerment looks like. It isn't charity; it is equitable investment in human capital. We plan to expand our micro-financing initiative to 50 more villages by early next year.
      </p>
    `,
    category: "Empowerment",
    author: "Shanti Devi",
    date: "Oct 20, 2025",
    image: "/assets/blog/emp_main.png",
    authorImage: "/assets/authors/shanti.png",
    readTime: "8 min read",
    likes: 342,
    comments: [],
    authorTitle: "Micro-finance Lead",
    authorBio: "Shanti specializes in rural economy revitalization and has successfully deployed over ₹20M in micro-loans to women-led cooperatives in Rajasthan."
  },
  {
    id: 3,
    title: "The Green Revolution: Reforestation Drives in the Western Ghats",
    content: `
      <p className="text-xl leading-relaxed text-primary-offwhite/80 mb-8 italic">
        Documenting our journey of planting 50,000 saplings in a month and training locals in sustainable agro-forestry.
      </p>
      <p className="mb-6 leading-relaxed">
        The Western Ghats is one of the world's eight "hottest hotspots" of biological diversity, but logging and agricultural expansion have severely crippled its ecosystem. Last month, our volunteers joined hands with local tribal communities to launch a massive reforestation drive.
      </p>
      
      <div className="grid grid-cols-2 gap-8 my-16">
        <img src="/assets/blog/env_v1.png" className="w-full h-72 object-cover rounded-[3rem] shadow-2xl" alt="Planting a sapling" />
        <img src="/assets/blog/env_v2.png" className="w-full h-72 object-cover rounded-[3rem] shadow-2xl" alt="Deep forest" />
      </div>

      <h3 className="text-3xl font-heading font-black mt-12 mb-6 uppercase">Beyond Just Planting</h3>
      <p className="mb-6 leading-relaxed">
        Planting a tree is easy; ensuring it survives to adulthood is the real challenge. We've introduced state-of-the-art agro-forestry training for the locals, turning them into wardens of the forest. They learn how to harvest non-timber forest products symbiotically.
      </p>

      <img src="/assets/blog/env_main.png" className="w-full h-96 object-cover rounded-[3rem] my-16 shadow-2xl" alt="Mountain ranges" />

      <p className="mb-6 leading-relaxed">
        We have officially planted our 50,000th sapling. With the monsoon fast approaching, the survival rate of these native trees (Jackfruit, Mahogany, Teak) is estimated to be over 85%. The Ghats are breathing again.
      </p>
    `,
    category: "Environment",
    author: "Dr. Mahesh Kumar",
    date: "Oct 15, 2025",
    image: "/assets/blog/env_main.png",
    authorImage: "/assets/authors/mahesh.png",
    readTime: "12 min read",
    likes: 850,
    comments: [],
    authorTitle: "Chief Ecologist",
    authorBio: "Dr. Mahesh Kumar holds a PhD in Environmental Science from IIT Bombay and leads Lakshmi NGO's reforestation efforts in the Western Ghats."
  },
  {
    id: 4,
    title: "Protection for All: Our New Legal Aid Center in Bihar",
    content: `
      <p className="text-xl leading-relaxed text-primary-offwhite/80 mb-8 italic">
        Behind the scenes of our new shelter opening, providing a sanctuary and legal aid for domestic violence survivors.
      </p>
      <p className="mb-6 leading-relaxed">
        In many rural sectors, escaping systemic abuse is nearly impossible without financial independence or legal knowledge. Yesterday, Lakshmi NGO officially cut the ribbon on our largest Safe Harbor shelter in Bihar—a 10,000 sq.ft facility dedicated solely to women's protection.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 my-16">
        <img src="/assets/blog/pro_main.png" className="w-full h-80 object-cover rounded-[3rem] shadow-2xl" alt="Supporting village family" />
        <img src="/assets/blog/pro_v1.png" className="w-full h-80 object-cover rounded-[3rem] shadow-2xl" alt="Legal aid desk" />
      </div>

      <h3 className="text-3xl font-heading font-black mt-12 mb-6 uppercase">A Multi-Tiered Approach</h3>
      <p className="mb-6 leading-relaxed">
        The facility isn't just a shelter. The ground floor houses a 24/7 pro-bono legal clinic where three full-time volunteer human rights lawyers handle restraining orders, divorce filings, and custody battles on behalf of the survivors.
      </p>

      <div className="bg-primary-gold/5 p-8 border-l-4 border-primary-gold rounded-r-3xl my-12 italic text-lg text-primary-gold">
        "Justice shouldn't be a luxury reserved for those who can afford an attorney. Our clinic actively defends those who have been silenced."
      </div>
      
      <img src="/assets/blog/pro_v2.png" className="w-full h-96 object-cover rounded-[3rem] my-16 shadow-2xl" alt="Safe shelter exterior" />

      <p className="mb-6 leading-relaxed">
        With the new legal wing operational, we anticipate assisting over 500 women this year in navigating the legal system towards a life of safety and autonomy.
      </p>
    `,
    category: "Protection",
    author: "Saira Khan",
    date: "Oct 12, 2025",
    image: "/assets/blog/pro_main.png",
    authorImage: "/assets/authors/saira.png",
    readTime: "5 min read",
    likes: 560,
    comments: [],
    authorTitle: "Social Impact Lead",
    authorBio: "Saira is a survivor-advocate who ensures all Lakshmi NGO shelters meet international humanitarian standards while honoring local cultural sensitivities."
  },
  {
    id: 5,
    title: "Bridging the Divide: AI and Coding Labs for Village Youth",
    content: `
      <p className="text-xl leading-relaxed text-primary-offwhite/80 mb-8 italic">
        Our tech-for-good initiative is turning rural villages into tech hubs, teaching coding and AI to the next generation of Indian innovators.
      </p>
      <p className="mb-6 leading-relaxed">
        The future is being written in code, and we refuse to let rural youth be left out of the narrative. Our pilot "Code The Future" program has successfully installed 20 computer labs across underfunded districts in Maharashtra.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 my-16">
        <img src="/indian_tech_1775031255974.png" className="w-full h-80 object-cover rounded-[3rem] shadow-2xl" alt="Coding class" />
        <img src="/assets/blog/edu_v2.png" className="w-full h-80 object-cover rounded-[3rem] shadow-2xl" alt="Tech workshop" />
      </div>

      <h3 className="text-3xl font-heading font-black mt-12 mb-6 uppercase">From Consumers to Creators</h3>
      <p className="mb-6 leading-relaxed">
        We aren't just teaching basic typing skills. Partnering with open-source communities, we've developed a localized curriculum that takes a 14-year-old from zero knowledge to building rudimentary machine learning models and Python web apps.
      </p>
      <div className="bg-primary-gold/5 p-8 border-l-4 border-primary-gold rounded-r-3xl my-12 italic text-lg text-primary-gold">
        "I built a script that tracks the local bus schedules because they are always late. Now my whole village uses it on their phones." — Rahul, 15
      </div>
      
      <img src="/indian_tech_1775031255974.png" className="w-full h-96 object-cover rounded-[3rem] my-16 shadow-2xl" alt="Modern computer lab" />

      <p className="mb-6 leading-relaxed">
        By providing these tools, we are unlocking vast human potential. Several of our first cohort students have already secured remote internships with tech firms in Bangalore. The divide is officially closing.
      </p>
    `,
    category: "Tech",
    author: "Dr. Vikram Malhotra",
    date: "Oct 10, 2025",
    image: "/indian_tech_1775031255974.png",
    authorImage: "/assets/authors/vikram.png",
    readTime: "10 min read",
    likes: 920,
    comments: [],
    authorTitle: "Head of Tech Innovation",
    authorBio: "Dr. Vikram is a pioneer in rural ed-tech, dedicated to democratizing AI and coding access for the next generation of Indian village youth."
  }
];

const BlogPost = () => {
  const { id } = useParams();
  const basePost = BlogPostsData.find(p => p.id === parseInt(id)) || BlogPostsData[0];
  
  // Interactive State
  const [likesCount, setLikesCount] = useState(basePost.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, user: "Community Member", text: "This is so inspiring! We need more projects like this.", date: "2 days ago" },
    { id: 2, user: "Volunt_India", text: "I witnessed this firsthand in Bihar. The transformation is real.", date: "1 day ago" }
  ]);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikesCount(prev => prev + 1);
      setIsLiked(true);
      toast.info("Thanks for the support!");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: basePost.title,
          text: `Check out this impact story from Lakshmi NGO: ${basePost.title}`,
          url: window.location.href
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      user: "You",
      text: newComment,
      date: "Just now"
    };
    
    setComments([comment, ...comments]);
    setNewComment("");
    toast.success("Comment posted!");
  };

  const handleDeleteComment = (id) => {
    setComments(comments.filter(c => c.id !== id));
    toast.dark("Comment removed.");
  };

  return (
    <div className="min-h-screen pt-32 pb-24 font-body">
      <SEO 
        title={basePost.title} 
        description={basePost.category + " Impact Story"}
      />

      <div className="container mx-auto px-6 max-w-4xl">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-primary-gold font-black uppercase text-xs tracking-widest mb-12 hover:-translate-x-2 transition-transform"
        >
          <ChevronLeft size={16} /> BACK TO STORIES
        </Link>

        <div className="mb-16">
          <span className="px-5 py-2 glass-gold text-primary-gold font-black text-xs rounded-full uppercase italic mb-6 inline-block tracking-widest border border-primary-gold/20">
            {basePost.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-black mb-10 leading-tight uppercase relative z-10">
            {basePost.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-8 py-8 border-y border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-primary-offwhite/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center overflow-hidden">
                 <img src={basePost.authorImage} alt={basePost.author} className="w-full h-full object-cover" />
              </div>
              <span>By {basePost.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary-gold" />
              <span>{basePost.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-primary-gold" />
              <span>{basePost.readTime}</span>
            </div>
          </div>
        </div>

        <div className="relative h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
          <img src={basePost.image} alt={basePost.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] pointer-events-none" />
        </div>

        <div className="custom-prose max-w-none text-gray-700 dark:text-primary-offwhite/60 text-lg leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: basePost.content }} />
        </div>

        {/* Interactions Row */}
        <div className="mt-20 pt-10 border-t border-gray-200 dark:border-white/5 flex flex-wrap justify-between items-center gap-8">
           <div className="flex items-center gap-6">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-3 px-8 py-3 border font-black rounded-2xl transition-all uppercase text-xs tracking-widest ${
                  isLiked 
                  ? 'bg-rose-500 text-white border-rose-500' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white'
                }`}
              >
                 <Heart size={18} className={isLiked ? 'fill-current' : ''} /> {likesCount} LIKES
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center gap-3 px-8 py-3 bg-primary-gold/10 border border-primary-gold/20 text-primary-gold font-black rounded-2xl hover:bg-primary-gold transition-all hover:text-primary-navy uppercase text-xs tracking-widest"
              >
                 <Share2 size={18} /> SHARE STORY
              </button>
           </div>
           
           <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-gray-900 dark:text-white">
              <MessageSquare size={18} className="text-primary-gold" /> {comments.length} COMMENTS
           </div>
        </div>

        {/* Comment Section */}
        <div className="mt-16 space-y-12">
            <h3 className="text-2xl font-heading font-black dark:text-white uppercase tracking-wider">Leave a <span className="text-primary-gold">Comment</span></h3>
            
            <form onSubmit={handleAddComment} className="relative group">
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on this mission..."
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-sm focus:outline-none focus:border-primary-gold/50 transition-all min-h-[150px] font-body text-white"
                />
                <button 
                  type="submit"
                  className="absolute bottom-6 right-6 p-4 bg-primary-gold text-primary-navy rounded-2xl hover:scale-110 transition-all shadow-lg active:scale-95"
                >
                    <Send size={20} />
                </button>
            </form>

            <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 font-bold uppercase text-[10px] tracking-widest">No comments yet. Be the first!</div>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="p-8 glass rounded-[2.5rem] border border-white/5 group hover:border-primary-gold/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary-gold/10 border border-primary-gold/20 flex items-center justify-center text-primary-gold font-black text-xs">
                                    {comment.user.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-gold">{comment.user}</h4>
                                    <p className="text-[8px] font-bold text-gray-500 uppercase">{comment.date}</p>
                                </div>
                            </div>
                            {comment.user === "You" && (
                              <button 
                                onClick={() => handleDeleteComment(comment.id)}
                                className="p-2 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                        </div>
                        <p className="text-primary-offwhite/70 text-sm leading-relaxed italic">"{comment.text}"</p>
                    </div>
                  ))
                )}
            </div>
        </div>

        <ImpactCTA title="Support this Impact Story" />

        {/* Author Footer */}
        <div className="mt-32 p-12 glass rounded-[3rem] border border-gray-200 dark:border-white/5 flex flex-col md:flex-row gap-10 items-center text-center md:text-left shadow-xl">
           <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary-gold ring-8 ring-black/5 dark:ring-white/5 shadow-2xl flex-shrink-0">
              <img src={basePost.authorImage} className="w-full h-full object-cover" />
           </div>
           <div>
              <p className="text-primary-gold font-black uppercase text-xs tracking-widest mb-2">{basePost.authorTitle}</p>
              <h4 className="text-2xl font-heading font-black mb-4 uppercase text-gray-900 dark:text-white">{basePost.author}</h4>
              <p className="text-gray-600 dark:text-primary-offwhite/50 font-body leading-relaxed max-w-lg mb-6">
                 {basePost.authorBio}
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                 <span className="text-[10px] font-black uppercase border border-gray-300 dark:border-white/10 px-4 py-2 rounded-full text-gray-700 dark:text-white hover:border-primary-gold cursor-pointer transition-colors">Twitter</span>
                 <span className="text-[10px] font-black uppercase border border-gray-300 dark:border-white/10 px-4 py-2 rounded-full text-gray-700 dark:text-white hover:border-primary-gold cursor-pointer transition-colors">LinkedIn</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
