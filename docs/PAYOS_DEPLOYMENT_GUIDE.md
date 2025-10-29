# 🚀 DEPLOY PAYOS LÊN PRODUCTION

## 📋 Checklist Trước Khi Deploy

- [ ] Đã test local thành công (create payment + webhook)
- [ ] Database migration đã chạy trên Supabase Production
- [ ] Có PayOS production keys (không phải sandbox)
- [ ] Code đã commit lên Git
- [ ] Environment variables đã chuẩn bị

---

## 🔧 Bước 1: Cấu Hình Production Environment

### 1.1. Supabase Production

```sql
-- Chạy migration trong Supabase SQL Editor (Production)
-- Copy nội dung từ: docs/supabase_payos_migration.sql
-- Paste và Run
```

**Verify:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscriptions', 'payment_logs');
```

### 1.2. PayOS Production Keys

1. Đăng nhập PayOS Dashboard: https://my.payos.vn/
2. **Tắt Sandbox Mode** (toggle ở góc trên)
3. Vào **Portal → Integration**
4. Copy 3 keys production:
   - Client ID
   - API Key
   - Checksum Key

⚠️ **Lưu ý:** Production keys khác với sandbox keys!

---

## 🚀 Bước 2: Deploy lên Vercel

### 2.1. Install Vercel CLI

```powershell
# Windows PowerShell
npm install -g vercel
```

### 2.2. Login Vercel

```powershell
vercel login
```

Chọn phương thức login (GitHub/GitLab/Email).

### 2.3. Deploy Lần Đầu

```powershell
# Trong thư mục project
cd d:\project\mindmap-ai-frontend

# Deploy
vercel
```

**Trả lời các câu hỏi:**
```
? Set up and deploy "d:\project\mindmap-ai-frontend"? [Y/n] Y
? Which scope do you want to deploy to? <your-username>
? Link to existing project? [y/N] N
? What's your project's name? mindmap-ai-frontend
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

### 2.4. Thêm Environment Variables

```powershell
# Supabase
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Nhập: https://xxxxxxxx.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Nhập: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App URL
vercel env add NEXT_PUBLIC_APP_URL
# Nhập: https://your-domain.vercel.app

# PayOS Production Keys
vercel env add PAYOS_CLIENT_ID
# Nhập: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

vercel env add PAYOS_API_KEY
# Nhập: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

vercel env add PAYOS_CHECKSUM_KEY
# Nhập: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Cho tất cả environments:**
```
? Select environments: Production, Preview, Development
```

### 2.5. Deploy Production

```powershell
vercel --prod
```

**Output:**
```
✅ Deployed to production: https://mindmap-ai-frontend.vercel.app
```

Copy URL này, bạn sẽ cần nó để config webhook.

---

## 🔗 Bước 3: Cấu Hình PayOS Webhook

### 3.1. Vào PayOS Dashboard

1. https://my.payos.vn/ → Login
2. **Portal → Integration → Webhook Settings**

### 3.2. Thêm Webhook URL

```
Webhook URL: https://your-domain.vercel.app/api/webhook/payos
Method: POST
```

**Example:**
```
https://mindmap-ai-frontend.vercel.app/api/webhook/payos
```

### 3.3. Test Webhook

Click **"Test Webhook"** trong PayOS Dashboard.

**Expected Response:**
```json
{
  "message": "PayOS Webhook endpoint is ready",
  "timestamp": "2025-10-29T07:30:00.000Z"
}
```

✅ Nếu thấy response này → Webhook URL đã đúng!

---

## 🧪 Bước 4: Test Production

### 4.1. Test Create Payment

```bash
curl -X POST https://your-domain.vercel.app/api/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "production_test_user",
    "planName": "Premium",
    "amount": 59000,
    "userEmail": "test@example.com",
    "userName": "Test User"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "orderCode": 1730182345123,
  "checkoutUrl": "https://pay.payos.vn/web/abc123xyz",
  "qrCode": "https://api.payos.vn/qr/abc123.png"
}
```

### 4.2. Test Real Payment

1. Copy `checkoutUrl` vào browser
2. Thanh toán bằng:
   - QR code (quét bằng app ngân hàng)
   - Chuyển khoản trực tiếp
   - Ví điện tử (MoMo/ZaloPay)

3. Sau khi thanh toán, kiểm tra:
   - Vercel logs: `vercel logs --follow`
   - Supabase table `subscriptions`
   - Frontend: Current Plan = Premium

---

## 📊 Bước 5: Monitor & Logs

### 5.1. Xem Logs Real-time

```powershell
vercel logs --follow
```

### 5.2. Xem Logs Webhook trong PayOS

PayOS Dashboard → **Portal → Integration → Webhook History**

Sẽ thấy:
- Request gửi đến webhook URL
- Response nhận được
- Status code
- Retry attempts (nếu có)

### 5.3. Xem Database

```sql
-- Supabase SQL Editor (Production)

-- Xem subscriptions mới nhất
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 10;

-- Xem payment logs
SELECT * FROM payment_logs ORDER BY created_at DESC LIMIT 10;

-- Count successful payments hôm nay
SELECT COUNT(*) FROM payment_logs 
WHERE status = 'PAID' 
AND created_at >= CURRENT_DATE;
```

---

## 🔒 Bước 6: Bảo Mật

### 6.1. Verify Webhook Signature

Đảm bảo code xác thực signature (đã có trong `route.ts`):

```typescript
// app/api/webhook/payos/route.ts
const isValid = verifyWebhookSignature(body, signature);
if (!isValid) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
}
```

### 6.2. Rate Limiting (Optional)

Thêm middleware để limit requests:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rate limit logic here
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

### 6.3. CORS (Optional)

Nếu cần giới hạn origin:

```typescript
// app/api/webhook/payos/route.ts
const allowedOrigins = ['https://api.payos.vn'];
const origin = request.headers.get('origin');

if (origin && !allowedOrigins.includes(origin)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

---

## 🐛 Troubleshooting Production

### Lỗi: Webhook không nhận được

**Kiểm tra:**
1. Webhook URL đúng chưa? (phải HTTPS, không HTTP)
2. Vercel function có timeout không? (check Vercel dashboard)
3. PayOS có retry không? (xem webhook history)

**Giải pháp:**
```powershell
# Xem logs chi tiết
vercel logs --follow --scope production

# Re-deploy nếu cần
vercel --prod
```

---

### Lỗi: Environment variables không load

**Kiểm tra:**
```powershell
# List tất cả env vars
vercel env ls

# Pull về local để verify
vercel env pull .env.production.local
```

**Giải pháp:**
```powershell
# Remove và add lại
vercel env rm PAYOS_API_KEY
vercel env add PAYOS_API_KEY

# Re-deploy
vercel --prod
```

---

### Lỗi: Database connection timeout

**Nguyên nhân:** Supabase RLS policy hoặc network issue.

**Giải pháp:**
1. Kiểm tra RLS policies trong Supabase
2. Verify connection string
3. Check Supabase service status

```sql
-- Disable RLS temporarily để test
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
```

---

## 📈 Monitoring & Analytics

### Setup Sentry (Optional)

```powershell
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Setup Vercel Analytics

Dashboard → Your Project → Analytics → Enable

---

## 🎉 Hoàn Tất Deploy!

Checklist cuối cùng:

✅ **Deploy lên Vercel thành công**  
✅ **Environment variables đã set**  
✅ **Webhook URL đã config trong PayOS**  
✅ **Test create payment thành công**  
✅ **Test real payment thành công**  
✅ **Database cập nhật đúng**  
✅ **Logs monitoring setup**  

---

## 📞 Support & Next Steps

**Nếu có vấn đề:**
1. Check Vercel logs: `vercel logs`
2. Check PayOS webhook history
3. Check Supabase logs
4. Contact PayOS support: https://my.payos.vn/support

**Next Steps:**
1. Setup email notifications khi có payment mới
2. Thêm admin dashboard để xem transactions
3. Setup auto-renew subscription
4. Thêm refund logic

---

**Author:** AI Programming Assistant  
**Date:** 2025-10-29
