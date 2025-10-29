#!/bin/bash

# Quick Test Script - PayOS Integration (Linux/Mac)
# Run: chmod +x test-payos.sh && ./test-payos.sh

echo "🧪 Testing PayOS Integration..."
echo ""

# Configuration
BASE_URL="http://localhost:3000"
TEST_USER_ID="test_user_$(date +%H%M%S)"

echo "📌 Base URL: $BASE_URL"
echo "📌 Test User ID: $TEST_USER_ID"
echo ""

# =====================================
# Test 1: Health Check
# =====================================
echo "🔍 Test 1: Health Check Webhook Endpoint"
echo "GET /api/webhook/payos"

curl -s "$BASE_URL/api/webhook/payos" | jq '.'
echo ""

# =====================================
# Test 2: Create Payment
# =====================================
echo "🔍 Test 2: Create Payment"
echo "POST /api/create-payment"

PAYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/create-payment" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$TEST_USER_ID\",
    \"planName\": \"Premium\",
    \"amount\": 59000,
    \"userEmail\": \"test@example.com\",
    \"userName\": \"Test User\"
  }")

echo "$PAYMENT_RESPONSE" | jq '.'
echo ""

ORDER_CODE=$(echo "$PAYMENT_RESPONSE" | jq -r '.orderCode')
CHECKOUT_URL=$(echo "$PAYMENT_RESPONSE" | jq -r '.checkoutUrl')

echo "💳 Order Code: $ORDER_CODE"
echo "🔗 Checkout URL: $CHECKOUT_URL"
echo ""

# =====================================
# Test 3: Simulate Webhook
# =====================================
echo "🔍 Test 3: Simulate Webhook - Payment Success"
echo "POST /api/webhook/payos"

WEBHOOK_RESPONSE=$(curl -s -X POST "$BASE_URL/api/webhook/payos" \
  -H "Content-Type: application/json" \
  -d "{
    \"code\": \"00\",
    \"desc\": \"Thành công\",
    \"data\": {
      \"orderCode\": $ORDER_CODE,
      \"amount\": 59000,
      \"description\": \"Thanh toán gói Premium - User: $TEST_USER_ID\",
      \"accountNumber\": \"9876543210\",
      \"reference\": \"FT$(date +%y%m%d%H%M%S)\",
      \"transactionDateTime\": \"$(date '+%Y-%m-%d %H:%M:%S')\",
      \"currency\": \"VND\",
      \"code\": \"00\",
      \"desc\": \"Thành công\"
    }
  }")

echo "$WEBHOOK_RESPONSE" | jq '.'
echo ""

# =====================================
# Summary
# =====================================
echo "📊 Test Summary"
echo "═══════════════════════════════════════"
echo "✅ Health check completed"
echo "✅ Payment created (Order Code: $ORDER_CODE)"
echo "✅ Webhook simulated"
echo ""
echo "🔍 Next Steps:"
echo "1. Check Supabase subscriptions table:"
echo "   SELECT * FROM subscriptions WHERE userid = '$TEST_USER_ID';"
echo ""
echo "2. Check payment logs:"
echo "   SELECT * FROM payment_logs WHERE ordercode = $ORDER_CODE;"
echo ""
echo "3. Open checkout URL:"
echo "   $CHECKOUT_URL"
echo ""
