'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Settings, Bell, Clock, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Tickets', href: '/dashboard/tickets', icon: Ticket },
  { name: 'Activity History', href: '/dashboard/history', icon: Clock },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: User },

];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-border/40 bg-card">
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="grid items-start px-4 text-sm font-medium gap-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
