import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#05050A] text-white flex flex-col font-sans items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto flex flex-col items-center">
        <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-8">
          <Clock className="w-10 h-10 text-blue-400" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Coming Soon
        </h1>
        <p className="text-xl text-white/60 mb-12 font-light leading-relaxed">
          We are working hard to bring you this feature. Stay tuned for updates!
        </p>

        <Link href="/">
          <button className="flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all text-lg font-medium group">
            <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
