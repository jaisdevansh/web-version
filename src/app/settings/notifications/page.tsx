'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState({
    pushBookings: true,
    pushMarketing: false,
    emailBookings: true,
    emailMarketing: true,
    smsAlerts: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success('Notification preferences saved successfully');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-[80vh]">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Notifications</h1>
      <p className="text-muted-foreground mb-8">Manage how we communicate with you.</p>

      <div className="space-y-6">
        <Card className="bg-card">
          <CardContent className="p-0">
            <div className="p-4 border-b border-border/50 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">Alerts on your device</p>
              </div>
            </div>
            <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/20">
              <div>
                <p className="font-medium">Booking Updates</p>
                <p className="text-xs text-muted-foreground">Ticket confirmations, QR codes, and changes</p>
              </div>
              <button 
                onClick={() => toggleSetting('pushBookings')}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.pushBookings ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.pushBookings ? 'translate-x-5.5 left-[2px]' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="p-4 flex justify-between items-center bg-muted/20">
              <div>
                <p className="font-medium">Promotions</p>
                <p className="text-xs text-muted-foreground">New venues and exclusive offers</p>
              </div>
              <button 
                onClick={() => toggleSetting('pushMarketing')}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.pushMarketing ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.pushMarketing ? 'translate-x-5.5 left-[2px]' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-0">
            <div className="p-4 border-b border-border/50 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Updates sent to your inbox</p>
              </div>
            </div>
            <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/20">
              <div>
                <p className="font-medium">Booking Receipts</p>
                <p className="text-xs text-muted-foreground">Invoices and detailed event information</p>
              </div>
              <button 
                onClick={() => toggleSetting('emailBookings')}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.emailBookings ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.emailBookings ? 'translate-x-5.5 left-[2px]' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="p-4 flex justify-between items-center bg-muted/20">
              <div>
                <p className="font-medium">Newsletter</p>
                <p className="text-xs text-muted-foreground">Weekly event highlights</p>
              </div>
              <button 
                onClick={() => toggleSetting('emailMarketing')}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.emailMarketing ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.emailMarketing ? 'translate-x-5.5 left-[2px]' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full h-12 bg-primary hover:bg-primary/90 text-lg">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
