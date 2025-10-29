# 💳 PayOS Payment Integration - Quick Start

## 🚀 TL;DR - Chạy Ngay

```powershell
# 1. Clone & Install
git clone <repo>
cd mindmap-ai-frontend
npm install

# 2. Setup Environment
cp .env.example .env.local
# Edit .env.local với PayOS keys

# 3. Run Database Migration
# Copy SQL từ docs/supabase_payos_migration.sql
# Paste vào Supabase SQL Editor → Run

# 4. Start Dev Server
npm run dev

# 5. Test Payment
# Mở: http://localhost:3000/pricing
# Click "Thanh toán qua PayOS"
```

---

## 📚 Tài Liệu Chi Tiết

| Tài liệu | Mô tả |
|----------|-------|
| [PAYOS_INTEGRATION_GUIDE.md](./docs/PAYOS_INTEGRATION_GUIDE.md) | Hướng dẫn tích hợp từ A-Z |
| [PAYOS_TESTING_GUIDE.md](./docs/PAYOS_TESTING_GUIDE.md) | Test với Postman & Curl |
| [PAYOS_DEPLOYMENT_GUIDE.md](./docs/PAYOS_DEPLOYMENT_GUIDE.md) | Deploy lên Production |
| [supabase_payos_migration.sql](./docs/supabase_payos_migration.sql) | Database schema |

---

## 📁 File Structure

```
mindmap-ai-frontend/
├── app/
│   ├── api/
│   │   ├── create-payment/
│   │   │   └── route.ts          # API tạo payment
│   │   └── webhook/
│   │       └── payos/
│   │           └── route.ts      # Webhook nhận callback
│   └── pricing/
│       └── page.tsx              # UI thanh toán
├── hooks/
│   └── use-payos-payment.ts      # Custom hook
├── docs/
│   ├── PAYOS_INTEGRATION_GUIDE.md
│   ├── PAYOS_TESTING_GUIDE.md
│   ├── PAYOS_DEPLOYMENT_GUIDE.md
│   └── supabase_payos_migration.sql
└── .env.example                  # Template env vars
```

---

## ⚙️ Environment Variables

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# PayOS (lấy từ https://my.payos.vn/portal/integration)
PAYOS_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PAYOS_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PAYOS_CHECKSUM_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🗄️ Database Schema

### Table: `subscriptions`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userid | TEXT | User ID (unique) |
| startdate | DATE | Ngày bắt đầu Premium |
| enddate | DATE | Ngày hết hạn Premium |
| status | TEXT | active, expired, cancelled |
| plan | TEXT | Free, Premium |
| ordercode | BIGINT | PayOS order code |

### Table: `payment_logs`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| ordercode | BIGINT | PayOS order code |
| userid | TEXT | User ID |
| amount | INTEGER | Số tiền (VND) |
| status | TEXT | PAID, FAILED, CANCELLED, PENDING |
| transactionid | TEXT | Transaction ID từ bank |
| rawdata | JSONB | Raw webhook data |

---

## 🔌 API Endpoints

### POST `/api/create-payment`

Tạo đơn thanh toán mới.

**Request:**
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
  "orderCode": 1730182345123,
  "checkoutUrl": "https://pay.payos.vn/web/abc123",
  "qrCode": "https://api.payos.vn/qr/abc123.png"
}
```

---

### POST `/api/webhook/payos`

Nhận callback từ PayOS (tự động).

**Payload:**
```json
{
  "code": "00",
  "desc": "Thành công",
  "data": {
    "orderCode": 1730182345123,
    "amount": 59000,
    "description": "Thanh toán gói Premium - User: user123",
    "code": "00"
  }
}
```

**Actions:**
- Parse webhook data
- Verify signature (optional)
- Update `subscriptions` table
- Log to `payment_logs`
- Return 200 OK

---

## 🧪 Quick Test

### Test 1: Create Payment

```powershell
# PowerShell
curl.exe -X POST http://localhost:3000/api/create-payment `
  -H "Content-Type: application/json" `
  -d '{\"userId\":\"test123\",\"planName\":\"Premium\",\"amount\":59000}'
```

### Test 2: Simulate Webhook

```powershell
# PowerShell
curl.exe -X POST http://localhost:3000/api/webhook/payos `
  -H "Content-Type: application/json" `
  -d '{\"code\":\"00\",\"data\":{\"orderCode\":123456789,\"amount\":59000,\"description\":\"Thanh toán gói Premium - User: test123\",\"code\":\"00\"}}'
```

### Test 3: Check Database

```sql
-- Supabase SQL Editor
SELECT * FROM subscriptions WHERE userid = 'test123';
SELECT * FROM payment_logs WHERE ordercode = 123456789;
```

---

## 🎯 Payment Flow

```
User clicks "Thanh toán qua PayOS"
    ↓
Frontend → POST /api/create-payment
    ↓
Backend → PayOS API → Payment Link
    ↓
User quét QR / chuyển khoản
    ↓
PayOS → POST /api/webhook/payos
    ↓
Backend → Update subscriptions table
    ↓
Frontend → Refresh → "Current Plan: Premium"
```

---

## 🔐 Security Features

✅ **HMAC-SHA256 Signature**: Xác thực webhook từ PayOS  
✅ **Environment Variables**: API keys không lộ trong code  
✅ **Supabase RLS**: Row Level Security cho database  
✅ **HTTPS Only**: PayOS chỉ gửi webhook đến HTTPS URLs  
✅ **Order Code Validation**: Mỗi order code unique  

---

## 🐛 Common Issues

### Issue: "Missing environment variables"

**Solution:**
```powershell
# Check file exists
ls .env.local

# Verify content
cat .env.local

# Restart dev server
npm run dev
```

---

### Issue: "PayOS API Error"

**Solution:**
1. Check PayOS dashboard: https://my.payos.vn/
2. Verify API keys (Client ID, API Key, Checksum Key)
3. Check sandbox vs production mode
4. View PayOS logs in dashboard

---

### Issue: "Database error"

**Solution:**
```sql
-- Run migration again
-- Copy từ: docs/supabase_payos_migration.sql

-- Or manually create tables:
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
```

---

### Issue: "Webhook not received"

**Solution:**
1. Check webhook URL in PayOS Dashboard
2. Ensure URL is public (use ngrok for local):
   ```powershell
   npx ngrok http 3000
   ```
3. Update webhook URL: `https://xxx.ngrok.io/api/webhook/payos`
4. Test webhook from PayOS dashboard

---

## 📊 Monitoring

### View Logs

```powershell
# Local development
# Check terminal where npm run dev is running

# Production (Vercel)
vercel logs --follow
```

### Database Queries

```sql
-- Total subscriptions
SELECT COUNT(*) FROM subscriptions WHERE status = 'active';

-- Revenue today
SELECT SUM(amount) FROM payment_logs 
WHERE status = 'PAID' 
AND created_at >= CURRENT_DATE;

-- Failed payments
SELECT * FROM payment_logs WHERE status = 'FAILED';
```

---

## 🚀 Deploy to Production

```powershell
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Add environment variables
vercel env add PAYOS_CLIENT_ID
vercel env add PAYOS_API_KEY
vercel env add PAYOS_CHECKSUM_KEY
vercel env add NEXT_PUBLIC_APP_URL

# 5. Config webhook in PayOS Dashboard
# URL: https://your-domain.vercel.app/api/webhook/payos
```

Chi tiết: [PAYOS_DEPLOYMENT_GUIDE.md](./docs/PAYOS_DEPLOYMENT_GUIDE.md)

---

## 📞 Support

- **PayOS Docs**: https://payos.vn/docs
- **PayOS Dashboard**: https://my.payos.vn/
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## 📝 Changelog

### v1.0.0 (2025-10-29)
- ✅ Initial PayOS integration
- ✅ Create payment API
- ✅ Webhook handler
- ✅ Database schema
- ✅ Frontend UI
- ✅ Documentation

---

## 📜 License

MIT

---

**Author:** AI Programming Assistant  
**Date:** 2025-10-29  
**Status:** ✅ Production Ready
