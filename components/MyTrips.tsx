import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, Sparkles, Hash, Check, Calendar, IndianRupee, 
  ChevronDown, MapPinned, Clock, AlertCircle, User, 
  Star, ChevronRight, Tag, ShieldCheck, Info, 
  Navigation, X, Share2, FileText, Phone, 
  AlertTriangle, CheckCircle2, MapPin, Coffee, Fuel, Utensils,
  PhoneCall, XCircle, Loader2, Siren, ArrowRight
} from 'lucide-react';
import { VARIANTS } from '../constants/animations';

interface MyTripsProps {
  language: 'en' | 'hi';
  additionalTrips?: any[];
  onViewProfile?: (driverData: any) => void;
  onCancelTrip?: (tripId: string, reason: string) => void;
  highlightedTripId?: string | null;
  clearHighlight?: () => void;
}

const STATIC_USER_TRIPS: any[] = [
  {
    id: 'TS-942',
    route: 'Gorakhpur → Lucknow',
    date: '12 Oct, 2023',
    price: 850,
    status: 'Completed',
    vehicle: 'Swift Dzire',
    type: 'Passenger',
    driverName: 'Ramesh Singh',
    rating: 4.9,
    trips: 450,
    icon: Car,
    details: {
      pickup: 'Gorakhpur Junction',
      dropoff: 'Lucknow Charbagh',
      pickupTime: '08:00 AM',
      dropoffTime: '01:30 PM',
      eta: '01:30 PM',
      plate: 'UP 53 AB 1234',
      otp: '8821'
    }
  }
];

export const MyTrips: React.FC<MyTripsProps> = ({ 
  language, 
  additionalTrips = [], 
  onViewProfile, 
  onCancelTrip,
  highlightedTripId,
  clearHighlight
}) => {
  const [filter, setFilter] = useState<'all' | 'Upcoming' | 'Completed' | 'Cancelled'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [showSOSOptions, setShowSOSOptions] = useState(false);
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  
  const tripRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  const cancellationReasons = [
    { en: 'Changed Plans', hi: 'योजना बदल गई' },
    { en: 'Driver Issue', hi: 'ड्राइवर की समस्या' },
    { en: 'Vehicle Problem', hi: 'वाहन की समस्या' },
    { en: 'Found Better Price', hi: 'बेहतर कीमत मिली' },
    { en: 'Other', hi: 'अन्य' }
  ];

  const content = {
    en: {
      title: 'My Journeys',
      subtitle: 'Manage your active intercity travel and past trip history.',
      insurance: '₹5L Policy Active',
      track: 'Track Live',
      sos: 'SOS Emergency',
      cancel: 'Cancel Trip',
      trackingTitle: 'Real-time GPS Tracking',
      trackingSub: 'Connecting to vehicle telematics...',
      cancelConfirm: 'Are you sure you want to cancel this trip?',
      cancelSub: 'Select a reason to help us improve our service.',
      cancelBtn: 'Confirm Cancellation',
      sosOptions: {
        police: 'Call Police (100)',
        ambulance: 'Call Ambulance (102)',
        support: 'TripSure Safety Line'
      }
    },
    hi: {
      title: 'मेरी यात्राएं',
      subtitle: 'अपनी सक्रिय अंतर-शहर यात्रा और पिछले ट्रिप इतिहास का प्रबंधन करें।',
      insurance: '₹5L बीमा सक्रिय',
      track: 'लाइव ट्रैक',
      sos: 'SOS आपातकालीन',
      cancel: 'यात्रा रद्द करें',
      trackingTitle: 'रीयल-टाइम GPS ट्रैकिंग',
      trackingSub: 'वाहन टेलीमैटिक्स से जुड़ रहा है...',
      cancelConfirm: 'क्या आप वाकई इस यात्रा को रद्द करना चाहते हैं?',
      cancelSub: 'हमारी सेवा को बेहतर बनाने में मदद करने के लिए एक कारण चुनें।',
      cancelBtn: 'रद्द करने की पुष्टि करें',
      sosOptions: {
        police: 'पुलिस को बुलाएं (100)',
        ambulance: 'एम्बुलेंस बुलाएं (102)',
        support: 'ट्रिपश्योर सुरक्षा लाइन'
      }
    }
  }[language];

  const handleTrackLive = (tripId: string) => {
    setTrackingId(tripId);
    setTimeout(() => setTrackingId(null), 5000);
  };

  const handleSOS = (type: 'police' | 'ambulance' | 'support') => {
    const numbers = { police: '100', ambulance: '102', support: '9347117635' };
    window.location.href = `tel:${numbers[type]}`;
    setShowSOSOptions(false);
  };

  const handleCancelAction = (tripId: string) => {
    setCancelModalId(tripId);
    setSelectedReason(null);
  };

  const confirmCancellation = () => {
    if (cancelModalId && selectedReason) {
      if (onCancelTrip) {
        onCancelTrip(cancelModalId, selectedReason);
      }
      setCancelModalId(null);
      setSelectedReason(null);
    }
  };

  const allTrips = [...additionalTrips.map(t => ({...t, icon: t.icon || Car})), ...STATIC_USER_TRIPS];
  const filteredTrips = allTrips.filter(trip => filter === 'all' || trip.status === filter);

  useEffect(() => {
    if (highlightedTripId) {
      setFilter('Upcoming');
      setExpandedId(highlightedTripId);
      setTimeout(() => {
        tripRefs.current[highlightedTripId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 800);
      const timer = setTimeout(() => clearHighlight?.(), 5000);
      return () => clearTimeout(timer);
    }
  }, [highlightedTripId]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-gray-900 mb-2">{content.title}</h2>
        <p className="text-gray-500 text-lg font-medium">{content.subtitle}</p>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-2xl mb-12 w-fit">
        {['all', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTrips.map((trip) => {
            const isExpanded = expandedId === trip.id;
            const canCancel = trip.status === 'Upcoming';
            return (
              <motion.div
                key={trip.id}
                layout
                ref={el => { tripRefs.current[trip.id] = el; }}
                className={`bg-white rounded-[2.5rem] border transition-all ${isExpanded ? 'ring-2 ring-indigo-500 shadow-2xl scale-[1.01]' : 'border-gray-100 hover:border-indigo-200'}`}
              >
                <div className="p-8 cursor-pointer flex justify-between items-center" onClick={() => setExpandedId(isExpanded ? null : trip.id)}>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-400">
                      <trip.icon size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                          trip.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                          trip.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>{trip.status}</span>
                        {trip.isNew && <span className="text-[10px] font-black uppercase px-2 py-1 bg-indigo-600 text-white rounded-lg animate-pulse">Live</span>}
                      </div>
                      <h4 className="text-2xl font-black text-gray-900">{trip.route}</h4>
                      <p className="text-xs text-gray-400 font-bold">{trip.date}</p>
                    </div>
                  </div>
                  <ChevronDown className={`text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-8 pb-10 pt-4 border-t border-gray-50 overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Journey Tracking</h5>
                            <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                               <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-gray-500">Security OTP</span>
                                  <span className="text-lg font-black text-indigo-600 tracking-widest">{trip.details?.otp}</span>
                               </div>
                               <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-gray-500">Registration</span>
                                  <span className="text-sm font-black text-gray-900">{trip.details?.plate}</span>
                               </div>
                            </div>
                            <button 
                              onClick={() => handleTrackLive(trip.id)}
                              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                            >
                               <Navigation size={18} /> {content.track}
                            </button>
                         </div>

                         <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Safety & SOS</h5>
                            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center gap-3 font-bold text-xs border border-emerald-100">
                               <ShieldCheck size={20} className="text-emerald-600" /> {content.insurance}
                            </div>
                            <button 
                              onClick={() => setShowSOSOptions(true)}
                              className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                            >
                               <Siren size={18} /> {content.sos}
                            </button>
                         </div>

                         <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Driver & Management</h5>
                            <div className="p-4 border border-gray-100 rounded-2xl flex items-center gap-4">
                               <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400"><User size={24}/></div>
                               <div>
                                  <p className="font-bold text-gray-900 text-sm">{trip.driverName}</p>
                                  <p className="text-[10px] font-black text-indigo-500">★ {trip.rating || 4.9} RATING</p>
                               </div>
                            </div>
                            {canCancel && (
                              <button 
                                onClick={() => handleCancelAction(trip.id)}
                                className="w-full py-4 bg-white border border-red-100 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
                              >
                                 <XCircle size={18} /> {content.cancel}
                              </button>
                            )}
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Tracking Modal Simulation */}
      <AnimatePresence>
        {trackingId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setTrackingId(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl">
              <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 relative">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
                <div className="absolute inset-0 border-4 border-indigo-200 rounded-[2.5rem] animate-ping opacity-20"></div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">{content.trackingTitle}</h3>
              <p className="text-gray-500 mb-6 text-sm font-medium">{content.trackingSub}</p>
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 text-left border border-gray-100">
                <MapPin className="text-red-500" />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Current Position</p>
                  <p className="text-sm font-bold text-gray-900">Gorakhpur Bypass (12km from base)</p>
                </div>
              </div>
              <button onClick={() => setTrackingId(null)} className="mt-8 w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Close Map</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SOS Modal */}
      <AnimatePresence>
        {showSOSOptions && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-red-900/40 backdrop-blur-xl" onClick={() => setShowSOSOptions(false)} />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Siren size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Emergency Support</h3>
                <p className="text-gray-500 text-sm font-medium">Select an emergency service for immediate response.</p>
              </div>
              <div className="space-y-4">
                <button onClick={() => handleSOS('police')} className="w-full p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4 group hover:bg-blue-600 hover:text-white transition-all">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center group-hover:bg-white group-hover:text-blue-600"><ShieldCheck /></div>
                  <span className="font-black text-sm uppercase tracking-widest">{content.sosOptions.police}</span>
                </button>
                <button onClick={() => handleSOS('ambulance')} className="w-full p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 group hover:bg-red-600 hover:text-white transition-all">
                  <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center group-hover:bg-white group-hover:text-red-600"><Siren /></div>
                  <span className="font-black text-sm uppercase tracking-widest">{content.sosOptions.ambulance}</span>
                </button>
                <button onClick={() => handleSOS('support')} className="w-full p-6 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-4 group hover:bg-gray-900 hover:text-white transition-all">
                  <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center group-hover:bg-white group-hover:text-gray-900"><PhoneCall /></div>
                  <span className="font-black text-sm uppercase tracking-widest">{content.sosOptions.support}</span>
                </button>
              </div>
              <button onClick={() => setShowSOSOptions(false)} className="mt-8 w-full py-4 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-600">Dismiss</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancellation Modal */}
      <AnimatePresence>
        {cancelModalId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setCancelModalId(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <XCircle size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900">{content.cancelConfirm}</h3>
                <p className="text-gray-500 text-sm font-medium mt-2">{content.cancelSub}</p>
              </div>
              
              <div className="space-y-3">
                {cancellationReasons.map((reason, idx) => {
                  const reasonLabel = language === 'hi' ? reason.hi : reason.en;
                  const isSelected = selectedReason === reasonLabel;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedReason(reasonLabel)}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${
                        isSelected ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-gray-50 bg-gray-50 hover:border-indigo-200'
                      }`}
                    >
                      <span className={`text-sm font-bold ${isSelected ? 'text-indigo-600' : 'text-gray-600'}`}>
                        {reasonLabel}
                      </span>
                      {isSelected && <CheckCircle2 size={18} className="text-indigo-600" />}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button onClick={() => setCancelModalId(null)} className="py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                  Dismiss
                </button>
                <button 
                  onClick={confirmCancellation}
                  disabled={!selectedReason}
                  className="py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {content.cancelBtn}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};