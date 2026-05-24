
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Users, MapPin, Shield, Calendar, 
  IndianRupee, ChevronRight, Settings, 
  LogOut, Star, Clock, CheckCircle, AlertCircle,
  Truck, Wallet, Plus, Navigation, X, ShieldCheck, ArrowRight
} from 'lucide-react';
import { VARIANTS } from '../constants/animations';
import { User, UserRole, Driver, IntercityTrip } from '../types';
import { PostTrip } from './PostTrip';

interface DashboardProps {
  language: 'en' | 'hi';
  userTrips: any[];
  driverTrips?: IntercityTrip[];
  user: User;
  onLogOut: () => void;
  onPostTrip: (trip: IntercityTrip) => void;
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  language, 
  userTrips, 
  driverTrips = [], 
  user, 
  onLogOut, 
  onPostTrip,
  setActiveTab
}) => {
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);
  const isDriver = user.role === UserRole.DRIVER;
  const driverData = user as Driver;

  const content = {
    en: {
      welcome: `Namaste, ${user.name.split(' ')[0]}`,
      stats: "Performance Overview",
      kycBanner: {
        title: "Verify Your Identity",
        desc: "Complete your KYC to unlock trusted badges and higher priority matching.",
        button: "Verify Now"
      },
      passenger: {
        tripsDone: "Total Trips",
        savings: "AI Savings",
        safety: "Safety Score",
        activeTitle: "Next Journeys",
        noTrips: "No upcoming journeys."
      },
      driver: {
        totalEarnings: "Gross Earnings",
        completedTrips: "Deliveries",
        rating: "Service Rating",
        fleet: "Active Fleet",
        postNew: "List Return Trip",
        postedTrips: "Return Routes"
      },
      logout: "Sign Out"
    },
    hi: {
      welcome: `नमस्ते, ${user.name.split(' ')[0]}`,
      stats: "प्रदर्शन अवलोकन",
      kycBanner: {
        title: "अपनी पहचान सत्यापित करें",
        desc: "भरोसेमंद बैज और उच्च प्राथमिकता अनलॉक करने के लिए KYC पूरा करें।",
        button: "सत्यापित करें"
      },
      passenger: {
        tripsDone: "कुल यात्राएं",
        savings: "AI बचत",
        safety: "सुरक्षा स्कोर",
        activeTitle: "अगली यात्राएं",
        noTrips: "कोई आगामी यात्रा नहीं।"
      },
      driver: {
        totalEarnings: "कुल कमाई",
        completedTrips: "डिलीवरी",
        rating: "सेवा रेटिंग",
        fleet: "सक्रिय बेड़ा",
        postNew: "वापसी यात्रा जोड़ें",
        postedTrips: "वापसी मार्ग"
      },
      logout: "लॉग आउट"
    }
  }[language];

  const stats = isDriver ? [
    { label: content.driver.totalEarnings, value: '₹14,250', icon: Wallet, trend: '+12%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: content.driver.completedTrips, value: '48', icon: Truck, trend: '+4', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: content.driver.rating, value: '4.95', icon: Star, trend: 'High', color: 'text-orange-500', bg: 'bg-orange-50' },
  ] : [
    { label: content.passenger.tripsDone, value: '12', icon: MapPin, trend: 'Member', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: content.passenger.savings, value: '₹4,250', icon: TrendingUp, trend: 'Eco', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: content.passenger.safety, value: '100%', icon: Shield, trend: 'Safe', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 bg-gray-100 rounded-[2rem] flex items-center justify-center text-gray-400 border-2 border-white shadow-xl overflow-hidden">
             {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <Users size={40} />}
           </div>
           <div>
             <h1 className="text-4xl font-black text-gray-900 leading-none mb-2">{content.welcome}</h1>
             <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] bg-gray-100 px-3 py-1 rounded-full inline-block">
               {user.role} ID: {user.id}
             </p>
           </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('settings')}
            className="p-4 bg-white border border-gray-200 rounded-3xl text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm active:scale-95"
          >
            <Settings size={24} />
          </button>
          <button 
            onClick={onLogOut}
            className="px-6 py-4 bg-red-50 text-red-600 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2 border border-red-100 shadow-sm"
          >
            <LogOut size={18} /> {content.logout}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            variants={VARIANTS.fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex items-center gap-8 group hover:shadow-xl transition-all"
          >
            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-[1.8rem] flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${stat.bg} ${stat.color}`}>{stat.trend}</span>
              </div>
              <div className="text-3xl font-black text-gray-900">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {user.kycStatus !== 'VERIFIED' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-12 p-10 bg-indigo-600 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)]"
        >
          <div className="relative z-10 flex items-center gap-8">
            <div className="w-20 h-20 bg-white/20 rounded-[2.5rem] flex items-center justify-center backdrop-blur-md">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black mb-2">{content.kycBanner.title}</h2>
              <p className="text-indigo-100 font-medium max-w-lg">{content.kycBanner.desc}</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('kyc')}
            className="relative z-10 px-10 py-5 bg-white text-indigo-600 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
          >
            {content.kycBanner.button}
          </button>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex justify-between items-center mb-8 px-4">
              <h2 className="text-2xl font-black text-gray-900">{isDriver ? content.driver.postedTrips : content.passenger.activeTitle}</h2>
              {isDriver && (
                <button 
                  onClick={() => setIsPostingModalOpen(true)}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-xl"
                >
                  <Plus size={16} /> {content.driver.postNew}
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {(isDriver ? driverTrips : userTrips).length > 0 ? (
                (isDriver ? driverTrips : userTrips).map((trip, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6 hover:shadow-md transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center">
                        <Navigation size={32} />
                      </div>
                      <div>
                        <div className="font-black text-xl text-gray-900 leading-none mb-2">{trip.source} → {trip.destination}</div>
                        <div className="text-sm text-gray-500 font-bold flex items-center gap-4">
                          <span className="flex items-center gap-1.5"><Calendar size={16} className="text-indigo-400"/> {trip.date}</span>
                          <span className="flex items-center gap-1.5"><Shield size={16} className="text-emerald-400"/> Verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                      <div className="text-2xl font-black text-gray-900">₹{trip.price}</div>
                      <div className="text-[10px] font-black uppercase px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">Confirmed</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold mb-6">{isDriver ? "No active routes." : content.passenger.noTrips}</p>
                  <button 
                    onClick={() => setActiveTab(isDriver ? 'kyc' : 'matching')}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-xl"
                  >
                    {isDriver ? "Configure Fleet" : "Find AI Matches"}
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <h2 className="text-2xl font-black mb-8">AI Safety Score</h2>
            <div className="flex items-center justify-center mb-10">
               <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552} strokeDashoffset={552 * 0.05} className="text-indigo-500" />
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-4xl font-black">95%</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase">Trusted</div>
                  </div>
               </div>
            </div>
            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8">Your score is calculated based on feedback, verified KYC, and safe driving metrics.</p>
            <button className="w-full py-4 bg-white/10 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">Download Safety Certificate</button>
            <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isPostingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsPostingModalOpen(false)} />
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative bg-gray-50 rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 z-10 px-10 py-8 bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-2xl font-black text-gray-900">{content.driver.postNew}</h3>
                <button onClick={() => setIsPostingModalOpen(false)} className="p-3 hover:bg-white rounded-2xl transition-all"><X size={24} /></button>
              </div>
              <div className="p-10">
                <PostTrip driver={driverData} onPost={(t) => { onPostTrip(t); setIsPostingModalOpen(false); }} onCancel={() => setIsPostingModalOpen(false)} language={language} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
