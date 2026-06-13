'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Trash2 } from 'lucide-react';

export default function PaymentMethodsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-[80vh]">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Payment Methods</h1>
      <p className="text-muted-foreground mb-8">Manage your saved cards and payment options.</p>

      <div className="space-y-4">
        {/* Placeholder for actual saved cards. In a real app, you'd fetch this from the backend / Razorpay vault */}
        <Card className="bg-card border-primary/20">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-bold">•••• •••• •••• 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/28</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full border-dashed border-2 py-8 text-muted-foreground hover:text-foreground">
          <Plus className="w-5 h-5 mr-2" />
          Add New Payment Method
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Payments are securely processed by Razorpay. We do not store your full card details on our servers.
        </p>
      </div>
    </div>
  );
}
