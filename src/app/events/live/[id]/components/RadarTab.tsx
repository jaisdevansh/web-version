'use client';

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Loader2, UserPlus, MapPin, Search, Radar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function RadarTab({ eventId }: { eventId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['radar', eventId],
    queryFn: async () => {
      // The radar usually accepts location params, but if bound to an event, the backend infers it
      const res = await axiosInstance.get('/api/v1/radar/nearby');
      return res.data.data;
    },
  });

  const handleConnect = async (userId: string) => {
    try {
      const res = await axiosInstance.post('/user/split-requests', {
        receiverId: userId,
        type: 'connect' // Simplified for web
      });
      if (res.data.success) {
        toast.success('Connection request sent!');
      }
    } catch (err) {
      toast.error('Could not send request.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-75"></div>
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary">
            <Search className="w-6 h-6 text-primary animate-pulse" />
          </div>
        </div>
        <p className="text-primary font-medium animate-pulse">Scanning nearby...</p>
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="text-center p-12 bg-card rounded-xl border border-border border-dashed">
        <Radar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">No one on Radar yet</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          You are the first one here or others have hidden their visibility. Make sure your visibility is turned ON.
        </p>
      </div>
    );
  }

  const users = data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {users.map((user: any) => (
        <Card key={user._id} className="bg-card hover:border-primary/50 transition-colors">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-border">
              <img 
                src={user.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg'} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">{user.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center mt-1 truncate">
                <MapPin className="w-3 h-3 mr-1" />
                {user.distance ? `${user.distance.toFixed(1)} km away` : 'At this event'}
              </p>
            </div>

            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-full shrink-0 border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => handleConnect(user._id)}
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
