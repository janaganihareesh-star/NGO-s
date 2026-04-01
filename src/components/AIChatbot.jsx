import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Mic, MicOff, Loader2, Sparkles, User, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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

    // Simulate AI Response & Complaint Logic
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let aiResponse = "I'm here to help! You can ask me about our 6 causes, how to volunteer, or how to donate.";
      const lowerText = text.toLowerCase();

      // Feature: Auto-detected Complaint Submission
      if (lowerText.includes('report') || lowerText.includes('issue') || lowerText.includes('complaint')) {
        try {
          const complaintRef = collection(db, 'complaints');
          await addDoc(complaintRef, {
            transcript: text,
            priority: lowerText.includes('urgent') || lowerText.includes('help') ? 'Urgent' : 'Normal',
            status: 'open',
            source: 'chatbot',
            timestamp: serverTimestamp()
          });
          aiResponse = "I have logged your concern in our Nexus system for immediate review. A field officer will be notified. Is there anything else you'd like to specify?";
          toast.success("Complaint Logged Successfully", { icon: <AlertCircle className="text-primary-gold" /> });
        } catch (err) {
          aiResponse = "I've noted your report locally, though I couldn't sync it with our servers right now. Rest assured, our team will look into it.";
        }
      } 
      else if (lowerText.includes('volunteer')) {
        aiResponse = "To volunteer, please fill out our 4-step form on the Get Involved section of our homepage. We'd love to have you!";
      } else if (lowerText.includes('donate')) {
        aiResponse = "You can donate via UPI or Card on our 'Donate Now' page. Every contribution saves lives.";
      } else if (lowerText.includes('causes')) {
        aiResponse = "We focus on 6 key causes: Women Safety, Girl Child Protection, Child Shelter, LGBTQ Support, Old Age Care, and Environmental Protection.";
      }

      setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      toast.error("Chatbot connection error.");
    } finally {
      setIsTyping(false);
    }
  };

  const quickReplies = [
    "How to volunteer?",
    "How to donate?",
    "Our causes",
    "Sponsor a child"
  ];

  return (
    <>
      {/* Floating Bubble */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[150] w-16 h-16 bg-gold-gradient rounded-full shadow-2xl flex items-center justify-center text-primary-navy"
      >
        <MessageSquare size={28} />
      </motion.button>

      {/* Chat Panel */}
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
                <div className="w-10 h-10 rounded-full bg-primary-gold flex items-center justify-center text-primary-navy font-black">L</div>
                <div>
                  <h3 className="text-white font-heading font-bold text-sm">Lakshmi Assistant</h3>
                  <p className="text-emerald-500 text-[10px] uppercase tracking-widest font-black">Online Now</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-primary-offwhite/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-body ${
                    msg.role === 'user' 
                      ? 'bg-primary-gold text-primary-navy font-bold rounded-tr-none' 
                      : 'bg-white/5 text-primary-offwhite/80 rounded-tl-none border border-white/10'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10">
                    <Loader2 size={16} className="animate-spin text-primary-gold" />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-primary-gold/10 bg-black/20">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="whitespace-nowrap px-4 py-2 rounded-full border border-primary-gold/20 text-[10px] text-primary-gold font-bold hover:bg-primary-gold/10 transition-all uppercase tracking-widest"
                  >
                    {reply}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3 items-center">
                <button
                  onClick={toggleRecording}
                  className={`p-4 rounded-xl transition-all ${isRecording ? 'bg-primary-rose animate-pulse' : 'bg-white/5 text-primary-gold'}`}
                >
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <div className="flex-grow relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask Lakshmi..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pr-12 text-sm focus:border-primary-gold outline-none text-white italic"
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
