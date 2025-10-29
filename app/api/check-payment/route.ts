import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabaseClient';

const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID as string;
const PAYOS_API_KEY = process.env.PAYOS_API_KEY as string;
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY as string;

/**
 * API: Kiểm tra trạng thái thanh toán từ PayOS
 * Được gọi từ /payment/result page để xác nhận trạng thái thật
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderCode, userId } = body;

        if (!orderCode || !userId) {
            return NextResponse.json(
                { error: 'Missing orderCode or userId' },
                { status: 400 }
            );
        }

        console.log('🔍 Checking payment status for orderCode:', orderCode);

        // Gọi PayOS API để lấy trạng thái
        const response = await fetch(
            `https://api-merchant.payos.vn/v2/payment-requests/${orderCode}`,
            {
                method: 'GET',
                headers: {
                    'x-client-id': PAYOS_CLIENT_ID,
                    'x-api-key': PAYOS_API_KEY,
                },
            }
        );

        const result = await response.json();
        console.log('📦 PayOS response:', result);

        if (!response.ok || result.code !== '00') {
            return NextResponse.json({
                success: false,
                status: 'PENDING',
                message: result.desc || 'Payment not found',
            });
        }

        const paymentData = result.data;
        const paymentStatus = paymentData.status; // PAID, CANCELLED, PENDING

        console.log('✅ Payment status:', paymentStatus);

        // Nếu thanh toán thành công, cập nhật DB
        if (paymentStatus === 'PAID') {
            try {
                // 1️⃣ Tìm paymentId từ payment_logs
                const { data: logData, error: logError } = await supabase
                    .from('payment_logs')
                    .select('paymentid, userid')
                    .eq('ordercode', orderCode)
                    .eq('userid', userId)
                    .maybeSingle();

                if (logError || !logData) {
                    console.error('❌ Payment log not found:', logError);
                    return NextResponse.json({
                        success: false,
                        status: paymentStatus,
                        message: 'Payment record not found in database',
                    });
                }

                const paymentId = logData.paymentid;

                // 2️⃣ Update payments table
                const { error: paymentError } = await supabase
                    .from('payments')
                    .update({
                        status: 'verified',
                        paidat: new Date().toISOString(),
                    })
                    .eq('paymentid', paymentId);

                if (paymentError) throw paymentError;

                // 3️⃣ Tạo hoặc cập nhật subscription
                const today = new Date().toISOString().split('T')[0];
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);
                const endDateStr = endDate.toISOString().split('T')[0];

                const { data: existingSub } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('userid', userId)
                    .maybeSingle();

                let subscriptionId;

                if (existingSub) {
                    // Gia hạn
                    const currentEnd = new Date(existingSub.enddate);
                    const newEnd = new Date(currentEnd);
                    newEnd.setMonth(newEnd.getMonth() + 1);

                    const { data: updatedSub, error: subError } = await supabase
                        .from('subscriptions')
                        .update({
                            enddate: newEnd.toISOString().split('T')[0],
                        })
                        .eq('subscriptionid', existingSub.subscriptionid)
                        .select()
                        .single();

                    if (subError) throw subError;
                    subscriptionId = updatedSub.subscriptionid;
                } else {
                    // Tạo mới
                    const { data: newSub, error: subError } = await supabase
                        .from('subscriptions')
                        .insert({
                            userid: userId,
                            startdate: today,
                            enddate: endDateStr,
                        })
                        .select()
                        .single();

                    if (subError) throw subError;
                    subscriptionId = newSub.subscriptionid;
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
                    .eq('ordercode', orderCode);

                console.log('🎉 Payment and subscription updated successfully!');

                return NextResponse.json({
                    success: true,
                    status: 'PAID',
                    message: 'Payment verified and subscription activated',
                });

            } catch (dbError: any) {
                console.error('❌ Database update error:', dbError);
                return NextResponse.json({
                    success: false,
                    status: paymentStatus,
                    message: 'Database update failed: ' + dbError.message,
                }, { status: 500 });
            }
        } else if (paymentStatus === 'CANCELLED') {
            // Cập nhật trạng thái hủy
            await supabase
                .from('payment_logs')
                .update({ status: 'CANCELLED' })
                .eq('ordercode', orderCode);

            return NextResponse.json({
                success: false,
                status: 'CANCELLED',
                message: 'Payment was cancelled',
            });
        } else {
            // PENDING hoặc trạng thái khác
            return NextResponse.json({
                success: false,
                status: paymentStatus || 'PENDING',
                message: 'Payment is still pending',
            });
        }

    } catch (error: any) {
        console.error('❌ Check payment error:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        );
    }
}
