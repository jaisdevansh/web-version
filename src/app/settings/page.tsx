'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Shield, Bell, CreditCard, LogOut, FileText, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { title: 'Edit Profile', icon: User, href: '/profile' },
    { title: 'Payment Methods', icon: CreditCard, href: '/settings/payment-methods' },
    { title: 'Notifications', icon: Bell, href: '/settings/notifications' },
    { title: 'Privacy Policy', icon: Shield, href: '/settings/privacy' },
    { title: 'Terms of Service', icon: FileText, href: '/settings/terms' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-[80vh]">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>

      <div className="space-y-4">
        {menuItems.map((item, index) => (
          <Link href={item.href} key={index} className="block">
            <Card className="bg-card hover:bg-secondary/20 transition-colors border-border/50 cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-lg">{item.title}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}

        <Card className="bg-red-600 hover:bg-red-700 transition-colors border-none cursor-pointer mt-8" onClick={handleLogout}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <LogOut className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg pr-4">Log Out</span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
