
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Search, Shield, Zap } from 'lucide-react';
import { VARIANTS, TRANSITIONS } from '../constants/animations';

interface HeroProps {
  onExplore: () => void;
  onRegisterDriver: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onRegisterDriver }) => {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-visible">
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        initial="initial"
        animate="animate"
        variants={VARIANTS.staggerContainer}
      >
        <div>
          <motion.div variants={VARIANTS.fadeInUp} className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6">
            <Zap size={16} className="mr-2 fill-indigo-700" />
            AI-Powered Return Trip Optimization
          </motion.div>
          <motion.h1 variants={VARIANTS.fadeInUp} className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Stop Empty Runs.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Start Earning.</span>
          </motion.h1>
          <motion.p variants={VARIANTS.fadeInUp} className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
            India's first platform dedicated to rural-to-urban intercity logistics. 
            Connect with verified drivers, ship cargo, or find a seat – all with 
            AI matching and instant insurance.
          </motion.p>
          <motion.div variants={VARIANTS.fadeInUp} className="flex flex-col sm:flex-row gap-4">
            <motion.button 
              onClick={onExplore}
              whileHover={VARIANTS.scaleHover.hover}
              whileTap={VARIANTS.scaleHover.tap}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl hover:shadow-indigo-200 transition-all flex items-center justify-center"
            >
              Book Your Trip <ArrowRight className="ml-2" size={20} />
            </motion.button>
            <motion.button 
              onClick={onRegisterDriver}
              whileHover={VARIANTS.scaleHover.hover}
              whileTap={VARIANTS.scaleHover.tap}
              className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center"
            >
              Register as Driver
            </motion.button>
          </motion.div>

          <motion.div variants={VARIANTS.fadeInUp} className="mt-12 grid grid-cols-3 gap-6">
            {['1.2M+', '45k+', '₹5L'].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-gray-900">{stat}</div>
                <div className="text-sm text-gray-500">
                  {i === 0 ? 'Kms Optimized' : i === 1 ? 'Verified Drivers' : 'Trip Insurance'}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: TRANSITIONS.emphasis, ease: TRANSITIONS.easing }}
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-52 h-52 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
          
          <motion.div 
            className="relative glass-morphism p-6 rounded-3xl shadow-2xl border border-white overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <MapPin className="text-red-500" />
              <div className="flex-1">
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Origin</div>
                <div className="text-lg font-bold">Lucknow, UP</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <Search className="text-indigo-500" />
              <div className="flex-1">
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Destination</div>
                <div className="text-lg font-bold">New Delhi, NCR</div>
              </div>
            </div>
            <div className="space-y-4">
              <motion.div 
                className="p-4 bg-indigo-600 text-white rounded-2xl flex justify-between items-center shadow-lg"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div>
                  <div className="text-xs opacity-80">AI Suggested Price</div>
                  <div className="text-xl font-bold">₹850 / seat</div>
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold">Best Value</div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
