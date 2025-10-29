import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabaseClient';

/**
 * API: Tạo đơn thanh toán qua PayOS (NextPay)
 * 
 * PayOS API Documentation: https://payos.vn/docs/api
 * 
 * Flow:
 * 1. Client gửi yêu cầu tạo thanh toán (userId, planName, amount)
 * 2. Server tạo orderCode unique
 * 3. Tạo chữ ký HMAC-SHA256 để xác thực với PayOS
 * 4. Gọi PayOS API để tạo payment link
 * 5. Trả về payment URL cho client
 */

// ⚙️ Cấu hình PayOS - Lấy từ dashboard PayOS
const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID as string;
const PAYOS_API_KEY = process.env.PAYOS_API_KEY as string;
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY as string;
const PAYOS_API_URL = 'https://api-merchant.payos.vn/v2/payment-requests';

/**
 * Hàm tạo chữ ký HMAC-SHA256
 * PayOS yêu cầu: amount + cancelUrl + description + orderCode + returnUrl
 */
function generateSignature(data: {
    amount: number;
    cancelUrl: string;
    description: string;
    orderCode: number;
    returnUrl: string;
}): string {
    const sortedData = `amount=${data.amount}&cancelUrl=${data.cancelUrl}&description=${data.description}&orderCode=${data.orderCode}&returnUrl=${data.returnUrl}`;

    return crypto
        .createHmac('sha256', PAYOS_CHECKSUM_KEY)
        .update(sortedData)
        .digest('hex');
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, planName, amount, userEmail, userName } = body;

        // ✅ Validate input
        if (!userId || !planName || !amount) {
            return NextResponse.json(
                { error: 'Missing required fields: userId, planName, amount' },
                { status: 400 }
            );
        }

        // 📝 Tạo orderCode unique (timestamp + random)
        const orderCode = Number(Date.now().toString().slice(-9) + Math.floor(Math.random() * 1000));

        // 🔗 URL callback - PayOS sẽ redirect về đây sau khi thanh toán
        // PayOS không tự thêm status vào URL, chỉ redirect về URL này
        const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/result?orderCode=${orderCode}`;
        const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/result?orderCode=${orderCode}`;

        // 📦 Payload gửi đến PayOS
        const paymentData = {
            orderCode,
            amount,
            description: `${planName} - ${userId}`, // PayOS yêu cầu tối đa 25 ký tự
            buyerName: userName || 'Customer',
            buyerEmail: userEmail || '',
            buyerPhone: '',
            buyerAddress: '',
            items: [
                {
                    name: `Gói ${planName}`,
                    quantity: 1,
                    price: amount,
                },
            ],
            cancelUrl,
            returnUrl,
            expiredAt: Math.floor(Date.now() / 1000) + 15 * 60, // Hết hạn sau 15 phút
            signature: '',
        };

        // 🔐 Tạo chữ ký
        paymentData.signature = generateSignature({
            amount: paymentData.amount,
            cancelUrl: paymentData.cancelUrl,
            description: paymentData.description,
            orderCode: paymentData.orderCode,
            returnUrl: paymentData.returnUrl,
        });

        // 🚀 Gửi request đến PayOS
        console.log('📤 Sending payment request to PayOS:', {
            orderCode,
            amount,
            userId,
        });
        console.log("🔗 returnUrl:", returnUrl);


        const response = await fetch(PAYOS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': PAYOS_CLIENT_ID,
                'x-api-key': PAYOS_API_KEY,
            },
            body: JSON.stringify(paymentData),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('❌ PayOS Error:', result);
            return NextResponse.json(
                { error: 'Failed to create payment', details: result },
                { status: response.status }
            );
        }

        // ✅ Kiểm tra response code từ PayOS
        if (result.code !== '00') {
            console.error('❌ PayOS returned error code:', result);
            return NextResponse.json(
                { error: 'Payment creation failed', details: result.desc || result },
                { status: 400 }
            );
        }

        // 💾 Tạo payment record trong DB với status pending
        try {
            const { data: paymentData, error: paymentError } = await supabase
                .from('payments')
                .insert({
                    userid: userId,
                    amount,
                    status: 'pending',
                    paidat: new Date().toISOString(),
                })
                .select()
                .single();

            if (paymentError) throw paymentError;

            // Lưu mapping orderCode → paymentId vào payment_logs cho webhook query
            await supabase.from('payment_logs').insert({
                ordercode: orderCode,
                userid: userId,
                amount,
                status: 'PENDING',
                description: `${planName} - ${userId}`,
                paymentmethod: 'PayOS',
                paymentid: paymentData.paymentid,
                created_at: new Date().toISOString(),
            });

            console.log('💾 Payment created in DB:', {
                paymentId: paymentData.paymentid,
                orderCode,
                userId
            });
        } catch (dbError) {
            console.error('⚠️ Failed to save payment:', dbError);
            // Continue anyway - webhook có thể tạo lại
        }

        // ✅ Lưu thông tin thanh toán vào DB (pending)
        // Bạn có thể lưu vào bảng payment_logs hoặc subscriptions
        console.log('✅ Payment created successfully:', {
            orderCode,
            checkoutUrl: result.data?.checkoutUrl,
            paymentLinkId: result.data?.paymentLinkId,
            qrCode: result.data?.qrCode,
        });

        // 📤 Trả về payment URL cho client
        return NextResponse.json({
            success: true,
            orderCode,
            checkoutUrl: result.data?.checkoutUrl,
            qrCode: result.data?.qrCode,
            paymentLinkId: result.data?.paymentLinkId,
            amount: result.data?.amount,
            expiredAt: result.data?.expiredAt,
        });

    } catch (error: any) {
        console.error('❌ Create payment error:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        );
    }
}
