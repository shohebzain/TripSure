
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MatchingEngine } from './components/MatchingEngine';
import { DriverOnboarding } from './components/DriverOnboarding';
import { MyTrips } from './components/MyTrips';
import { SupportChat } from './components/SupportChat';
import { Dashboard } from './components/Dashboard';
import { Auth } from './components/Auth';
import { DriverProfile } from './components/DriverProfile';
import { PostTrip } from './components/PostTrip';
import { NotificationPanel } from './components/NotificationPanel';
import { Settings as SettingsComponent } from './components/Settings';
import { 
  Shield, MapPin, Phone, IndianRupee, Globe, Search, 
  CheckCircle, Zap, MessageCircle, ArrowRight, Truck, Users, 
  ShieldCheck, Navigation, Settings, Mail, Package,
  Route, Eye, Fingerprint, CalendarCheck, TrendingDown,
  ChevronRight, Award, History
} from 'lucide-react';
import { VARIANTS, TRANSITIONS } from './constants/animations';
import { User, UserRole, Driver, Vehicle, IntercityTrip, Notification } from './types';

const Footer = ({ language }: { language: 'en' | 'hi' }) => {
  const content = {
    en: {
      tagline: 'Optimizing intercity transportation for a billion people. Made for India, from India.',
      features: 'Features',
      support: 'Support',
      connect: 'Connect',
      rights: '© 2024 TripSure Logistics Pvt Ltd.',
      featureItems: ['AI Matching Engine', 'Instant KYC Verification', 'Dual-Utility Logistics', 'Rural-to-Urban Focus'],
      supportItems: ['Help Center', 'Safety & Insurance', 'Driver Community', 'Business Inquiries']
    },
    hi: {
      tagline: 'एक अरब लोगों के लिए अंतर-शहर परिवहन का अनुकूलन। भारत के लिए, भारत से बना।',
      features: 'विशेषताएं',
      support: 'सहायता',
      connect: 'संपर्क करें',
      rights: '© 2024 ट्रिपश्योर लॉजिस्टिक्स प्राइवेट लिमिटेड।',
      featureItems: ['AI मैचिंग इंजन', 'त्वरित KYC सत्यापन', 'दोहरी-उपयोगिता लॉजिस्टिक्स', 'ग्रामीण-से-शहरी फोकस'],
      supportItems: ['सहायता केंद्र', 'सुरक्षा और बीमा', 'ड्राइवर समुदाय', 'व्यावसायिक पूछताछ']
    }
  }[language];

  const whatsappLink = `https://wa.me/919347117635`;

  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-8 h-8 ai-gradient rounded-lg flex items-center justify-center font-bold mr-2">T</div>
            <span className="text-xl font-bold">TripSure</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">{content.tagline}</p>
          <div className="space-y-3 pt-2">
            <a href="mailto:support@tripsure.in" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors group">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center mr-3"><Mail size={14} /></div>
              support@tripsure.in
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6">{content.features}</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            {content.featureItems.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">{content.support}</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            {content.supportItems.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">{content.connect}</h4>
          <div className="flex space-x-4 mb-6">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg"><MessageCircle size={20}/></a>
            <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"><Globe size={20}/></button>
          </div>
          <div className="text-xs text-gray-500">{content.rights}</div>
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [driverTrips, setDriverTrips] = useState<IntercityTrip[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [highlightedTripId, setHighlightedTripId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('tripsure_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    const savedNotifs = localStorage.getItem('tripsure_notifications');
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    const savedUserTrips = localStorage.getItem('tripsure_user_trips');
    if (savedUserTrips) setUserTrips(JSON.parse(savedUserTrips));
    const savedDriverTrips = localStorage.getItem('tripsure_driver_trips');
    if (savedDriverTrips) setDriverTrips(JSON.parse(savedDriverTrips));
  }, []);

  useEffect(() => { localStorage.setItem('tripsure_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('tripsure_user_trips', JSON.stringify(userTrips)); }, [userTrips]);
  useEffect(() => { localStorage.setItem('tripsure_driver_trips', JSON.stringify(driverTrips)); }, [driverTrips]);

  const addNotification = useCallback((title: string, message: string, type: Notification['type'] = 'info', actionTab?: string) => {
    const newNotif: Notification = {
      id: 'NOTIF-' + Date.now(), title, message, timestamp: 'Just Now', type, isRead: false, actionTab
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('tripsure_user', JSON.stringify(user));
    if (user.role === UserRole.DRIVER && user.kycStatus !== 'VERIFIED') {
      setActiveTab('kyc');
    } else {
      setActiveTab('dashboard');
    }
    addNotification(
      language === 'en' ? 'Welcome Back!' : 'वापसी पर स्वागत है!',
      language === 'en' ? `Namaste ${user.name}, identity verified.` : `नमस्ते ${user.name}, आपकी पहचान सत्यापित है।`,
      'success'
    );
  };

  const handleRegisterDriver = () => {
    if (!currentUser) {
      setActiveTab('auth');
    } else if (currentUser.role === UserRole.DRIVER) {
      setActiveTab('dashboard');
    } else {
      const updatedUser = { ...currentUser, role: UserRole.DRIVER, kycStatus: 'NONE' as any };
      setCurrentUser(updatedUser);
      localStorage.setItem('tripsure_user', JSON.stringify(updatedUser));
      setActiveTab('kyc');
      addNotification(
        language === 'en' ? 'Upgraded to Driver' : 'ड्राइवर में अपग्रेड किया गया',
        language === 'en' ? 'Please complete KYC to start accepting bookings.' : 'बुकिंग स्वीकार करना शुरू करने के लिए कृपया KYC पूरा करें।',
        'info'
      );
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tripsure_user');
    setActiveTab('home');
    setNotifications([]);
  };

  const handleBookingSuccess = (trip: any) => {
    const newTrip = {
      ...trip, status: 'Upcoming', date: 'Today, Just Now', isNew: true,
      details: {
        pickup: trip.source || 'Assigned Pickup', dropoff: trip.destination || 'Assigned Drop-off',
        otp: Math.floor(1000 + Math.random() * 9000).toString(),
        plate: trip.details?.plate || 'UP 32 TS 2024'
      }
    };
    setUserTrips([newTrip, ...userTrips]);
    setHighlightedTripId(newTrip.id);
    addNotification(
      language === 'en' ? 'Booking Confirmed!' : 'बुकिंग की पुष्टि!',
      language === 'en' ? `Your journey to ${trip.route} is secured.` : `${trip.route} के लिए आपकी यात्रा सुरक्षित है।`,
      'success', 'my-trips'
    );
  };

  const handleCancelTrip = (tripId: string, reason: string) => {
    setUserTrips(prev => prev.map(trip => 
      trip.id === tripId ? { ...trip, status: 'Cancelled' } : trip
    ));
    addNotification(
      language === 'en' ? 'Trip Cancelled' : 'यात्रा रद्द कर दी गई',
      language === 'en' ? `Trip ${tripId} has been cancelled successfully. Reason: ${reason}` : `ट्रिप ${tripId} सफलतापूर्वक रद्द कर दिया गया है। कारण: ${reason}`,
      'warning'
    );
  };

  const handlePostTrip = (trip: IntercityTrip) => {
    setDriverTrips([trip, ...driverTrips]);
    addNotification(language === 'en' ? 'Journey Live' : 'यात्रा लाइव', 'Your return trip is now active.', 'success', 'dashboard');
  };

  const handleDriverOnboardingComplete = (data: { kycData: any, vehicles?: Vehicle[], firstTrip?: IntercityTrip }) => {
    if (currentUser) {
      const updatedUser: Driver = { 
        ...currentUser as any, 
        role: UserRole.DRIVER, kycStatus: 'VERIFIED' as any,
        drivingLicense: data.kycData.dlNumber, vehicles: data.vehicles as Vehicle[],
        rating: 4.8, tripsCount: 0, bio: 'New TripSure Partner', joinedDate: new Date().toLocaleDateString(), verified: true
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('tripsure_user', JSON.stringify(updatedUser));
      addNotification(language === 'en' ? 'KYC Verified' : 'KYC सत्यापित', 'Welcome to the driver fleet!', 'success');
      if (data.firstTrip) handlePostTrip(data.firstTrip);
      setTimeout(() => setActiveTab('dashboard'), 2000);
    }
  };

  const homeContent = {
    en: {
      howItWorks: 'How It Works',
      howItWorksSub: 'Three simple steps to smarter intercity travel.',
      steps: [
        { title: 'Search & Select', desc: 'Enter your route. Our AI finds drivers returning to your destination.', icon: Search },
        { title: 'AI Match', desc: 'Drivers list their empty return legs. You get matched instantly with optimal pricing.', icon: Zap },
        { title: 'Secure Transit', desc: 'Pay via UPI, track live with GPS, and travel with ₹5 Lakh insurance.', icon: ShieldCheck }
      ],
      safetyTitle: 'India\'s Safest Intercity Network',
      safetyPoints: [
        { title: 'Aadhaar Verified', desc: 'Every driver and vehicle undergoes multi-point KYC.' },
        { title: 'Insurance Covered', desc: 'Automatic coverage for every passenger and cargo shipment.' },
        { title: 'Real-time GPS', desc: 'Share your live location with family via TripSure Secure.' }
      ],
      routesTitle: 'Popular Corridors',
      routes: [
        { path: 'Lucknow → Delhi', price: '₹850', savings: '40% Lower' },
        { path: 'Gorakhpur → Varanasi', price: '₹350', savings: 'Return Leg Special' },
        { path: 'Agra → Meerut', price: '₹550', savings: 'Optimized Cargo' },
        { path: 'Kanpur → Prayagraj', price: '₹400', savings: 'Daily Connect' }
      ]
    },
    hi: {
      howItWorks: 'यह कैसे काम करता है',
      howItWorksSub: 'स्मार्ट अंतर-शहर यात्रा के लिए तीन आसान चरण।',
      steps: [
        { title: 'खोजें और चुनें', desc: 'अपना रूट दर्ज करें। हमारा AI आपके गंतव्य पर लौटने वाले ड्राइवरों को ढूंढता है।', icon: Search },
        { title: 'AI मिलान', desc: 'ड्राइवर अपनी खाली वापसी यात्राओं को सूचीबद्ध करते हैं। आपको तुरंत मिलान मिलता है।', icon: Zap },
        { title: 'सुरक्षित पारगमन', desc: 'UPI के माध्यम से भुगतान करें और ₹5 लाख के बीमा के साथ यात्रा करें।', icon: ShieldCheck }
      ],
      safetyTitle: 'भारत का सबसे सुरक्षित नेटवर्क',
      safetyPoints: [
        { title: 'आधार सत्यापित', desc: 'हर ड्राइवर और वाहन का मल्टी-पॉइंट KYC होता है।' },
        { title: 'बीमा कवर', desc: 'हर यात्री और कार्गो शिपमेंट के लिए स्वचालित कवरेज।' },
        { title: 'रियल-टाइम GPS', desc: 'ट्रिपश्योर सिक्योर के माध्यम से परिवार के साथ लाइव लोकेशन साझा करें।' }
      ],
      routesTitle: 'लोकप्रिय मार्ग',
      routes: [
        { path: 'लखनऊ → दिल्ली', price: '₹850', savings: '40% कम' },
        { path: 'गोरखपुर → वाराणसी', price: '₹350', savings: 'रिटर्न लेग स्पेशल' },
        { path: 'आगरा → मेरठ', price: '₹550', savings: 'ऑप्टिमाइज्ड कार्गो' },
        { path: 'कानपुर → प्रयागराज', price: '₹400', savings: 'डेली कनेक्ट' }
      ]
    }
  }[language];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} language={language} setLanguage={setLanguage} user={currentUser} onLogout={handleLogout} notifications={notifications} onOpenNotifications={() => setIsNotifPanelOpen(true)} />
      <NotificationPanel isOpen={isNotifPanelOpen} onClose={() => setIsNotifPanelOpen(false)} notifications={notifications} onMarkAsRead={(id) => setNotifications(n => n.map(notif => notif.id === id ? { ...notif, isRead: true } : notif))} onClearAll={() => setNotifications([])} onAction={setActiveTab} language={language} />

      <main className="flex-grow pt-16">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" {...VARIANTS.pageTransition}>
              <Hero onExplore={() => setActiveTab('matching')} onRegisterDriver={handleRegisterDriver} />
              
              {/* The Advantage Section (Refined) */}
              <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                  <h2 className="text-4xl font-black mb-16 tracking-tight">The TripSure Advantage</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                      { icon: Truck, title: 'Optimized Fleet', desc: 'India\'s largest network of return-trip drivers.', color: 'bg-indigo-100 text-indigo-600' },
                      { icon: Package, title: 'Dual Utility', desc: 'Book space for cargo and seats in one trip.', color: 'bg-purple-100 text-purple-600' },
                      { icon: ShieldCheck, title: 'Business Ready', desc: 'Full GST invoicing for Cargo Owners.', color: 'bg-pink-100 text-pink-600' }
                    ].map((item, idx) => (
                      <motion.div key={idx} whileHover={{y: -10}} className="p-10 rounded-[3rem] bg-gray-50 border border-gray-100 shadow-sm transition-all group">
                        <div className={`w-20 h-20 ${item.color} rounded-[2rem] flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform`}><item.icon size={40} /></div>
                        <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed font-medium">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* How It Works Section */}
              <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-black mb-4">{homeContent.howItWorks}</h2>
                    <p className="text-gray-500 font-medium text-lg">{homeContent.howItWorksSub}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>
                    {homeContent.steps.map((step, idx) => (
                      <motion.div key={idx} className="relative z-10 text-center space-y-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="w-16 h-16 bg-white border-4 border-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl text-indigo-600">
                           <step.icon size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">{step.title}</h3>
                        <p className="text-gray-500 font-medium leading-relaxed px-4">{step.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Safety & Trust Section */}
              <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-8 leading-tight">
                      {homeContent.safetyTitle}
                    </h2>
                    <div className="space-y-8">
                      {homeContent.safetyPoints.map((point, i) => (
                        <div key={i} className="flex gap-6">
                          <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <CheckCircle size={24} />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-1">{point.title}</h4>
                            <p className="text-gray-500 font-medium">{point.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setActiveTab('matching')} className="mt-12 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 shadow-xl">
                      Learn About TripSure Secure <ArrowRight size={18} />
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 ai-gradient opacity-10 blur-3xl rounded-full"></div>
                    <div className="relative bg-white border border-gray-100 rounded-[3rem] p-10 shadow-2xl">
                       <div className="flex items-center justify-between mb-8">
                          <h4 className="text-xl font-black">Digital Trust Profile</h4>
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                       </div>
                       <div className="space-y-6">
                          <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: '95%' }} transition={{ duration: 1.5 }} className="h-full ai-gradient"></motion.div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                               <Fingerprint className="text-indigo-600 mb-2" />
                               <p className="text-[10px] font-black uppercase text-gray-400">KYC Status</p>
                               <p className="font-bold">Verified</p>
                             </div>
                             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                               <Shield className="text-emerald-600 mb-2" />
                               <p className="text-[10px] font-black uppercase text-gray-400">Insurance</p>
                               <p className="font-bold">₹5L Active</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Popular Routes Section */}
              <section className="py-24 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex justify-between items-end mb-16">
                    <div>
                      <h2 className="text-4xl font-black mb-4">{homeContent.routesTitle}</h2>
                      <p className="text-gray-400 font-medium">Real-time matching across 400+ Indian corridors.</p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-widest hover:text-indigo-300">
                      View All Routes <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {homeContent.routes.map((route, i) => (
                      <motion.div key={i} whileHover={{ y: -5 }} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-2 text-indigo-400 mb-4">
                          <Route size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">AI Route</span>
                        </div>
                        <h4 className="text-xl font-bold mb-1">{route.path}</h4>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-black">{route.price}</span>
                          <span className="text-xs text-emerald-400 font-bold">{route.savings}</span>
                        </div>
                        <button onClick={() => setActiveTab('matching')} className="w-full py-3 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white text-gray-900 transition-all">
                          Book This Route
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Final CTA Section */}
              <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                   <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest mb-8">
                     Ready to join?
                   </div>
                   <h2 className="text-5xl font-black text-gray-900 mb-8 leading-tight">
                      Join India's Smartest Intercity Logistics Network.
                   </h2>
                   <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <button onClick={() => setActiveTab('auth')} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 group">
                        Sign Up Now <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button onClick={handleRegisterDriver} className="px-12 py-5 bg-white text-gray-900 border border-gray-200 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
                        <Truck size={24} /> Become a Driver
                      </button>
                   </div>
                   <p className="mt-12 text-gray-400 font-medium">Over 45,000 drivers and 1.2M kilometers optimized this month.</p>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'auth' && <motion.div key="auth" {...VARIANTS.pageTransition}><Auth onLogin={handleLogin} language={language} /></motion.div>}
          {activeTab === 'matching' && <motion.div key="matching" {...VARIANTS.pageTransition}><MatchingEngine setActiveTab={setActiveTab} onBookingSuccess={handleBookingSuccess} /></motion.div>}
          {activeTab === 'kyc' && <motion.div key="kyc" {...VARIANTS.pageTransition}><DriverOnboarding onComplete={handleDriverOnboardingComplete} language={language} userRole={currentUser?.role} /></motion.div>}
          {activeTab === 'my-trips' && (
            <motion.div key="my-trips" {...VARIANTS.pageTransition}>
              <MyTrips 
                language={language} 
                additionalTrips={userTrips} 
                onCancelTrip={handleCancelTrip}
                highlightedTripId={highlightedTripId} 
                clearHighlight={() => setHighlightedTripId(null)} 
              />
            </motion.div>
          )}
          {activeTab === 'dashboard' && currentUser && <motion.div key="dashboard" {...VARIANTS.pageTransition}><Dashboard language={language} userTrips={userTrips} driverTrips={driverTrips} user={currentUser} onLogOut={handleLogout} onPostTrip={handlePostTrip} setActiveTab={setActiveTab} /></motion.div>}
          {activeTab === 'settings' && currentUser && <motion.div key="settings" {...VARIANTS.pageTransition}><SettingsComponent user={currentUser} onUpdate={(u) => { setCurrentUser(u); localStorage.setItem('tripsure_user', JSON.stringify(u)); }} onBack={() => setActiveTab('dashboard')} language={language} onLogout={handleLogout} setActiveTab={setActiveTab} /></motion.div>}
        </AnimatePresence>
      </main>

      <Footer language={language} />
      <SupportChat language={language} />
    </div>
  );
};

export default App;
