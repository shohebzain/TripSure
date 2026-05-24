
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle2, AlertCircle, Info, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { Notification } from '../types';
import { VARIANTS } from '../constants/animations';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onAction: (tab: string) => void;
  language: 'en' | 'hi';
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
  onAction,
  language
}) => {
  const content = {
    en: {
      title: 'Notifications',
      clear: 'Clear All',
      empty: 'No new notifications',
      emptySub: 'We will notify you about trip updates and account status.',
      markRead: 'Mark as read'
    },
    hi: {
      title: 'सूचनाएं',
      clear: 'सभी साफ करें',
      empty: 'कोई नई सूचना नहीं',
      emptySub: 'हम आपको ट्रिप अपडेट और अकाउंट की स्थिति के बारे में सूचित करेंगे।',
      markRead: 'पढ़ा हुआ मानों'
    }
  }[language];

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'warning': return <AlertCircle className="text-orange-500" size={18} />;
      case 'error': return <AlertCircle className="text-red-500" size={18} />;
      default: return <Info className="text-indigo-500" size={18} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">{content.title}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {notifications.filter(n => !n.isRead).length} Unread
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button 
                    onClick={onClearAll}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title={content.clear}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-[1.5rem] border transition-all ${
                      notif.isRead ? 'bg-white border-gray-100 opacity-60' : 'bg-indigo-50/30 border-indigo-100 shadow-sm'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-bold text-sm ${notif.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notif.title}
                          </h4>
                          {!notif.isRead && (
                            <button 
                              onClick={() => onMarkAsRead(notif.id)}
                              className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                            >
                              {content.markRead}
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed mb-3">
                          {notif.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            <Clock size={10} /> {notif.timestamp}
                          </div>
                          {notif.actionTab && (
                            <button 
                              onClick={() => {
                                onAction(notif.actionTab!);
                                onClose();
                              }}
                              className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:gap-2 transition-all"
                            >
                              View Details <ArrowRight size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                    <Bell size={40} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{content.empty}</h4>
                  <p className="text-sm text-gray-500 max-w-xs">{content.emptySub}</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
