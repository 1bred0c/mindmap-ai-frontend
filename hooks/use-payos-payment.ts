/**
 * Hook: usePayOSPayment
 * 
 * Custom hook để xử lý thanh toán qua PayOS
 * 
 * Features:
 * - Tạo payment link
 * - Mở popup thanh toán
 * - Polling kiểm tra trạng thái
 * - Cập nhật UI khi thanh toán thành công
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PaymentData {
    userId: string;
    planName: string;
    amount: number;
    userEmail?: string;
    userName?: string;
}

interface PaymentResponse {
    success: boolean;
    orderCode: number;
    checkoutUrl: string;
    qrCode?: string;
}

export function usePayOSPayment() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    /**
     * Tạo thanh toán và mở popup PayOS
     */
    const createPayment = async (data: PaymentData): Promise<PaymentResponse | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Không thể tạo thanh toán');
            }

            return result;

        } catch (err: any) {
            setError(err.message);
            console.error('❌ Payment error:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Mở popup thanh toán PayOS
     */
    const openPaymentPopup = (checkoutUrl: string) => {
        const width = 600;
        const height = 700;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        const popup = window.open(
            checkoutUrl,
            'PayOS Payment',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
        );

        // Kiểm tra popup có bị block không
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            alert('Popup bị chặn! Vui lòng cho phép popup để thanh toán.');
            window.location.href = checkoutUrl;
        }

        return popup;
    };

    /**
     * Polling kiểm tra trạng thái thanh toán từ PayOS
     */
    const pollPaymentStatus = async (orderCode: number): Promise<boolean> => {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 100; // 100 * 3s = 5 phút

            const interval = setInterval(async () => {
                try {
                    attempts++;
                    console.log(`🔄 Checking payment status (${attempts}/${maxAttempts})...`);

                    // Lấy userId
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    const userId = user?.userId;

                    if (!userId) {
                        clearInterval(interval);
                        resolve(false);
                        return;
                    }

                    // Gọi API check-payment
                    const response = await fetch('/api/check-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderCode, userId }),
                    });

                    const result = await response.json();

                    if (result.success && result.status === 'PAID') {
                        console.log('✅ Payment confirmed!');
                        clearInterval(interval);
                        resolve(true);
                        return;
                    }

                    if (result.status === 'CANCELLED') {
                        console.log('❌ Payment cancelled');
                        clearInterval(interval);
                        resolve(false);
                        return;
                    }

                    // Timeout sau maxAttempts
                    if (attempts >= maxAttempts) {
                        console.log('⏱️ Polling timeout');
                        clearInterval(interval);
                        resolve(false);
                    }

                } catch (err) {
                    console.error('❌ Polling error:', err);
                }
            }, 3000); // Check mỗi 3 giây
        });
    };

    return {
        createPayment,
        openPaymentPopup,
        pollPaymentStatus,
        isLoading,
        error,
    };
}
