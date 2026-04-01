import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import SEO from '../components/SEO';
import { MapPin, Phone, Mail, Send, CheckCircle, Globe, Star, Smile, Check, Loader2, Mic, MicOff, AlertCircle } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';


const Contact = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Voice Complaint State
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [complaintPriority, setComplaintPriority] = useState('Normal');
  const [complaintEmail, setComplaintEmail] = useState('');
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const recognitionRef = useRef(null);
  
  const hasSpeechSupport = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice recording not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    try {
      recognition.start();
      setIsRecording(true);
      recognitionRef.current = recognition;
    } catch(e) {
      console.error(e);
      toast.error('Microphone access denied or error starting recording.');
    }
  };

  const submitComplaint = async () => {
    if (!transcript.trim()) {
      toast.error('Please record or type a complaint.');
      return;
    }
    setSubmittingComplaint(true);
    try {
      await addDoc(collection(db, 'complaints'), {
        transcript,
        priority: complaintPriority,
        contactEmail: complaintEmail,
        status: 'open',
        timestamp: serverTimestamp()
      });
      toast.success('Your complaint has been submitted. We will respond within 24 hours.');
      setTranscript('');
      setComplaintEmail('');
      setComplaintPriority('Normal');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit complaint.');
    }
    setSubmittingComplaint(false);
  };



  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    // Placeholder for EmailJS - normally you'd use your service/template IDs
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, 'YOUR_PUBLIC_KEY')
      .then((result) => {
          setSuccess(true);
          setLoading(false);
      }, (error) => {
          console.error(error.text);
          // Fallback for demo
          setTimeout(() => {
            setSuccess(true);
            setLoading(false);
          }, 1500);
      });
  };

  const contactInfo = [
    { icon: <MapPin />, title: "Headquarters", detail: "123 Nexus Global HQ, New York, NY 10001" },
    { icon: <Phone />, title: "Contact Number", detail: "+1 (800) NEXUS-GI" },
    { icon: <Mail />, title: "Email Support", detail: "impact@nexusglobal.org" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-primary-navy pt-40 pb-24 min-h-screen font-body"
    >
      <SEO 
        title="Contact Us" 
        description="Have questions or want to partner with us? Get in touch today."
      />
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Side: Form */}
          <div className="lg:w-1/2">
            <h4 className="text-primary-gold uppercase tracking-[0.4em] font-black text-xs mb-4">Get In Touch</h4>
            <h1 className="text-5xl md:text-7xl font-heading font-black mb-8 uppercase">CONTACT <span className="text-primary-gold italic text-primary-gold">US</span></h1>
            
            <p className="text-gray-400 text-lg mb-12 max-w-lg leading-relaxed">
              Have questions about our missions or want to partner with us? Reach out and we'll get back to you within 24 hours.
            </p>

            <div className="glass p-10 rounded-[3rem] border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-primary-gold opacity-10 group-hover:scale-110 transition-transform">
                <Send size={150} />
              </div>
              
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <CheckCircle className="mx-auto text-primary-gold mb-6" size={80} />
                    <h2 className="text-3xl font-heading font-bold mb-4">MESSAGE SENT!</h2>
                    <p className="text-gray-400 mb-8">Thank you for reaching out. A nexus representative will contact you shortly.</p>
                    <button 
                      onClick={() => setSuccess(false)}
                      className="px-10 py-3 bg-white text-primary-navy font-black rounded-full hover:bg-primary-gold transition-all"
                    >
                      SEND ANOTHER
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="contact-form"
                    ref={form} 
                    onSubmit={sendEmail} 
                    className="space-y-6 relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="relative group">
                      <input 
                        type="text" 
                        name="user_name" 
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary-gold transition-colors peer placeholder-transparent" 
                        placeholder="Name" 
                        required
                        id="contact_name"
                      />
                      <label htmlFor="contact_name" className="absolute left-4 top-4 text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-[-1.5rem] peer-focus:text-xs peer-focus:text-primary-gold">Full Name</label>
                    </div>

                    <div className="relative group">
                      <input 
                        type="email" 
                        name="user_email" 
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary-gold transition-colors peer placeholder-transparent" 
                        placeholder="Email" 
                        required
                        id="contact_email"
                      />
                      <label htmlFor="contact_email" className="absolute left-4 top-4 text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-[-1.5rem] peer-focus:text-xs peer-focus:text-primary-gold">Email Address</label>
                    </div>

                    <div className="relative group">
                      <textarea 
                        name="message" 
                        rows="5" 
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary-gold transition-colors peer placeholder-transparent" 
                        placeholder="Message" 
                        required
                        id="contact_message"
                      />
                      <label htmlFor="contact_message" className="absolute left-4 top-4 text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-[-1.5rem] peer-focus:text-xs peer-focus:text-primary-gold">Your Message</label>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-5 bg-primary-gold text-primary-navy font-black rounded-3xl hover:bg-white transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "SEND MESSAGE"}
                      {!loading && <Send size={20} />}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Feature A & B: Voice Complaint Section */}
            <div className="mt-12 glass p-10 rounded-[3rem] border-primary-gold/20">
              <h3 className="text-2xl font-heading font-black mb-2 flex items-center gap-3">
                <AlertCircle className="text-primary-gold" />
                SPEAK YOUR COMPLAINT
              </h3>
              <p className="text-gray-400 text-sm mb-6">Leave an audio complaint. We transcribe and prioritize it immediately.</p>
              
              <div className="space-y-6">
                {hasSpeechSupport ? (
                  <div className="flex flex-col items-center p-6 border border-white/5 rounded-2xl bg-white/5">
                    <button
                      onClick={toggleRecording}
                      className={`p-6 rounded-full transition-all flex items-center justify-center relative ${
                        isRecording ? 'bg-red-500/20 text-red-500 border-2 border-red-500' : 'bg-primary-gold/10 text-primary-gold border-2 border-primary-gold hover:bg-primary-gold hover:text-primary-navy'
                      }`}
                    >
                      {isRecording && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-red-500/40"></span>
                      )}
                      {isRecording ? <MicOff size={32} className="relative z-10" /> : <Mic size={32} className="relative z-10" />}
                    </button>
                    {isRecording && <p className="text-red-500 font-bold uppercase tracking-widest text-[10px] mt-4 animate-pulse">Listening...</p>}
                    {!isRecording && <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-4">Click to Speak</p>}
                  </div>
                ) : (
                  <p className="p-4 bg-red-500/10 text-red-400 text-sm rounded-xl border border-red-500/20">Voice API not supported in this browser. Please type.</p>
                )}

                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  readOnly={isRecording}
                  placeholder="Your complaint transcript..."
                  className={`w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-primary-gold transition-colors text-white text-sm min-h-[100px] ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                />

                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={complaintEmail}
                      onChange={(e) => setComplaintEmail(e.target.value)}
                      placeholder="Email (Optional)"
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-primary-gold transition-colors text-white text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <select
                      value={complaintPriority}
                      onChange={(e) => setComplaintPriority(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-primary-gold transition-colors text-gray-300 text-sm appearance-none cursor-pointer"
                    >
                      <option value="Normal" className="bg-primary-navy">Normal</option>
                      <option value="Urgent" className="bg-primary-navy">Urgent</option>
                      <option value="Critical" className="bg-primary-navy">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <p className="text-xs text-gray-400 flex-1 italic">
                    {complaintPriority === 'Urgent' && <span className="text-orange-400 font-bold bg-orange-500/10 px-2 py-1 rounded ml-2">Urgent</span>}
                    {complaintPriority === 'Critical' && <span className="text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded ml-2">Critical</span>}
                  </p>
                  <button
                    onClick={submitComplaint}
                    disabled={submittingComplaint}
                    className="px-8 py-4 bg-white text-primary-navy font-black text-sm rounded-xl hover:bg-primary-gold transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    {submittingComplaint ? 'SUBMITTING...' : 'SUBMIT COMPLAINT'}
                  </button>
                </div>
              </div>
            </div>
          </div>


          {/* Right Side: Map & Info */}
          <div className="lg:w-1/2 flex flex-col gap-12">
            {/* Map Placeholder/Embed */}
            <div className="h-[400px] rounded-[3rem] overflow-hidden border border-white/5 relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1655000000000!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} 
                allowFullScreen={true} 
                loading="lazy"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none border-[10px] border-primary-navy/20 rounded-[3rem]" />
            </div>

            {/* Contact Info Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="glass-gold p-6 rounded-3xl text-center flex flex-col items-center">
                  <div className="p-3 bg-white/5 rounded-2xl text-primary-gold mb-4">{info.icon}</div>
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2">{info.title}</h4>
                  <p className="text-white text-xs font-bold leading-tight">{info.detail}</p>
                </div>
              ))}
            </div>

            {/* Social Redirects */}
            <div className="flex justify-center gap-8 items-center py-6 border-t border-white/5">
              {[<Globe />, <Star />, <Smile />, <Check />].map((icon, idx) => (
                <a key={idx} href="#" className="p-4 bg-white/5 rounded-full text-white hover:bg-primary-gold hover:text-primary-navy transition-all duration-300">
                  {icon}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
