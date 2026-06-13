'use client';

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Loader2, MessageSquare, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ChatTab() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['chatPeers'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/v1/chat/peers');
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="text-center p-12 bg-card rounded-xl border border-border border-dashed">
        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">No active chats</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Connect with people on Radar to start chatting!
        </p>
      </div>
    );
  }

  const peers = data;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {peers.map((peer: any) => (
        <Card key={peer._id} className="bg-card hover:bg-secondary/30 transition-colors cursor-pointer border-border">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
              <img 
                src={peer.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg'} 
                alt={peer.name} 
                className="w-full h-full object-cover"
              />
              {peer.unreadCount > 0 && (
                <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-primary border-2 border-card flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">{peer.unreadCount}</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-base truncate">{peer.name}</h3>
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(peer.lastMessageAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className={`text-sm truncate ${peer.unreadCount > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                {peer.lastMessage || 'Tap to chat'}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="pt-4 text-center">
         <p className="text-xs text-muted-foreground">Real-time messaging is powered by the Live Hub.</p>
      </div>
    </div>
  );
}
