'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Mail, CheckCircle2, User, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';

// Extract constants outside to prevent recreation on every render
const IMAGES = [
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop'
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  // Use React 19's useTransition for smooth, non-blocking async state updates
  const [isPending, startTransition] = useTransition();
  
  // Auth State
  const [authStep, setAuthStep] = useState<'email' | 'otp' | 'onboarding'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [tempAuthData, setTempAuthData] = useState<any>(null);

  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Memoized handlers for performance
  const handleSendOtp = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    startTransition(async () => {
      try {
        await api.post('/auth/send-otp', { identifier: email });
        toast.success('OTP sent successfully!');
        setAuthStep('otp');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to send OTP');
      }
    });
  }, [email]);

  const handleVerifyOtp = useCallback(() => {
    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }
    
    startTransition(async () => {
      try {
        const response = await api.post('/auth/verify-otp', { identifier: email, otp });
        const data = response.data.data || response.data;
        
        if (data.onboardingCompleted) {
          login({ id: data.id, role: data.role, name: data.name, email: data.email, profileImage: data.profileImage }, data.accessToken);
          toast.success('Logged in successfully');
          router.push('/dashboard');
        } else {
          setTempAuthData(data);
          setAuthStep('onboarding');
          toast.success('OTP verified. Please complete your profile.');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Invalid OTP');
      }
    });
  }, [email, otp, login, router]);

  const handleOnboarding = useCallback(() => {
    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    
    startTransition(async () => {
      try {
        const usernameBase = fullName.replace(/\s+/g, '').toLowerCase().slice(0, 5);
        const random = Math.floor(1000 + Math.random() * 9000);
        const username = `${usernameBase}${random}`;

        const response = await api.post('/auth/onboarding', 
          { name: fullName, username },
          { headers: { Authorization: `Bearer ${tempAuthData.accessToken}` } }
        );
        
        const updatedUser = response.data.data || response.data;
        
        login({ 
          id: tempAuthData.id, 
          role: tempAuthData.role, 
          name: updatedUser.name || fullName, 
          email: tempAuthData.email, 
          profileImage: updatedUser.profileImage 
        }, tempAuthData.accessToken);
        
        toast.success('Account created successfully');
        router.push('/dashboard');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to complete registration');
      }
    });
  }, [fullName, tempAuthData, login, router]);

  const handleGoogleLogin = useCallback(() => {
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://party.stayin.in/api1';
    window.location.href = `${baseUrl}/auth/google?redirectUri=${redirectUri}`;
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-black selection:bg-blue-500/30">
      {/* Dynamic Full-Screen Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={IMAGES[currentImageIndex]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Club Venue Background"
          />
        </AnimatePresence>
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95 z-10" />
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay z-10" />
        {/* Animated abstract ambient lights */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-10" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none z-10" 
        />
      </div>

      {/* Back Button */}
      <Link
        href="/"
        className="absolute left-6 top-6 md:left-10 md:top-10 flex items-center text-sm font-medium text-white/60 hover:text-white transition-all z-50 group hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/5"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* Main Form Container - Glassmorphic Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full max-w-[440px] px-6 sm:px-10 py-12 mx-4"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] -z-10 overflow-hidden">
          {/* Card subtle top highlight */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Logo Header */}
        <div className="flex justify-center mb-10">
          <motion.div 
            initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 1 }}
            className="text-2xl font-black tracking-[0.25em] flex items-center"
          >
            <span className="text-white drop-shadow-lg">ENTRY</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 ml-2 drop-shadow-lg">CLUB</span>
          </motion.div>
        </div>

        <div className="flex flex-col space-y-3 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
            {authStep === 'onboarding' ? 'Complete Profile' : 'Welcome Back'}
          </h1>
          <p className="text-sm font-medium text-white/50">
            {authStep === 'onboarding' 
              ? 'Just one more step to unlock your access' 
              : 'Enter the most exclusive nightlife ecosystem'}
          </p>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={authStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            {authStep === 'email' ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/40 group-focus-within:text-blue-400 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <Input 
                      className="w-full pl-12 h-14 bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 focus:bg-white/10 focus-visible:ring-1 focus-visible:ring-blue-500 text-white rounded-2xl transition-all text-base placeholder:text-white/30 shadow-inner" 
                      placeholder="you@example.com" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isPending} 
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSendOtp} 
                  className="w-full h-14 cursor-pointer rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300" 
                  disabled={isPending || !email}
                >
                  {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Continue with Email'}
                </Button>
              </div>
            ) : authStep === 'otp' ? (
              <div className="space-y-5">
                <div className="space-y-2 text-center mb-8">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                    className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 mb-4 border border-blue-500/30 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                  >
                    <CheckCircle2 className="h-8 w-8" />
                  </motion.div>
                  <p className="text-sm text-white/60">We sent a secure code to<br/><span className="text-white font-semibold mt-1 inline-block">{email}</span></p>
                  <button onClick={() => setAuthStep('email')} className="text-xs font-medium text-blue-400 hover:text-blue-300 underline underline-offset-2 mt-2">Change email</button>
                </div>
                <Input 
                  className="bg-black/40 border-white/10 text-white focus-visible:ring-blue-500 h-16 rounded-2xl text-center text-3xl tracking-[0.5em] font-mono shadow-inner" 
                  placeholder="••••" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  disabled={isPending} 
                />
                <Button 
                  onClick={handleVerifyOtp} 
                  className="w-full h-14 cursor-pointer rounded-2xl bg-white text-black font-bold hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300" 
                  disabled={isPending || otp.length < 4}
                >
                  {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Verify Secure Code'}
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/40 group-focus-within:text-blue-400 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <Input 
                      className="w-full pl-12 h-14 bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 focus:bg-white/10 focus-visible:ring-1 focus-visible:ring-blue-500 text-white rounded-2xl transition-all text-base placeholder:text-white/30 shadow-inner" 
                      placeholder="Your Full Name" 
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isPending} 
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleOnboarding} 
                  className="w-full h-14 cursor-pointer rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300" 
                  disabled={isPending || !fullName.trim()}
                >
                  {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Complete Setup'}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {authStep !== 'onboarding' && (
          <div className="mt-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-medium">
                <span className="bg-[#111111] rounded-full px-4 text-white/40 tracking-widest border border-white/5">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              type="button" 
              className="w-full h-14 cursor-pointer rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white hover:border-white/20 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 backdrop-blur-md" 
              disabled={isPending} 
              onClick={handleGoogleLogin}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
          </div>
        )}

        {/* Dynamic Carousel Indicators for Background */}
        <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
          {IMAGES.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-700 ${idx === currentImageIndex ? 'w-8 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'w-2 bg-white/20'}`} 
            />
          ))}
        </div>
      </motion.div>

      {/* Subtle Footer */}
      <div className="absolute bottom-6 w-full px-6 md:px-12 flex justify-between items-center z-50 text-xs font-medium text-white/40">
        <p>&copy; {new Date().getFullYear()} ENTRY CLUB</p>
        <div className="flex space-x-6">
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/contact" className="hover:text-white transition-colors hidden sm:block">Support</Link>
        </div>
      </div>
    </div>
  );
}
