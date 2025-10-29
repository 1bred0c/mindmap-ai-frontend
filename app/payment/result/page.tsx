'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

function PaymentResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [message, setMessage] = useState('');
    const [orderCode, setOrderCode] = useState('');

    useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                // Lấy thông tin từ URL - PayOS chỉ có orderCode, không có status
                const code = searchParams?.get('orderCode') || searchParams?.get('code');
                console.log("🔍 URL params - orderCode:", code);

                if (code) {
                    setOrderCode(code);
                }

                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const userId = user?.userId;

                if (!userId) {
                    setStatus('failed');
                    setMessage('Vui lòng đăng nhập để xem kết quả thanh toán');
                    return;
                }

                if (!code) {
                    setStatus('failed');
                    setMessage('Không tìm thấy mã đơn hàng');
                    return;
                }

                console.log('🔄 Checking payment status from PayOS API...');

                // Gọi API check-payment để lấy trạng thái thật từ PayOS
                try {
                    const response = await fetch('/api/check-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderCode: parseInt(code), userId }),
                    });

                    const result = await response.json();
                    console.log('📦 PayOS status:', result);

                    // Nếu thanh toán thành công từ PayOS
                    if (result.success && result.status === 'PAID') {
                        try {
                            // 1️⃣ Tìm paymentId từ payment_logs
                            const { data: logData, error: logError } = await supabase
                                .from('payment_logs')
                                .select('paymentid, userid')
                                .eq('ordercode', parseInt(code))
                                .eq('userid', userId)
                                .maybeSingle();

                            if (logError || !logData) {
                                console.error('❌ Payment log not found:', logError);
                                setStatus('failed');
                                setMessage('Không tìm thấy thông tin thanh toán');
                                return;
                            }

                            const paymentId = logData.paymentid;

                            // 2️⃣ Update payments table → status = 'verified'
                            const { error: paymentError } = await supabase
                                .from('payments')
                                .update({
                                    status: 'verified',
                                    paidat: new Date().toISOString(),
                                })
                                .eq('paymentid', paymentId);

                            if (paymentError) {
                                console.error('❌ Failed to update payment:', paymentError);
                                throw paymentError;
                            }

                            console.log('✅ Payment updated to verified');

                            // 3️⃣ Tạo hoặc cập nhật subscription
                            const today = new Date().toISOString().split('T')[0];
                            const endDate = new Date();
                            endDate.setMonth(endDate.getMonth() + 1);
                            const endDateStr = endDate.toISOString().split('T')[0];

                            // Kiểm tra subscription hiện tại
                            const { data: existingSub } = await supabase
                                .from('subscriptions')
                                .select('*')
                                .eq('userid', userId)
                                .maybeSingle();

                            let subscriptionId;

                            if (existingSub) {
                                // Gia hạn subscription hiện tại
                                const currentEnd = new Date(existingSub.enddate);
                                const newEnd = new Date(currentEnd);
                                newEnd.setMonth(newEnd.getMonth() + 1);

                                const { data: updatedSub, error: subError } = await supabase
                                    .from('subscriptions')
                                    .update({
                                        enddate: newEnd.toISOString().split('T')[0],
                                        status: 'active',
                                    })
                                    .eq('subscriptionid', existingSub.subscriptionid)
                                    .select()
                                    .single();

                                if (subError) throw subError;
                                subscriptionId = updatedSub.subscriptionid;
                                console.log('✅ Subscription extended to:', newEnd.toISOString().split('T')[0]);
                            } else {
                                // Tạo subscription mới
                                const { data: newSub, error: subError } = await supabase
                                    .from('subscriptions')
                                    .insert({
                                        userid: userId,
                                        startdate: today,
                                        enddate: endDateStr,
                                        status: 'active',
                                    })
                                    .select()
                                    .single();

                                if (subError) throw subError;
                                subscriptionId = newSub.subscriptionid;
                                console.log('✅ New subscription created, ends:', endDateStr);
                            }

                            // 4️⃣ Link payment với subscription
                            await supabase
                                .from('payments')
                                .update({ subscriptionid: subscriptionId })
                                .eq('paymentid', paymentId);

                            // 5️⃣ Update payment_logs
                            await supabase
                                .from('payment_logs')
                                .update({ status: 'PAID' })
                                .eq('ordercode', parseInt(code));

                            console.log('🎉 Payment and subscription updated successfully!');

                            // Hiển thị thành công
                            setStatus('success');
                            setMessage('Bạn đã nâng cấp lên Premium thành công!');

                        } catch (err: any) {
                            console.error('❌ Error updating payment:', err);
                            setStatus('failed');
                            setMessage('Có lỗi khi cập nhật thanh toán: ' + err.message);
                        }
                    } else if (result.status === 'CANCELLED') {
                        // Nếu hủy thanh toán
                        setStatus('failed');
                        setMessage('Bạn đã hủy thanh toán.');
                    } else {
                        // Chưa thanh toán hoặc trạng thái khác
                        setStatus('failed');
                        setMessage(`Thanh toán chưa hoàn tất. Trạng thái: ${result.status || 'PENDING'}`);
                    }

                } catch (apiError: any) {
                    console.error('❌ Error calling check-payment API:', apiError);
                    setStatus('failed');
                    setMessage('Không thể kiểm tra trạng thái thanh toán');
                }

            } catch (error) {
                console.error('Error in checkPaymentStatus:', error);
                setStatus('failed');
                setMessage('Có lỗi xảy ra khi kiểm tra thanh toán.');
            }
        };

        checkPaymentStatus();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
            <Card className="max-w-md w-full shadow-2xl">
                <CardHeader className="text-center space-y-4">
                    {status === 'loading' && (
                        <>
                            <div className="flex justify-center">
                                <Loader2 className="h-16 w-16 text-primary animate-spin" />
                            </div>
                            <CardTitle className="text-2xl">Đang kiểm tra thanh toán...</CardTitle>
                            <CardDescription>Vui lòng đợi trong giây lát</CardDescription>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="flex justify-center">
                                <div className="relative">
                                    <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
                                    <div className="absolute inset-0 h-16 w-16 bg-green-500/20 rounded-full animate-ping" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                                Thanh toán thành công!
                            </CardTitle>
                            <CardDescription className="text-base">{message}</CardDescription>
                            {orderCode && (
                                <p className="text-sm text-muted-foreground">Mã đơn hàng: {orderCode}</p>
                            )}
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <div className="flex justify-center">
                                <XCircle className="h-16 w-16 text-destructive" />
                            </div>
                            <CardTitle className="text-2xl text-destructive">Thanh toán không thành công</CardTitle>
                            <CardDescription className="text-base">{message}</CardDescription>
                            {orderCode && (
                                <p className="text-sm text-muted-foreground">Mã đơn hàng: {orderCode}</p>
                            )}
                        </>
                    )}
                </CardHeader>

                <CardContent className="space-y-4">
                    {status === 'success' && (
                        <>
                            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-2">
                                <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                                    ✓ Gói Premium đã được kích hoạt
                                </p>
                                <p className="text-xs text-green-700 dark:text-green-300">
                                    Bạn có thể sử dụng tất cả tính năng Premium ngay bây giờ!
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={() => router.push('/dashboard')}
                                    className="flex-1"
                                >
                                    Về Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button
                                    onClick={() => router.push('/pricing')}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Xem gói đăng ký
                                </Button>
                            </div>
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
                                <p className="text-sm font-semibold text-destructive">
                                    Thanh toán chưa hoàn tất
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Nếu bạn đã thanh toán, vui lòng đợi vài phút hoặc liên hệ hỗ trợ.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={() => router.push('/pricing')}
                                    className="flex-1"
                                >
                                    Thử lại
                                </Button>
                                <Button
                                    onClick={() => router.push('/dashboard')}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Về Dashboard
                                </Button>
                            </div>
                        </>
                    )}

                    {status === 'loading' && (
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Đang xác minh thông tin thanh toán...
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function PaymentResultPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
                <Card className="max-w-md w-full shadow-2xl">
                    <CardHeader className="text-center space-y-4">
                        <div className="flex justify-center">
                            <Loader2 className="h-16 w-16 text-primary animate-spin" />
                        </div>
                        <CardTitle className="text-2xl">Đang tải...</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        }>
            <PaymentResultContent />
        </Suspense>
    );
}
