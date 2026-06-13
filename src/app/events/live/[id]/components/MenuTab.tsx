'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Loader2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function MenuTab({ eventId, hostId }: { eventId: string; hostId: string }) {
  const [cart, setCart] = useState<Record<string, number>>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['menu', eventId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/user/events/${eventId}/menu`);
      return res.data.data;
    },
  });

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="text-center p-8 bg-card rounded-xl border border-border">
        <p className="text-muted-foreground">No menu items available right now.</p>
      </div>
    );
  }

  const items = data;

  const updateCart = (itemId: string, diff: number) => {
    setCart((prev) => {
      const newQty = Math.max(0, (prev[itemId] || 0) + diff);
      const newCart = { ...prev };
      if (newQty === 0) delete newCart[itemId];
      else newCart[itemId] = newQty;
      return newCart;
    });
  };

  const calculateTotal = () => {
    let total = 0;
    Object.keys(cart).forEach((id) => {
      const item = items.find((i: any) => i._id === id);
      if (item) total += item.price * cart[id];
    });
    return total;
  };

  const handlePlaceOrder = async () => {
    if (Object.keys(cart).length === 0) return;

    try {
      // In a real flow, you would pass these to the initiateFoodPayment Razorpay flow
      // Or if they have tab/credit, deduct it.
      const orderPayload = {
        eventId,
        items: Object.keys(cart).map((id) => {
          const item = items.find((i: any) => i._id === id);
          return { _id: id, name: item.name, price: item.price, qty: cart[id] };
        }),
        subtotal: calculateTotal(),
        serviceFee: 0,
        tipAmount: 0,
      };

      const res = await axiosInstance.post('/user/payments/food/order', orderPayload);
      if (res.data.success) {
        toast.success('Order placed successfully! It will be brought to your table.');
        setCart({});
      } else {
        toast.error('Failed to place order.');
      }
    } catch (err) {
      toast.error('An error occurred while placing your order.');
    }
  };

  const total = calculateTotal();

  return (
    <div className="relative pb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item: any) => {
          const qty = cart[item._id] || 0;
          return (
            <Card key={item._id} className="bg-card">
              <CardContent className="p-4 flex gap-4">
                {item.image && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-lg">₹{item.price}</span>
                    <div className="flex items-center space-x-3 bg-secondary rounded-full px-2 py-1">
                      <button onClick={() => updateCart(item._id, -1)} className="p-1 rounded-full hover:bg-background"><Minus className="w-4 h-4" /></button>
                      <span className="font-semibold w-4 text-center">{qty}</span>
                      <button onClick={() => updateCart(item._id, 1)} className="p-1 rounded-full hover:bg-background text-primary"><Plus className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {total > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-10">
          <div className="container mx-auto max-w-5xl flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">₹{total}</p>
            </div>
            <Button onClick={handlePlaceOrder} className="bg-primary hover:bg-primary/90 text-white px-8 h-12">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Place Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
