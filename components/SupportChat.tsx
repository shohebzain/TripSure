
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2, Languages, MessageSquare } from 'lucide-react';
import { getSupportResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface SupportChatProps {
  language: 'en' | 'hi';
}

export const SupportChat: React.FC<SupportChatProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  const welcomeMessages = {
    en: 'Namaste! I am your TripSure assistant. How can I help you with your return trip today?',
    hi: 'नमस्ते! मैं आपका ट्रिपश्योर (TripSure) सहायक हूँ। आज मैं आपकी वापसी यात्रा में कैसे मदद कर सकता हूँ?'
  };

  const placeholders = {
    en: 'Ask about KYC, Insurance, or Booking...',
    hi: 'KYC, बीमा या बुकिंग के बारे में पूछें...'
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const defaultWhatsappMessage = `Hello TripSure Support Team,

I need assistance regarding my TripSure account / booking.

Name: 
Registered Mobile Number: 
Role: Driver / Passenger 
Issue Type: Booking / Payment / KYC / Trip / Other

Please help me resolve this. Thank you.`;

  const whatsappLink = `https://wa.me/919347117635?text=${encodeURIComponent(defaultWhatsappMessage)}`;

  // Initialize/Reset messages when language changes
  useEffect(() => {
    setMessages([
      { role: 'model', text: welcomeMessages[language], timestamp: new Date() }
    ]);
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getSupportResponse(
        messages.map(m => ({ role: m.role, text: m.text })),
        input,
        language
      );
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that.", timestamp: new Date() }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: language === 'hi' ? "क्षमा करें, कुछ गलत हो गया।" : "Sorry, something went wrong.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-[380px] h-[580px] bg-white rounded-3xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="p-5 ai-gradient text-white flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                <Bot size={24} />
              </div>
              <div>
                <div className="font-bold">TripSure Support</div>
                <div className="text-xs opacity-80 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span> {language === 'hi' ? 'ऑनलाइन' : 'Online'}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold uppercase tracking-wider flex items-center">
                <Languages size={10} className="mr-1" /> {language}
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                <MessageCircle size={18} />
              </div>
              <span className="text-xs font-bold text-emerald-800">
                {language === 'hi' ? 'WhatsApp पर बात करें' : 'Talk on WhatsApp'}
              </span>
            </div>
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm"
            >
              Connect Now
            </a>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-100' 
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm">
                  <Loader2 size={20} className="animate-spin text-indigo-600" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-2xl">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={placeholders[language]}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 ai-gradient rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform relative group"
        >
          <MessageCircle size={28} />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
            <span className="block w-2 h-2 bg-white rounded-full"></span>
          </div>
          <span className="absolute right-20 bg-gray-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
            {language === 'hi' ? 'मदद चाहिए?' : 'Need Help?'}
          </span>
        </button>
      )}
    </div>
  );
};
