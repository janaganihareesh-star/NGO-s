import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Mic, MicOff, Loader2, Sparkles, User, AlertCircle, HelpCircle, Heart, Shield, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am Lakshmi, your NGO assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `You are Lakshmi Assistant, a sympathetic and expert AI for "Lakshmi NGO" based in Mumbai. 
    Our 6 core causes are: 
    1. Women Safety & Empowerment 
    2. Girl Child Protection (Beti Bachao) 
    3. Child Shelter & Education (Orphanage) 
    4. LGBTQ+ Awareness & Rights 
    5. Old Age Care (Dignity for Seniors) 
    6. Environmental Protection & Coastal Cleanup.
    
    GUIDELINES:
    - Be professional, empathetic, and expert.
    - If a user asks about volunteering, guide them to the "Get Involved" section.
    - If a user asks about donating, guide them to the "Donate Now" button.
    - If a user reports an issue, complaint, or emergency, acknowledge it and say it will be logged.
    - YOU MUST ANSWER ALL QUESTIONS. If a question is not about the NGO, answer it politely but try to tie it back to our mission if possible.
    - Keep responses relatively concise but helpful.`
  });

  // Intelligent Mock Response Logic (Fallback for "All Questions")
  const getMockResponse = (text) => {
    const t = text.toLowerCase();
    
    // Mission Mapping
    const missionMap = [
      { keys: ['who', 'what', 'ngo', 'lakshmi'], res: "Lakshmi NGO is more than a foundation; we are a protective nexus for Mumbai's most vulnerable. We serve women, children, the elderly, LGBTQ+ individuals, and the environment. Since 2014, we've focused on restoring dignity and building a sustainable future." },
      { keys: ['volunteer', 'join', 'help'], res: "We are always looking for passionate Guardians! To volunteer, head to our 'Get Involved' section on the homepage and complete our 4-step digital vetting process. You can assist in slum education, field work, or admin tasks." },
      { keys: ['donate', 'money', 'sponsor'], res: "Your contribution directly saves lives. You can donate via UPI, card, or direct transfer on our 'Donate Now' portal. 100% of public donations go straight to our field missions. Would you like to sponsor a specific cause today?" },
      { keys: ['women', 'safety', 'harassment'], res: "Women safety is our highest priority. We run 24/7 safe-spaces and empowerment workshops. If you'd like to report a safety concern, just specify 'urgent report' and I'll log it for immediate administrative review." },
      { keys: ['lgbtq', 'gay', 'pride', 'rights'], res: "We are one of the few NGOs in Mumbai dedicated to LGBTQ+ rights and mental health support. We provide a safe-haven and awareness campaigns to fight discrimination." },
      { keys: ['child', 'orphan', 'education'], res: "Our 'Beti Bachao' and 'Slum Education' drives impact over 5,000 children annually. We provide tech-enabled learning materials and safe shelters for vulnerable youth." },
      { keys: ['old', 'elderly', 'senior'], res: "Dignity for seniors is vital. We collaborate with elderly care centers to provide medical aid, community engagement, and psychological support for abandoned seniors." },
      { keys: ['environment', 'beach', 'cleanup', 'green'], res: "Protecting our planet is protecting our future. Our Coastal Cleanup missions in Juhu Beach and Worli have successfully diverted tons of plastic from the Arabian Sea." },
      { keys: ['contact', 'number', 'email', 'address'], res: "Our main mission hub is located in the heart of Mumbai. You can reach us via our 'Contact Us' page, or email support@lakshmingo.org. We reply within 2 hours for urgent inquiries." }
    ];

    // General Catch-All for "All Questions"
    const generalMap = [
      { keys: ['hii', 'hi', 'hello', 'hey', 'greetings', 'namaste'], res: "Hello! I am Lakshmi Assistant. How can I help you support our mission today?" },
      { keys: ['how are you', 'how do you do', 'whats up', "what's up"], res: "I'm functioning perfectly, thank you! Ready to help you with anything related to Lakshmi NGO." },
      { keys: ['thank', 'thanks', 'thx', 'appreciate'], res: "You're very welcome! Let me know if you need any more assistance." },
      { keys: ['bye', 'goodbye', 'see ya', 'quit'], res: "Goodbye! Take care and thank you for connecting with Lakshmi NGO." },
      { keys: ['poverty', 'homeless', 'slum'], res: "Poverty is a systemic challenge we fight every day. We believe education and basic safety are the first steps to breaking the cycle. That's why our Slum Education and Ration drives are so vital." },
      { keys: ['future', 'vision', 'goal'], res: "Our vision is a Mumbai where every life—regardless of age, gender, or background—is cherished and protected. We aim for zero-vulnerability by 2030." },
      { keys: ['technology', 'ai', 'chatbot'], res: "I am Lakshmi Assistant, an AI interface designed to bridge the gap between our missions and you. I help log complaints, guide volunteers, and ensure our field operations remain transparent." }
    ];

    // Find first match
    for (const item of [...missionMap, ...generalMap]) {
      // Use exact word match for short keywords like 'hi', 'hey' to avoid false positives in words like 'this' or 'they'
      if (item.keys.some(k => {
        if (k.length <= 3) {
          const regex = new RegExp(`\\b${k}\\b`, 'i');
          return regex.test(t);
        }
        return t.includes(k);
      })) {
        return item.res;
      }
    }

    // High-Quality Default Catch-All that acknowledges the user's input directly
    if (t.endsWith('?')) {
      return `That's a very thoughtful question! While my primary expertise lies in Lakshmi NGO's programs—like child education, women's safety, and environmental protection—I'm always eager to learn. What else would you like to know about our work?`;
    }

    return `I understand! Thank you for sharing that. As the Lakshmi Assistant, I'm here to ensure you have all the information you need about our volunteer programs, donation drives, and community missions. Feel free to ask me anything specific!`;
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };
      
      recognitionRef.current.onerror = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // 1. Complaint Detection Logic
      const lowerText = text.toLowerCase();
      if (lowerText.includes('report') || lowerText.includes('issue') || lowerText.includes('complaint') || lowerText.includes('urgent')) {
        try {
          await addDoc(collection(db, 'complaints'), {
            transcript: text,
            priority: lowerText.includes('urgent') || lowerText.includes('help') ? 'Urgent' : 'Normal',
            status: 'open',
            source: 'chatbot',
            timestamp: serverTimestamp()
          });
          toast.success("Mission Signal Sent: Complaint Logged", { icon: <AlertCircle className="text-primary-gold" /> });
        } catch { console.warn("Sync failing."); }
      }

      // 2. AI Decision Logic
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE" || apiKey.length < 20) {
         // USE INTELLIGENT MOCK (No key needed, always works)
         setTimeout(() => {
           const res = getMockResponse(text);
           setMessages(prev => [...prev, { role: 'assistant', content: res }]);
           setIsTyping(false);
         }, 1000);
         return;
      }

      // Use Gemini if key exists
      const chat = model.startChat({
        history: messages.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
      });

      const result = await chat.sendMessage(text);
      const responseText = result.response.text();
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (error) {
      console.error("AI Error:", error);
      // Resilience Fallback
      setMessages(prev => [...prev, { role: 'assistant', content: getMockResponse(text) }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickReplies = [
    "Who is Lakshmi NGO?",
    "How to volunteer?",
    "Our 6 core causes",
    "Log an urgent complaint"
  ];

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[150] w-16 h-16 bg-gold-gradient rounded-full shadow-2xl flex items-center justify-center text-primary-navy"
      >
        <div className="relative">
           <MessageSquare size={28} />
           <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0A0A0F]" />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-8 z-[150] w-[400px] max-w-[90vw] h-[600px] glass rounded-[2.5rem] border-primary-gold/20 flex flex-col overflow-hidden shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="p-6 bg-primary-gold/10 border-b border-primary-gold/10 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-gold flex items-center justify-center text-primary-navy font-black shadow-lg shadow-primary-gold/20">L</div>
                <div>
                  <h3 className="text-white font-heading font-black text-sm tracking-widest uppercase">Lakshmi Assistant</h3>
                  <p className="text-emerald-400 text-[10px] uppercase tracking-widest font-black flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" /> Intelligence Optimized
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-primary-offwhite/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-none">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                   <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-body shadow-xl ${
                    msg.role === 'user' 
                      ? 'bg-primary-gold text-[#0A0A0F] font-black rounded-tr-none' 
                      : 'bg-white/10 text-white rounded-tl-none border border-white/20 backdrop-blur-md shadow-black/20'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary-gold rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-primary-gold rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-primary-gold rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-primary-gold/10 bg-black/40 backdrop-blur-xl">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                     className="whitespace-nowrap px-4 py-2 rounded-xl border border-primary-gold/30 text-[9px] text-primary-gold font-black hover:bg-primary-gold hover:text-primary-navy transition-all uppercase tracking-[0.2em]"
                  >
                    {reply}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3 items-center">
                <button
                  onClick={toggleRecording}
                  className={`p-4 rounded-xl transition-all ${isRecording ? 'bg-primary-rose animate-pulse' : 'bg-white/5 text-primary-gold hover:bg-white/10'}`}
                >
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <div className="flex-grow relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                     placeholder="Ask anything about our missions..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 pr-12 text-sm focus:border-primary-gold outline-none text-white font-bold placeholder:text-white/40 transition-all shadow-inner"
                  />
                  <button
                    onClick={() => handleSend()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-gold hover:scale-110 transition-transform"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
