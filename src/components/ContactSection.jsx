import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Voice Recognition setup
  const recognitionRef = useRef(null);
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setFormData(prev => ({ ...prev, message: prev.message + " " + transcript }));
        setIsRecording(false);
        toast.info("Voice transcribed successfully!");
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error(event.error);
        setIsRecording(false);
        toast.error("Speech recognition error. Please type your message.");
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        toast.warning("Browser does not support speech recognition.");
        return;
      }
      recognitionRef.current.start();
      setIsRecording(true);
      toast.info("Listening...");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form Submit:', formData);
      toast.success("Thank you for reaching out! We'll contact you soon.");
      setFormData({ name: '', email: '', message: '' });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <MapPin size={20} />, label: "Address", value: "Lakshmi Heights, 8th Floor, BKC, Mumbai - 400051", color: "text-primary-gold" },
    { icon: <Phone size={20} />, label: "Phone", value: "+91 22 2650 4000", color: "text-primary-rose" },
    { icon: <Mail size={20} />, label: "Email", value: "support@lakshmingo.org", color: "text-primary-teal" }
  ];

  return (
    <section className="py-24 bg-primary-navy relative overflow-hidden" id="contact">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass p-10 md:p-16 rounded-[3rem] border-primary-gold/10"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-4 uppercase tracking-tighter">
              REACH <span className="text-primary-gold italic underline">OUT</span>
            </h2>
            <p className="text-primary-offwhite/50 font-body text-sm mb-12 italic">
              Whether you have a query or a complaint, our team is here to listen.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative group">
                  <label className="block text-[10px] uppercase tracking-widest text-primary-gold mb-3 font-bold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:border-primary-gold outline-none transition-all"
                    placeholder="Lakshmi Devi"
                  />
                </div>
                <div className="relative group">
                  <label className="block text-[10px] uppercase tracking-widest text-primary-gold mb-3 font-bold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:border-primary-gold outline-none transition-all"
                    placeholder="contact@email.com"
                  />
                </div>
              </div>
              
              <div className="relative group">
                <label className="flex justify-between items-center text-[10px] uppercase tracking-widest text-primary-gold mb-3 font-bold">
                  <span>Your Message / Complaint</span>
                  <span className="text-primary-offwhite/30 lowercase text-[9px] font-normal italic">Speak or type</span>
                </label>
                <div className="relative">
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pr-16 focus:border-primary-gold outline-none transition-all italic"
                    placeholder="Describe your situation..."
                  />
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`absolute bottom-6 right-6 p-4 rounded-[1.5rem] transition-all transform hover:scale-110 ${
                      isRecording ? 'bg-primary-rose animate-pulse' : 'glass-gold'
                    }`}
                  >
                    {isRecording ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-primary-gold" />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-gold-gradient text-primary-navy font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 text-sm tracking-widest uppercase font-bold"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> SEND MESSAGE</>}
              </button>
            </form>
          </motion.div>

          {/* Right: Info & Map */}
          <div className="space-y-12 h-full flex flex-col">
            <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-6">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass p-8 rounded-[2rem] border-primary-gold/10 hover:border-primary-gold/30 transition-all flex items-center gap-6"
                >
                  <div className={`p-5 rounded-2xl bg-white/5 ${info.color}`}>
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="text-primary-gold font-body uppercase tracking-[0.2em] text-[10px] mb-1 font-bold">{info.label}</h4>
                    <p className="text-primary-offwhite/60 font-body text-sm leading-relaxed">{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="flex-grow glass rounded-[3rem] border-primary-gold/10 overflow-hidden relative min-h-[300px]"
            >
              <iframe
                title="NGO Location"
                className="w-full h-full grayscale opacity-50 relative z-10 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15082.93240097746!2d72.846879!3d19.076090!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e123f8d271%3A0x1ba230ef75bb53f9!2sBandra%20Kurla%20Complex!5e0!3m2!1sen!2sin!4v1625478440000!500"
                frameBorder="0"
                allowFullScreen=""
              ></iframe>
              <div className="absolute inset-0 pointer-events-none border-[12px] border-primary-navy/80 z-20" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
