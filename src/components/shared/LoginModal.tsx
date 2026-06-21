'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { X, ChevronDown, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [step, setStep] = useState<'email' | 'otp' | 'onboarding'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [tempAuthData, setTempAuthData] = useState<any>(null);

  const resetState = () => {
    setStep('email');
    setEmail('');
    setOtp('');
    setFullName('');
    setTempAuthData(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    // Frontend-only bypass for dev testing
    if (email.toLowerCase() === 'dev@entryclub.test') {
      toast.success('Developer Bypass Activated! (Use OTP: 123456)');
      setStep('otp');
      return;
    }
    
    try {
      setIsLoading(true);
      await api.post('/auth/send-otp', { identifier: email });
      toast.success('OTP sent to your email!');
      setStep('otp');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) return;
    
    // Frontend-only bypass for dev testing
    if (email.toLowerCase() === 'dev@entryclub.test' && otp === '123456') {
      login({ id: "dev-user-id", role: "user", name: "Devansh (Test)", email: "devansh@entryclub.test", profileImage: "" }, "dummy_frontend_token");
      toast.success('Logged in successfully via Bypass');
      if (onSuccess) onSuccess();
      handleClose();
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/auth/verify-otp', { identifier: email, otp });
      const data = response.data.data || response.data;
      
      if (data.onboardingCompleted) {
        login({ id: data.id, role: data.role, name: data.name, email: data.email, profileImage: data.profileImage }, data.accessToken);
        toast.success('Logged in successfully');
        if (onSuccess) onSuccess();
        handleClose();
      } else {
        setTempAuthData(data);
        setStep('onboarding');
        toast.success('OTP verified. Please complete your profile.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    
    try {
      setIsLoading(true);
      
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
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to complete registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://party.stayin.in/api1';
    window.location.href = `${baseUrl}/auth/google?redirectUri=${redirectUri}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-end md:items-center justify-center z-[100] pointer-events-none p-4 md:p-0">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="p-6 pb-2 relative flex flex-col items-center">
                <button 
                  onClick={handleClose}
                  className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-6 md:hidden" />
                <h2 className="text-subheading text-gray-900 mb-2">
                  {step === 'onboarding' ? 'Complete Profile' : 'Welcome'}
                </h2>
                <p className="text-gray-500 text-small text-center">
                  {step === 'onboarding' ? 'Just one more step to get started' : 'Log in or register to continue'}
                </p>
              </div>

              {/* Body */}
              <div className="p-6 pt-4">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={step}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step === 'email' ? (
                      <form onSubmit={handleSendOtp} className="space-y-6">
                        <div className="flex space-x-3">
                          <div className="flex-1 relative">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Email address"
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-lg font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                              autoFocus
                            />
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          disabled={!email || !email.includes('@') || isLoading}
                          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-button rounded-xl disabled:opacity-50 transition-all"
                        >
                          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Send OTP'}
                        </Button>
                      </form>
                    ) : step === 'otp' ? (
                      <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="space-y-2 text-center">
                          <p className="text-sm text-gray-600">Enter code sent to <span className="font-bold text-black">{email}</span></p>
                          <button type="button" onClick={() => setStep('email')} className="text-xs text-blue-600 font-semibold hover:underline">Change email</button>
                        </div>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="••••••"
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-center text-2xl tracking-[0.5em] font-mono text-gray-900 placeholder:text-gray-400"
                          maxLength={6}
                          autoFocus
                        />
                        <Button 
                          type="submit" 
                          disabled={otp.length < 4 || isLoading}
                          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-button rounded-xl disabled:opacity-50 transition-all"
                        >
                          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify OTP'}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleOnboarding} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-800">Full Name</label>
                          <div className="flex items-center space-x-2 border border-gray-300 rounded-xl px-4 py-3 bg-white focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                            <User className="w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="John Doe"
                              className="w-full border-0 outline-none text-lg font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                              autoFocus
                            />
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          disabled={!fullName.trim() || isLoading}
                          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-button rounded-xl disabled:opacity-50 transition-all"
                        >
                          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Account'}
                        </Button>
                      </form>
                    )}
                  </motion.div>
                </AnimatePresence>

                {step !== 'onboarding' && (
                  <>
                    <div className="relative mt-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-4 text-gray-400 tracking-widest font-medium">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    
                    <Button variant="outline" type="button" className="w-full h-14 mt-6 rounded-xl border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 text-button shadow-sm transition-all" disabled={isLoading} onClick={handleGoogleLogin}>
                      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Google
                    </Button>
                  </>
                )}

                <div className="text-center text-xs font-medium text-gray-500 mt-6 pb-2">
                  By continuing, you agree to our <br/>
                  <a href="#" className="underline hover:text-black decoration-gray-400 underline-offset-2">Terms of Service</a> &nbsp;
                  <a href="#" className="underline hover:text-black decoration-gray-400 underline-offset-2">Privacy Policy</a>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
