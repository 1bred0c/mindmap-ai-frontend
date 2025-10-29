# 🚀 Hướng dẫn cấu hình Environment Variables trên Vercel

## ❌ Lỗi thường gặp:

```
TypeError: The "key" argument must be of type string... Received undefined
```

**Nguyên nhân:** Chưa set environment variables trên Vercel.

---

## ✅ Cách fix:

### **1. Vào Vercel Dashboard**
1. Truy cập: https://vercel.com/dashboard
2. Chọn project của bạn (ví dụ: `mindmap-ai-frontend`)
3. Click tab **Settings** → **Environment Variables**

### **2. Thêm các biến môi trường sau:**

#### **PayOS Configuration:**
```
Variable Name: PAYOS_CLIENT_ID
Value: [Lấy từ PayOS Dashboard]
Environment: Production, Preview, Development
```

```
Variable Name: PAYOS_API_KEY
Value: [Lấy từ PayOS Dashboard]
Environment: Production, Preview, Development
```

```
Variable Name: PAYOS_CHECKSUM_KEY
Value: [Lấy từ PayOS Dashboard]
Environment: Production, Preview, Development
```

#### **Supabase Configuration:**
```
Variable Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co
Environment: Production, Preview, Development
```

```
Variable Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Lấy từ Supabase Dashboard → Settings → API]
Environment: Production, Preview, Development
```

#### **App Configuration:**
```
Variable Name: NEXT_PUBLIC_APP_URL
Value: https://your-domain.vercel.app
Environment: Production

Variable Name: NEXT_PUBLIC_APP_URL
Value: https://your-preview.vercel.app
Environment: Preview

Variable Name: NEXT_PUBLIC_APP_URL
Value: http://localhost:3000
Environment: Development
```

---

## **3. Lấy PayOS credentials:**

1. Đăng nhập: https://my.payos.vn/
2. Vào **Settings** → **API Credentials**
3. Copy 3 giá trị:
   - **Client ID** → `PAYOS_CLIENT_ID`
   - **API Key** → `PAYOS_API_KEY`
   - **Checksum Key** → `PAYOS_CHECKSUM_KEY`

---

## **4. Cấu hình PayOS Webhook URL:**

Sau khi deploy xong, cần cấu hình webhook URL tại PayOS:

1. Vào PayOS Dashboard → **Settings** → **Webhook**
2. Nhập URL: `https://your-domain.vercel.app/api/webhook/payos`
3. Click **Save**

**LƯU Ý:** URL phải là HTTPS và public (không dùng localhost)

---

## **5. Redeploy project:**

Sau khi thêm environment variables, cần redeploy:

```bash
# Option 1: Tự động redeploy khi push code
git push

# Option 2: Manual redeploy từ Vercel Dashboard
# Vào Deployments → Click "Redeploy" ở deployment mới nhất
```

---

## **6. Kiểm tra environment variables đã load:**

Mở browser console và test API:

```javascript
fetch('https://your-domain.vercel.app/api/create-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 1,
    planName: 'Premium',
    amount: 59000,
    userEmail: 'test@example.com',
    userName: 'Test User'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**Nếu thành công**, sẽ trả về:
```json
{
  "success": true,
  "orderCode": 123456789,
  "checkoutUrl": "https://pay.payos.vn/web/xxxxx",
  ...
}
```

**Nếu thiếu env vars**, sẽ trả về:
```json
{
  "error": "Payment gateway not configured",
  "message": "Please contact administrator to setup PayOS credentials"
}
```

---

## **📋 Checklist Deploy:**

- [ ] Thêm `PAYOS_CLIENT_ID` vào Vercel
- [ ] Thêm `PAYOS_API_KEY` vào Vercel
- [ ] Thêm `PAYOS_CHECKSUM_KEY` vào Vercel
- [ ] Thêm `NEXT_PUBLIC_SUPABASE_URL` vào Vercel
- [ ] Thêm `NEXT_PUBLIC_SUPABASE_ANON_KEY` vào Vercel
- [ ] Thêm `NEXT_PUBLIC_APP_URL` vào Vercel
- [ ] Redeploy project
- [ ] Cấu hình webhook URL tại PayOS Dashboard
- [ ] Test thanh toán trên production
- [ ] Kiểm tra webhook có gọi thành công không

---

## **🔒 Security Notes:**

1. **KHÔNG** commit `.env.local` lên Git
2. **KHÔNG** share API keys công khai
3. Sử dụng environment khác nhau cho sandbox và production:
   - Development: PayOS Sandbox keys
   - Production: PayOS Live keys

---

## **🆘 Troubleshooting:**

### Lỗi: "Payment gateway not configured"
→ Environment variables chưa được set trên Vercel

### Lỗi: "Failed to create payment"
→ PayOS credentials không đúng hoặc hết hạn

### Webhook không được gọi
→ Kiểm tra webhook URL tại PayOS Dashboard
→ Đảm bảo URL là HTTPS và public

### Thanh toán thành công nhưng subscription không update
→ Kiểm tra webhook logs tại Vercel: `Deployments → Function Logs`
→ Kiểm tra Supabase logs: `Supabase Dashboard → Logs → API Logs`

