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
import { useState } from 'react';
import { UploadReceipt } from '@/components/UploadReceipt'


const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 workspaces',
      'Up to 10 mind maps',
      'Basic templates',
      'Export as PNG',
      'Community support',
    ],
    limitations: [
      'No AI features',
      'No real-time collaboration',
      'Limited export formats',
    ],
    current: true,
  },
  {
    name: 'Premium',
    price: '99,000',
    currency: 'VND',
    period: '/month',
    description: 'Everything you need for professional work',
    features: [
      'Unlimited workspaces',
      'Unlimited mind maps',
      'AI-powered generation',
      'Real-time collaboration',
      'Priority support',
      'Advanced templates',
      'Export in all formats',
      'Custom branding',
      'Analytics & insights',
      'Version history',
    ],
    popular: true,
  },
];

export default function PricingPage() {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };




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
          {plans.map((plan, index) => (
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
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
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
                            <div className="mx-auto w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">MoMo QR Code</span>
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
          ))}
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