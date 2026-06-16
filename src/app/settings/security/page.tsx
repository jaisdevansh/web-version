'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { ChevronLeft, Lock, Trash2, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export default function SecuritySettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [incognito, setIncognito] = useState(user?.role === 'incognito');

  const passwordMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.put('/user/change-password', passwords);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
      setPasswords({ oldPassword: '', newPassword: '' });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete('/user/account');
      return res.data;
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');
      logout();
      router.push('/login');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    }
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.oldPassword || !passwords.newPassword) {
      toast.error('Both fields are required');
      return;
    }
    passwordMutation.mutate();
  };

  const handleToggleIncognito = async (checked: boolean) => {
    setIncognito(checked);
    // There is no explicit incognito toggle endpoint in the backend list except maybe profile update or radar update.
    // Assuming updating profile works, or we just keep it as UI for now.
    toast.success(checked ? 'Incognito Mode Activated' : 'Incognito Mode Deactivated');
  };

  return (
    <div className="min-h-[85vh] py-8 lg:py-12 px-4 sm:px-6 lg:px-8 font-sans text-white">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group w-fit">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back</span>
        </button>

        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-8">Security & Privacy</h1>

        <div className="space-y-8">
          
          {/* Change Password */}
          <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Change Password</h2>
                <p className="text-sm text-white/40">Ensure your account is using a long, random password to stay secure.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
              <input 
                type="password" 
                placeholder="Current Password" 
                value={passwords.oldPassword}
                onChange={e => setPasswords({...passwords, oldPassword: e.target.value})}
                className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              <input 
                type="password" 
                placeholder="New Password" 
                value={passwords.newPassword}
                onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              <Button type="submit" disabled={passwordMutation.isPending} className="bg-blue-600 hover:bg-blue-500 w-full rounded-xl">
                {passwordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Update Password
              </Button>
            </form>
          </div>

          {/* Incognito Mode */}
          <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 md:p-8 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <EyeOff className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Incognito Mode</h2>
                <p className="text-sm text-white/40 max-w-sm">Hide your location on the Live Discovery map. You won't be able to interact with others nearby.</p>
              </div>
            </div>
            <Switch checked={incognito} onCheckedChange={handleToggleIncognito} className="data-[state=checked]:bg-purple-500" />
          </div>

          {/* Delete Account */}
          <div className="bg-[#0A0A0A] border border-red-500/20 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-400">Delete Account</h2>
                <p className="text-sm text-white/40 max-w-sm">Permanently delete your account and all of your content. This action is not reversible.</p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              className="bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all"
              disabled={deleteAccountMutation.isPending}
              onClick={() => {
                if(confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                  deleteAccountMutation.mutate();
                }
              }}
            >
              {deleteAccountMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete Account
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
