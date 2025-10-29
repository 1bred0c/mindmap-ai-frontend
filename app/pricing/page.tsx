'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, CreditCard, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePayOSPayment } from '@/hooks/use-payos-payment';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';


const plans = [
  {
    name: 'Free',
    currency: 'VND 0',
    description: 'Perfect for getting started',

  },
  {
    name: 'Premium',
    price: '59.000',
    currency: 'VND ',
    period: '/month',
    description: 'Everything you need for professional work',
    popular: true,
  },
];

function PricingContent() {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<'Free' | 'Premium'>('Free');
  const [isProcessing, setIsProcessing] = useState(false);

  const searchParams = useSearchParams();
  const { createPayment, openPaymentPopup, pollPaymentStatus, isLoading, error } = usePayOSPayment();
  const { toast } = useToast();

  // ✅ Kiểm tra subscription từ DB
  const checkSubscription = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user?.userId;
      if (!userId) return;

      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('userid', userId)
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

  useEffect(() => {
    checkSubscription();

    // Xử lý redirect từ PayOS
    const paymentStatus = searchParams?.get('payment');
    if (paymentStatus === 'success') {
      toast({
        title: '✅ Thanh toán thành công!',
        description: 'Đang kiểm tra trạng thái subscription...',
      });
      // Refresh subscription sau 2s
      setTimeout(() => {
        checkSubscription();
      }, 2000);
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: 'Thanh toán bị hủy',
        description: 'Bạn đã hủy thanh toán',
        variant: 'destructive',
      });
    }
  }, [searchParams]);

  // 💳 Xử lý thanh toán qua PayOS
  const handlePayOSPayment = async (planName: string, amount: number) => {
    try {
      setIsProcessing(true);

      // Lấy thông tin user
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user?.userId;
      const userEmail = user?.email || '';
      const userName = user?.name || user?.username || '';

      if (!userId) {
        toast({
          title: 'Lỗi',
          description: 'Vui lòng đăng nhập để tiếp tục',
          variant: 'destructive',
        });
        return;
      }

      // ⏳ Tạo payment
      toast({
        title: 'Đang tạo thanh toán...',
        description: 'Vui lòng đợi trong giây lát',
      });

      const paymentResult = await createPayment({
        userId,
        planName,
        amount,
        userEmail,
        userName,
      });

      if (!paymentResult) {
        throw new Error('Không thể tạo thanh toán');
      }

      setShowPaymentDialog(false);

      // 🚀 Mở popup thanh toán
      toast({
        title: 'Chuyển hướng thanh toán',
        description: 'Vui lòng hoàn tất thanh toán trong cửa sổ mới',
      });

      openPaymentPopup(paymentResult.checkoutUrl);

      // 🔄 Polling kiểm tra trạng thái
      const isPaid = await pollPaymentStatus(paymentResult.orderCode);

      if (isPaid) {
        toast({
          title: '✅ Thanh toán thành công!',
          description: 'Bạn đã nâng cấp lên Premium',
        });

        // Refresh subscription status
        await checkSubscription();
      } else {
        toast({
          title: 'Chưa nhận được xác nhận',
          description: 'Vui lòng kiểm tra lại sau vài phút hoặc liên hệ hỗ trợ',
          variant: 'destructive',
        });
      }

    } catch (err: any) {
      console.error('❌ Payment error:', err);
      toast({
        title: 'Lỗi thanh toán',
        description: err.message || 'Đã có lỗi xảy ra, vui lòng thử lại',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
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
                  {/* <div className="space-y-3">

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
                  </div> */}
                  <div className="pt-4">
                    {isCurrent ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (plan.name !== 'Free' && plan.price && (
                      <Button
                        className="w-full"
                        onClick={() => handlePayOSPayment(plan.name, parseInt(plan.price!.replace(/\./g, '')))}
                        disabled={isLoading || isProcessing}
                      >
                        {isLoading || isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Thanh toán qua PayOS
                          </>
                        )}
                      </Button>
                    )
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

export default function PricingPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    }>
      <PricingContent />
    </Suspense>
  );
}