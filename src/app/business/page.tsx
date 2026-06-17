'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BusinessPage() {
  return (
    <div className="bg-black text-white font-sans selection:bg-blue-500/30">
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
      
      {/* 1. Hero Section */}
      <section className="bg-black pt-20 md:pt-32 pb-0 overflow-hidden">
        <div className="container mx-auto px-4 max-w-[1536px]">
          <h1 className="text-6xl md:text-[128px] leading-[0.9] font-black uppercase tracking-tighter mb-8 text-white max-w-7xl">
            Grow <span className="italic font-light">Your</span> Nightlife Empire
          </h1>
          <p className="text-lg md:text-[18px] text-white max-w-[800px] mb-12">
            More than just a ticket system, our innovative ticketing and marketing engine is purpose-built to accelerate your brand's growth and help take your events business to the next level.
          </p>
        </div>

        {/* Hero Image & CTA Container */}
        <div className="relative w-full max-w-[1536px] mx-auto h-[400px] md:h-[616px] bg-[#181817] mt-8 overflow-hidden rounded-t-3xl border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80 z-10" />
          <img src="/slide3.png" alt="Crowd" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen" />

          {/* Circular absolute CTA */}
          <Link href="/contact" className="absolute top-8 right-8 z-20 group">
            <div className="w-[100px] h-[100px] md:w-[141px] md:h-[141px] bg-transparent border-2 border-blue-500 rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-300 relative">
              <div className="absolute inset-2 rounded-full bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="text-white w-8 h-8" strokeWidth={3} />
              </div>
            </div>
          </Link>
        </div>

        {/* Marquee Banner */}
        <div className="bg-black py-6 border-y border-white/10 flex whitespace-nowrap overflow-hidden relative">
          <div className="animate-marquee inline-block text-2xl md:text-3xl font-black uppercase tracking-widest">
            <span className="mx-8">30,000 EVENT ORGANISERS AND COUNTING</span>
            <span className="mx-8 text-blue-500">ENTRY CLUB</span>
            <span className="mx-8">30,000 EVENT ORGANISERS AND COUNTING</span>
            <span className="mx-8 text-blue-500">ENTRY CLUB</span>
            <span className="mx-8">30,000 EVENT ORGANISERS AND COUNTING</span>
            <span className="mx-8 text-blue-500">ENTRY CLUB</span>
            <span className="mx-8">30,000 EVENT ORGANISERS AND COUNTING</span>
            <span className="mx-8 text-blue-500">ENTRY CLUB</span>
          </div>
        </div>
      </section>

      {/* 2. Features Section (01-04) */}
      <section className="bg-black text-white py-24 md:py-32">
        <div className="container mx-auto px-4 max-w-[1300px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[96px]">
            {/* Left Column */}
            <div className="flex flex-col gap-16 md:gap-[96px]">
              {/* Feature 01 */}
              <div className="group">
                <div className="w-full aspect-[491/496] bg-[#111] border border-white/5 group-hover:border-blue-500/30 transition-colors duration-500 mb-8 flex items-center justify-center relative overflow-hidden rounded-xl">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                   <img src="/flawless.png" alt="Ticketing" className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-screen transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-gray-500 font-black text-2xl tracking-tighter">01.</span>
                  <h3 className="text-2xl font-black uppercase text-white">Sell Tickets</h3>
                </div>
                <p className="text-gray-400 text-[16px] leading-relaxed max-w-md">
                  Increase conversions and give your customers a premium buying experience. Our optimised, intuitive ticketing and marketing features give you everything you need to maximise ticket sales.
                </p>
              </div>

              {/* Feature 03 */}
              <div className="group">
                <div className="w-full aspect-[491/496] bg-[#111] border border-white/5 group-hover:border-blue-500/30 transition-colors duration-500 mb-8 flex items-center justify-center relative overflow-hidden rounded-xl">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                   <img src="/slide3.png" alt="Promotion" className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-screen transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-gray-500 font-black text-2xl tracking-tighter">03.</span>
                  <h3 className="text-2xl font-black uppercase text-white">Promote Directly To Them</h3>
                </div>
                <p className="text-gray-400 text-[16px] leading-relaxed max-w-md">
                  Get your customers coming back, again and again. Promote your events in just one click. Send Emails, WhatsApps, SMS, push notifications in our app to all your followers.
                </p>
              </div>
            </div>

            {/* Right Column - Staggered */}
            <div className="flex flex-col gap-16 md:gap-[96px] md:mt-[120px]">
              {/* Feature 02 */}
              <div className="group">
                <div className="w-full aspect-[491/496] bg-[#111] border border-white/5 group-hover:border-cyan-500/30 transition-colors duration-500 mb-8 flex items-center justify-center relative overflow-hidden rounded-xl">
                   <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                   <img src="/slide2.png" alt="Audience" className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-screen transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-gray-500 font-black text-2xl tracking-tighter">02.</span>
                  <h3 className="text-2xl font-black uppercase text-white">Build a Following</h3>
                </div>
                <p className="text-gray-400 text-[16px] leading-relaxed max-w-md">
                  Grow your audience with every ticket you sell. Every time a customer purchases a ticket to your event on Entry Club they become part of your following. Giving you a stronger foundation to launch your next event.
                </p>
              </div>

              {/* Feature 04 */}
              <div className="group">
                <div className="w-full aspect-[491/496] bg-[#111] border border-white/5 group-hover:border-indigo-500/30 transition-colors duration-500 mb-8 flex items-center justify-center relative overflow-hidden rounded-xl">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                   <img src="/flawless.png" alt="Chat" className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-screen transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-gray-500 font-black text-2xl tracking-tighter">04.</span>
                  <h3 className="text-2xl font-black uppercase text-white">Get People Talking</h3>
                </div>
                <p className="text-gray-400 text-[16px] leading-relaxed max-w-md">
                  See your customers promote your events for you. Our app's chat and share features keep the conversation about your events going, even after purchase. It's how each sale becomes an ad for your brand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "Everything's Covered" Section */}
      <section className="bg-black text-white py-24 pb-32 border-t border-white/10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 max-w-[1300px] relative z-10">
          <div className="mb-16">
            <h4 className="text-center font-bold text-[20px] mb-4 text-blue-500">Everything's covered</h4>
            <h2 className="text-center text-4xl md:text-[64px] font-bold leading-[1.1] max-w-[960px] mx-auto text-white">
              We push boundaries, but we build on solid foundations. All the basics are covered too.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="flex flex-col group">
              <div className="w-full h-[304px] bg-[#111] border border-white/5 group-hover:border-blue-500/30 transition-colors duration-500 mb-6 flex items-center justify-center rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="font-bold text-white/30 tracking-widest group-hover:text-blue-400 transition-colors duration-500 relative z-10">TICKETING</span>
                <img src="/flawless.png" alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen group-hover:opacity-40 transition-opacity duration-500" />
              </div>
              <h3 className="text-[24px] font-bold mb-3 uppercase tracking-tight text-white">Sell Tickets</h3>
              <p className="text-[16px] text-gray-400 font-light leading-relaxed">
                Our ticketing experience is optimised for you and your customers. Our web pages are designed for speed and search, so your events are found quicker, and customers checkout faster.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="flex flex-col group">
              <div className="w-full h-[304px] bg-[#111] border border-white/5 group-hover:border-cyan-500/30 transition-colors duration-500 mb-6 flex items-center justify-center rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="font-bold text-white/30 tracking-widest group-hover:text-cyan-400 transition-colors duration-500 relative z-10">MARKETING</span>
                <img src="/slide3.png" alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen group-hover:opacity-40 transition-opacity duration-500" />
              </div>
              <h3 className="text-[24px] font-bold mb-3 uppercase tracking-tight text-white">Market Your Events</h3>
              <p className="text-[16px] text-gray-400 font-light leading-relaxed">
                Reach more customers with our unique promotional tools. Integrate with the most popular ad and analytics platforms so you can optimise all your marketing channels too.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col group">
              <div className="w-full h-[304px] bg-[#111] border border-white/5 group-hover:border-indigo-500/30 transition-colors duration-500 mb-6 flex items-center justify-center rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="font-bold text-white/30 tracking-widest group-hover:text-indigo-400 transition-colors duration-500 relative z-10">OPERATIONS</span>
                <img src="/slide2.png" alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen group-hover:opacity-40 transition-opacity duration-500" />
              </div>
              <h3 className="text-[24px] font-bold mb-3 uppercase tracking-tight text-white">Manage Operations</h3>
              <p className="text-[16px] text-gray-400 font-light leading-relaxed">
                Get customers through the door faster with Entry Club Scan, our robust and reliable ticket scanning solutions for your venue's door staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Value Proposition / Final CTA */}
      <section className="bg-black text-white py-24 pb-48 relative overflow-hidden border-t border-white/10">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="bg-[#0a0a0a] border border-white/10 shadow-[0_0_50px_rgba(37,99,235,0.1)] w-full max-w-[1312px] min-h-[600px] md:min-h-[754px] rounded-3xl relative flex flex-col items-center justify-center px-4 py-20 md:p-[176px_80px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />

            {/* Phone Mockups (Absolute) */}
            <div className="hidden md:flex absolute -left-[32px] -bottom-[64px] w-[300px] h-[500px] bg-[#111] border-[12px] border-[#181817] rounded-[40px] items-center justify-center shadow-2xl overflow-hidden z-10">
              <img src="/slide2.png" alt="App Preview" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="hidden md:flex absolute -right-[48px] -top-[48px] w-[300px] h-[500px] bg-[#111] border-[12px] border-[#181817] rounded-[40px] items-center justify-center shadow-2xl overflow-hidden z-10">
               <img src="/slide3.png" alt="App Preview" className="w-full h-full object-cover opacity-80" />
            </div>

            <h2 className="text-white text-5xl md:text-[112px] font-medium leading-[0.9] text-center mb-10 z-20">
              DESIGNED WITH <span className="italic font-light">CARE.</span>
            </h2>
            
            <p className="text-gray-300 font-light text-[16px] text-center max-w-[512px] mb-12 z-20 leading-relaxed opacity-90">
              We care about your customers' experience with your brand as much as you do. That's why we craft and continually improve every aspect of our customer experience. So you can be confident your events and business are represented with the respect they deserve.
            </p>

            <Link href="/contact" className="z-20">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] px-[32px] py-[28px] h-auto rounded-full uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] border-0">
                List Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
