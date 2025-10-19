'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { UploadReceipt } from '@/components/UploadReceipt'
import { supabase } from '@/lib/supabaseClient';


const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started',
    limitations: [
      'No AI features',
    ],
    current: true,
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

  // 🟢 ADD: lưu trạng thái gói hiện tại
  const [currentPlan, setCurrentPlan] = useState<'Free' | 'Premium'>('Free');

  // 🟢 ADD: kiểm tra DB subscriptions
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
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Pricing Plans</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your mind mapping needs. Upgrade anytime to unlock more features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {plans.map((plan, index) => {
            // thêm logic kiểm tra isCurrent
            const isCurrent = currentPlan === plan.name;

            return (
              <Card
                key={index}
                className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}
              >
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
                      {plan.currency ? plan.currency : '$'}{plan.price}
                    </span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">

                    {plan.limitations && (
                      <>
                        <hr className="my-4" />
                        <p className="text-xs text-muted-foreground font-medium">Limitations:</p>
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className="flex items-center space-x-3">
                            <div className="w-4 h-4 flex items-center justify-center">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                            </div>
                            <span className="text-sm text-muted-foreground">{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="pt-4">
                    {plan.current ? (
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
                            {/* QR Momo */}
                            <div className="text-center space-y-3">
                              <p className="font-medium">Scan QR code to pay via MoMo</p>

                              <div className="mx-auto w-48 h-48 rounded-lg overflow-hidden border">
                                <img
                                  src="/momo-qr.jpg" // đường dẫn ảnh QR của bạn (ví dụ lưu trong /public)
                                  alt="MoMo QR Code"
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <p className="text-sm text-muted-foreground">Amount: {plan.price} VND</p>
                            </div>

                            {/* Gọi component upload */}
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

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="grid gap-4 text-left">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the payment process work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simply scan the MoMo QR code to make your payment, then upload a screenshot
                  or photo of your payment receipt. Our team will verify your payment within 24 hours.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my subscription anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time. Your premium features will
                  remain active until the end of your current billing period.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens to my data if I downgrade?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your data is always safe. If you exceed the limits of your new plan,
                  you'll need to delete some content or upgrade again to access everything.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}