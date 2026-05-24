
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, 
  Car, Users, Loader2, AlertCircle, Package, Truck, 
  CheckCircle, ArrowLeft, Building2, Phone
} from 'lucide-react';
import { VARIANTS } from '../constants/animations';
import { UserRole, User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  language: 'en' | 'hi';
}

type AuthStage = 'ROLE_SELECTION' | 'CREDENTIALS';

export const Auth: React.FC<AuthProps> = ({ onLogin, language }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [stage, setStage] = useState<AuthStage>(isLogin ? 'CREDENTIALS' : 'ROLE_SELECTION');
  const [role, setRole] = useState<UserRole>(UserRole.PASSENGER);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    companyName: ''
  });

  const content = {
    en: {
      login: 'Welcome Back', signup: 'Create Your Account',
      loginSub: 'Secure access to your logistics hub.',
      signupSub: 'Choose your identity to get started.',
      roles: {
        passenger: { title: 'Passenger', desc: 'I want to travel intercity.' },
        driver: { title: 'Driver Partner', desc: 'I want to earn by driving.' },
        cargo: { title: 'Cargo Owner', desc: 'I want to ship products.' }
      },
      submitLogin: 'Sign In', submitSignup: 'Create Account',
      toggleSignup: 'Don\'t have an account? Sign Up',
      toggleLogin: 'Already have an account? Sign In',
      back: 'Back to roles',
      validation: {
        email: 'Please enter a valid email address.',
        password: 'Password must be at least 6 characters.',
        name: 'Full name is required.',
        phone: 'Valid 10-digit mobile number required.'
      }
    },
    hi: {
      login: 'वापसी पर स्वागत है', signup: 'अपना अकाउंट बनाएं',
      loginSub: 'अपने लॉजिस्टिक्स हब तक सुरक्षित पहुँच।',
      signupSub: 'शुरू करने के लिए अपनी पहचान चुनें।',
      roles: {
        passenger: { title: 'यात्री', desc: 'मैं अंतर-शहर यात्रा करना चाहता हूँ।' },
        driver: { title: 'ड्राइवर पार्टनर', desc: 'मैं ड्राइविंग करके कमाना चाहता हूँ।' },
        cargo: { title: 'कार्गो मालिक', desc: 'मैं उत्पाद भेजना चाहता हूँ।' }
      },
      submitLogin: 'साइन इन करें', submitSignup: 'अकाउंट बनाएं',
      toggleSignup: 'अकाउंट नहीं है? साइन अप करें',
      toggleLogin: 'पहले से अकाउंट है? साइन इन करें',
      back: 'भूमिकाओं पर वापस',
      validation: {
        email: 'कृपया एक वैध ईमेल पता दर्ज करें।',
        password: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
        name: 'पूरा नाम आवश्यक है।',
        phone: 'वैध 10-अंकीय मोबाइल नंबर आवश्यक है।'
      }
    }
  }[language];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = content.validation.email;
    if (formData.password.length < 6) newErrors.password = content.validation.password;
    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = content.validation.name;
      if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = content.validation.phone;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setTimeout(() => {
      const mockUser: User = {
        id: 'USR-' + Math.floor(Math.random() * 10000),
        name: formData.name || (formData.email.split('@')[0]),
        email: formData.email,
        role: isLogin ? UserRole.PASSENGER : role, // In real app, role comes from DB on login
        phone: formData.phone || '+91 90000 00000',
        kycStatus: 'NONE',
        companyName: role === UserRole.CARGO_OWNER ? formData.companyName : undefined
      };
      onLogin(mockUser);
      setLoading(false);
    }, 1500);
  };

  const roleOptions = [
    { id: UserRole.PASSENGER, icon: Users, ...content.roles.passenger, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: UserRole.DRIVER, icon: Truck, ...content.roles.driver, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: UserRole.CARGO_OWNER, icon: Package, ...content.roles.cargo, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-gray-50/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden"
      >
        <div className="p-8 md:p-14">
          <div className="text-center mb-10">
            <div className="w-16 h-16 ai-gradient rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-xl shadow-indigo-100">T</div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">{isLogin ? content.login : content.signup}</h2>
            <p className="text-gray-500 font-medium">{isLogin ? content.loginSub : content.signupSub}</p>
          </div>

          <AnimatePresence mode="wait">
            {stage === 'ROLE_SELECTION' ? (
              <motion.div 
                key="roles"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {roleOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setRole(opt.id); setStage('CREDENTIALS'); }}
                    className="w-full p-6 rounded-3xl border-2 border-gray-50 bg-white hover:border-indigo-600 hover:shadow-xl transition-all flex items-center gap-6 group text-left"
                  >
                    <div className={`w-14 h-14 ${opt.bg} ${opt.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <opt.icon size={28} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-lg">{opt.title}</h4>
                      <p className="text-sm text-gray-500 font-medium">{opt.desc}</p>
                    </div>
                    <ArrowRight className="ml-auto text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
                <div className="mt-8 text-center">
                  <button 
                    onClick={() => { setIsLogin(true); setStage('CREDENTIALS'); }}
                    className="text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline"
                  >
                    {content.toggleLogin}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit} 
                className="space-y-4"
              >
                {!isLogin && (
                  <button 
                    type="button"
                    onClick={() => setStage('ROLE_SELECTION')}
                    className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-6 hover:gap-3 transition-all"
                  >
                    <ArrowLeft size={14} /> {content.back}
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!isLogin && (
                    <div className="md:col-span-2 space-y-2">
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="text" placeholder="Full Name" 
                          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                          className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl outline-none transition-all ${errors.name ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-100 focus:ring-2 focus:ring-indigo-600'}`} 
                        />
                      </div>
                      {errors.name && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">{errors.name}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="email" placeholder="Email Address" 
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl outline-none transition-all ${errors.email ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-100 focus:ring-2 focus:ring-indigo-600'}`} 
                      />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="password" placeholder="Password" 
                        value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl outline-none transition-all ${errors.password ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-100 focus:ring-2 focus:ring-indigo-600'}`} 
                      />
                    </div>
                    {errors.password && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">{errors.password}</p>}
                  </div>

                  {!isLogin && (
                    <div className="md:col-span-2 space-y-2">
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="tel" placeholder="Mobile Number" 
                          maxLength={10}
                          value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} 
                          className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl outline-none transition-all ${errors.phone ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-100 focus:ring-2 focus:ring-indigo-600'}`} 
                        />
                      </div>
                      {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">{errors.phone}</p>}
                    </div>
                  )}

                  {!isLogin && role === UserRole.CARGO_OWNER && (
                    <div className="md:col-span-2 relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" placeholder="Company Name (Optional)" 
                        value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} 
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600" 
                      />
                    </div>
                  )}
                </div>

                <button 
                  disabled={loading} 
                  className="w-full py-5 bg-indigo-600 text-white rounded-[1.8rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50 mt-6 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>{isLogin ? content.submitLogin : content.submitSignup} <ArrowRight size={20} /></>
                  )}
                </button>

                <div className="mt-8 text-center">
                  <button 
                    type="button"
                    onClick={() => { setIsLogin(!isLogin); setStage(isLogin ? 'ROLE_SELECTION' : 'CREDENTIALS'); setErrors({}); }} 
                    className="text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline"
                  >
                    {isLogin ? content.toggleSignup : content.toggleLogin}
                  </button>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-center gap-4 text-gray-400">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Secure 256-bit Identity Protection</span>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
