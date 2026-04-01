import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, Heart, ArrowRight, Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';

const volunteerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  city: z.string().min(2, 'City is required'),
  skills: z.string().min(5, 'Please tell us your skills'),
  availability: z.string().min(2, 'Availability is required'),
  message: z.string().min(10, 'Please tell us your motivation'),
});

const GetInvolved = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(volunteerSchema),
  });

  const nextStep = async () => {
    let fields = [];
    if (step === 1) fields = ['name', 'email', 'phone', 'city'];
    if (step === 2) fields = ['skills', 'availability'];
    if (step === 3) fields = ['message'];

    const isValid = await trigger(fields);
    if (isValid) setStep((s) => s + 1);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // Simulate Firebase save
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Form Data:', data);
    setIsSubmitting(false);
    setIsSuccess(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C9933A', '#8B2252', '#0F7A6E']
    });
    toast.success("Welcome to the Lakshmi family!");
  };

  const steps = [
    { title: 'Personal Info', desc: 'Identify yourself' },
    { title: 'Expertise', desc: 'What can you do?' },
    { title: 'Motivation', desc: 'Why join us?' },
    { title: 'Review', desc: 'Final check' },
  ];

  if (isSuccess) {
    return (
      <section className="py-24 bg-primary-navy min-h-[600px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-[3rem] text-center max-w-xl border-primary-gold/20"
        >
          <div className="w-24 h-24 bg-primary-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="text-primary-gold" size={48} />
          </div>
          <h2 className="text-4xl font-heading font-black mb-4">YOU ARE AMAZING!</h2>
          <p className="text-primary-offwhite/60 font-body text-lg mb-10 italic">
            Your application to join the Lakshmi NGO family has been received. Our team will reach out within 48 hours.
          </p>
          <button
            onClick={() => { setIsSuccess(false); setStep(1); reset(); }}
            className="px-10 py-4 bg-primary-gold text-primary-navy font-bold rounded-full hover:scale-105 transition-all"
          >
            BACK TO SITE
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-secondary/20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-heading font-black mb-4">GET INVOLVED</h2>
          <p className="text-primary-offwhite/50 font-body italic">Choose your legacy and start making a difference today.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          {[
            { title: 'Volunteer', icon: <Users size={40} />, color: 'primary-gold', desc: 'Give your time and skills to lead change on the ground.' },
            { title: 'Donate', icon: <DollarSign size={40} />, color: 'primary-rose', desc: 'Your financial support fuels our life-saving programs.' },
            { title: 'Sponsor', icon: <Heart size={40} />, color: 'primary-teal', desc: 'Directly fund the education and safety of a specific child.' }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass p-10 rounded-[2.5rem] border-primary-gold/10 hover:border-primary-gold/40 transition-all duration-500 group"
            >
              <div className={`mb-8 p-6 rounded-3xl bg-white/5 w-fit group-hover:scale-110 transition-transform text-${card.color}`}>
                {card.icon}
              </div>
              <h3 className="text-3xl font-heading font-black mb-4 uppercase">{card.title}</h3>
              <p className="text-primary-offwhite/50 font-body mb-8 leading-relaxed italic">{card.desc}</p>
              <Link 
                to={card.title === 'Volunteer' ? '/volunteer' : '/donate'}
                className="flex items-center gap-2 text-primary-gold text-[10px] uppercase tracking-widest font-black group-hover:gap-4 transition-all"
              >
                Learn How <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Multi-Step Volunteer Form */}
        <div className="max-w-4xl mx-auto">
          <div className="glass p-8 md:p-16 rounded-[3rem] border-primary-gold/10 relative overflow-hidden">
            <div className="flex justify-between mb-12 relative z-10">
              {steps.map((s, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                    step > i + 1 ? 'bg-primary-gold text-primary-navy' : 
                    step === i + 1 ? 'border-2 border-primary-gold text-primary-gold scale-125' : 
                    'bg-white/5 text-primary-offwhite/30'
                  }`}>
                    {step > i + 1 ? <Check size={20} /> : i + 1}
                  </div>
                  <span className={`text-[10px] uppercase tracking-tighter font-bold font-body ${step === i + 1 ? 'text-primary-gold' : 'text-primary-offwhite/30'}`}>
                    {s.title}
                  </span>
                </div>
              ))}
              {/* Progress Line */}
              <div className="absolute top-5 left-0 w-full h-[1px] bg-white/5 -z-10" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-primary-gold mb-2 font-black">Full Name</label>
                      <input {...register('name')} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary-gold outline-none transition-colors" placeholder="Lakshmi Prasad" />
                      {errors.name && <p className="text-rose-500 text-[10px] mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-primary-gold mb-2 font-black">Email</label>
                      <input {...register('email')} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary-gold outline-none transition-colors" placeholder="name@email.com" />
                      {errors.email && <p className="text-rose-500 text-[10px] mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-primary-gold mb-2 font-black">Phone</label>
                      <input {...register('phone')} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary-gold outline-none transition-colors" placeholder="+91 999 000 1234" />
                      {errors.phone && <p className="text-rose-500 text-[10px] mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-primary-gold mb-2 font-black">City</label>
                      <input {...register('city')} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary-gold outline-none transition-colors" placeholder="Bangalore" />
                      {errors.city && <p className="text-rose-500 text-[10px] mt-1">{errors.city.message}</p>}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-primary-gold mb-2 font-black">Your Skills</label>
                      <input {...register('skills')} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary-gold outline-none transition-colors" placeholder="e.g. Teaching, Legal assistance, Social media" />
                      {errors.skills && <p className="text-rose-500 text-[10px] mt-1">{errors.skills.message}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-primary-gold mb-2 font-black">Availability</label>
                      <select {...register('availability')} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary-gold outline-none transition-colors">
                        <option value="Weekends Only" className="bg-primary-navy">Weekends Only</option>
                        <option value="Weekday Evenings" className="bg-primary-navy">Weekday Evenings</option>
                        <option value="Full Time" className="bg-primary-navy">Full Time (1-Month+)</option>
                      </select>
                      {errors.availability && <p className="text-rose-500 text-[10px] mt-1">{errors.availability.message}</p>}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-primary-gold mb-2 font-black">Motivation Message</label>
                      <textarea {...register('message')} rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary-gold outline-none transition-colors italic" placeholder="Why do you want to join our mission?" />
                      {errors.message && <p className="text-rose-500 text-[10px] mt-1">{errors.message.message}</p>}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center py-10"
                  >
                    <Heart className="mx-auto text-primary-rose mb-6 animate-pulse" size={48} />
                    <h3 className="text-2xl font-heading font-black mb-2 uppercase">Ready to submit?</h3>
                    <p className="text-primary-offwhite/50 italic mb-8">By clicking submit, you agree to join a community dedicated to radical kindness.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-8 py-3 text-primary-offwhite/50 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors"
                  >
                    Back
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-10 py-4 bg-primary-gold text-primary-navy font-black rounded-xl hover:scale-105 active:scale-95 transition-all text-[11px] flex items-center gap-2"
                  >
                    NEXT STEP <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto px-12 py-4 bg-gold-gradient text-primary-navy font-black rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'SUBMIT APPLICATION'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInvolved;
