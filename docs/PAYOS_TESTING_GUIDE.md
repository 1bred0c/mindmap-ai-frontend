# 🧪 Test PayOS Integration với Postman & Curl

## 📌 Prerequisites

1. **Install Postman**: https://www.postman.com/downloads/
2. **Đã setup .env.local** với PayOS keys
3. **Dev server đang chạy**: `npm run dev`
4. **Database migration** đã chạy (bảng `subscriptions` và `payment_logs`)

---

## 🎯 Test Flow Tổng Quan

```
Test 1: Tạo thanh toán (POST /api/create-payment)
    ↓
Test 2: Mở payment URL → Thanh toán sandbox
    ↓
Test 3: Giả lập webhook (POST /api/webhook/payos)
    ↓
Test 4: Verify subscription trong DB
```

---

## 🔧 Test 1: Tạo Thanh Toán

### Postman

**Method:** POST  
**URL:** `http://localhost:3000/api/create-payment`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "userId": "test_user_123",
  "planName": "Premium",
  "amount": 59000,
  "userEmail": "test@example.com",
  "userName": "Nguyen Van A"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "orderCode": 1730182345123,
  "checkoutUrl": "https://pay.payos.vn/web/abc123xyz",
  "qrCode": "https://api.payos.vn/qr/abc123.png"
}
```

### Curl (Windows PowerShell)

```powershell
curl.exe -X POST http://localhost:3000/api/create-payment `
  -H "Content-Type: application/json" `
  -d '{\"userId\":\"test_user_123\",\"planName\":\"Premium\",\"amount\":59000,\"userEmail\":\"test@example.com\",\"userName\":\"Nguyen Van A\"}'
```

### Curl (Linux/Mac)

```bash
curl -X POST http://localhost:3000/api/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_123",
    "planName": "Premium",
    "amount": 59000,
    "userEmail": "test@example.com",
    "userName": "Nguyen Van A"
  }'
```

### ✅ Verify

1. Response có `checkoutUrl` và `orderCode`
2. Copy `checkoutUrl` vào browser → Mở PayOS payment page
3. Trong sandbox mode, thanh toán sẽ auto-success (hoặc dùng test card)

---

## 🔧 Test 2: Giả Lập Webhook

### Postman

**Method:** POST  
**URL:** `http://localhost:3000/api/webhook/payos`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON) - Success:**
```json
{
  "code": "00",
  "desc": "Thành công",
  "data": {
    "orderCode": 1730182345123,
    "amount": 59000,
    "description": "Thanh toán gói Premium - User: test_user_123",
    "accountNumber": "9876543210",
    "reference": "FT24102912345678",
    "transactionDateTime": "2025-10-29 14:30:00",
    "currency": "VND",
    "paymentLinkId": "abc123xyz",
    "code": "00",
    "desc": "Thành công",
    "counterAccountBankId": "",
    "counterAccountBankName": "Vietcombank",
    "counterAccountName": "NGUYEN VAN A",
    "counterAccountNumber": "1234567890",
    "virtualAccountName": "PayOS",
    "virtualAccountNumber": "9999999999"
  },
  "signature": "optional_signature_here"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "orderCode": 1730182345123,
  "status": "PAID"
}
```

### Curl (Windows PowerShell)

```powershell
curl.exe -X POST http://localhost:3000/api/webhook/payos `
  -H "Content-Type: application/json" `
  -d '{\"code\":\"00\",\"desc\":\"Thành công\",\"data\":{\"orderCode\":1730182345123,\"amount\":59000,\"description\":\"Thanh toán gói Premium - User: test_user_123\",\"code\":\"00\"}}'
```

### Curl (Linux/Mac)

```bash
curl -X POST http://localhost:3000/api/webhook/payos \
  -H "Content-Type: application/json" \
  -d '{
    "code": "00",
    "desc": "Thành công",
    "data": {
      "orderCode": 1730182345123,
      "amount": 59000,
      "description": "Thanh toán gói Premium - User: test_user_123",
      "code": "00"
    }
  }'
```

### ✅ Verify

1. Response status = `PAID`
2. Kiểm tra Supabase:
   ```sql
   SELECT * FROM subscriptions WHERE userid = 'test_user_123';
   SELECT * FROM payment_logs WHERE ordercode = 1730182345123;
   ```
3. `subscriptions` table phải có record mới với `enddate = CURRENT_DATE + 30 days`

---

## 🔧 Test 3: Webhook Failed Payment

**Body (raw JSON) - Failed:**
```json
{
  "code": "99",
  "desc": "Giao dịch thất bại",
  "data": {
    "orderCode": 1730182345456,
    "amount": 59000,
    "description": "Thanh toán gói Premium - User: test_user_456",
    "code": "99",
    "desc": "Insufficient balance"
  }
}
```

**Expected:**
- Response: `{ "success": true, "status": "FAILED" }`
- Không tạo subscription mới
- Có record trong `payment_logs` với status = `FAILED`

---

## 🔧 Test 4: Check GET Endpoint

**Method:** GET  
**URL:** `http://localhost:3000/api/webhook/payos`

**Expected Response:**
```json
{
  "message": "PayOS Webhook endpoint is ready",
  "timestamp": "2025-10-29T07:30:00.000Z"
}
```

### Curl

```powershell
curl.exe http://localhost:3000/api/webhook/payos
```

---

## 📋 Postman Collection (Import JSON)

Tạo file `PayOS_Tests.postman_collection.json`:

```json
{
  "info": {
    "name": "PayOS Integration Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Payment",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"userId\": \"test_user_123\",\n  \"planName\": \"Premium\",\n  \"amount\": 59000,\n  \"userEmail\": \"test@example.com\",\n  \"userName\": \"Nguyen Van A\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/create-payment",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "create-payment"]
        }
      }
    },
    {
      "name": "Webhook - Success",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"code\": \"00\",\n  \"desc\": \"Thành công\",\n  \"data\": {\n    \"orderCode\": 1730182345123,\n    \"amount\": 59000,\n    \"description\": \"Thanh toán gói Premium - User: test_user_123\",\n    \"code\": \"00\"\n  }\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/webhook/payos",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "webhook", "payos"]
        }
      }
    },
    {
      "name": "Webhook - Health Check",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/api/webhook/payos",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "webhook", "payos"]
        }
      }
    }
  ]
}
```

**Import vào Postman:**
1. Postman → Import → Paste JSON above
2. Run từng request theo thứ tự

---

## 🚀 Test với PayOS Sandbox

### 1. Lấy Sandbox Keys

1. Đăng nhập PayOS Dashboard
2. Chuyển sang **Sandbox Mode** (toggle ở góc trên)
3. Lấy Sandbox API Keys
4. Update `.env.local`

### 2. Test End-to-End

```bash
# 1. Tạo payment
curl -X POST http://localhost:3000/api/create-payment \
  -H "Content-Type: application/json" \
  -d '{"userId":"real_test","planName":"Premium","amount":59000}'

# 2. Copy checkoutUrl từ response
# Example: https://pay.payos.vn/web/abc123

# 3. Mở URL trong browser

# 4. Sử dụng test card PayOS cung cấp:
# - Card number: 9704 0000 0000 0018
# - Exp: 03/07
# - CVV: 123
# - OTP: 123456

# 5. Sau khi thanh toán, webhook sẽ tự động gọi
```

---

## 🔍 Debug Tips

### View Logs

```bash
# Terminal đang chạy npm run dev
# Xem console logs:

📤 Sending payment request to PayOS: { orderCode: ..., amount: ..., userId: ... }
✅ Payment created successfully: { orderCode: ..., checkoutUrl: ... }
📨 Webhook received from PayOS: { orderCode: ..., status: ..., amount: ... }
✅ Subscription updated successfully for user: test_user_123
```

### Check Database

```sql
-- Supabase SQL Editor

-- Xem tất cả subscriptions
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 10;

-- Xem payment logs
SELECT * FROM payment_logs ORDER BY created_at DESC LIMIT 10;

-- Xem subscription của user cụ thể
SELECT * FROM subscriptions WHERE userid = 'test_user_123';

-- Xem subscription còn active
SELECT * FROM subscriptions WHERE enddate >= CURRENT_DATE;
```

### Common Errors

| Error | Nguyên nhân | Giải pháp |
|-------|-------------|-----------|
| `Missing required fields` | Body thiếu userId/amount | Check request payload |
| `Failed to create payment` | API keys sai | Verify `.env.local` |
| `Invalid signature` | Checksum key sai | Re-check PayOS dashboard |
| `Database error` | Bảng chưa tạo | Run migration SQL |
| `Webhook not received` | URL không public | Dùng ngrok: `npx ngrok http 3000` |

---

## 🎉 Kết Luận

Sau khi test xong:

✅ **Create Payment API** hoạt động  
✅ **Webhook** nhận và xử lý đúng  
✅ **Database** update subscription tự động  
✅ **Frontend** hiển thị "Current Plan = Premium"  

**Next Steps:**
1. Deploy lên production (Vercel)
2. Update webhook URL trong PayOS Dashboard
3. Test với real payment
4. Monitor logs & errors

---

**Author:** AI Programming Assistant  
**Date:** 2025-10-29
