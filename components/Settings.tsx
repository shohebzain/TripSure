
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Lock, Bell, Globe, 
  ShieldCheck, ArrowLeft, Camera, ChevronRight, 
  CheckCircle2, Trash2, Save, LogOut, ShieldAlert
} from 'lucide-react';
import { VARIANTS } from '../constants/animations';
import { User as UserType, UserRole } from '../types';

interface SettingsProps {
  user: UserType;
  onUpdate: (updatedUser: UserType) => void;
  onBack: () => void;
  language: 'en' | 'hi';
  onLogout: () => void;
  setActiveTab: (tab: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  user, 
  onUpdate, 
  onBack, 
  language,
  onLogout,
  setActiveTab
}) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const content = {
    en: {
      title: 'Account Settings',
      subtitle: 'Manage your profile and security preferences.',
      sections: {
        profile: 'Profile Info',
        security: 'Security & KYC',
        preferences: 'Preferences'
      },
      profile: {
        title: 'Profile Information',
        desc: 'Update your personal details and how others see you.',
        nameLabel: 'Full Name',
        emailLabel: 'Email Address',
        phoneLabel: 'Phone Number',
        avatarLabel: 'Profile Photo',
        changeAvatar: 'Change Photo'
      },
      security: {
        title: 'Security & Verification',
        desc: 'Monitor your account security and identity status.',
        kycStatus: 'Identity Verification (KYC)',
        verified: 'Identity Verified',
        notVerified: 'Verification Required',
        verifyBtn: 'Complete KYC Now',
        passwordTitle: 'Change Password',
        passwordDesc: 'Set a strong password to protect your account.',
        changePassword: 'Update Password'
      },
      preferences: {
        title: 'System Preferences',
        desc: 'Tailor the TripSure experience to your needs.',
        langTitle: 'Preferred Language',
        notifTitle: 'Notifications',
        notifDesc: 'Get alerts for trip updates and security.'
      },
      save: 'Save Changes',
      saving: 'Saving...',
      saved: 'Changes Saved!',
      danger: 'Danger Zone',
      delete: 'Delete Account',
      logout: 'Sign Out'
    },
    hi: {
      title: 'अकाउंट सेटिंग्स',
      subtitle: 'अपनी प्रोफ़ाइल और सुरक्षा प्राथमिकताओं को प्रबंधित करें।',
      sections: {
        profile: 'प्रोफ़ाइल जानकारी',
        security: 'सुरक्षा और KYC',
        preferences: 'प्राथमिकताएं'
      },
      profile: {
        title: 'प्रोफ़ाइल जानकारी',
        desc: 'अपने व्यक्तिगत विवरण अपडेट करें।',
        nameLabel: 'पूरा नाम',
        emailLabel: 'ईमेल पता',
        phoneLabel: 'फ़ोन नंबर',
        avatarLabel: 'प्रोफ़ाइल फोटो',
        changeAvatar: 'फोटो बदलें'
      },
      security: {
        title: 'सुरक्षा और सत्यापन',
        desc: 'अपने खाते की सुरक्षा और पहचान की स्थिति की निगरानी करें।',
        kycStatus: 'पहचान सत्यापन (KYC)',
        verified: 'पहचान सत्यापित',
        notVerified: 'सत्यापन आवश्यक',
        verifyBtn: 'अभी KYC पूरा करें',
        passwordTitle: 'पासवर्ड बदलें',
        passwordDesc: 'अपने खाते की सुरक्षा के लिए एक मजबूत पासवर्ड सेट करें।',
        changePassword: 'पासवर्ड अपडेट करें'
      },
      preferences: {
        title: 'सिस्टम प्राथमिकताएं',
        desc: 'अपनी आवश्यकताओं के अनुसार TripSure अनुभव को अनुकूलित करें।',
        langTitle: 'पसंदीदा भाषा',
        notifTitle: 'सूचनाएं',
        notifDesc: 'ट्रिप अपडेट और सुरक्षा के लिए अलर्ट प्राप्त करें।'
      },
      save: 'परिवर्तन सहेजें',
      saving: 'सहेज रहा है...',
      saved: 'परिवर्तन सहेजे गए!',
      danger: 'खतरा क्षेत्र',
      delete: 'अकाउंट हटाएं',
      logout: 'लॉग आउट'
    }
  }[language];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate({
        ...user,
        ...formData
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center text-gray-400 hover:text-indigo-600 font-bold mb-4 transition-all group"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            {language === 'en' ? 'Back to Dashboard' : 'डैशबोर्ड पर वापस'}
          </button>
          <h1 className="text-4xl font-black text-gray-900 leading-tight">{content.title}</h1>
          <p className="text-gray-500 font-medium">{content.subtitle}</p>
        </div>
        <button 
          onClick={onLogout}
          className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2 border border-red-100"
        >
          <LogOut size={16} /> {content.logout}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'profile', icon: User, label: content.sections.profile },
            { id: 'security', icon: ShieldCheck, label: content.sections.security },
            { id: 'preferences', icon: Globe, label: content.sections.preferences },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold text-sm transition-all ${
                activeSection === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              {item.label}
              {activeSection === item.id && (
                <motion.div layoutId="active-pill" className="ml-auto">
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                {activeSection === 'profile' && (
                  <motion.div key="profile" variants={VARIANTS.fadeInUp} initial="initial" animate="animate" className="space-y-10">
                    <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-gray-50">
                      <div className="relative group">
                        <div className="w-24 h-24 bg-gray-100 rounded-[2rem] flex items-center justify-center text-gray-400 border-2 border-white shadow-xl overflow-hidden">
                          {formData.avatar ? (
                            <img src={formData.avatar} className="w-full h-full object-cover" />
                          ) : (
                            <User size={40} />
                          )}
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all">
                          <Camera size={16} />
                        </button>
                      </div>
                      <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-gray-900">{content.profile.title}</h3>
                        <p className="text-gray-500 text-sm">{content.profile.desc}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">{content.profile.nameLabel}</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">{content.profile.emailLabel}</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">{content.profile.phoneLabel}</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            type="tel" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'security' && (
                  <motion.div key="security" variants={VARIANTS.fadeInUp} initial="initial" animate="animate" className="space-y-10">
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900">{content.security.title}</h3>
                      <div className={`p-6 rounded-[2rem] border flex items-center justify-between ${
                        user.kycStatus === 'VERIFIED' ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            user.kycStatus === 'VERIFIED' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'
                          }`}>
                            <ShieldCheck size={24} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{content.security.kycStatus}</div>
                            <div className={`text-xs font-bold uppercase tracking-widest ${
                              user.kycStatus === 'VERIFIED' ? 'text-emerald-600' : 'text-orange-600'
                            }`}>
                              {user.kycStatus === 'VERIFIED' ? content.security.verified : content.security.notVerified}
                            </div>
                          </div>
                        </div>
                        {user.kycStatus !== 'VERIFIED' && (
                          <button 
                            onClick={() => setActiveTab('kyc')}
                            className="px-6 py-2 bg-white text-orange-600 rounded-xl text-xs font-black uppercase border border-orange-200 hover:bg-orange-600 hover:text-white transition-all"
                          >
                            {content.security.verifyBtn}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-gray-50">
                      <div>
                        <h4 className="font-bold text-gray-900">{content.security.passwordTitle}</h4>
                        <p className="text-sm text-gray-500">{content.security.passwordDesc}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                          <div className="flex items-center gap-3">
                            <Lock size={18} className="text-gray-400" />
                            <span className="text-sm font-bold text-gray-700">{content.security.changePassword}</span>
                          </div>
                          <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'preferences' && (
                  <motion.div key="preferences" variants={VARIANTS.fadeInUp} initial="initial" animate="animate" className="space-y-10">
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900">{content.preferences.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{content.preferences.langTitle}</label>
                          <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
                            <button 
                              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${language === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
                            >
                              English
                            </button>
                            <button 
                              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${language === 'hi' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
                            >
                              हिन्दी
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-bold text-gray-900">{content.preferences.notifTitle}</div>
                              <div className="text-xs text-gray-500">{content.preferences.notifDesc}</div>
                            </div>
                            <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer p-1 transition-all">
                              <div className="absolute right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {activeSection === 'profile' && (
                <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                      {isSaving ? content.saving : saveSuccess ? content.saved : content.save}
                    </button>
                    {saveSuccess && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-500">
                        <CheckCircle2 size={24} />
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50/50 p-8 border-t border-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none mb-1">{content.danger}</h4>
                    <p className="text-xs text-red-600/60 font-medium">Delete account and erase all trip history.</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">
                  {content.delete}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`animate-spin ${className}`}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
