'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ChevronLeft, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Password reset link sent to your email');
      router.push('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center text-white/50 hover:text-white mb-8 transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Login
        </Link>

        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20">
          <KeyRound className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-2">Reset Password</h1>
        <p className="text-white/50 mb-8">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              type="email"
              placeholder="Email address"
              className="h-14 pl-12 bg-white/5 border-white/10 text-white rounded-xl focus:border-primary/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 bg-white text-black hover:bg-white/90 rounded-xl font-bold text-lg"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </div>
    </div>
  );
}
