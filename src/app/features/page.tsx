'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, QrCode, CreditCard, LayoutDashboard, Ticket, Users, Globe } from 'lucide-react';
import { ReactLenis } from 'lenis/react';

import FloatingPosterWall from '@/components/features/FloatingPosterWall';

export default function FeaturesPage() {
  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

  const features = [
    {
      title: "Seamless Ticketing",
      description: "Digital QR codes, instant delivery, and zero hassle at the door. Your phone is your entry pass.",
      icon: QrCode,
      colSpan: "md:col-span-2",
      gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
      title: "Split Payments",
      description: "Going with friends? Split the cost at checkout instantly without the awkward follow-ups.",
      icon: CreditCard,
      colSpan: "md:col-span-1",
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      title: "Real-time Analytics",
      description: "For organizers: Track attendance, revenue, and demographics live as your event unfolds.",
      icon: LayoutDashboard,
      colSpan: "md:col-span-1",
      gradient: "from-orange-500/20 to-red-500/20"
    },
    {
      title: "VIP Access & Tables",
      description: "Skip the line and book exclusive VIP tables directly through the app. Premium service guaranteed.",
      icon: Shield,
      colSpan: "md:col-span-2",
      gradient: "from-amber-500/20 to-yellow-500/20"
    },
    {
      title: "Global Discovery",
      description: "Find the best underground raves, exclusive clubs, and massive festivals in any city worldwide.",
      icon: Globe,
      colSpan: "md:col-span-3",
      gradient: "from-fuchsia-500/20 to-pink-500/20"
    }
  ];

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <main className="min-h-screen bg-[#000000] text-white pb-24 overflow-hidden">
        
        {/* New Animated Floating Poster Hero */}
        <FloatingPosterWall />

        {/* Background Gradients */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[40%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 mt-32">

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease }}
                className={`relative group overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-8 md:p-10 hover:bg-white/[0.04] transition-colors ${feature.colSpan}`}
              >
                {/* Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${feature.gradient}`} />
                
                <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white/80" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-white/50 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </ReactLenis>
  );
}
