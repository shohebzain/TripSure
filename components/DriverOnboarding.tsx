
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, UserCheck, Truck, CheckCircle, Camera, Upload, 
  Loader2, CheckCircle2, Info, Navigation, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VARIANTS } from '../constants/animations';
import { Vehicle, ProfileStatus, Driver, IntercityTrip, UserRole, User } from '../types';
import { PostTrip } from './PostTrip';

const DRIVER_STEPS = [
  { id: 1, label: 'Personal KYC', icon: UserCheck, desc: 'Aadhaar & PAN' },
  { id: 2, label: 'Driving License', icon: ShieldCheck, desc: 'DL Verification' },
  { id: 3, label: 'Vehicle Details', icon: Truck, desc: 'RC & Fitness' },
  { id: 4, label: 'Post Journey', icon: Navigation, desc: 'First Trip' },
];

const PASSENGER_STEPS = [
  { id: 1, label: 'Identity KYC', icon: UserCheck, desc: 'Aadhaar & PAN' },
];

const VERIFICATION_SUBSTEPS = [
  "Validating Aadhaar with UIDAI biometrics...",
  "Scanning PAN database for financial integrity...",
  "Verifying identity with government records...",
  "Running background safety check...",
  "Generating your Digital ID..."
];

interface DriverOnboardingProps {
  onComplete?: (data: { kycData: any, vehicles?: Vehicle[], firstTrip?: IntercityTrip }) => void;
  language: 'en' | 'hi';
  userRole?: UserRole;
}

export const DriverOnboarding: React.FC<DriverOnboardingProps> = ({ onComplete, language, userRole = UserRole.DRIVER }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  
  const isPassenger = userRole === UserRole.PASSENGER;
  const activeSteps = isPassenger ? PASSENGER_STEPS : DRIVER_STEPS;

  // Form State
  const [kycData, setKycData] = useState({
    aadhaar: '',
    pan: '',
    dlNumber: ''
  });

  const [vehicles, setVehicles] = useState<Partial<Vehicle>[]>([
    { id: 'v1', model: '', plate: '', type: 'CAR', rcNumber: '', insuranceNumber: '', fitnessExpiry: '', isPrimary: true }
  ]);

  const [firstTrip, setFirstTrip] = useState<IntercityTrip | null>(null);

  const content = {
    en: {
      title: isPassenger ? 'Passenger Identity Verification' : 'Driver Partner Onboarding',
      subtitle: isPassenger ? 'Verify your identity to unlock premium trust badges and higher trip priority.' : 'Complete these steps to start your journey as a TripSure partner.',
      kycTitle: 'Identity Verification',
      kycSub: 'Secure Aadhaar and PAN verification.',
      dlTitle: 'Driving Credentials',
      dlSub: 'Valid Commercial or Private Driving License.',
      vTitle: 'Vehicle Fleet',
      vSub: 'Register one or more vehicles to your profile.',
      tripTitle: 'List Your Return Leg',
      tripSub: 'Create your first journey to start receiving matches immediately.',
      addVehicle: 'Add Another Vehicle',
      verifying: 'Verification in Progress',
      verifyingSub: 'Our AI is cross-referencing your documents with national databases.',
      complete: 'Identity Verified!',
      completeSub: isPassenger ? 'Your profile is now verified. You will receive higher priority in trip matching.' : 'Your first trip is now live! We will notify you once your documents are finalized.',
      primary: 'Primary Vehicle',
      skipTrip: 'I will post my trip later'
    },
    hi: {
      title: isPassenger ? 'यात्री पहचान सत्यापन' : 'ड्राइवर पार्टनर ऑनबोर्डिंग',
      subtitle: isPassenger ? 'प्रीमियम ट्रस्ट बैज और उच्च प्राथमिकता अनलॉक करने के लिए अपनी पहचान सत्यापित करें।' : 'ट्रिपश्योर पार्टनर के रूप में अपनी यात्रा शुरू करने के लिए इन चरणों को पूरा करें।',
      kycTitle: 'पहचान सत्यापन',
      kycSub: 'सुरक्षित आधार और पैन सत्यापन।',
      dlTitle: 'ड्राइविंग क्रेडेंशियल',
      dlSub: 'वैध वाणिज्यिक या निजी ड्राइविंग लाइसेंस।',
      vTitle: 'वाहन बेड़ा',
      vSub: 'अपने प्रोफाइल में एक या अधिक वाहन पंजीकृत करें।',
      tripTitle: 'वापसी यात्रा जोड़ें',
      tripSub: 'तुरंत मिलान प्राप्त करना शुरू करने के लिए अपनी पहली यात्रा बनाएं।',
      addVehicle: 'एक और वाहन जोड़ें',
      verifying: 'सत्यापन जारी है',
      verifyingSub: 'हमारा AI राष्ट्रीय डेटाबेस के साथ आपके दस्तावेजों का मिलान कर रहा है।',
      complete: 'पहचान सत्यापित!',
      completeSub: isPassenger ? 'आपकी प्रोफ़ाइल अब सत्यापित है। आपको ट्रिप मिलान में उच्च प्राथमिकता मिलेगी।' : 'आपकी पहली यात्रा अब लाइव है! दस्तावेज फाइनल होने पर हम सूचित करेंगे।',
      primary: 'मुख्य वाहन',
      skipTrip: 'मैं अपनी यात्रा बाद में पोस्ट करूँगा'
    }
  }[language];

  useEffect(() => {
    let interval: any;
    if (isVerifying) {
      interval = setInterval(() => {
        setVerificationProgress((prev) => {
          if (prev >= VERIFICATION_SUBSTEPS.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setIsVerifying(false);
              if (isPassenger) {
                 setIsCompleted(true);
                 if (onComplete) onComplete({ kycData });
              } else {
                 setCurrentStep(4);
              }
            }, 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isVerifying, isPassenger]);

  const updateVehicle = (id: string, field: keyof Vehicle, value: any) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const addVehicle = () => {
    setVehicles([...vehicles, { id: 'v' + (vehicles.length + 1), model: '', plate: '', type: 'CAR', isPrimary: false }]);
  };

  const removeVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const handleTripPost = (trip: IntercityTrip) => {
    setFirstTrip(trip);
    setIsCompleted(true);
    if (onComplete) onComplete({ kycData, vehicles: vehicles as Vehicle[], firstTrip: trip });
  };

  const handleSkipTrip = () => {
    setIsCompleted(true);
    if (onComplete) onComplete({ kycData, vehicles: vehicles as Vehicle[] });
  };

  const mockDriver: Driver = {
    id: 'NEW-DRIVER',
    name: 'New Partner',
    email: '',
    phone: '',
    role: UserRole.DRIVER,
    drivingLicense: kycData.dlNumber,
    vehicles: vehicles as Vehicle[],
    rating: 0,
    tripsCount: 0,
    bio: '',
    joinedDate: '',
    verified: false
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial="initial" animate="animate" variants={VARIANTS.staggerContainer} className="text-center mb-12">
        <motion.h2 variants={VARIANTS.fadeInUp} className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          {content.title}
        </motion.h2>
        <motion.p variants={VARIANTS.fadeInUp} className="text-gray-500 text-lg">
          {content.subtitle}
        </motion.p>
      </motion.div>

      {!isVerifying && !isCompleted && !isPassenger && (
        <div className="flex justify-between items-center mb-12 relative px-4">
          <div className="absolute top-7 left-10 right-10 h-0.5 bg-gray-100 -z-10"></div>
          {activeSteps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                currentStep === step.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100' : 
                currentStep > step.id ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-50' : 'bg-white text-gray-300 border-gray-100 shadow-sm'
              }`}>
                {currentStep > step.id ? <CheckCircle size={24} /> : <step.icon size={24} />}
              </div>
              <span className={`mt-4 text-[10px] font-black uppercase tracking-widest ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {isVerifying ? (
          <motion.div 
            key="verifying"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 text-center"
          >
            <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 relative">
              <Loader2 className="animate-spin text-indigo-600" size={48} />
              <div className="absolute inset-0 border-4 border-indigo-200 rounded-[2.5rem] animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-2">{content.verifying}</h3>
            <p className="text-gray-500 mb-10 max-w-md mx-auto">{content.verifyingSub}</p>
            
            <div className="space-y-4 max-w-md mx-auto text-left">
              {VERIFICATION_SUBSTEPS.map((step, idx) => (
                <div key={idx} className={`flex items-center space-x-4 transition-all duration-500 ${idx <= verificationProgress ? 'opacity-100' : 'opacity-20'}`}>
                  {idx < verificationProgress ? (
                    <CheckCircle2 className="text-emerald-500" size={18} />
                  ) : (
                    <div className={`w-4 h-4 rounded-full border-2 ${idx === verificationProgress ? 'border-indigo-600 border-t-transparent animate-spin' : 'border-gray-300'}`} />
                  )}
                  <span className={`text-sm ${idx === verificationProgress ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : isCompleted ? (
          <motion.div 
            key="completed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 text-center"
          >
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={56} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-2">{content.complete}</h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">{content.completeSub}</p>
            <div className="flex items-center justify-center gap-4">
              <div className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Status</div>
                <div className="text-indigo-600 font-bold">Verified</div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key={`step-${currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100"
          >
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{content.kycTitle}</h3>
                  <p className="text-gray-500">{content.kycSub}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Aadhaar Number</label>
                      <input 
                        type="text" 
                        placeholder="12 Digit Aadhaar"
                        value={kycData.aadhaar}
                        onChange={e => setKycData({...kycData, aadhaar: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">PAN Number</label>
                      <input 
                        type="text" 
                        placeholder="ABCDE1234F"
                        value={kycData.pan}
                        onChange={e => setKycData({...kycData, pan: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 uppercase"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <button className="flex-1 border-2 border-dashed border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-600 hover:text-indigo-600 transition-all">
                       <Upload size={32} className="mb-2" />
                       <span className="text-xs font-bold uppercase tracking-widest">Upload ID Photo</span>
                     </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && !isPassenger && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{content.dlTitle}</h3>
                  <p className="text-gray-500">{content.dlSub}</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">DL Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. DL-1234567890123"
                      value={kycData.dlNumber}
                      onChange={e => setKycData({...kycData, dlNumber: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button className="h-48 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-indigo-600 hover:text-indigo-600 transition-all">
                      <Camera size={32} className="mb-2" />
                      <span className="text-xs font-bold">Front Photo</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && !isPassenger && (
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">{content.vTitle}</h3>
                    <p className="text-gray-500">{content.vSub}</p>
                  </div>
                </div>
                <div className="space-y-10">
                  {vehicles.map((v, i) => (
                    <div key={v.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 relative group">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          placeholder="Registration No. (RC)"
                          value={v.plate}
                          onChange={e => updateVehicle(v.id!, 'plate', e.target.value.toUpperCase())}
                          className="w-full p-3 bg-white border border-gray-100 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && !isPassenger && (
              <div className="space-y-4">
                <PostTrip 
                  driver={mockDriver} 
                  onPost={handleTripPost} 
                  onCancel={handleSkipTrip} 
                  language={language} 
                />
              </div>
            )}

            {((currentStep < 4 && !isPassenger) || (currentStep === 1 && isPassenger)) && (
              <div className="mt-12 flex gap-4">
                <button 
                  onClick={() => {
                    if (isPassenger || (currentStep === 3 && !isPassenger)) setIsVerifying(true);
                    else setCurrentStep(prev => prev + 1);
                  }}
                  disabled={!kycData.aadhaar || !kycData.pan}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Verify & Continue <ChevronRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
