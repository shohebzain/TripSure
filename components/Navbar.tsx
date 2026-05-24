
import React from 'react';
import { Menu, X, Car, Box, User as UserIcon, Languages, MapPinned, LogOut, LayoutDashboard, Settings, Bell, Package } from 'lucide-react';
import { User, UserRole, Notification } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  user: User | null;
  onLogout: () => void;
  notifications: Notification[];
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  language, 
  setLanguage, 
  user, 
  onLogout,
  notifications,
  onOpenNotifications
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const labels = {
    en: { 
      home: 'Home', 
      matching: 'Book Trip', 
      myTrips: 'My Journeys',
      dashboard: 'Dashboard', 
      login: 'Sign In',
      logout: 'Logout',
      settings: 'Settings',
      notifications: 'Notifications',
      cargo: 'Ship Cargo'
    },
    hi: { 
      home: 'होम', 
      matching: 'ट्रिप बुक करें', 
      myTrips: 'मेरी यात्राएं',
      dashboard: 'डैशबोर्ड', 
      login: 'लॉग इन',
      logout: 'लॉग आउट',
      settings: 'सेटिंग्स',
      notifications: 'सूचनाएं',
      cargo: 'कार्गो शिप'
    }
  }[language];

  const getNavItems = () => {
    const items = [{ id: 'home', label: labels.home, icon: Car }];
    
    if (!user) {
      items.push({ id: 'matching', label: labels.matching, icon: Box });
      return items;
    }

    if (user.role === UserRole.DRIVER) {
      items.push({ id: 'dashboard', label: labels.dashboard, icon: LayoutDashboard });
    } else if (user.role === UserRole.CARGO_OWNER) {
      items.push({ id: 'matching', label: labels.cargo, icon: Package });
      items.push({ id: 'my-trips', label: labels.myTrips, icon: MapPinned });
      items.push({ id: 'dashboard', label: labels.dashboard, icon: LayoutDashboard });
    } else {
      items.push({ id: 'matching', label: labels.matching, icon: Box });
      items.push({ id: 'my-trips', label: labels.myTrips, icon: MapPinned });
      items.push({ id: 'dashboard', label: labels.dashboard, icon: UserIcon });
    }

    return items;
  };

  const navItems = getNavItems();

  const getRoleLabel = (role?: UserRole) => {
    if (role === UserRole.CARGO_OWNER) return 'SHIPPER';
    return role || 'GUEST';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => setActiveTab('home')}
              className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 ai-gradient rounded-xl flex items-center justify-center text-white font-bold text-xl mr-2 shadow-lg shadow-indigo-200">T</div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">TripSure</span>
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex items-center bg-gray-100 p-1 rounded-xl mr-4">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${language === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${language === 'hi' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                हिन्दी
              </button>
            </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.id 
                  ? 'text-indigo-600 bg-indigo-50 shadow-sm' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            {user && (
              <div className="flex items-center gap-2 pl-4 ml-2 border-l border-gray-200">
                <button 
                  onClick={onOpenNotifications}
                  className="p-2 text-gray-400 hover:text-indigo-600 transition-colors relative group"
                  title={labels.notifications}
                >
                  <Bell size={20} className="group-hover:scale-110 transition-transform" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`p-2 transition-all group ${activeTab === 'settings' ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-600'}`}
                  title={labels.settings}
                >
                  <Settings size={20} className="group-hover:rotate-45 transition-transform" />
                </button>
                
                <div className="flex items-center gap-3 ml-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-900 leading-none">{user.name.split(' ')[0]}</div>
                    <div className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mt-1">{getRoleLabel(user.role)}</div>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-all hover:bg-red-50 rounded-lg"
                    title={labels.logout}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            )}
            
            {!user && (
              <button 
                onClick={() => setActiveTab('auth')}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 ml-4"
              >
                {labels.login}
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass-morphism border-t border-gray-100 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
              className={`flex items-center w-full px-5 py-4 rounded-2xl text-left font-bold transition-all ${
                activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} className="mr-4" />
              {item.label}
            </button>
          ))}
          {/* Mobile Footer Links */}
        </div>
      )}
    </nav>
  );
};
