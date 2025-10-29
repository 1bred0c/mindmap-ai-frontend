import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabaseClient';

/**
 * API Webhook: Nhận callback từ PayOS khi thanh toán hoàn tất
 * 
 * PayOS sẽ gửi POST request đến endpoint này khi:
 * - Thanh toán thành công
 * - Thanh toán thất bại
 * - Thanh toán bị hủy
 * 
 * Flow:
 * 1. Nhận webhook từ PayOS
 * 2. Xác thực chữ ký HMAC-SHA256
 * 3. Kiểm tra trạng thái thanh toán
 * 4. Cập nhật database (subscriptions/payment_logs)
 * 5. Trả về response 200 OK
 */

const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY as string;

/**
 * Xác thực chữ ký webhook từ PayOS
 */
function verifyWebhookSignature(data: any, receivedSignature: string): boolean {
    // PayOS gửi signature trong header hoặc body
    // Format: code + id + cancel + status + orderCode
    const signatureData = `code=${data.code}&desc=${data.desc}&id=${data.id}&cancel=${data.cancel}&status=${data.status}&orderCode=${data.orderCode}`;

    const computedSignature = crypto
        .createHmac('sha256', PAYOS_CHECKSUM_KEY)
        .update(signatureData)
        .digest('hex');

    return computedSignature === receivedSignature;
}

/**
 * Cập nhật payment và subscription khi thanh toán thành công
 */
async function handlePaymentSuccess(orderCode: number, userId: string, amount: number) {
    try {
        // 1️⃣ Lấy paymentId từ payment_logs
        const { data: logData } = await supabase
            .from('payment_logs')
            .select('paymentid')
            .eq('ordercode', orderCode)
            .maybeSingle();

        const paymentId = logData?.paymentid;

        // 2️⃣ Update payment status = verified
        if (paymentId) {
            const { error: paymentError } = await supabase
                .from('payments')
                .update({
                    status: 'verified',
                    paidat: new Date().toISOString(),
                })
                .eq('paymentid', paymentId);

            if (paymentError) {
                console.error('❌ Error updating payment:', paymentError);
            } else {
                console.log('✅ Payment verified:', paymentId);
            }
        }

        // 3️⃣ Tạo hoặc update subscription
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // +1 tháng

        // Kiểm tra xem user đã có subscription chưa
        const { data: existingSub } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('userid', userId)
            .maybeSingle();

        if (existingSub) {
            // Update subscription hiện tại
            const { error: subError } = await supabase
                .from('subscriptions')
                .update({
                    startdate: startDate.toISOString().split('T')[0],
                    enddate: endDate.toISOString().split('T')[0],
                    status: 'active',
                })
                .eq('subscriptionid', existingSub.subscriptionid);

            if (subError) throw subError;

            // Update payment với subscriptionid
            if (paymentId) {
                await supabase
                    .from('payments')
                    .update({ subscriptionid: existingSub.subscriptionid })
                    .eq('paymentid', paymentId);
            }

            console.log('✅ Subscription updated:', existingSub.subscriptionid);
        } else {
            // Tạo subscription mới
            const { data: newSub, error: subError } = await supabase
                .from('subscriptions')
                .insert({
                    userid: userId,
                    startdate: startDate.toISOString().split('T')[0],
                    enddate: endDate.toISOString().split('T')[0],
                    status: 'active',
                })
                .select()
                .single();

            if (subError) throw subError;

            // Update payment với subscriptionid
            if (paymentId && newSub) {
                await supabase
                    .from('payments')
                    .update({ subscriptionid: newSub.subscriptionid })
                    .eq('paymentid', paymentId);
            }

            console.log('✅ Subscription created:', newSub?.subscriptionid);
        }

        console.log('✅ Payment & Subscription updated for user:', userId);
        return true;

    } catch (error) {
        console.error('❌ Error in handlePaymentSuccess:', error);
        throw error;
    }
}

/**
 * Cập nhật payment khi thanh toán bị hủy
 */
async function handlePaymentCancelled(orderCode: number) {
    try {
        // Lấy paymentId từ payment_logs
        const { data: logData } = await supabase
            .from('payment_logs')
            .select('paymentid')
            .eq('ordercode', orderCode)
            .maybeSingle();

        if (logData?.paymentid) {
            const { error } = await supabase
                .from('payments')
                .update({ status: 'cancelled' })
                .eq('paymentid', logData.paymentid);

            if (error) {
                console.error('❌ Error updating cancelled payment:', error);
            } else {
                console.log('✅ Payment cancelled:', logData.paymentid);
            }
        }

        return true;
    } catch (error) {
        console.error('❌ Error in handlePaymentCancelled:', error);
        return false;
    }
}

/**
 * Lưu log thanh toán vào DB
 */
async function logPayment(data: any) {
    try {
        const { error } = await supabase
            .from('payment_logs')
            .insert({
                ordercode: data.orderCode,
                amount: data.amount,
                status: data.status,
                description: data.desc || data.description,
                paymentmethod: 'PayOS',
                transactionid: data.id,
                rawdata: JSON.stringify(data),
                created_at: new Date().toISOString(),
            });

        if (error) {
            console.error('❌ Error logging payment:', error);
        }
    } catch (error) {
        console.error('❌ Log payment error:', error);
    }
}

/**
 * POST /api/webhook/payos
 * Nhận webhook từ PayOS
 */
export async function POST(request: NextRequest) {
    try {
        // 📨 Nhận data từ PayOS
        const body = await request.json();
        const signature = request.headers.get('x-payos-signature') || body.signature || '';

        console.log('📨 Webhook received from PayOS:', {
            orderCode: body.orderCode,
            status: body.status,
            amount: body.amount,
        });

        // 🔐 Xác thực chữ ký (tùy PayOS có gửi hay không)
        if (signature && PAYOS_CHECKSUM_KEY) {
            const isValid = verifyWebhookSignature(body, signature);
            if (!isValid) {
                console.error('❌ Invalid webhook signature');
                return NextResponse.json(
                    { error: 'Invalid signature' },
                    { status: 401 }
                );
            }
        }

        // 📝 Parse dữ liệu từ webhook
        const {
            code,          // Mã trạng thái (00 = thành công)
            desc,          // Mô tả
            data: webhookData,
            signature: webhookSignature,
        } = body;

        const {
            orderCode,
            amount,
            description,
            accountNumber,
            reference,
            transactionDateTime,
            currency,
            paymentLinkId,
            code: statusCode,
            desc: statusDesc,
            counterAccountBankId,
            counterAccountBankName,
            counterAccountName,
            counterAccountNumber,
            virtualAccountName,
            virtualAccountNumber,
        } = webhookData || body;

        // 🔍 Lấy userId từ database (query bằng orderCode)
        let userId = '';
        try {
            const { data: paymentLog } = await supabase
                .from('payment_logs')
                .select('userid')
                .eq('ordercode', orderCode)
                .single();

            if (paymentLog) {
                userId = paymentLog.userid;
            } else {
                // Fallback: parse từ description (format: "Premium - {userId}")
                const userMatch = description?.match(/Premium\s*-\s*(\w+)/);
                if (userMatch) {
                    userId = userMatch[1];
                }
            }
        } catch (error) {
            console.error('⚠️ Failed to get userId from DB, trying description:', error);
            // Fallback: parse từ description
            const userMatch = description?.match(/Premium\s*-\s*(\w+)/);
            if (userMatch) {
                userId = userMatch[1];
            }
        }

        // ✅ Xác định trạng thái thanh toán
        const isPaid = code === '00' || statusCode === '00';
        const isCancelled = code === 'cancelled' || statusCode === 'cancelled';
        const paymentStatus = isPaid ? 'PAID' : isCancelled ? 'CANCELLED' : 'FAILED';

        // 💾 Lưu log thanh toán
        await logPayment({
            orderCode,
            amount,
            status: paymentStatus,
            desc: desc || statusDesc,
            description,
            id: reference || paymentLinkId,
            transactionDateTime,
        });

        // 💎 Xử lý thanh toán theo trạng thái
        if (isPaid && userId) {
            // Thanh toán thành công
            await handlePaymentSuccess(orderCode, userId, amount);
        } else if (isCancelled) {
            // Thanh toán bị hủy
            await handlePaymentCancelled(orderCode);
        }

        // 📤 Trả về response 200 OK để PayOS biết đã nhận
        return NextResponse.json({
            success: true,
            message: 'Webhook processed successfully',
            orderCode,
            status: paymentStatus,
        });

    } catch (error: any) {
        console.error('❌ Webhook error:', error);

        // ⚠️ Vẫn trả 200 để tránh PayOS retry liên tục
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 200 });
    }
}

/**
 * GET /api/webhook/payos
 * Test endpoint (PayOS có thể dùng GET để verify URL)
 */
export async function GET(request: NextRequest) {
    return NextResponse.json({
        message: 'PayOS Webhook endpoint is ready',
        timestamp: new Date().toISOString(),
    });
}
