'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error('Google login failed: ' + decodeURIComponent(error));
      router.push('/login');
      return;
    }

    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const id = searchParams.get('userId');
    const name = searchParams.get('name');
    const username = searchParams.get('username');
    const email = searchParams.get('email');
    const role = searchParams.get('role');
    const profileImage = searchParams.get('profileImage');
    const onboardingCompleted = searchParams.get('onboardingCompleted') === 'true';
    const hostId = searchParams.get('hostId');

    if (token && id) {
      const user = {
        id,
        name: name || '',
        username: username || undefined,
        email: email || '',
        role: role || 'user',
        profileImage: profileImage || undefined,
        onboardingCompleted,
        hostId: hostId || null
      };

      // Save token and user details to store
      login(user, token);
      
      // Store refresh token manually since store might not handle it directly
      if (typeof window !== 'undefined' && refreshToken) {
         // Some stores handle this, but just in case:
         document.cookie = `refreshToken=${refreshToken}; path=/; max-age=7776000; Secure; SameSite=Lax`;
      }

      toast.success('Successfully logged in with Google!');
      router.push('/dashboard');
    } else {
      toast.error('Missing authentication tokens');
      router.push('/login');
    }
  }, [searchParams, router, login]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <h2 className="text-xl font-semibold tracking-tight">Authenticating...</h2>
      <p className="text-sm text-muted-foreground">Please wait while we log you in securely.</p>
    </div>
  );
}
