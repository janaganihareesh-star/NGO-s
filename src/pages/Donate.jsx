import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, Star, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, limit, getDocs } from 'firebase/firestore';
import SEO from '../components/SEO';

const donationAmounts = [
  { amount: 100, label: "Starter" },
  { amount: 500, label: "Supporting" },
  { amount: 1000, label: "Impact" },
  { amount: 5000, label: "Visionary" },
];

const Donate = () => {
  // Form State
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  // App State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [recentDonors, setRecentDonors] = useState([]);
  const [totalDonorsCount, setTotalDonorsCount] = useState(312); // initial dummy baseline
  const [totalRaised, setTotalRaised] = useState(245000); // initial dummy baseline
  const goal = 500000;

  // Real-time listener for donations
  useEffect(() => {
    const q = query(collection(db, 'donations'), orderBy('timestamp', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const donors = [];
      snapshot.forEach((doc) => {
        donors.push({ id: doc.id, ...doc.data() });
      });
      setRecentDonors(donors);
    });

    // Get total count
    getDocs(collection(db, 'donations')).then(snap => {
      setTotalDonorsCount(312 + snap.size);
      let total = 245000;
      snap.forEach(doc => total += (Number(doc.data().amount) || 0));
      setTotalRaised(total);
    });

    return () => unsubscribe();
  }, []);

  const handlePayment = async () => {
    const amountToPay = customAmount ? Number(customAmount) : selectedAmount;
    if (!amountToPay || amountToPay <= 0) return;

    setIsProcessing(true);

    // Simulated Secure Payment Logic (Direct to Firestore)
    setTimeout(async () => {
      try {
        await addDoc(collection(db, 'donations'), {
          donorName: donorName.trim() || "Anonymous",
          email: donorEmail,
          amount: amountToPay,
          method: paymentMethod,
          timestamp: serverTimestamp(),
          campaignId: 'general'
        });
        
        setIsProcessing(false);
        setIsSuccess(true);
        
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#C9933A', '#FFFFFF', '#064E3B']
        });
      } catch (error) {
        console.error("Error saving donation:", error);
        setIsProcessing(false);
        toast.error("Internal sync error. Please try again.");
      }
    }, 1500);
  };

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const diff = Math.floor((new Date() - timestamp.toDate()) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  if (isSuccess) {
    const amountPaid = customAmount ? Number(customAmount) : selectedAmount;
    return (
      <div className="min-h-screen bg-primary-navy flex items-center justify-center pt-20 px-6 font-body">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-xl w-full glass p-12 rounded-[4rem] text-center border-primary-gold/20"
        >
          <div className="w-24 h-24 bg-primary-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <CheckCircle2 size={48} className="text-primary-navy" />
          </div>
          <h2 className="text-4xl font-heading font-black mb-4 uppercase">Thank you, {donorName || "Hero"}!</h2>
          <p className="text-gray-400 font-body mb-8 text-lg leading-relaxed">
            Your <span className="text-white font-bold">₹{amountPaid}</span> donation is confirmed. You are donor <span className="text-primary-gold font-bold">#{totalDonorsCount}</span>. Together, we are changing lives.
          </p>
          <button 
            onClick={() => {
              setIsSuccess(false);
              setCustomAmount("");
              setDonorName("");
              setDonorEmail("");
            }}
            className="w-full py-5 border border-white/10 text-white font-bold rounded-3xl hover:bg-white/5 transition-all"
          >
            MAKE ANOTHER DONATION
          </button>
        </motion.div>
      </div>
    );
  }

  const progressPercent = Math.min((totalRaised / goal) * 100, 100);

  return (
    <div className="min-h-screen bg-primary-navy pt-40 pb-24 overflow-hidden relative font-body">
      <SEO title="Donate Now" description="Support Lakshmi NGO Trust. Fuel the change in rural India." />
      
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-gold/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Left Side: Campaign Tracker & Info */}
          <div className="lg:w-1/2 space-y-12">
            <div>
              <h4 className="text-primary-gold font-black uppercase tracking-[0.4em] text-xs mb-4">Fuel The Change</h4>
              <h1 className="text-6xl md:text-7xl font-heading font-black text-white mb-6 leading-[0.95] uppercase">
                EMPOWER <br />
                <span className="italic text-primary-gold">HUMANITY</span>
              </h1>
            </div>

            {/* Campaign Tracker Bar */}
            <div className="glass p-8 rounded-3xl border-primary-gold/20 relative overflow-hidden">
               <div className="flex justify-between items-end mb-4">
                 <div>
                   <p className="text-sm text-gray-400 uppercase tracking-widest font-black mb-1">Campaign Goal</p>
                   <p className="text-3xl font-heading font-black text-white">₹{totalRaised.toLocaleString('en-IN')}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs text-gray-400">raised of ₹{goal.toLocaleString('en-IN')}</p>
                 </div>
               </div>
               
               <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden mb-4 relative">
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${progressPercent}%` }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className="absolute top-0 left-0 h-full bg-primary-gold rounded-full"
                 />
                 <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] bg-[length:400%_100%] animate-[shimmer_2s_infinite]" />
               </div>
               
               <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                 <span>{totalDonorsCount} Donors</span>
                 <span>18 Days Left</span>
               </div>
            </div>

            {/* Impact Equivalents */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-offwhite/40 ml-2">Your Impact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 border border-white/5 rounded-2xl bg-white/5 text-center">
                  <p className="text-xl font-black text-primary-gold mb-1">₹500</p>
                  <p className="text-xs text-gray-400">1 child's meals for a week</p>
                </div>
                <div className="p-5 border border-white/5 rounded-2xl bg-white/5 text-center">
                  <p className="text-xl font-black text-primary-gold mb-1">₹1000</p>
                  <p className="text-xs text-gray-400">1 girl's school books</p>
                </div>
                <div className="p-5 border border-white/5 rounded-2xl bg-white/5 text-center">
                  <p className="text-xl font-black text-primary-gold mb-1">₹5000</p>
                  <p className="text-xs text-gray-400">1 month shelter for a family</p>
                </div>
              </div>
            </div>

            {/* Testimonial Snippet */}
            <div className="p-8 glass rounded-3xl border-primary-gold/10 relative">
               <Heart className="absolute -top-4 -left-4 text-primary-gold fill-primary-gold/20" size={32} />
               <p className="text-white italic text-md leading-relaxed">
                 "100% of your donation is deployed to field operations within 48 hours. We are committed to radical transparency."
               </p>
            </div>
          </div>

          {/* Right Side: Donation Form */}
          <div className="lg:w-1/2">
            <div className="glass p-1 p-[2px] rounded-[3.5rem] bg-gradient-to-br from-primary-gold/40 via-white/5 to-transparent shadow-2xl">
              <div className="bg-[#0A0F1E]/95 backdrop-blur-2xl p-8 md:p-12 rounded-[3.4rem]">
                
                {/* Amount Grid */}
                <div className="mb-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-offwhite/40 mb-4 ml-2">Choose Amount</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {donationAmounts.map((opt) => (
                      <button
                        key={opt.amount}
                        onClick={() => {setSelectedAmount(opt.amount); setCustomAmount("");}}
                        className={`py-4 rounded-2xl text-center transition-all border ${
                          selectedAmount === opt.amount && !customAmount 
                          ? "bg-primary-gold border-primary-gold text-primary-navy shadow-[0_0_20px_rgba(201,147,58,0.3)]" 
                          : "bg-white/5 border-white/10 text-white hover:border-white/30"
                        }`}
                      >
                        <p className="text-lg font-heading font-black">₹{opt.amount}</p>
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="mt-4 relative group">
                    <input 
                      type="number"
                      value={customAmount}
                      onChange={(e) => {setCustomAmount(e.target.value); setSelectedAmount(0);}}
                      placeholder="Enter custom amount..."
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-primary-gold text-white font-bold peer placeholder-transparent"
                    />
                    <label className="absolute left-4 top-4 text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-[-1rem] peer-focus:text-[10px] peer-focus:text-primary-gold bg-[#0A0F1E] px-1">Optional Custom Amount (₹)</label>
                  </div>
                </div>

                {/* Donor Details */}
                <div className="mb-8 space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary-offwhite/40 mb-2 ml-2">Your Details</p>
                   <input 
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Full Name (Optional for Anonymous)"
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-primary-gold text-white text-sm"
                    />
                    <input 
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="Email Address (Optional)"
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-primary-gold text-white text-sm"
                    />
                </div>

                {/* Payment Methods */}
                <div className="mb-10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary-offwhite/40 mb-4 ml-2">Payment Method</p>
                   <div className="space-y-3">
                      
                      {/* CARD */}
                      <div
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                          paymentMethod === "card"
                            ? "border-primary-gold bg-primary-gold/10"
                            : "border-white/10 bg-white/5 hover:border-white/30"
                        }`}
                      >
                        <span className="text-xl">💳</span> 
                        <span className="text-white text-sm font-bold flex-1">Credit / Debit Card</span>
                        {paymentMethod === "card" && <span className="text-primary-gold text-xs font-black tracking-widest">SELECTED</span>}
                      </div>

                      {/* UPI */}
                      <div
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                          paymentMethod === "upi"
                            ? "border-primary-gold bg-primary-gold/10"
                            : "border-white/10 bg-white/5 hover:border-white/30"
                        }`}
                      >
                        <span className="text-xl">📱</span> 
                        <span className="text-white text-sm font-bold flex-1">Wallet / UPI / Digital</span>
                        {paymentMethod === "upi" && <span className="text-primary-gold text-xs font-black tracking-widest">SELECTED</span>}
                      </div>

                      {/* NET BANKING */}
                      <div
                        onClick={() => setPaymentMethod("netbanking")}
                        className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                          paymentMethod === "netbanking"
                            ? "border-primary-gold bg-primary-gold/10"
                            : "border-white/10 bg-white/5 hover:border-white/30"
                        }`}
                      >
                        <span className="text-xl">🏦</span> 
                        <span className="text-white text-sm font-bold flex-1">Bank Transfer / Net Banking</span>
                        {paymentMethod === "netbanking" && <span className="text-primary-gold text-xs font-black tracking-widest">SELECTED</span>}
                      </div>

                   </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing || (!selectedAmount && !customAmount)}
                  className="w-full py-5 bg-white text-primary-navy font-black text-lg rounded-2xl hover:bg-primary-gold transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isProcessing ? "PROCESSING SECURE PAY..." : <>PROCEED TO SECURE PAY <ArrowRight size={20} /></>}
                </button>
              </div>
            </div>

            {/* Recent Donors Feed */}
            <div className="mt-12 glass p-8 rounded-3xl border-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-gold mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live Donors Feed
              </h4>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                <AnimatePresence>
                  {recentDonors.map((donor) => (
                    <motion.div
                      key={donor.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-gold flex items-center justify-center text-primary-navy font-black text-lg shadow-lg">
                        {donor.donorName ? donor.donorName[0].toUpperCase() : "A"}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold text-sm">
                          {donor.donorName || "Anonymous"} <span className="text-gray-400 font-normal">donated</span> <span className="text-primary-gold">₹{donor.amount}</span>
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">{getRelativeTime(donor.timestamp)}</p>
                      </div>
                    </motion.div>
                  ))}
                  {recentDonors.length === 0 && (
                     <p className="text-xs text-gray-500 text-center py-4">Waiting for incoming donations...</p>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
