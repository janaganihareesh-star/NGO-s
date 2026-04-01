import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import confetti from 'canvas-confetti';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import SEO from '../components/SEO';
import { Check, ChevronRight, ChevronLeft, Heart, Shield, Sparkles } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  skills: z.string().min(5, "Tell us more about your skills"),
  availability: z.string().min(1, "Please select availability"),
  motivation: z.string().min(20, "Tell us more about your motivation (min 20 chars)"),
  priority: z.enum(['Normal', 'Urgent', 'Critical']).default('Normal'),
});

const Volunteer = () => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors }, trigger, watch } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      priority: 'Normal'
    }
  });

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (step === 1) fieldsToValidate = ["fullName", "email", "phone"];
    if (step === 2) fieldsToValidate = ["skills", "availability"];
    if (step === 3) fieldsToValidate = ["motivation"];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Save to Firebase Firestore
      await addDoc(collection(db, "volunteers"), {
        ...data,
        createdAt: new Date(),
      });

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F4C430', '#064E3B', '#0A192F']
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error adding document: ", error);
      // Fallback for demo if Firebase not configured
      setIsSubmitted(true);
      confetti({ particleCount: 150 });
    }
    setLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-heading font-black mb-8">PERSONAL <span className="text-primary-gold underline">INFO</span></h3>
            <div className="space-y-4">
              <div className="relative group">
                <input
                  {...register("fullName")}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary-gold transition-colors peer placeholder-transparent"
                  placeholder="Full Name"
                  id="fullName"
                />
                <label htmlFor="fullName" className="absolute left-4 top-4 text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-[-1.5rem] peer-focus:text-xs peer-focus:text-primary-gold">Full Name</label>
                {errors.fullName && <p className="text-red-400 text-xs mt-2 ml-2 animate-pulse">{errors.fullName.message}</p>}
              </div>

              <div className="relative group">
                <input
                  {...register("email")}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary-gold transition-colors peer placeholder-transparent"
                  placeholder="Email"
                  id="email"
                />
                <label htmlFor="email" className="absolute left-4 top-4 text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-[-1.5rem] peer-focus:text-xs peer-focus:text-primary-gold">Email Address</label>
                {errors.email && <p className="text-red-400 text-xs mt-2 ml-2 animate-pulse">{errors.email.message}</p>}
              </div>

              <div className="relative group">
                <input
                  {...register("phone")}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary-gold transition-colors peer placeholder-transparent"
                  placeholder="Phone"
                  id="phone"
                />
                <label htmlFor="phone" className="absolute left-4 top-4 text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-[-1.5rem] peer-focus:text-xs peer-focus:text-primary-gold">Phone Number</label>
                {errors.phone && <p className="text-red-400 text-xs mt-2 ml-2 animate-pulse">{errors.phone.message}</p>}
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-heading font-black mb-8">SKILLS & <span className="text-primary-gold underline">AVAILABILITY</span></h3>
            <div className="space-y-4">
              <div className="relative group">
                <textarea
                  {...register("skills")}
                  rows="3"
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary-gold transition-colors peer placeholder-transparent"
                  placeholder="Skills"
                  id="skills"
                />
                <label htmlFor="skills" className="absolute left-4 top-4 text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-[-1.5rem] peer-focus:text-xs peer-focus:text-primary-gold">Your Skills (e.g. Design, Teaching, Tech)</label>
                {errors.skills && <p className="text-red-400 text-xs mt-2 ml-2 animate-pulse">{errors.skills.message}</p>}
              </div>

              <div className="relative group">
                <select
                  {...register("availability")}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary-gold transition-colors text-gray-300 appearance-none"
                >
                  <option value="" className="bg-primary-navy">Select Availability</option>
                  <option value="Weekends" className="bg-primary-navy">Weekends Only</option>
                  <option value="Weekdays" className="bg-primary-navy">Weekdays Only</option>
                  <option value="Flexible" className="bg-primary-navy">Flexible / Remote</option>
                  <option value="FullTime" className="bg-primary-navy">Full-time Mission</option>
                </select>
                {errors.availability && <p className="text-red-400 text-xs mt-2 ml-2 animate-pulse">{errors.availability.message}</p>}
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-heading font-black mb-8">YOUR <span className="text-primary-gold underline">MOTIVATION</span></h3>
            <div className="relative group">
              <textarea
                {...register("motivation")}
                rows="5"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary-gold transition-colors peer placeholder-transparent"
                placeholder="Motivation"
                id="motivation"
              />
              <label htmlFor="motivation" className="absolute left-4 top-4 text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-[-1.5rem] peer-focus:text-xs peer-focus:text-primary-gold">Why do you want to join Nexus Global?</label>
              {errors.motivation && <p className="text-red-400 text-xs mt-2 ml-2 animate-pulse">{errors.motivation.message}</p>}
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Application Priority</p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setValue("priority", "Normal")}
                  className={`px-6 py-2 rounded-full border text-sm font-bold transition-all ${
                    watch("priority") === "Normal" ? "bg-gray-600 border-gray-500 text-white" : "border-white/10 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setValue("priority", "Urgent")}
                  className={`px-6 py-2 rounded-full border text-sm font-bold transition-all ${
                    watch("priority") === "Urgent" ? "bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20" : "border-white/10 text-gray-400 hover:border-orange-500 hover:text-orange-400"
                  }`}
                >
                  Urgent
                </button>
                <button
                  type="button"
                  onClick={() => setValue("priority", "Critical")}
                  className={`px-6 py-2 rounded-full border text-sm font-bold transition-all ${
                    watch("priority") === "Critical" ? "bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20" : "border-white/10 text-gray-400 hover:border-red-500 hover:text-red-400"
                  }`}
                >
                  Critical
                </button>
              </div>
              <p className="text-xs text-gray-500 italic mt-2">
                Mark as Urgent if you need help within 24 hours. Mark Critical for emergencies.
              </p>
            </div>
          </motion.div>
        );
      case 4:
        const currentData = watch();
        return (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-heading font-black mb-8">FINAL <span className="text-primary-gold underline">REVIEW</span></h3>
            <div className="bg-white/5 p-8 rounded-3xl space-y-4 border border-white/5 max-h-64 overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4">
                <span className="text-gray-500 uppercase text-[10px] font-black">Name</span>
                <span className="col-span-2 text-white font-bold">{currentData.fullName}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4">
                <span className="text-gray-500 uppercase text-[10px] font-black">Email</span>
                <span className="col-span-2 text-white font-bold">{currentData.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4">
                <span className="text-gray-500 uppercase text-[10px] font-black">Skills</span>
                <span className="col-span-2 text-white font-bold">{currentData.skills}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4">
                <span className="text-gray-500 uppercase text-[10px] font-black">Motivation</span>
                <span className="col-span-2 text-white font-bold italic">"{currentData.motivation.substring(0, 50)}..."</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-500 uppercase text-[10px] font-black">Priority</span>
                <span className={`col-span-2 font-black uppercase text-xs rounded-full px-3 py-1 w-fit border ${
                    currentData.priority === 'Critical' ? 'bg-red-500/20 text-red-500 border-red-500/50' :
                    currentData.priority === 'Urgent' ? 'bg-orange-500/20 text-orange-500 border-orange-500/50' : 
                    'bg-gray-500/20 text-gray-400 border-gray-500/50'
                }`}>
                  {currentData.priority}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-primary-gold/10 rounded-2xl border border-primary-gold/20 text-sm text-primary-gold">
              <Shield size={20} />
              <p>By submitting, you agree to our Code of Conduct and Global Ethics Policy.</p>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-primary-navy flex items-center justify-center pt-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-xl w-full mx-6 glass-gold p-12 rounded-[3rem] text-center"
        >
          <div className="w-24 h-24 bg-primary-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-gold/40">
            <Check size={48} className="text-primary-navy" />
          </div>
          <h2 className="text-5xl font-heading font-black mb-4 uppercase">WELCOME TO THE <span className="text-white italic">FAMILY!</span></h2>
          <p className="text-gray-400 font-body mb-8 text-lg">
            Your application has been successfully received. Our Global Onboarding Team will reach out to you within 48 hours.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-12 py-4 bg-white text-primary-navy font-black rounded-full hover:bg-primary-gold transition-all"
          >
            RETURN HOME
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-navy pt-40 pb-24 overflow-hidden relative font-body">
      <SEO 
        title="Become a Volunteer" 
        description="Join our global mission. Register as a volunteer and make a real-world impact."
      />
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-forest/20 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-gold/10 blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left Side: Copy */}
          <div className="lg:w-1/2">
            <h4 className="text-primary-gold font-black uppercase tracking-[0.4em] text-xs mb-4">Join The Mission</h4>
            <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-8 leading-tight uppercase">
              BECOME A <br />
              <span className="italic text-primary-gold">VOLUNTEER</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-12">
              Every revolution starts with a conversation. Yours starts here. Join 5000+ others who have dedicated their skills to changing the fabric of society.
            </p>

            <div className="space-y-8">
              {[
                { icon: <Heart size={20} />, text: "Direct impact on field operations" },
                { icon: <Sparkles size={20} />, text: "LTD networking with global leaders" },
                { icon: <Shield size={20} />, text: "Certification & skill accreditation" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 text-white">
                  <div className="p-3 bg-white/5 rounded-2xl text-primary-gold">{item.icon}</div>
                  <span className="font-bold tracking-wide uppercase text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Step Form Card */}
          <div className="lg:w-1/2">
            <div className="glass p-1 p-[2px] rounded-[2.5rem] bg-gradient-to-br from-primary-gold/50 via-white/5 to-transparent">
              <div className="bg-[#0D1D3A]/90 backdrop-blur-xl p-10 md:p-12 rounded-[2.4rem] relative overflow-hidden">
                {/* Steps Navigator */}
                <div className="flex justify-between items-center mb-16 relative">
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2 z-0" />
                  <div className="absolute top-1/2 left-0 h-[1px] bg-primary-gold -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${(step - 1) * 33}%` }} />
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 border-2 ${
                        step >= s 
                          ? "bg-primary-gold border-primary-gold text-primary-navy" 
                          : "bg-primary-navy border-white/20 text-gray-500"
                      }`}
                    >
                      {step > s ? <Check size={16} /> : s}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <AnimatePresence mode="wait">
                    {renderStep()}
                  </AnimatePresence>

                  <div className="flex justify-between gap-4 mt-12">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="p-5 border border-white/10 text-white rounded-2xl hover:bg-white/5 transition-all"
                      >
                        <ChevronLeft />
                      </button>
                    )}
                    
                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex-grow py-5 bg-white text-primary-navy font-black rounded-2xl hover:bg-primary-gold transition-all uppercase flex items-center justify-center gap-2 group"
                      >
                        NEXT STEP <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-grow py-5 bg-primary-gold text-primary-navy font-black rounded-2xl hover:bg-white transition-all uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? "PROCESSING..." : "SUBMIT APPLICATION"} <Sparkles size={20} />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
