'use client';

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Utensils, Clock, Receipt } from 'lucide-react';
import Link from 'next/link';

export default function MyOrdersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myFoodOrders'],
    queryFn: async () => {
      const res = await axiosInstance.get('/user/orders/my');
      return res.data.data;
    },
  });

  if (isLoading) {
    return <div className="flex h-[50vh] justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <div className="text-destructive text-center p-8">Failed to load orders.</div>;
  }

  const orders = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Food & Drink Orders</h1>
        <p className="text-muted-foreground mt-1">Track your active and past orders from events.</p>
      </div>

      {orders.length === 0 ? (
        <Card className="bg-card/50 border-dashed border-border p-12 text-center">
          <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-sm text-muted-foreground mb-6">You haven't ordered any food or drinks yet.</p>
          <Link href="/events">
            <Button className="bg-primary hover:bg-primary/90">Find an Event</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order: any) => (
            <Card key={order._id} className="bg-card hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2 border-b border-border/50">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-bold">Order #{order.orderNumber || order._id.substring(order._id.length - 6).toUpperCase()}</CardTitle>
                  <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                    order.status === 'pending' || order.status === 'preparing' ? 'bg-yellow-500/20 text-yellow-500' :
                    order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.qty}x {item.name}</span>
                      <span className="text-muted-foreground">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-3 border-t border-border flex justify-between items-center text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Receipt className="w-4 h-4 mr-2" />
                    Total Paid
                  </div>
                  <div className="font-bold text-base">
                    ₹{order.totalAmount || order.subtotal}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
