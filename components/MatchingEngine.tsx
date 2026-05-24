
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Loader2, IndianRupee, MapPin, Truck, 
  Sparkles, BrainCircuit, ShieldCheck, 
  CheckCircle, ArrowRight, X, Phone, User, CreditCard, Shield, Lock, Wallet,
  Navigation, Globe, Info, AlertCircle, Share2
} from 'lucide-react';
import { getAIMatches, getRouteInsights } from '../services/geminiService';
import { TripMatch } from '../types';
import { VARIANTS } from '../constants/animations';

const SkeletonCard = () => (
  <div className="border border-gray-100 rounded-3xl p-6 bg-white animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="text-right">
        <div className="h-8 w-20 bg-gray-200 rounded-lg ml-auto mb-2"></div>
      </div>
    </div>
    <div className="h-6 w-3/4 bg-gray-200 rounded-lg mb-2"></div>
    <div className="h-12 w-full bg-gray-50 rounded-xl mb-4"></div>
    <div className="h-14 w-full bg-gray-200 rounded-2xl"></div>
  </div>
);

const BOOKING_STEPS = [
  "Initializing secure payment gateway...",
  "Locking trip availability with driver...",
  "Activating ₹5 Lakh trip insurance...",
  "Generating security OTP...",
  "Confirming intercity transit block..."
];

type BookingStage = 'LIST' | 'PASSENGER_DETAILS' | 'REVIEW' | 'PAYMENT' | 'PROCESSING' | 'SUCCESS';

interface MatchingEngineProps {
  setActiveTab: (tab: string) => void;
  onBookingSuccess: (trip: any) => void;
}

export const MatchingEngine: React.FC<MatchingEngineProps> = ({ setActiveTab, onBookingSuccess }) => {
  const [source, setSource] = useState('Gorakhpur');
  const [dest, setDest] = useState('Delhi');
  const [type, setType] = useState<'seat' | 'cargo'>('seat');
  const [matches, setMatches] = useState<TripMatch[]>([]);
  const [routeInsights, setRouteInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [bookingStage, setBookingStage] = useState<BookingStage>('LIST');
  const [bookingProgress, setBookingProgress] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState<TripMatch | null>(null);
  const [passengerDetails, setPassengerDetails] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    if (!passengerDetails.name.trim()) newErrors.name = "Full name is required";
    if (!/^\d{10}$/.test(passengerDetails.phone)) newErrors.phone = "Enter a valid 10-digit mobile number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async () => {
    if (!source || !dest) return;
    setLoading(true);
    setInsightsLoading(true);
    setMatches([]);
    setRouteInsights(null);
    
    try {
      // Initiate both but await matches first to display results immediately
      const matchesPromise = getAIMatches(source, dest, type);
      const insightsPromise = getRouteInsights(source, dest);

      const results = await matchesPromise;
      setMatches(results);
      setLoading(false); // Immediate feedback for matches

      // Insights can load in background
      const insights = await insightsPromise;
      setRouteInsights(insights);
      setInsightsLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setInsightsLoading(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (bookingStage === 'PROCESSING') {
      setBookingProgress(0);
      interval = setInterval(() => {
        setBookingProgress((prev) => {
          if (prev >= BOOKING_STEPS.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setBookingStage('SUCCESS');
              if (selectedMatch) {
                onBookingSuccess({ 
                  ...selectedMatch, 
                  source, 
                  destination: dest,
                  bookingDate: new Date().toLocaleDateString()
                });
              }
            }, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [bookingStage]);

  const closeBooking = () => {
    setBookingStage('LIST');
    setSelectedMatch(null);
    setPassengerDetails({ name: '', phone: '' });
    setErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-8 lg:p-12 ai-gradient text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Sparkles className="animate-pulse" /> TripSure Match
            </h2>
            <p className="text-white/80 font-medium max-w-xl">
              Optimizing India's intercity return trips with real-time AI grounding and safety verification.
            </p>
          </div>
          <BrainCircuit className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white opacity-10 rotate-12" />
        </div>

        <div className="p-8 lg:p-12">
          {bookingStage === 'LIST' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end mb-12">
                <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">From</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                      <input 
                        type="text" 
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">To</label>
                    <div className="relative">
                      <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" size={18} />
                      <input 
                        type="text" 
                        value={dest}
                        onChange={(e) => setDest(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                      />
                    </div>
                  </div>
                  <div className="flex bg-gray-100 p-1 rounded-2xl self-end h-[60px]">
                    <button 
                      onClick={() => setType('seat')}
                      className={`flex-1 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === 'seat' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Seats
                    </button>
                    <button 
                      onClick={() => setType('cargo')}
                      className={`flex-1 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === 'cargo' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Cargo
                    </button>
                  </div>
                </div>
                <motion.button 
                  onClick={handleSearch}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-900 text-white font-black uppercase tracking-widest text-xs py-4 px-6 rounded-2xl hover:bg-black flex items-center justify-center transition-all h-[60px] shadow-xl disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Search className="mr-2" size={18} />}
                  Find Matches
                </motion.button>
              </div>

              {(routeInsights || insightsLoading) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 p-8 bg-gray-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Globe className="text-indigo-400" size={24} />
                        <h3 className="text-xl font-black">AI Route Intelligence</h3>
                        {insightsLoading && <Loader2 className="animate-spin text-white/40" size={16} />}
                      </div>
                      {insightsLoading ? (
                        <div className="space-y-2">
                          <div className="h-3 bg-white/10 rounded w-full animate-pulse"></div>
                          <div className="h-3 bg-white/10 rounded w-3/4 animate-pulse"></div>
                        </div>
                      ) : (
                        <p className="text-white/70 text-sm font-medium leading-relaxed italic">"{routeInsights.text}"</p>
                      )}
                    </div>
                    {!insightsLoading && routeInsights?.sources?.length > 0 && (
                      <div className="w-full md:w-64 space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Verified Grounding</p>
                        <div className="flex flex-wrap gap-2">
                          {routeInsights.sources.map((chunk: any, i: number) => chunk.web && (
                            <a key={i} href={chunk.web.uri} target="_blank" className="text-[9px] bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/20 transition-all">{chunk.web.title}</a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                ) : matches.length > 0 ? (
                  matches.map((match, idx) => (
                    <motion.div 
                      key={match.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border border-gray-100 rounded-[2.5rem] p-8 bg-white hover:shadow-2xl transition-all border-b-4 border-b-transparent hover:border-b-indigo-500 group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-gray-400 text-xl">
                          {match.driverName.charAt(0)}
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black text-gray-900 flex items-center justify-end">
                            <IndianRupee size={24} className="text-emerald-500" />{match.price}
                          </div>
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Confirmed Match</span>
                        </div>
                      </div>
                      <h4 className="text-xl font-black text-gray-900 mb-1">{match.driverName}</h4>
                      <p className="text-sm text-gray-500 font-medium mb-6">{match.vehicle}</p>
                      
                      <div className="p-4 bg-indigo-50 rounded-2xl mb-8 border border-indigo-100 text-xs font-bold text-indigo-800 leading-relaxed italic">
                        "{match.reason}"
                      </div>

                      <button 
                        onClick={() => { setSelectedMatch(match); setBookingStage('PASSENGER_DETAILS'); }}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-xl"
                      >
                        Secure Seat <ArrowRight size={18} />
                      </button>
                    </motion.div>
                  ))
                ) : !loading && (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="text-gray-200" size={40} />
                    </div>
                    <p className="text-lg text-gray-400 font-bold">Search above to find verified AI matches.</p>
                  </div>
                )}
              </div>
            </>
          )}

          <AnimatePresence mode="wait">
            {bookingStage === 'PASSENGER_DETAILS' && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-xl mx-auto py-8">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-black text-gray-900">Passenger Info</h3>
                  <button onClick={closeBooking} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><X size={24} /></button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="text" 
                        value={passengerDetails.name}
                        onChange={(e) => setPassengerDetails({ ...passengerDetails, name: e.target.value })}
                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl outline-none font-bold ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-100 focus:ring-indigo-500'}`}
                        placeholder="As on Aadhaar"
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 font-bold ml-2 flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="tel" 
                        maxLength={10}
                        value={passengerDetails.phone}
                        onChange={(e) => setPassengerDetails({ ...passengerDetails, phone: e.target.value.replace(/\D/g, '') })}
                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl outline-none font-bold ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-100 focus:ring-indigo-500'}`}
                        placeholder="10-digit number"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 font-bold ml-2 flex items-center gap-1"><AlertCircle size={12}/> {errors.phone}</p>}
                  </div>
                  <button 
                    onClick={() => validateDetails() && setBookingStage('REVIEW')}
                    className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-indigo-100 mt-10"
                  >
                    Review Order <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {bookingStage === 'REVIEW' && (
              <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl mx-auto py-8">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-black text-gray-900">Review & Confirm</h3>
                  <button onClick={() => setBookingStage('PASSENGER_DETAILS')} className="text-sm font-black text-indigo-600 hover:underline">Edit Info</button>
                </div>
                <div className="bg-gray-50 rounded-[2.5rem] p-8 space-y-8 border border-gray-100 mb-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Route</p>
                      <p className="font-black text-xl text-gray-900">{source} → {dest}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fare</p>
                      <p className="font-black text-2xl text-emerald-600">₹{selectedMatch?.price}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-indigo-500" />
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Passenger</p>
                        <p className="text-sm font-bold">{passengerDetails.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase">Phone</p>
                      <p className="text-sm font-bold">+91 {passengerDetails.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 text-xs font-bold">
                    <ShieldCheck size={20} /> ₹5L Insurance Coverage Included
                  </div>
                </div>
                <button 
                  onClick={() => setBookingStage('PAYMENT')}
                  className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 shadow-2xl"
                >
                  Pay ₹{selectedMatch?.price} Now
                </button>
              </motion.div>
            )}

            {bookingStage === 'PAYMENT' && (
              <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl mx-auto py-8 text-center">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-black text-gray-900">Secure Payment</h3>
                  <button onClick={() => setBookingStage('REVIEW')} className="p-2"><X size={24} /></button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <button onClick={() => setBookingStage('PROCESSING')} className="p-8 border-2 border-indigo-600 bg-indigo-50 rounded-[2.5rem] flex flex-col items-center gap-4 transition-all">
                    <Wallet size={32} className="text-indigo-600" />
                    <span className="font-black text-xs uppercase tracking-widest">Pay with UPI</span>
                  </button>
                  <button onClick={() => setBookingStage('PROCESSING')} className="p-8 border-2 border-gray-100 bg-white rounded-[2.5rem] flex flex-col items-center gap-4 hover:border-indigo-200 transition-all">
                    <CreditCard size={32} className="text-gray-400" />
                    <span className="font-black text-xs uppercase tracking-widest text-gray-400">Card / Net</span>
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Lock size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">PCI-DSS Compliant Gateway</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {bookingStage === 'PROCESSING' && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl">
              <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 relative">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Finalizing Booking</h3>
              <p className="text-gray-500 mb-10 text-sm font-medium">Please do not refresh or close the browser.</p>
              <div className="space-y-4 text-left px-4">
                {BOOKING_STEPS.map((step, idx) => (
                  <div key={idx} className={`flex items-center gap-3 transition-opacity duration-500 ${idx <= bookingProgress ? 'opacity-100' : 'opacity-20'}`}>
                    {idx < bookingProgress ? <CheckCircle className="text-emerald-500" size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />}
                    <span className="text-xs font-bold text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {bookingStage === 'SUCCESS' && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={closeBooking} />
            <motion.div initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} className="relative bg-white rounded-[3.5rem] p-12 max-w-xl w-full border border-gray-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]">
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-100">
                  <CheckCircle size={56} />
                </div>
                <h3 className="text-4xl font-black text-gray-900 mb-2">You're All Set!</h3>
                <p className="text-gray-500 font-medium italic">"Safe travels from the TripSure AI Team"</p>
              </div>

              <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 mb-10 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Trip Ticket</p>
                    <p className="font-black text-2xl text-gray-900">{source} → {dest}</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-gray-100 text-center shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase">OTP</p>
                    <p className="text-2xl font-black text-indigo-600 tracking-widest">{Math.floor(1000 + Math.random() * 9000)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                  <ShieldCheck className="text-indigo-600" size={24} />
                  <span className="text-sm font-black text-indigo-700">₹5,00,000 Insurance Policy Active</span>
                </div>
                <div className="absolute top-0 right-0 p-2 opacity-5">
                   <Truck size={120} />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => { setActiveTab('my-trips'); closeBooking(); }}
                  className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 group"
                >
                  View Live Journey <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <button className="py-4 bg-white border border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2">
                    <Share2 size={16} /> Share Ticket
                  </button>
                  <button onClick={closeBooking} className="py-4 bg-white border border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-500 hover:bg-gray-50">
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
