'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Settings, Bell, Clock, Ticket, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Events', href: '/dashboard/events', icon: Compass },
  { name: 'My Tickets', href: '/dashboard/tickets', icon: Ticket },
  { name: 'Activity History', href: '/dashboard/history', icon: Clock },
  { name: 'Profile', href: '/profile', icon: User },
];

function SidebarContent() {
  const pathname = usePathname();

  return (
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
  );
}

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-border/40 bg-card">
      <SidebarContent />
    </div>
  );
}

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex h-full flex-col bg-card">
          <div className="p-4 border-b border-border/40 font-bold text-xl tracking-tight">ENTRY CLUB</div>
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
