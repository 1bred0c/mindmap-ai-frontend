-- ================================================
-- MIGRATION: PayOS Payment Integration
-- Description: Tạo bảng subscriptions và payment_logs
-- Date: 2025-10-29
-- ================================================

-- ================================
-- 1. Bảng payments (giao dịch thanh toán)
-- ================================
CREATE TABLE IF NOT EXISTS payments (
  paymentid BIGSERIAL PRIMARY KEY,
  userid BIGINT NOT NULL,
  subscriptionid BIGINT,
  amount NUMERIC NOT NULL,
  paidat TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'cancelled', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_userid ON payments(userid);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_subscriptionid ON payments(subscriptionid);

-- Comment
COMMENT ON TABLE payments IS 'Lưu thông tin các giao dịch thanh toán';
COMMENT ON COLUMN payments.paymentid IS 'Mã thanh toán tự tăng';
COMMENT ON COLUMN payments.userid IS 'ID người dùng thực hiện thanh toán';
COMMENT ON COLUMN payments.subscriptionid IS 'Liên kết đến gói đăng ký';
COMMENT ON COLUMN payments.amount IS 'Số tiền thanh toán (VND)';
COMMENT ON COLUMN payments.status IS 'pending: chờ thanh toán, verified: đã xác nhận, cancelled: đã hủy, failed: thất bại';

-- ================================
-- 2. Bảng subscriptions
-- ================================
CREATE TABLE IF NOT EXISTS subscriptions (
  subscriptionid BIGSERIAL PRIMARY KEY,
  userid BIGINT NOT NULL UNIQUE,
  startdate DATE NOT NULL,
  enddate DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes cho performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_userid ON subscriptions(userid);
CREATE INDEX IF NOT EXISTS idx_subscriptions_enddate ON subscriptions(enddate);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Trigger auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comment
COMMENT ON TABLE subscriptions IS 'Lưu thông tin gói đăng ký của người dùng';
COMMENT ON COLUMN subscriptions.subscriptionid IS 'Mã đăng ký tự tăng';
COMMENT ON COLUMN subscriptions.userid IS 'ID của user (unique - 1 user chỉ có 1 subscription active)';
COMMENT ON COLUMN subscriptions.startdate IS 'Ngày bắt đầu gói Premium';
COMMENT ON COLUMN subscriptions.enddate IS 'Ngày hết hạn gói Premium';
COMMENT ON COLUMN subscriptions.status IS 'active: đang hoạt động, expired: hết hạn, cancelled: đã hủy';

-- ================================
-- 3. Bảng payment_logs (log chi tiết cho webhook)
-- ================================
CREATE TABLE IF NOT EXISTS payment_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ordercode BIGINT NOT NULL,
  paymentid BIGINT,
  userid BIGINT,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PAID', 'FAILED', 'CANCELLED', 'PENDING')),
  description TEXT,
  paymentmethod TEXT DEFAULT 'PayOS',
  transactionid TEXT,
  rawdata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_logs_ordercode ON payment_logs(ordercode);
CREATE INDEX IF NOT EXISTS idx_payment_logs_paymentid ON payment_logs(paymentid);
CREATE INDEX IF NOT EXISTS idx_payment_logs_userid ON payment_logs(userid);
CREATE INDEX IF NOT EXISTS idx_payment_logs_status ON payment_logs(status);
CREATE INDEX IF NOT EXISTS idx_payment_logs_created_at ON payment_logs(created_at DESC);

-- Comment
COMMENT ON TABLE payment_logs IS 'Log tất cả giao dịch thanh toán qua PayOS';
COMMENT ON COLUMN payment_logs.ordercode IS 'Mã đơn hàng unique từ PayOS';
COMMENT ON COLUMN payment_logs.amount IS 'Số tiền thanh toán (VND)';
COMMENT ON COLUMN payment_logs.status IS 'Trạng thái: PAID, FAILED, CANCELLED, PENDING';
COMMENT ON COLUMN payment_logs.transactionid IS 'Mã giao dịch từ ngân hàng/PayOS';
COMMENT ON COLUMN payment_logs.rawdata IS 'Raw JSON từ PayOS webhook';

-- ================================
-- 3. Enable Row Level Security (RLS)
-- ================================
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- Policy: User chỉ xem được subscription của mình
CREATE POLICY "Users can view own subscriptions"
ON subscriptions FOR SELECT
USING (userid = auth.uid()::text);

-- Policy: Admin có thể xem tất cả
CREATE POLICY "Admin can view all subscriptions"
ON subscriptions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Policy: Service role có thể insert/update (cho webhook)
CREATE POLICY "Service can manage subscriptions"
ON subscriptions FOR ALL
USING (true);

-- Payment logs: Admin only
CREATE POLICY "Admin can view payment logs"
ON payment_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "Service can manage payment logs"
ON payment_logs FOR ALL
USING (true);

-- ================================
-- 4. Sample Data (for testing)
-- ================================
-- Uncomment để test
/*
INSERT INTO subscriptions (userid, startdate, enddate, status, plan, ordercode) 
VALUES 
  ('test_user_1', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'active', 'Premium', 123456789),
  ('test_user_2', CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '10 days', 'expired', 'Premium', 987654321);
*/

-- ================================
-- 5. Verify Migration
-- ================================
-- Kiểm tra bảng đã tạo
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscriptions', 'payment_logs');

-- Kiểm tra indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('subscriptions', 'payment_logs');

-- ================================
-- ROLLBACK (nếu cần)
-- ================================
/*
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS payment_logs CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
*/
