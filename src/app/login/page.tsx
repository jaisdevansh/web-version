'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Mail, ArrowRight, CheckCircle2, User } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Email Auth State
  const [authStep, setAuthStep] = useState<'email' | 'otp' | 'onboarding'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  
  // Onboarding State
  const [fullName, setFullName] = useState('');
  const [tempAuthData, setTempAuthData] = useState<any>(null);

  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000&auto=format&fit=crop',
    '/slide2.png',
    '/slide3.png'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  async function handleSendOtp() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    try {
      setIsLoading(true);
      await api.post('/auth/send-otp', { identifier: email });
      toast.success('OTP sent! (Use 123456 for local dev)');
      setAuthStep('otp');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }
    try {
      setIsLoading(true);
      const response = await api.post('/auth/verify-otp', { identifier: email, otp });
      const data = response.data.data || response.data;
      
      if (data.onboardingCompleted) {
        login({ id: data.id, role: data.role, name: data.name, email: data.email, profileImage: data.profileImage }, data.accessToken);
        toast.success('Logged in successfully');
        router.push('/dashboard');
      } else {
        // Needs onboarding
        setTempAuthData(data);
        setAuthStep('onboarding');
        toast.success('OTP verified. Please complete your profile.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOnboarding() {
    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    try {
      setIsLoading(true);
      
      // Generate a quick username
      const usernameBase = fullName.replace(/\s+/g, '').toLowerCase().slice(0, 5);
      const random = Math.floor(1000 + Math.random() * 9000);
      const username = `${usernameBase}${random}`;

      // Set auth header for this specific request since we haven't stored it globally yet
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
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://party.stayin.in/api1';
    window.location.href = `${baseUrl}/auth/google?redirectUri=${redirectUri}`;
  };

  return (
    <div className="container relative min-h-[calc(100vh-8rem)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center text-nav text-muted-foreground hover:text-foreground transition-colors z-20"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Link>
      
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex justify-end overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover z-0"
            alt="Club Venue"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 z-10" />
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay z-10" />
        
        <div className="relative z-20 flex items-center text-3xl font-bold tracking-widest text-white mb-auto drop-shadow-2xl mt-8">
          ENTRY CLUB
        </div>
        
        <div className="relative z-20 mb-10 p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
          <blockquote className="space-y-4">
            <p className="text-card-heading leading-relaxed font-light text-white/90">
              &quot;This platform has completely transformed how we manage our venue.
              Table bookings, guest lists, and revenue tracking all in one premium ecosystem.&quot;
            </p>
            <footer className="text-small font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase tracking-widest">
              Sofia Davis, Club Owner
            </footer>
          </blockquote>
          
          <div className="flex gap-2 mt-6">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentImageIndex ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`} 
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 py-24 lg:p-8 flex items-center justify-center min-h-[100dvh] lg:min-h-full bg-black/95">
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px] mt-24 lg:mt-0">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-subheading tracking-tight text-white">
              {authStep === 'onboarding' ? 'Complete Profile' : 'Welcome back'}
            </h1>
            <p className="text-small text-white/60">
              {authStep === 'onboarding' 
                ? 'Just one more step to get started' 
                : 'Log in or register to continue'}
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={authStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="grid gap-6"
            >
              <div className="space-y-4">
                {authStep === 'email' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Email Address</label>
                      <div className="flex shadow-sm rounded-xl overflow-hidden border border-white/10 bg-white/5 focus-within:ring-2 focus-within:ring-blue-500">
                        <span className="flex items-center px-4 border-r border-white/10 text-white/50 bg-black/20 font-medium">
                          <Mail className="w-5 h-5" />
                        </span>
                        <Input 
                          className="border-0 bg-transparent text-white h-12 rounded-none focus-visible:ring-0 text-base" 
                          placeholder="you@example.com" 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading} 
                        />
                      </div>
                    </div>
                    <Button onClick={handleSendOtp} className="w-full h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-500 text-button shadow-lg shadow-blue-500/25 transition-all" disabled={isLoading || !email}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><ArrowRight className="mr-2 h-4 w-4" /> Continue with Email</>}
                    </Button>
                  </div>
                ) : authStep === 'otp' ? (
                  <div className="space-y-4">
                    <div className="space-y-2 text-center mb-6">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 mb-2 text-blue-400">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <p className="text-sm text-white/70">We sent a verification code to<br/><span className="text-white font-medium">{email}</span></p>
                      <button onClick={() => setAuthStep('email')} className="text-xs text-blue-400 hover:text-blue-300">Change email</button>
                    </div>
                    <Input 
                      className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500 h-14 rounded-xl text-center text-2xl tracking-[0.5em] font-mono" 
                      placeholder="••••" 
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      disabled={isLoading} 
                    />
                    <Button onClick={handleVerifyOtp} className="w-full h-12 rounded-xl bg-white text-black font-bold hover:bg-gray-200" disabled={isLoading || otp.length < 4}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Verify OTP'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Full Name</label>
                      <div className="flex shadow-sm rounded-xl overflow-hidden border border-white/10 bg-white/5 focus-within:ring-2 focus-within:ring-blue-500">
                        <span className="flex items-center px-4 border-r border-white/10 text-white/50 bg-black/20 font-medium">
                          <User className="w-5 h-5" />
                        </span>
                        <Input 
                          className="border-0 bg-transparent text-white h-12 rounded-none focus-visible:ring-0 text-lg" 
                          placeholder="John Doe" 
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={isLoading} 
                        />
                      </div>
                    </div>
                    <Button onClick={handleOnboarding} className="w-full h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-500 text-button shadow-lg shadow-blue-500/25 transition-all" disabled={isLoading || !fullName.trim()}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          
          {authStep !== 'onboarding' && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black px-4 text-white/40 tracking-widest">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <Button variant="outline" type="button" className="w-full h-12 rounded-xl border border-white/20 bg-white text-black hover:bg-gray-100 text-button shadow-lg transition-all" disabled={isLoading} onClick={handleGoogleLogin}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
