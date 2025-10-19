'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UploadReceipt } from '@/components/UploadReceipt';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started',
    limitations: ['No AI features'],
  },
  {
    name: 'Premium',
    price: '59,000',
    currency: 'VND',
    period: '/month',
    description: 'Everything you need for professional work',
    popular: true,
  },
];

export default function PricingPage() {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<'Free' | 'Premium'>('Free');

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user?.userid;
        if (!userId) return;

        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('userid', userId)
          .eq('status', 'active')
          .gte('enddate', today)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setCurrentPlan('Premium');
        } else {
          setCurrentPlan('Free');
        }
      } catch (err) {
        console.error('Error checking subscription:', err);
      }
    };

    checkSubscription();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Pricing Plans</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your mind mapping needs. Upgrade anytime to unlock more features.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {plans.map((plan, index) => {
            const isCurrent = currentPlan === plan.name;
            return (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold">
                      {plan.currency ? plan.currency : '$'}
                      {plan.price}
                    </span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {plan.limitations && (
                    <>
                      <hr className="my-4" />
                      <p className="text-xs text-muted-foreground font-medium">Limitations:</p>
                      {plan.limitations.map((l, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                          <span className="text-sm text-muted-foreground">{l}</span>
                        </div>
                      ))}
                    </>
                  )}

                  <div className="pt-4">
                    {isCurrent ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                        <DialogTrigger asChild>
                          <Button className="w-full">Upgrade to {plan.name}</Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Payment Information</DialogTitle>
                            <DialogDescription>
                              Pay via MoMo and upload your receipt for verification.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div className="text-center space-y-3">
                              <p className="font-medium">Scan QR code to pay via MoMo</p>
                              <div className="mx-auto w-48 h-48 rounded-lg overflow-hidden border">
                                <img src="/momo-qr.jpg" alt="MoMo QR" className="w-full h-full object-cover" />
                              </div>
                              <p className="text-sm text-muted-foreground">Amount: {plan.price} VND</p>
                            </div>

                            <UploadReceipt
                              onSuccess={() => console.log('Upload thành công!')}
                              onClose={() => setShowPaymentDialog(false)}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
