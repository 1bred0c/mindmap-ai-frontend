# ✅ PayOS Integration Checklist

## 📋 Setup Checklist

### 1. Code Files
- [x] `app/api/create-payment/route.ts` - API tạo thanh toán
- [x] `app/api/webhook/payos/route.ts` - Webhook nhận callback
- [x] `hooks/use-payos-payment.ts` - Custom hook
- [x] `app/pricing/page.tsx` - UI thanh toán (updated)
- [x] `docs/supabase_payos_migration.sql` - Database schema
- [x] `.env.example` - Template environment variables

### 2. Documentation
- [x] `docs/PAYOS_README.md` - Quick start guide
- [x] `docs/PAYOS_INTEGRATION_GUIDE.md` - Chi tiết tích hợp
- [x] `docs/PAYOS_TESTING_GUIDE.md` - Hướng dẫn test
- [x] `docs/PAYOS_DEPLOYMENT_GUIDE.md` - Hướng dẫn deploy

### 3. Test Scripts
- [x] `test-payos.ps1` - PowerShell test script
- [x] `test-payos.sh` - Bash test script

---

## 🔧 Configuration Checklist

### Local Development

- [ ] Copy `.env.example` → `.env.local`
- [ ] Lấy Supabase URL & Anon Key
- [ ] Đăng ký PayOS: https://my.payos.vn/
- [ ] Lấy PayOS Sandbox Keys (Client ID, API Key, Checksum Key)
- [ ] Update `.env.local` với tất cả keys
- [ ] Run `npm install`
- [ ] Run database migration trong Supabase SQL Editor
- [ ] Run `npm run dev`

### Database Setup

- [ ] Chạy migration: `docs/supabase_payos_migration.sql`
- [ ] Verify tables created:
  ```sql
  SELECT table_name FROM information_schema.tables 
  WHERE table_name IN ('subscriptions', 'payment_logs');
  ```
- [ ] Check indexes:
  ```sql
  SELECT indexname FROM pg_indexes 
  WHERE tablename IN ('subscriptions', 'payment_logs');
  ```
- [ ] Setup RLS policies (optional)

---

## 🧪 Testing Checklist

### Manual Testing

- [ ] Test health check: `GET /api/webhook/payos`
- [ ] Test create payment: `POST /api/create-payment`
- [ ] Copy checkout URL và mở trong browser
- [ ] Simulate webhook: `POST /api/webhook/payos`
- [ ] Verify subscription trong Supabase
- [ ] Verify payment logs trong Supabase

### Automated Testing

- [ ] Run PowerShell script: `.\test-payos.ps1`
- [ ] Check console output
- [ ] Verify database updates
- [ ] Check logs không có errors

### Frontend Testing

- [ ] Mở `http://localhost:3000/pricing`
- [ ] Click "Thanh toán qua PayOS"
- [ ] Verify loading state
- [ ] Check popup mở đúng
- [ ] Verify current plan updates sau thanh toán

---

## 🚀 Production Deployment Checklist

### Pre-Deploy

- [ ] Code đã commit lên Git
- [ ] All tests passed
- [ ] Database migration chạy trên Production Supabase
- [ ] Có PayOS Production Keys (không phải Sandbox)
- [ ] Review code security (signature verification, etc.)

### Vercel Deployment

- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login: `vercel login`
- [ ] Deploy: `vercel --prod`
- [ ] Add environment variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `NEXT_PUBLIC_APP_URL`
  - [ ] `PAYOS_CLIENT_ID`
  - [ ] `PAYOS_API_KEY`
  - [ ] `PAYOS_CHECKSUM_KEY`
- [ ] Verify deployment URL

### PayOS Configuration

- [ ] Login PayOS Dashboard
- [ ] Switch to Production mode (tắt Sandbox)
- [ ] Config webhook URL: `https://yourdomain.com/api/webhook/payos`
- [ ] Test webhook từ PayOS Dashboard
- [ ] Verify webhook responds với status 200

### Production Testing

- [ ] Test create payment với production URL
- [ ] Test real payment (nhỏ amount để test)
- [ ] Verify webhook received
- [ ] Check Vercel logs: `vercel logs --follow`
- [ ] Check Supabase subscription created
- [ ] Check frontend updates correctly

---

## 📊 Monitoring Checklist

### Logs

- [ ] Setup Vercel logging
- [ ] Monitor PayOS webhook history
- [ ] Check Supabase logs
- [ ] Setup error alerts (optional: Sentry)

### Database

- [ ] Monitor subscription counts:
  ```sql
  SELECT COUNT(*) FROM subscriptions WHERE status = 'active';
  ```
- [ ] Monitor payment success rate:
  ```sql
  SELECT status, COUNT(*) FROM payment_logs GROUP BY status;
  ```
- [ ] Check for failed payments:
  ```sql
  SELECT * FROM payment_logs WHERE status = 'FAILED';
  ```

### Performance

- [ ] API response time < 2s
- [ ] Webhook processing time < 5s
- [ ] Database query time < 500ms
- [ ] No memory leaks

---

## 🔒 Security Checklist

- [ ] Environment variables not committed to Git
- [ ] `.env.local` in `.gitignore`
- [ ] Webhook signature verification enabled
- [ ] HTTPS only in production
- [ ] Supabase RLS enabled (if needed)
- [ ] No sensitive data in logs
- [ ] Rate limiting implemented (optional)
- [ ] CORS configured properly

---

## 📝 Post-Deploy Checklist

### Documentation

- [ ] Update README with production URL
- [ ] Document any changes/customizations
- [ ] Update API documentation if needed
- [ ] Create runbook for common issues

### Team Handoff

- [ ] Share PayOS Dashboard access
- [ ] Share Supabase access
- [ ] Share Vercel access
- [ ] Document support contacts

### Future Improvements

- [ ] Email notifications cho successful payments
- [ ] Admin dashboard xem transactions
- [ ] Auto-renew subscription logic
- [ ] Refund/cancellation flow
- [ ] Multiple payment tiers
- [ ] Discount codes/coupons

---

## ❌ Troubleshooting Checklist

### Common Issues

#### Payment Creation Failed
- [ ] Check PayOS API keys
- [ ] Verify `.env.local` loaded
- [ ] Check PayOS dashboard for errors
- [ ] Review server logs
- [ ] Test with Postman/curl

#### Webhook Not Received
- [ ] Verify webhook URL in PayOS Dashboard
- [ ] Check URL is HTTPS (production)
- [ ] Use ngrok for local testing
- [ ] Check webhook signature
- [ ] Review PayOS webhook history

#### Database Errors
- [ ] Verify migration ran successfully
- [ ] Check Supabase connection
- [ ] Review RLS policies
- [ ] Check table permissions
- [ ] Verify user ID format

#### Frontend Issues
- [ ] Check browser console
- [ ] Verify API endpoints
- [ ] Check loading states
- [ ] Test popup blockers disabled
- [ ] Review network tab

---

## 📞 Support Resources

- PayOS Docs: https://payos.vn/docs
- PayOS Dashboard: https://my.payos.vn/
- PayOS Support: support@payos.vn
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs

---

## ✅ Final Verification

Before going live:

- [ ] All tests passed (local & production)
- [ ] Database properly configured
- [ ] Webhook working correctly
- [ ] Frontend UX smooth
- [ ] Error handling robust
- [ ] Monitoring setup
- [ ] Documentation complete
- [ ] Team trained
- [ ] Backup plan ready

**Sign-off:**
- [ ] Developer: ________________
- [ ] QA: ________________
- [ ] Product Owner: ________________
- [ ] Date: ________________

---

**Status:** 🟢 Ready for Production

**Last Updated:** 2025-10-29
