'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        <div className="mx-auto w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-8">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Something went wrong</h1>
          <p className="text-white/50 text-lg leading-relaxed">
            We've encountered an unexpected error. Our engineering team has been notified and is looking into it.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-white text-black font-bold text-sm px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto bg-white/5 text-white font-bold text-sm px-8 py-4 rounded-xl flex items-center justify-center gap-2 border border-white/10 hover:bg-white/10 transition-all"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
        
        {/* Optional tech details for devs */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-12 p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-left overflow-x-auto">
            <p className="text-red-400 font-mono text-xs">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
