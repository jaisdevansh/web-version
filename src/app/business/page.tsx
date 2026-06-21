import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Business | Entry Club',
  description: 'Grow your nightlife empire with our innovative ticketing and marketing engine purpose-built for event organizers.',
};

export default function BusinessPage() {
  return (
    <div className="bg-[#000000] text-[#f5f5f7] font-sans selection:bg-[#0066cc]/30">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}} />
      
      {/* 1. Hero Section */}
      <section className="pt-24 md:pt-36 pb-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c1e]/50 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <h1 className="text-6xl md:text-8xl lg:text-[120px] font-semibold tracking-tight mb-8 text-[#f5f5f7] leading-[0.9]">
            Grow your <br /><span className="text-[#86868b]">nightlife empire.</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#86868b] max-w-3xl mb-12 font-medium leading-relaxed">
            More than just a ticket system, our innovative ticketing and marketing engine is purpose-built to accelerate your brand's growth and help take your events business to the next level.
          </p>
        </div>

        {/* Hero Image & CTA Container */}
        <div className="relative w-full max-w-6xl mx-auto h-[400px] md:h-[616px] bg-[#1c1c1e] mt-8 overflow-hidden rounded-[2.5rem] border border-white/[0.05]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#000000] opacity-90 z-10" />
          <Image src="/slide3.png" alt="Crowd at a nightlife event" fill priority className="object-cover opacity-60 mix-blend-screen" sizes="(max-width: 1536px) 100vw, 1536px" />

          {/* Circular absolute CTA */}
          <Link href="/contact" className="absolute top-8 right-8 z-20 group" aria-label="Contact us to list your event">
            <div className="w-[100px] h-[100px] md:w-[141px] md:h-[141px] bg-transparent border-2 border-[#2997ff] rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-500 relative backdrop-blur-md">
              <div className="absolute inset-2 rounded-full bg-[#2997ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-16 h-16 bg-[#2997ff] rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-500 shadow-[0_0_30px_rgba(41,151,255,0.4)]">
                <ArrowUpRight className="text-white w-8 h-8" strokeWidth={2.5} aria-hidden="true" />
              </div>
            </div>
          </Link>
        </div>

        {/* Marquee Banner */}
        <div className="py-8 flex whitespace-nowrap overflow-hidden relative border-b border-white/[0.05]" aria-hidden="true">
          <div className="animate-marquee inline-block text-2xl md:text-3xl font-semibold tracking-tight text-[#86868b]">
            <span className="mx-8">30,000 EVENT ORGANISERS AND COUNTING</span>
            <span className="mx-8 text-[#2997ff]">ENTRY CLUB</span>
            <span className="mx-8">30,000 EVENT ORGANISERS AND COUNTING</span>
            <span className="mx-8 text-[#2997ff]">ENTRY CLUB</span>
            <span className="mx-8">30,000 EVENT ORGANISERS AND COUNTING</span>
            <span className="mx-8 text-[#2997ff]">ENTRY CLUB</span>
            <span className="mx-8">30,000 EVENT ORGANISERS AND COUNTING</span>
            <span className="mx-8 text-[#2997ff]">ENTRY CLUB</span>
          </div>
        </div>
      </section>

      {/* 2. Features Section (01-04) */}
      <section className="py-24 md:py-36">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {/* Left Column */}
            <div className="flex flex-col gap-16 md:gap-32">
              {/* Feature 01 */}
              <div className="group">
                <div className="w-full aspect-square bg-[#1c1c1e]/50 border border-white/[0.05] group-hover:bg-[#1c1c1e] transition-colors duration-500 mb-8 flex items-center justify-center relative overflow-hidden rounded-[2.5rem] backdrop-blur-xl">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#2997ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                   <Image src="/flawless.png" alt="Ticketing interface preview" fill className="object-cover opacity-80 mix-blend-screen transition-transform duration-1000 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-[#86868b] text-xl font-medium" aria-hidden="true">01.</span>
                  <h2 className="text-3xl md:text-4xl font-semibold text-[#f5f5f7] tracking-tight">Sell Tickets</h2>
                </div>
                <p className="text-lg text-[#86868b] max-w-md leading-relaxed">
                  Increase conversions and give your customers a premium buying experience. Our optimised, intuitive ticketing and marketing features give you everything you need to maximise ticket sales.
                </p>
              </div>

              {/* Feature 03 */}
              <div className="group">
                <div className="w-full aspect-square bg-[#1c1c1e]/50 border border-white/[0.05] group-hover:bg-[#1c1c1e] transition-colors duration-500 mb-8 flex items-center justify-center relative overflow-hidden rounded-[2.5rem] backdrop-blur-xl">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#bf5af2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                   <Image src="/slide3.png" alt="Promotion tools and analytics" fill className="object-cover opacity-80 mix-blend-screen transition-transform duration-1000 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-[#86868b] text-xl font-medium" aria-hidden="true">03.</span>
                  <h2 className="text-3xl md:text-4xl font-semibold text-[#f5f5f7] tracking-tight">Promote Directly</h2>
                </div>
                <p className="text-lg text-[#86868b] max-w-md leading-relaxed">
                  Get your customers coming back, again and again. Promote your events in just one click. Send Emails, WhatsApps, SMS, push notifications in our app to all your followers.
                </p>
              </div>
            </div>

            {/* Right Column - Staggered */}
            <div className="flex flex-col gap-16 md:gap-32 md:mt-32">
              {/* Feature 02 */}
              <div className="group">
                <div className="w-full aspect-square bg-[#1c1c1e]/50 border border-white/[0.05] group-hover:bg-[#1c1c1e] transition-colors duration-500 mb-8 flex items-center justify-center relative overflow-hidden rounded-[2.5rem] backdrop-blur-xl">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#32d74b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                   <Image src="/slide2.png" alt="Audience building tools" fill className="object-cover opacity-80 mix-blend-screen transition-transform duration-1000 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-[#86868b] text-xl font-medium" aria-hidden="true">02.</span>
                  <h2 className="text-3xl md:text-4xl font-semibold text-[#f5f5f7] tracking-tight">Build a Following</h2>
                </div>
                <p className="text-lg text-[#86868b] max-w-md leading-relaxed">
                  Grow your audience with every ticket you sell. Every time a customer purchases a ticket to your event on Entry Club they become part of your following. Giving you a stronger foundation to launch your next event.
                </p>
              </div>

              {/* Feature 04 */}
              <div className="group">
                <div className="w-full aspect-square bg-[#1c1c1e]/50 border border-white/[0.05] group-hover:bg-[#1c1c1e] transition-colors duration-500 mb-8 flex items-center justify-center relative overflow-hidden rounded-[2.5rem] backdrop-blur-xl">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#ff9f0a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                   <Image src="/flawless.png" alt="Chat and community features" fill className="object-cover opacity-80 mix-blend-screen transition-transform duration-1000 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-[#86868b] text-xl font-medium" aria-hidden="true">04.</span>
                  <h2 className="text-3xl md:text-4xl font-semibold text-[#f5f5f7] tracking-tight">Get People Talking</h2>
                </div>
                <p className="text-lg text-[#86868b] max-w-md leading-relaxed">
                  See your customers promote your events for you. Our app's chat and share features keep the conversation about your events going, even after purchase. It's how each sale becomes an ad for your brand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "Everything's Covered" Section */}
      <section className="py-24 md:py-32 border-t border-white/[0.05] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c1e]/30 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="mb-20 text-center">
            <p className="font-medium text-[#2997ff] mb-4 tracking-wide">Everything's covered.</p>
            <h2 className="text-4xl md:text-6xl font-semibold text-[#f5f5f7] tracking-tight max-w-4xl mx-auto">
              We push boundaries, but we build on solid foundations.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="flex flex-col group">
              <div className="w-full h-[320px] bg-[#1c1c1e]/50 border border-white/[0.05] group-hover:bg-[#1c1c1e] transition-colors duration-500 mb-8 flex items-center justify-center rounded-[2.5rem] relative overflow-hidden backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2997ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                <span className="font-semibold text-white/20 tracking-widest group-hover:text-[#2997ff] transition-colors duration-500 relative z-20">TICKETING</span>
                <Image src="/flawless.png" alt="" fill className="object-cover opacity-20 mix-blend-screen group-hover:opacity-40 transition-opacity duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-[#f5f5f7] tracking-tight">Sell Tickets</h3>
              <p className="text-[#86868b] leading-relaxed">
                Our ticketing experience is optimised for you and your customers. Our web pages are designed for speed and search, so your events are found quicker, and customers checkout faster.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="flex flex-col group">
              <div className="w-full h-[320px] bg-[#1c1c1e]/50 border border-white/[0.05] group-hover:bg-[#1c1c1e] transition-colors duration-500 mb-8 flex items-center justify-center rounded-[2.5rem] relative overflow-hidden backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-br from-[#bf5af2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                <span className="font-semibold text-white/20 tracking-widest group-hover:text-[#bf5af2] transition-colors duration-500 relative z-20">MARKETING</span>
                <Image src="/slide3.png" alt="" fill className="object-cover opacity-20 mix-blend-screen group-hover:opacity-40 transition-opacity duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-[#f5f5f7] tracking-tight">Market Your Events</h3>
              <p className="text-[#86868b] leading-relaxed">
                Reach more customers with our unique promotional tools. Integrate with the most popular ad and analytics platforms so you can optimise all your marketing channels too.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col group">
              <div className="w-full h-[320px] bg-[#1c1c1e]/50 border border-white/[0.05] group-hover:bg-[#1c1c1e] transition-colors duration-500 mb-8 flex items-center justify-center rounded-[2.5rem] relative overflow-hidden backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-br from-[#32d74b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                <span className="font-semibold text-white/20 tracking-widest group-hover:text-[#32d74b] transition-colors duration-500 relative z-20">OPERATIONS</span>
                <Image src="/slide2.png" alt="" fill className="object-cover opacity-20 mix-blend-screen group-hover:opacity-40 transition-opacity duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-[#f5f5f7] tracking-tight">Manage Operations</h3>
              <p className="text-[#86868b] leading-relaxed">
                Get customers through the door faster with Entry Club Scan, our robust and reliable ticket scanning solutions for your venue's door staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Value Proposition / Final CTA */}
      <section className="py-24 pb-48 relative overflow-hidden border-t border-white/[0.05]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="bg-[#1c1c1e]/40 border border-white/[0.05] shadow-[0_0_50px_rgba(41,151,255,0.05)] w-full min-h-[600px] md:min-h-[750px] rounded-[3rem] relative flex flex-col items-center justify-center px-6 py-20 overflow-hidden backdrop-blur-3xl">
            <div className="absolute inset-0 bg-gradient-to-b from-[#2997ff]/5 to-transparent pointer-events-none" />

            {/* Phone Mockups */}
            <div className="hidden md:flex absolute -left-[5%] -bottom-[10%] w-[320px] h-[550px] bg-[#2c2c2e] border-[12px] border-[#1c1c1e] rounded-[3rem] items-center justify-center shadow-2xl overflow-hidden z-10 transform -rotate-6">
              <Image src="/slide2.png" alt="App Preview showing audience growth" fill className="object-cover opacity-90" sizes="320px" />
            </div>
            <div className="hidden md:flex absolute -right-[5%] -top-[10%] w-[320px] h-[550px] bg-[#2c2c2e] border-[12px] border-[#1c1c1e] rounded-[3rem] items-center justify-center shadow-2xl overflow-hidden z-10 transform rotate-6">
               <Image src="/slide3.png" alt="App Preview showing promotional tools" fill className="object-cover opacity-90" sizes="320px" />
            </div>

            <h2 className="text-5xl md:text-7xl font-semibold text-[#f5f5f7] text-center mb-8 z-20 tracking-tight">
              Designed with <span className="text-[#86868b]">care.</span>
            </h2>
            
            <p className="text-xl text-[#86868b] text-center max-w-2xl mb-12 z-20 leading-relaxed font-medium">
              We care about your customers' experience with your brand as much as you do. That's why we craft and continually improve every aspect of our customer experience. So you can be confident your events and business are represented with the respect they deserve.
            </p>

            <Link href="/contact" className="z-20">
              <Button className="bg-[#f5f5f7] hover:bg-white text-black font-semibold text-lg px-8 py-7 h-auto rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 border-0">
                List Your Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
