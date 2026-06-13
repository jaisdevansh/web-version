'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Users, ChevronLeft, Receipt, ShieldCheck, XCircle, PlusCircle, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const MOCK_FRIENDS = [
  { id: 'm1', name: 'Ananya Sharma', phone: '9876543210', avatar: 'https://i.pravatar.cc/150?u=a' },
  { id: 'm2', name: 'Rohan Malhotra', phone: '9876543211', avatar: 'https://i.pravatar.cc/150?u=b' },
  { id: 'm3', name: 'Ishani Gupta', phone: '9876543212', avatar: 'https://i.pravatar.cc/150?u=c' },
  { id: 'm4', name: 'Kabir Singh', phone: '9876543213', avatar: 'https://i.pravatar.cc/150?u=d' },
];

export default function SplitPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const total = Number(searchParams.get('total')) || 25000;
  const guests = Number(searchParams.get('guests')) || 4;
  const title = searchParams.get('title') || 'Private Event';
  const venueName = searchParams.get('venueName') || '';
  const cover = searchParams.get('coverImage') || 'https://images.unsplash.com/photo-1514525253361-bee8a197c0c1';
  const timeSlot = searchParams.get('timeSlot') || '10:30 PM onwards';
  const zone = searchParams.get('zone') || 'VIP';
  const eventId = searchParams.get('eventId') || '';
  
  const [selectedFriends, setSelectedFriends] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const activeSplits = guests > 0 ? guests : 1;
  const shareAmount = Math.ceil(total / activeSplits);
  const remainingSlots = guests - 1 - selectedFriends.length;

  const toggleFriend = (friend: any) => {
    const exists = selectedFriends.find(f => f.id === friend.id);
    if (exists) {
      setSelectedFriends(selectedFriends.filter(f => f.id !== friend.id));
    } else if (remainingSlots > 0) {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const handleRequestSplit = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      // Simulate success and redirect to booking success / dashboard
      router.push('/dashboard/bookings?tab=upcoming');
    }, 1500);
  };

  const filteredFriends = MOCK_FRIENDS.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.phone.includes(search)
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-[80vh] flex flex-col pb-32">
      <div className="flex items-center justify-between mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full bg-white/5 hover:bg-white/10"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Split Details</h1>
        <div className="w-10" />
      </div>

      <Card className="bg-[#0D0D0D] border-white/5 p-6 rounded-[28px] mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-extrabold tracking-widest text-white/40 mb-1">TOTAL BOOKING (FOR {guests})</p>
            <p className="text-4xl font-black text-white">₹{total.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Receipt className="w-6 h-6 text-primary" />
          </div>
        </div>
        
        <div className="flex items-center gap-4 pt-5 border-t border-white/10">
          <img src={cover} alt="Event" className="w-12 h-12 rounded-xl object-cover" />
          <div>
            <p className="font-bold text-sm text-white">{zone} Booth • {title}</p>
            <p className="text-xs text-white/40 mt-1">Sat, 24 Oct • {timeSlot}</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-white/50">Split Details</h2>
        <div className="text-right">
          <p className="text-2xl font-black text-primary">₹{shareAmount.toLocaleString()} <span className="text-sm font-normal text-white/30">each</span></p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <Input 
              placeholder="Search mock contacts..." 
              className="h-14 pl-12 bg-[#0D0D0D] border-white/10 rounded-2xl text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <DialogTrigger
            render={
              <Button className="w-14 h-14 rounded-2xl bg-primary hover:bg-primary/90">
                <Users className="w-6 h-6 text-white" />
              </Button>
            }
          />
        </div>

        <DialogContent className="bg-[#0D0D0D] border-white/10 text-white rounded-[32px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-1">My Contacts</DialogTitle>
            <p className="text-primary text-sm font-semibold">{remainingSlots} slots empty</p>
          </DialogHeader>
          
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <Input 
              placeholder="Search contacts..." 
              className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-2">
            {filteredFriends.map(f => {
              const isAdded = selectedFriends.find(sf => sf.id === f.id);
              return (
                <button 
                  key={f.id}
                  onClick={() => toggleFriend(f)}
                  disabled={!isAdded && remainingSlots <= 0}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-colors ${isAdded ? 'bg-primary/10' : 'hover:bg-white/5'} ${(!isAdded && remainingSlots <= 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <img src={f.avatar} alt={f.name} className="w-11 h-11 rounded-full" />
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm text-white">{f.name}</p>
                    <p className="text-xs text-white/40">{f.phone}</p>
                  </div>
                  {isAdded ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <PlusCircle className="w-6 h-6 text-white/20" />
                  )}
                </button>
              );
            })}
          </div>
          
          <Button className="w-full h-14 rounded-xl font-bold mt-4" onClick={() => setIsDialogOpen(false)}>
            Done
          </Button>
        </DialogContent>
      </Dialog>

      <div className="mb-2">
        <h3 className="text-[11px] font-extrabold text-white/40 mb-4">Participants ({selectedFriends.length + 1}/{guests})</h3>
        
        <div className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-2xl mb-3">
          <img src={user?.profileImage || "https://i.pravatar.cc/150?u=me"} alt="You" className="w-12 h-12 rounded-full border border-white/10" />
          <div className="flex-1">
            <p className="font-bold text-white flex items-center gap-2">
              {user?.name || 'You'} <ShieldCheck className="w-4 h-4 text-primary" />
            </p>
            <p className="text-sm text-white/40">₹{shareAmount.toLocaleString()}</p>
          </div>
          <div className="bg-primary/20 px-3 py-1.5 rounded-lg">
            <span className="text-[10px] font-black text-primary">SETTLED</span>
          </div>
        </div>

        {selectedFriends.map(f => (
          <div key={f.id} className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-2xl mb-3">
            <img src={f.avatar} alt={f.name} className="w-12 h-12 rounded-full border border-white/10" />
            <div className="flex-1">
              <p className="font-bold text-white">{f.name}</p>
              <p className="text-sm text-white/40">₹{shareAmount.toLocaleString()}</p>
            </div>
            <button onClick={() => toggleFriend(f)} className="p-2">
              <XCircle className="w-6 h-6 text-white/20 hover:text-white/40" />
            </button>
          </div>
        ))}

        {Array.from({ length: remainingSlots }).map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setIsDialogOpen(true)}
            className="w-full flex items-center gap-4 p-4 border-2 border-dashed border-white/10 rounded-2xl mb-3 hover:bg-white/5 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-white/20" />
            </div>
            <span className="text-sm font-semibold text-white/30">Add Friend Share</span>
          </button>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#030303] border-t border-white/5 z-40">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-white/40">Total Guests: {guests}</span>
            <span className="text-xl font-black text-white">₹{total.toLocaleString()}</span>
          </div>
          <Button 
            className="w-full h-14 rounded-2xl text-base font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-primary/20 border-none"
            onClick={handleRequestSplit}
            disabled={processing}
          >
            {processing ? 'Requesting...' : 'Request Split & Pay'}
          </Button>
        </div>
      </div>
    </div>
  );
}
