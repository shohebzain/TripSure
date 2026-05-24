
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Clock, Truck, Users, Box, Plus, 
  Trash2, Info, ArrowRight, CheckCircle2, ChevronRight,
  Zap, Navigation, ShieldCheck, IndianRupee, ArrowLeft,
  CalendarCheck, MoveRight, X, Car
} from 'lucide-react';
import { VARIANTS } from '../constants/animations';
import { Driver, Vehicle, IntercityTrip } from '../types';

interface PostTripProps {
  driver: Driver;
  onPost: (trip: IntercityTrip) => void;
  onCancel: () => void;
  language: 'en' | 'hi';
}

const WIZARD_STEPS = [
  { id: 1, label: 'Route', icon: MapPin },
  { id: 2, label: 'Timing', icon: Clock },
  { id: 3, label: 'Vehicle & Utility', icon: Zap },
  { id: 4, label: 'Finish', icon: CheckCircle2 },
];

export const PostTrip: React.FC<PostTripProps> = ({ driver, onPost, onCancel, language }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    date: '',
    timeWindow: '',
    vehicleId: driver.vehicles?.[0]?.id || 'v1',
    utilityType: 'DUAL' as 'PASSENGER' | 'CARGO' | 'DUAL',
    seats: 4,
    weightKg: 200,
    flexibleRoute: true,
    stops: [] as string[],
    newStop: ''
  });

  const content = {
    en: {
      stepTitles: ['Where are you going?', 'When is the journey?', 'Vehicle & Utility', 'Almost done!'],
      stepSubs: [
        'Select your source and destination for the return leg.',
        'Choose a date and your preferred departure window.',
        'Choose your vehicle and how you want to fill your vehicle space.',
        'Add stops and final preferences for better matches.'
      ],
      source: 'Starting From',
      dest: 'Heading To',
      date: 'Departure Date',
      time: 'Departure Window',
      utility: 'Trip Utility',
      passenger: 'Seats',
      cargo: 'Cargo',
      dual: 'Dual (Seats + Cargo)',
      seats: 'Available Seats',
      weight: 'Cargo Capacity (kg)',
      flexible: 'Flexible AI Routing',
      flexibleSub: 'Enables matching with passengers slightly off-route.',
      stops: 'Waypoints / Preferred Stops',
      addStop: 'Add stop',
      submit: 'Confirm & Post Trip',
      next: 'Continue',
      back: 'Go Back',
      selectVehicle: 'Choose Vehicle'
    },
    hi: {
      stepTitles: ['आप कहाँ जा रहे हैं?', 'यात्रा कब है?', 'वाहन और उपयोगिता', 'बस हो गया!'],
      stepSubs: [
        'अपनी वापसी यात्रा के लिए प्रस्थान और गंतव्य चुनें।',
        'तारीख और अपना पसंदीदा प्रस्थान समय चुनें।',
        'वाहन चुनें और चुनें कि आप अपने वाहन की जगह कैसे भरना चाहते हैं।',
        'बेहतर मिलान के लिए स्टॉप और अंतिम प्राथमिकताएं जोड़ें।'
      ],
      source: 'कहाँ से',
      dest: 'कहाँ तक',
      date: 'प्रस्थान तिथि',
      time: 'प्रस्थान का समय',
      utility: 'यात्रा उपयोगिता',
      passenger: 'सीटें',
      cargo: 'कार्गो',
      dual: 'दोनों (सीटें + कार्गो)',
      seats: 'उपलब्ध सीटें',
      weight: 'कार्गो क्षमता (kg)',
      flexible: 'लचीला AI रूटिंग',
      flexibleSub: 'थोड़े ऑफ-रूट यात्रियों के साथ मिलान सक्षम करता है।',
      stops: 'रास्ते के स्टॉप',
      addStop: 'स्टॉप जोड़ें',
      submit: 'पुष्टि करें और पोस्ट करें',
      next: 'आगे बढ़ें',
      back: 'पीछे जाएँ',
      selectVehicle: 'वाहन चुनें'
    }
  }[language];

  const handleAddStop = () => {
    if (formData.newStop.trim()) {
      setFormData({
        ...formData,
        stops: [...formData.stops, formData.newStop.trim()],
        newStop: ''
      });
    }
  };

  const removeStop = (index: number) => {
    setFormData({
      ...formData,
      stops: formData.stops.filter((_, i) => i !== index)
    });
  };

  const handleFinalSubmit = () => {
    const trip: IntercityTrip = {
      id: 'TRP-' + Math.floor(Math.random() * 10000),
      driverId: driver.id,
      source: formData.source,
      destination: formData.destination,
      date: formData.date,
      timeWindow: formData.timeWindow,
      vehicleId: formData.vehicleId,
      utilityType: formData.utilityType,
      capacity: {
        seats: formData.utilityType !== 'CARGO' ? formData.seats : 0,
        weightKg: formData.utilityType !== 'PASSENGER' ? formData.weightKg : 0
      },
      stops: formData.stops,
      flexibleRoute: formData.flexibleRoute,
      status: 'ACTIVE',
      price: Math.floor(Math.random() * 2000) + 1000
    };
    onPost(trip);
  };

  const isStepValid = () => {
    if (step === 1) return formData.source && formData.destination;
    if (step === 2) return formData.date && formData.timeWindow;
    if (step === 3) return !!formData.vehicleId;
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      {/* Wizard Progress Bar */}
      <div className="flex justify-between items-center mb-12 relative px-2">
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-100 -translate-y-1/2 -z-10"></div>
        <div 
          className="absolute top-1/2 left-4 h-0.5 ai-gradient -translate-y-1/2 -z-10 transition-all duration-500"
          style={{ width: `${((step - 1) / (WIZARD_STEPS.length - 1)) * 95}%` }}
        ></div>
        {WIZARD_STEPS.map((s) => (
          <div key={s.id} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
              step >= s.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-gray-100 text-gray-300'
            }`}>
              <s.icon size={18} />
            </div>
          </div>
        ))}
      </div>

      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-900 mb-2">{content.stepTitles[step - 1]}</h2>
        <p className="text-gray-500">{content.stepSubs[step - 1]}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[300px]"
        >
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{content.source}</label>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-indigo-600" size={20} />
                    <input 
                      type="text" 
                      placeholder="e.g. Gorakhpur"
                      value={formData.source}
                      onChange={e => setFormData({...formData, source: e.target.value})}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-bold outline-none"
                    />
                  </div>
                </div>
                <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{content.dest}</label>
                  <div className="flex items-center gap-3">
                    <Navigation className="text-purple-600" size={20} />
                    <input 
                      type="text" 
                      placeholder="e.g. Lucknow"
                      value={formData.destination}
                      onChange={e => setFormData({...formData, destination: e.target.value})}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-bold outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <Zap size={20} />
                </div>
                <p className="text-sm font-medium text-indigo-700">AI optimizes for return trips on this specific corridor to ensure 40% higher earnings.</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{content.date}</label>
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="text-indigo-600" size={20} />
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-bold outline-none"
                    />
                  </div>
                </div>
                <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{content.time}</label>
                  <select 
                    value={formData.timeWindow}
                    onChange={e => setFormData({...formData, timeWindow: e.target.value})}
                    className="w-full bg-transparent border-none focus:ring-0 text-lg font-bold outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Window</option>
                    <option value="Early (4-8 AM)">Early (4-8 AM)</option>
                    <option value="Morning (8-12 PM)">Morning (8-12 PM)</option>
                    <option value="Afternoon (12-4 PM)">Afternoon (12-4 PM)</option>
                    <option value="Evening (4-8 PM)">Evening (4-8 PM)</option>
                  </select>
                </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              {/* Vehicle Selection - Dynamic if driver has vehicles */}
              {driver.vehicles && driver.vehicles.length > 0 && (
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{content.selectVehicle}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {driver.vehicles.map(v => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setFormData({...formData, vehicleId: v.id})}
                        className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                          formData.vehicleId === v.id 
                          ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                          : 'border-gray-50 bg-white text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          formData.vehicleId === v.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {v.type === 'TRUCK' ? <Truck size={20} /> : <Car size={20} />}
                        </div>
                        <div>
                          <div className={`text-sm font-black ${formData.vehicleId === v.id ? 'text-gray-900' : 'text-gray-500'}`}>{v.model}</div>
                          <div className="text-[10px] font-bold uppercase opacity-60 tracking-widest">{v.plate}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'PASSENGER', icon: Users, label: content.passenger },
                  { id: 'CARGO', icon: Box, label: content.cargo },
                  { id: 'DUAL', icon: Zap, label: content.dual }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setFormData({...formData, utilityType: opt.id as any})}
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                      formData.utilityType === opt.id 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md' 
                      : 'border-gray-50 bg-gray-50 text-gray-400'
                    }`}
                  >
                    <opt.icon size={24} />
                    <span className="text-[10px] font-black uppercase tracking-wider">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(formData.utilityType === 'PASSENGER' || formData.utilityType === 'DUAL') && (
                  <div className="p-6 bg-white border border-gray-100 rounded-3xl">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-4">{content.seats}</label>
                    <div className="flex items-center gap-6">
                      <input 
                        type="range" min="1" max="10" 
                        value={formData.seats}
                        onChange={e => setFormData({...formData, seats: parseInt(e.target.value)})}
                        className="flex-1 h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                      />
                      <span className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black">{formData.seats}</span>
                    </div>
                  </div>
                )}
                {(formData.utilityType === 'CARGO' || formData.utilityType === 'DUAL') && (
                  <div className="p-6 bg-white border border-gray-100 rounded-3xl">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-4">{content.weight}</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="number" 
                        value={formData.weightKg}
                        onChange={e => setFormData({...formData, weightKg: parseInt(e.target.value)})}
                        className="flex-1 text-2xl font-black outline-none bg-transparent"
                      />
                      <span className="text-gray-400 font-bold">KG</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
               <div 
                  onClick={() => setFormData({...formData, flexibleRoute: !formData.flexibleRoute})}
                  className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center gap-6 ${
                    formData.flexibleRoute ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${formData.flexibleRoute ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Zap size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{content.flexible}</div>
                    <div className="text-xs text-gray-500">{content.flexibleSub}</div>
                  </div>
                  {formData.flexibleRoute && <CheckCircle2 className="text-indigo-600" size={24} />}
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{content.stops}</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.stops.map((stop, i) => (
                      <div key={i} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                        {stop}
                        <button type="button" onClick={() => removeStop(i)} className="hover:text-red-300">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. Noida Sector 18"
                      value={formData.newStop}
                      onChange={e => setFormData({...formData, newStop: e.target.value})}
                      className="flex-1 p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600"
                      onKeyPress={e => e.key === 'Enter' && handleAddStop()}
                    />
                    <button 
                      type="button" 
                      onClick={handleAddStop}
                      className="p-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex gap-4 pt-8 border-t border-gray-50">
        {step > 1 ? (
          <button 
            onClick={() => setStep(step - 1)}
            className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> {content.back}
          </button>
        ) : (
          <button 
            onClick={onCancel}
            className="flex-1 py-4 bg-white border border-gray-200 text-gray-400 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        )}
        
        <button 
          onClick={step === 4 ? handleFinalSubmit : () => setStep(step + 1)}
          disabled={!isStepValid()}
          className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {step === 4 ? content.submit : content.next} 
          {step < 4 ? <ArrowRight size={18} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
    </div>
  );
};
