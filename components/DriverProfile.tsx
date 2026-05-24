
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, MapPin, Calendar, ShieldCheck, Car, Truck, 
  ArrowLeft, Award, MessageSquare, ThumbsUp, User,
  CheckCircle2, Info
} from 'lucide-react';
import { Driver } from '../types';
import { VARIANTS } from '../constants/animations';

interface DriverProfileProps {
  driver: Driver;
  onBack: () => void;
  language: 'en' | 'hi';
}

export const DriverProfile: React.FC<DriverProfileProps> = ({ driver, onBack, language }) => {
  const content = {
    en: {
      back: 'Back to Trips',
      verified: 'Verified Partner',
      trips: 'Trips Completed',
      rating: 'Overall Rating',
      since: 'Member Since',
      vehicles: 'Registered Vehicles',
      about: 'About the Driver',
      reviews: 'Recent Reviews',
      contact: 'Book with this Driver'
    },
    hi: {
      back: 'यात्राओं पर वापस जाएं',
      verified: 'सत्यापित भागीदार',
      trips: 'पूरी हुई यात्राएं',
      rating: 'कुल रेटिंग',
      since: 'सदस्यता की तिथि',
      vehicles: 'पंजीकृत वाहन',
      about: 'ड्राइवर के बारे में',
      reviews: 'हालिया समीक्षाएं',
      contact: 'इस ड्राइवर के साथ बुक करें'
    }
  }[language];

  return (
    <motion.div 
      initial="initial" 
      animate="animate" 
      exit="exit" 
      variants={VARIANTS.pageTransition}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <button 
        onClick={onBack}
        className="flex items-center text-gray-500 hover:text-indigo-600 font-bold mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        {content.back}
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
        {/* Profile Header */}
        <div className="relative h-48 ai-gradient">
          <div className="absolute -bottom-16 left-12">
            <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-xl">
              <div className="w-full h-full rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 overflow-hidden">
                {driver.avatar ? (
                  <img src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={64} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 px-12 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-gray-900">{driver.name}</h1>
                {driver.verified && (
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center gap-1">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{content.verified}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-gray-500 font-medium">
                <div className="flex items-center gap-1">
                  <Star size={18} className="text-orange-400 fill-orange-400" />
                  <span className="text-gray-900 font-bold">{driver.rating}</span>
                  <span>({driver.tripsCount} {content.trips})</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar size={18} />
                  <span>{content.since} {driver.joinedDate}</span>
                </div>
              </div>
            </div>
            <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl">
              {content.contact}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: About & Vehicles */}
            <div className="lg:col-span-7 space-y-10">
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{content.about}</h3>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  {driver.bio}
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-6">{content.vehicles}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {driver.vehicles.map((v, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                          {/* Corrected: Comparison against valid Vehicle['type'] union values */}
                          {v.type !== 'TRUCK' ? <Car size={24} /> : <Truck size={24} />}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{v.model}</div>
                          <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{v.plate}</div>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {v.type}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Trust & Reviews */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Award size={24} className="text-indigo-200" /> Trust Badges
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: CheckCircle2, label: 'Police Verified Background' },
                      { icon: ThumbsUp, label: 'Top-Rated Excellence' },
                      { icon: MessageSquare, label: 'Regional Language Specialist' }
                    ].map((badge, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <badge.icon size={18} className="text-indigo-300" />
                        <span className="text-sm font-bold opacity-90">{badge.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              </div>

              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-6">{content.reviews}</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Amit S.', comment: 'Very professional and punctual. Vehicle was clean.', rating: 5 },
                    { name: 'Priya M.', comment: 'Expert navigator through traffic. Safe driving.', rating: 4 }
                  ].map((review, i) => (
                    <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-900">{review.name}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, star) => (
                            <Star 
                              key={star} 
                              size={12} 
                              className={star < review.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-200'} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
