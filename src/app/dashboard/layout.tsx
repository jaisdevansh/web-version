'use client';

import Sidebar from '@/components/shared/Sidebar';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  useEffect(() => {
    const checkLocation = async () => {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        try {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          if (result.state === 'prompt') {
            setShowLocationPrompt(true);
          } else if (result.state === 'granted') {
            // Already granted, just update silently
            navigator.geolocation.getCurrentPosition(() => {});
          }
        } catch (e) {
          // Fallback for browsers that don't support permissions.query
          const hasAsked = localStorage.getItem('hasAskedLocation');
          if (!hasAsked) {
            setShowLocationPrompt(true);
            localStorage.setItem('hasAskedLocation', 'true');
          }
        }
      }
    };
    checkLocation();
  }, []);

  const handleAllowLocation = () => {
    setShowLocationPrompt(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          toast.success('Location access granted!');
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            toast.error('Location access denied. You can enable it in your browser settings.');
          }
        },
        { maximumAge: 60000, timeout: 5000 }
      );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-1">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>

      <Dialog open={showLocationPrompt} onOpenChange={setShowLocationPrompt}>
        <DialogContent className="sm:max-w-md bg-[#111111] border-white/10 text-white rounded-3xl p-6 md:p-8">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-blue-500" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold mb-2">Enable Location</DialogTitle>
            <DialogDescription className="text-center text-white/60 text-base">
              We need your location to show you the best events, clubs, and venues near you.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-col gap-3 mt-6 sm:space-x-0">
            <Button onClick={handleAllowLocation} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-all">
              Allow Location Access
            </Button>
            <Button variant="ghost" onClick={() => setShowLocationPrompt(false)} className="w-full h-12 rounded-xl text-white/50 hover:text-white hover:bg-white/5 font-semibold transition-all">
              Not Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
