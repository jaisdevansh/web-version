'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, User, Bell, Gift, Ticket, Star, HelpCircle, ChevronRight, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const MENU_ITEMS = [
  {
    label: 'Edit Profile',
    sublabel: 'Manage your info & photos',
    icon: User,
    route: '/settings/edit-profile',
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
    borderColor: 'border-indigo-400/20'
  },
  {
    label: 'Notification Settings',
    sublabel: 'Alerts, sounds & preferences',
    icon: Bell,
    route: '/settings/notifications',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20'
  },
  {
    label: 'Invite & Earn',
    sublabel: 'Refer friends · get bonus credits',
    icon: Gift,
    route: '/invite',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    borderColor: 'border-violet-400/20',
    badge: 'BONUS'
  },
  {
    label: 'My Rewards & Coupons',
    sublabel: 'Points, perks & exclusive deals',
    icon: Ticket,
    route: '/rewards',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/20'
  },
  {
    label: 'Rate the App',
    sublabel: 'Share your feedback',
    icon: Star,
    route: '/rate-app',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20'
  },
  {
    label: 'Terms & Support',
    sublabel: 'Help centre & legal',
    icon: HelpCircle,
    route: '/settings/terms',
    color: 'text-slate-400',
    bg: 'bg-slate-400/10',
    borderColor: 'border-slate-400/20'
  },
];

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', user?._id],
    queryFn: async () => {
      const res = await axiosInstance.get('/user/profile');
      return res.data.data || res.data;
    },
    enabled: mounted && !!user?._id,
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!mounted) return null;

  if (isLoading) {
    return <div className="flex h-[50vh] justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const defaultImage = 'https://via.placeholder.com/100';
  let profileImageUrl = profile?.profileImage || user?.profileImage || defaultImage;
  
  // Note: mobile handles base64 format differently, we mock it closely here
  if (profileImageUrl && !profileImageUrl.startsWith('http') && !profileImageUrl.startsWith('data:')) {
    profileImageUrl = `data:image/jpeg;base64,${profileImageUrl}`;
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 max-w-6xl min-h-[80vh] pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Account Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile Card & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-[#111111] border-white/5 overflow-hidden relative rounded-3xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 pointer-events-none" />
            <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 rounded-full border-2 border-indigo-500/30 p-1 mb-4 shadow-lg shadow-indigo-500/20 relative overflow-hidden flex items-center justify-center">
                <div className="w-full h-full relative rounded-full overflow-hidden">
                  <Image 
                    src={profileImageUrl} 
                    alt="Profile" 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{profile?.name || user?.name || 'Member'}</h2>
              <p className="text-sm text-white/50 mb-4 w-full truncate px-4">
                {profile?.email || user?.email || profile?.phone || user?.phone || ''}
              </p>
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase">Entry Club Member</span>
              </div>
            </CardContent>
          </Card>

          <Button 
            variant="outline" 
            className="w-full py-6 rounded-2xl bg-red-600 border-none hover:bg-red-700 text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-base font-bold tracking-wide">Sign Out</span>
          </Button>

          <p className="text-center text-white/20 text-xs font-semibold mt-4">
            Entry Club Web v1.2.0 (Stable)
          </p>
        </div>

        {/* Right Column: Menu Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MENU_ITEMS.map((item, index) => (
              <Link href={item.route} key={index} className="block group h-full">
                <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 h-full hover:bg-[#151515] hover:border-white/10 transition-all duration-300 flex flex-col relative overflow-hidden">
                  
                  {/* Hover Glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 ${item.bg} rounded-full blur-[50px] opacity-0 group-hover:opacity-50 transition-opacity duration-500 -mr-10 -mt-10 pointer-events-none`} />

                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bg} border ${item.borderColor}`}>
                      <item.icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    {item.badge && (
                      <div className={`px-2.5 py-1 rounded-md border ${item.bg} ${item.borderColor}`}>
                        <span className={`text-[10px] font-black tracking-widest uppercase ${item.color}`}>{item.badge}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative z-10 flex-1">
                    <h3 className="text-white text-lg font-bold mb-1.5 group-hover:text-white transition-colors">{item.label}</h3>
                    <p className="text-white/40 text-sm font-medium leading-relaxed">{item.sublabel}</p>
                  </div>

                  <div className="mt-6 flex justify-end relative z-10">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:translate-x-1 transition-all">
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/80" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
