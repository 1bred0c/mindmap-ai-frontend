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
                // Lấy thông tin từ URL
                const paymentStatus = searchParams?.get('status') || searchParams?.get('payment');
                const code = searchParams?.get('orderCode') || searchParams?.get('code');

                if (code) {
                    setOrderCode(code);
                }

                // Kiểm tra payment trong DB
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const userId = user?.userId;

                if (userId && code) {
                    // Tìm payment từ payment_logs
                    const { data: paymentLog } = await supabase
                        .from('payment_logs')
                        .select('*, payments:paymentid(*)')
                        .eq('ordercode', parseInt(code))
                        .eq('userid', userId)
                        .maybeSingle();

                    if (paymentLog) {
                        // Kiểm tra trạng thái trong bảng payments
                        if (paymentLog.status === 'PAID' && paymentLog.payments?.status === 'verified') {
                            setStatus('success');
                            setMessage('Bạn đã nâng cấp lên Premium thành công!');
                            return;
                        } else if (paymentLog.status === 'CANCELLED') {
                            setStatus('failed');
                            setMessage('Bạn đã hủy thanh toán.');
                            return;
                        }
                    }
                }

                // Fallback: check bằng payment status param
                if (paymentStatus === 'success' || paymentStatus === 'PAID') {
                    setStatus('success');
                    setMessage('Thanh toán thành công! Đang xử lý đơn hàng...');
                } else if (paymentStatus === 'cancelled' || paymentStatus === 'CANCELLED') {
                    setStatus('failed');
                    setMessage('Bạn đã hủy thanh toán.');
                } else {
                    setStatus('failed');
                    setMessage('Thanh toán thất bại hoặc chưa hoàn tất.');
                }
            } catch (error) {
                console.error('Error checking payment:', error);
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
