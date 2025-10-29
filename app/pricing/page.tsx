'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CreditCard, Loader2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
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

// 🎯 Payment State Type
type PaymentState = 'idle' | 'processing' | 'success' | 'failed';

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState<'Free' | 'Premium'>('Free');
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');
  const [orderCode, setOrderCode] = useState<number>(0);
  const [currentUserId, setCurrentUserId] = useState<number>(0);

  const { toast } = useToast();

  // ✅ Bước 0: Kiểm tra subscription hiện tại
  const checkSubscription = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user?.userId;
      if (!userId) return;

      setCurrentUserId(userId);

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
  }, []);

  // 💳 Bước 1: Tạo payment link từ PayOS
  const handleCreatePayment = async (planName: string, amount: number) => {
    try {
      setPaymentState('processing');

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
        setPaymentState('idle');
        return;
      }

      console.log('📤 Creating payment...');

      // Gọi API tạo payment
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          planName,
          amount,
          userEmail,
          userName,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Không thể tạo thanh toán');
      }

      console.log('✅ Payment created:', result.orderCode);

      // Lưu thông tin để xử lý sau
      setCheckoutUrl(result.checkoutUrl);
      setOrderCode(result.orderCode);
      setCurrentUserId(userId);

      // Hiển thị iframe PayOS (tiếp tục ở bước 2)
      toast({
        title: 'Đang mở thanh toán...',
        description: 'Vui lòng hoàn tất thanh toán trong cửa sổ bên dưới',
      });

    } catch (err: any) {
      console.error('❌ Payment error:', err);
      toast({
        title: 'Lỗi thanh toán',
        description: err.message || 'Đã có lỗi xảy ra',
        variant: 'destructive',
      });
      setPaymentState('failed');
    }
  };

  // 🔄 Bước 2: Polling kiểm tra trạng thái PayOS
  useEffect(() => {
    if (paymentState !== 'processing' || !orderCode) return;

    let pollCount = 0;
    const maxPolls = 100; // 100 * 3s = 5 phút
    const intervalMs = 3000;

    const pollInterval = setInterval(async () => {
      try {
        pollCount++;
        console.log(`🔄 Checking payment status (${pollCount}/${maxPolls})...`);

        // Gọi API check-payment để kiểm tra PayOS
        const response = await fetch('/api/check-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderCode, userId: currentUserId }),
        });

        const result = await response.json();

        if (result.success && result.status === 'PAID') {
          console.log('✅ Payment confirmed!');
          clearInterval(pollInterval);
          setPaymentState('success');

          toast({
            title: '🎉 Thanh toán thành công!',
            description: 'Gói Premium đã được kích hoạt',
          });

          // Refresh subscription
          await checkSubscription();
          return;
        }

        if (result.status === 'CANCELLED') {
          console.log('❌ Payment cancelled');
          clearInterval(pollInterval);
          setPaymentState('failed');

          toast({
            title: 'Thanh toán bị hủy',
            description: 'Bạn đã hủy thanh toán',
            variant: 'destructive',
          });
          return;
        }

        // Timeout
        if (pollCount >= maxPolls) {
          console.log('⏱️ Polling timeout');
          clearInterval(pollInterval);
          setPaymentState('failed');

          toast({
            title: 'Timeout',
            description: 'Không nhận được xác nhận từ PayOS. Vui lòng kiểm tra lại.',
            variant: 'destructive',
          });
        }

      } catch (err) {
        console.error('Polling error:', err);
      }
    }, intervalMs);

    return () => clearInterval(pollInterval);
  }, [paymentState, orderCode, currentUserId]);

  // 🔙 Quay lại danh sách plans
  const handleBackToPlans = () => {
    setPaymentState('idle');
    setCheckoutUrl('');
    setOrderCode(0);
  };

  // 🎨 Render: Màn hình thanh toán đang xử lý (iframe PayOS)
  if (paymentState === 'processing' && checkoutUrl) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBackToPlans}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Đang chờ thanh toán...</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Thanh toán qua PayOS</CardTitle>
              <CardDescription>
                Vui lòng hoàn tất thanh toán trong cửa sổ bên dưới.
                Hệ thống sẽ tự động cập nhật khi thanh toán thành công.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[600px] border rounded-lg overflow-hidden">
                <iframe
                  src={checkoutUrl}
                  className="w-full h-full"
                  title="PayOS Payment"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
                />
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 <strong>Hướng dẫn:</strong>
                </p>
                <ul className="text-xs text-blue-700 dark:text-blue-300 mt-2 space-y-1 ml-4 list-disc">
                  <li>Chọn phương thức thanh toán (QR, MoMo, ZaloPay...)</li>
                  <li>Quét mã QR hoặc nhập thông tin thanh toán</li>
                  <li>Sau khi thanh toán xong, hệ thống sẽ tự động xác nhận (không cần đóng cửa sổ)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // 🎨 Render: Màn hình thanh toán thành công
  if (paymentState === 'success') {
    return (
      <DashboardLayout>
        <div className="p-6 min-h-screen flex items-center justify-center">
          <Card className="max-w-md w-full shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
                  <div className="absolute inset-0 h-16 w-16 bg-green-500/20 rounded-full animate-ping" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                🎉 Thanh toán thành công!
              </CardTitle>
              <CardDescription className="text-base">
                Bạn đã nâng cấp lên gói Premium thành công!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                  ✓ Gói Premium đã được kích hoạt
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Bạn có thể sử dụng tất cả tính năng Premium ngay bây giờ!
                </p>
              </div>
              <Button onClick={handleBackToPlans} className="w-full">
                Quay lại trang chính
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // 🎨 Render: Màn hình thanh toán thất bại
  if (paymentState === 'failed') {
    return (
      <DashboardLayout>
        <div className="p-6 min-h-screen flex items-center justify-center">
          <Card className="max-w-md w-full shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <XCircle className="h-16 w-16 text-destructive" />
              </div>
              <CardTitle className="text-2xl text-destructive">
                Thanh toán không thành công
              </CardTitle>
              <CardDescription className="text-base">
                Thanh toán đã bị hủy hoặc thất bại
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-destructive">
                  Thanh toán chưa hoàn tất
                </p>
                <p className="text-xs text-muted-foreground">
                  Nếu bạn đã thanh toán, vui lòng đợi vài phút hoặc liên hệ hỗ trợ.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={handleBackToPlans} className="w-full">
                  Thử lại
                </Button>
                <Button onClick={handleBackToPlans} variant="outline" className="w-full">
                  Quay lại
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // 🎨 Render: Màn hình chọn gói (idle)
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
                  <div className="pt-4">
                    {isCurrent ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (plan.name !== 'Free' && plan.price && (
                      <Button
                        className="w-full"
                        onClick={() => handleCreatePayment(plan.name, parseInt(plan.price!.replace(/\./g, '')))}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Thanh toán qua PayOS
                      </Button>
                    ))}
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
                  Click "Thanh toán qua PayOS" button, complete payment in the embedded PayOS window,
                  and your Premium subscription will be activated automatically.
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
