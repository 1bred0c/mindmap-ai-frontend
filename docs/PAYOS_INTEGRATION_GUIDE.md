# 🚀 Hướng Dẫn Tích Hợp PayOS (NextPay)

## 📋 Mục Lục
1. [Giới thiệu](#giới-thiệu)
2. [Cấu hình](#cấu-hình)
3. [Cấu trúc Database](#cấu-trúc-database)
4. [API Endpoints](#api-endpoints)
5. [Test với Postman](#test-với-postman)
6. [Deploy lên Production](#deploy-lên-production)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Giới Thiệu

PayOS (NextPay) là cổng thanh toán của Việt Nam hỗ trợ:
- ✅ QR Code thanh toán
- ✅ Chuyển khoản ngân hàng
- ✅ Ví điện tử (MoMo, ZaloPay, VNPay...)
- ✅ Webhook tự động xác nhận thanh toán

### Flow Thanh Toán

```
User chọn gói Premium
    ↓
Frontend gọi /api/create-payment
    ↓
PayOS tạo payment link + QR
    ↓
User quét mã thanh toán
    ↓
PayOS gửi webhook → /api/webhook/payos
    ↓
Backend cập nhật DB → User nhận Premium
```

---

## ⚙️ Cấu Hình

### 1. Đăng Ký Tài Khoản PayOS

1. Truy cập: https://my.payos.vn/
2. Đăng ký tài khoản merchant
3. Xác thực thông tin doanh nghiệp (hoặc cá nhân)
4. Lấy API credentials tại: **Portal → Integration**

### 2. Lấy API Keys

Trong PayOS Dashboard → **Integration**, copy 3 keys:

```
Client ID:     [Dùng để xác thực merchant]
API Key:       [Dùng để gọi API]
Checksum Key:  [Dùng để ký chữ ký HMAC-SHA256]
```

### 3. Cấu Hình `.env.local`

Tạo file `.env.local` trong thư mục root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App URL (quan trọng!)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Dev
# NEXT_PUBLIC_APP_URL=https://yourdomain.com  # Production

# PayOS Keys
PAYOS_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PAYOS_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PAYOS_CHECKSUM_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Lưu ý:** Không commit file `.env.local` lên Git!

---

## 🗄️ Cấu Trúc Database

### Bảng `subscriptions`

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userid TEXT NOT NULL UNIQUE,
  startdate DATE NOT NULL,
  enddate DATE NOT NULL,
  status TEXT DEFAULT 'active',
  plan TEXT DEFAULT 'Premium',
  ordercode BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index để tăng tốc query
CREATE INDEX idx_subscriptions_userid ON subscriptions(userid);
CREATE INDEX idx_subscriptions_enddate ON subscriptions(enddate);
```

### Bảng `payment_logs` (Optional)

```sql
CREATE TABLE payment_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ordercode BIGINT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  description TEXT,
  paymentmethod TEXT DEFAULT 'PayOS',
  transactionid TEXT,
  rawdata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_payment_logs_ordercode ON payment_logs(ordercode);
CREATE INDEX idx_payment_logs_status ON payment_logs(status);
```

Chạy migration này trong Supabase SQL Editor.

---

## 🛠️ API Endpoints

### 1. POST `/api/create-payment`

Tạo đơn thanh toán mới.

**Request Body:**

```json
{
  "userId": "user123",
  "planName": "Premium",
  "amount": 59000,
  "userEmail": "user@example.com",
  "userName": "Nguyen Van A"
}
```

**Response:**

```json
{
  "success": true,
  "orderCode": 123456789,
  "checkoutUrl": "https://pay.payos.vn/web/xxxxxxxx",
  "qrCode": "https://api.payos.vn/qr/xxxxxxxx.png"
}
```

**Giải thích Code:**

```typescript
// 1. Tạo orderCode unique
const orderCode = Number(Date.now().toString().slice(-9) + Math.floor(Math.random() * 1000));

// 2. Tạo chữ ký HMAC-SHA256
const signatureData = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
const signature = crypto.createHmac('sha256', PAYOS_CHECKSUM_KEY).update(signatureData).digest('hex');

// 3. Gọi PayOS API
const response = await fetch('https://api-merchant.payos.vn/v2/payment-requests', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-client-id': PAYOS_CLIENT_ID,
    'x-api-key': PAYOS_API_KEY,
  },
  body: JSON.stringify(paymentData),
});
```

---

### 2. POST `/api/webhook/payos`

Nhận callback từ PayOS (tự động).

**Webhook Payload:**

```json
{
  "code": "00",
  "desc": "Thành công",
  "data": {
    "orderCode": 123456789,
    "amount": 59000,
    "description": "Thanh toán gói Premium - User: user123",
    "accountNumber": "9876543210",
    "reference": "FT24102912345678",
    "transactionDateTime": "2025-10-29 14:30:00",
    "currency": "VND",
    "paymentLinkId": "xxxxxxxx",
    "code": "00",
    "desc": "Thành công"
  },
  "signature": "abc123..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "orderCode": 123456789,
  "status": "PAID"
}
```

**Giải thích Code:**

```typescript
// 1. Xác thực chữ ký webhook
function verifyWebhookSignature(data: any, receivedSignature: string): boolean {
  const signatureData = `code=${data.code}&desc=${data.desc}&id=${data.id}&cancel=${data.cancel}&status=${data.status}&orderCode=${data.orderCode}`;
  const computedSignature = crypto.createHmac('sha256', PAYOS_CHECKSUM_KEY).update(signatureData).digest('hex');
  return computedSignature === receivedSignature;
}

// 2. Cập nhật subscription
async function updateSubscription(orderCode: number, userId: string, status: string) {
  if (status === 'PAID') {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // +1 tháng

    await supabase.from('subscriptions').upsert({
      userid: userId,
      startdate: startDate.toISOString().split('T')[0],
      enddate: endDate.toISOString().split('T')[0],
      status: 'active',
      plan: 'Premium',
      ordercode: orderCode,
    });
  }
}
```

---

## 🧪 Test với Postman

### Test 1: Tạo Thanh Toán

```bash
# Endpoint
POST http://localhost:3000/api/create-payment

# Headers
Content-Type: application/json

# Body (raw JSON)
{
  "userId": "test_user_123",
  "planName": "Premium",
  "amount": 59000,
  "userEmail": "test@example.com",
  "userName": "Test User"
}

# Expected Response
{
  "success": true,
  "orderCode": 123456789,
  "checkoutUrl": "https://pay.payos.vn/web/xxxxxxxx",
  "qrCode": "https://api.payos.vn/qr/xxxxxxxx.png"
}
```

**Cách test:**
1. Copy `checkoutUrl` vào browser
2. Quét QR code để thanh toán (sandbox)
3. Kiểm tra webhook trong console

---

### Test 2: Webhook (Manual Test)

```bash
# Endpoint
POST http://localhost:3000/api/webhook/payos

# Headers
Content-Type: application/json

# Body (giả lập PayOS webhook)
{
  "code": "00",
  "desc": "Thành công",
  "data": {
    "orderCode": 123456789,
    "amount": 59000,
    "description": "Thanh toán gói Premium - User: test_user_123",
    "accountNumber": "9876543210",
    "reference": "FT24102912345678",
    "transactionDateTime": "2025-10-29 14:30:00",
    "code": "00",
    "desc": "Thành công"
  }
}

# Expected Response
{
  "success": true,
  "message": "Webhook processed successfully",
  "orderCode": 123456789,
  "status": "PAID"
}
```

---

### Test 3: Curl Commands

#### Tạo Thanh Toán

```bash
curl -X POST http://localhost:3000/api/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_123",
    "planName": "Premium",
    "amount": 59000,
    "userEmail": "test@example.com",
    "userName": "Test User"
  }'
```

#### Test Webhook

```bash
curl -X POST http://localhost:3000/api/webhook/payos \
  -H "Content-Type: application/json" \
  -d '{
    "code": "00",
    "desc": "Thành công",
    "data": {
      "orderCode": 123456789,
      "amount": 59000,
      "description": "Thanh toán gói Premium - User: test_user_123",
      "code": "00"
    }
  }'
```

---

## 🚀 Deploy lên Production

### 1. Cấu Hình Webhook URL trong PayOS

1. Đăng nhập PayOS Dashboard
2. Vào **Portal → Integration → Webhook**
3. Nhập URL: `https://yourdomain.com/api/webhook/payos`
4. Click **Save & Test**

⚠️ **Lưu ý:** 
- URL phải public (không được localhost)
- Phải HTTPS (PayOS yêu cầu SSL)
- Phải return status 200

### 2. Deploy lên Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Thêm environment variables
vercel env add PAYOS_CLIENT_ID
vercel env add PAYOS_API_KEY
vercel env add PAYOS_CHECKSUM_KEY
vercel env add NEXT_PUBLIC_APP_URL

# 5. Redeploy
vercel --prod
```

### 3. Kiểm Tra Production

```bash
# Test create payment
curl -X POST https://yourdomain.com/api/create-payment \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","planName":"Premium","amount":59000}'

# Test webhook endpoint
curl https://yourdomain.com/api/webhook/payos
```

---

## 🐛 Troubleshooting

### Lỗi: "Invalid signature"

**Nguyên nhân:** Checksum key sai hoặc format signature không đúng.

**Giải pháp:**
1. Kiểm tra `PAYOS_CHECKSUM_KEY` trong `.env.local`
2. Đảm bảo format chữ ký đúng thứ tự: `amount + cancelUrl + description + orderCode + returnUrl`
3. Log ra để debug:

```typescript
console.log('Signature Data:', signatureData);
console.log('Computed Signature:', signature);
```

---

### Lỗi: "Webhook not received"

**Nguyên nhân:** PayOS không gọi được webhook URL.

**Giải pháp:**
1. Kiểm tra URL có public không (dùng ngrok nếu localhost):
   ```bash
   npx ngrok http 3000
   ```
2. Kiểm tra firewall/security group
3. Đảm bảo return status 200
4. Xem log trong PayOS Dashboard → Webhooks → History

---

### Lỗi: "Database error"

**Nguyên nhân:** Schema không đúng hoặc RLS policy.

**Giải pháp:**
1. Chạy lại migration SQL
2. Tắt RLS (Row Level Security) cho testing:
   ```sql
   ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
   ```
3. Kiểm tra connection string Supabase

---

### Lỗi: "Missing environment variables"

**Giải pháp:**
```bash
# Kiểm tra .env.local
cat .env.local

# Restart dev server
npm run dev
```

---

## 📊 Monitoring

### Log Payment Success

```typescript
console.log('✅ Payment successful:', {
  orderCode,
  userId,
  amount,
  timestamp: new Date().toISOString(),
});
```

### Log Webhook Received

```typescript
console.log('📨 Webhook received:', {
  orderCode: body.orderCode,
  status: body.status,
  ip: request.headers.get('x-forwarded-for'),
});
```

---

## 🎉 Hoàn Tất!

Bây giờ bạn đã có:
- ✅ API tạo thanh toán qua PayOS
- ✅ Webhook tự động xác nhận
- ✅ Cập nhật subscription tự động
- ✅ Xác thực chữ ký bảo mật
- ✅ Hướng dẫn deploy production

**Next Steps:**
1. Test trên sandbox PayOS
2. Tích hợp vào frontend (button "Thanh toán qua PayOS")
3. Deploy lên production
4. Monitor logs & errors

---

## 📞 Support

- PayOS Docs: https://payos.vn/docs
- PayOS Support: https://my.payos.vn/support
- GitHub Issues: [Your repo]

**Author:** AI Programming Assistant  
**Date:** 2025-10-29
