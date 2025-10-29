# 🧪 Test PayOS Webhook với ngrok

## Vấn đề
PayOS không thể gọi webhook về `localhost:3000` vì đây là địa chỉ nội bộ.

## Giải pháp: Dùng ngrok

### 1. Cài đặt ngrok
```powershell
# Tải ngrok tại: https://ngrok.com/download
# Hoặc cài qua Chocolatey:
choco install ngrok
```

### 2. Chạy ngrok
```powershell
# Terminal 1: Chạy Next.js
npm run dev

# Terminal 2: Expose port 3000 ra internet
ngrok http 3000
```

### 3. Lấy public URL
Ngrok sẽ hiển thị URL công khai, ví dụ:
```
Forwarding: https://abcd1234.ngrok.io -> http://localhost:3000
```

### 4. Cấu hình PayOS Dashboard
1. Vào https://payos.vn/dashboard
2. Mục **Settings → Webhook**
3. Nhập URL: `https://abcd1234.ngrok.io/api/webhook/payos`
4. Save

### 5. Test thanh toán
1. Mở `https://abcd1234.ngrok.io/pricing` (hoặc localhost:3000)
2. Click "Thanh toán qua PayOS"
3. Thanh toán test trên PayOS
4. PayOS sẽ gọi webhook về ngrok URL
5. Kiểm tra log trong terminal:

```
📥 Webhook received: PAID
💾 Payment updated to verified
✅ Subscription created/updated
```

### 6. Kiểm tra database
Vào Supabase → Table Editor:
- `payments` → Kiểm tra `status = 'verified'`
- `subscriptions` → Kiểm tra `enddate` đã được cập nhật
- `payment_logs` → Kiểm tra `status = 'PAID'`

---

## Alternative: Test bằng cURL (manual webhook)

Nếu không muốn dùng ngrok, bạn có thể test webhook bằng cách gọi API thủ công:

```powershell
# Giả lập PayOS gọi webhook với payload PAID
$body = @{
    code = "00"
    desc = "success"
    data = @{
        orderCode = 72989353296
        amount = 59000
        description = "Premium - 8"
        accountNumber = "123456"
        reference = "FT123456"
        transactionDateTime = "2025-10-29T10:30:00Z"
        paymentLinkId = "test-payment-link-123"
    }
    signature = "test-signature-placeholder"
} | ConvertTo-Json -Depth 10

curl.exe -X POST http://localhost:3000/api/webhook/payos `
  -H "Content-Type: application/json" `
  -d $body
```

**LƯU Ý**: Signature sẽ fail vì không đúng, nhưng bạn có thể tạm thời comment dòng verify signature trong webhook để test.

