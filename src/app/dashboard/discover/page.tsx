'use client';

import { useState } from 'react';
import { ChevronLeft, MessageSquare, SlidersHorizontal, Radio, EyeOff, MapPin, Gift, Coffee, Flame, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<'chats' | 'gift' | 'orders'>('chats');
  const [showOnMap, setShowOnMap] = useState(false);

  return (
    <div className="min-h-screen bg-[#06040b] text-white overflow-hidden flex flex-col font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between px-6 pt-10 pb-4 relative z-10">
        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-white/80" />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-bold tracking-widest text-white/60 uppercase mb-0.5">Live Discovery</p>
          <h1 className="text-xl font-bold text-white tracking-tight">No Active Event</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center hover:bg-indigo-600/30 transition-colors">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-white/80" />
          </button>
        </div>
      </div>

      {/* RADAR SECTION */}
      <div className="flex flex-col items-center pt-6 pb-8 relative z-0">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Radar Rings */}
          <div className="absolute w-full h-full rounded-full border border-indigo-500/10" />
          <div className="absolute w-3/4 h-3/4 rounded-full border border-indigo-500/20" />
          <div className="absolute w-1/2 h-1/2 rounded-full border border-indigo-500/30" />
          
          {/* Crosshairs */}
          <div className="absolute w-[1px] h-full bg-indigo-500/10" />
          <div className="absolute w-full h-[1px] bg-indigo-500/10" />

          {/* Center Icon */}
          <div className="absolute bg-[#1a0b2e] rounded-full p-4 border border-indigo-500/30 z-10">
            {showOnMap ? (
               <Radio className="w-6 h-6 text-indigo-400" />
            ) : (
               <EyeOff className="w-6 h-6 text-indigo-400" />
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-6 bg-[#130822] border border-indigo-500/20 rounded-full px-4 py-2 flex items-center shadow-[0_0_15px_rgba(79,70,229,0.15)]">
          <Flame className="w-4 h-4 text-orange-500 mr-2" />
          <span className="text-sm font-semibold text-indigo-200">0 people at this event</span>
        </div>

        {/* Toggle Map Switch */}
        <div className="mt-6 flex items-center space-x-3">
          <span className="text-sm font-medium text-white/70">Show me on map</span>
          <Switch 
            checked={showOnMap}
            onCheckedChange={setShowOnMap}
            className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/20"
          />
        </div>
      </div>

      {/* TABS & CONTENT SECTION */}
      <div className="flex-1 bg-[#0b0a12] rounded-t-[2.5rem] flex flex-col relative shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        
        {/* Tabs */}
        <div className="flex items-center justify-between px-2 pt-2 pb-6 w-full">
          {[
            { id: 'chats', label: 'CHATS', icon: MessageSquare },
            { id: 'gift', label: 'GIFT', icon: Gift },
            { id: 'orders', label: 'ORDERS', icon: Coffee }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#1a1728] text-white shadow-lg' 
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : ''}`} />
                <span className={`text-[11px] tracking-widest font-bold ${isActive ? 'text-white' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 px-8 pb-12 flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === 'chats' && (
              <motion.div 
                key="chats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col items-center justify-center text-center -mt-10"
              >
                <div className="w-16 h-16 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center mb-6">
                  <EyeOff className="w-6 h-6 text-white/40" />
                </div>
                <h2 className="text-xl font-bold text-white mb-3">Incognito Mode Active</h2>
                <p className="text-white/40 text-sm max-w-[250px] leading-relaxed">
                  Enable "Show me on map" to interact with people nearby.
                </p>
              </motion.div>
            )}

            {activeTab === 'gift' && (
              <motion.div 
                key="gift"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col items-center justify-center text-center -mt-10"
              >
                <div className="w-16 h-16 rounded-full border border-blue-500/20 bg-blue-500/5 flex items-center justify-center mb-6">
                  <Gift className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-3">No Booking Yet</h2>
                <p className="text-white/40 text-sm max-w-[250px] leading-relaxed">
                  Book an event to view and send premium gifts.
                </p>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div 
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full"
              >
                {/* Orders Header Info */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Member-Only Mixology</h2>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-blue-500 uppercase mt-1">Real-time direct service</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-white/80" />
                  </div>
                </div>

                <div className="mb-12">
                  <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all">
                    ALL
                  </button>
                </div>

                {/* Orders Empty State */}
                <div className="flex-1 flex flex-col items-center justify-center text-center pb-12 mt-10">
                  <div className="w-16 h-16 rounded-full border border-blue-500/20 bg-blue-500/5 flex items-center justify-center mb-6">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-3">No Active Order</h2>
                  <p className="text-white/40 text-sm max-w-[250px] leading-relaxed">
                    Book a new event to view the menu and order drinks.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
