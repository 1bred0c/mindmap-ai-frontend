# Quick Test Script - PayOS Integration
# Run: .\test-payos.ps1

Write-Host "🧪 Testing PayOS Integration..." -ForegroundColor Cyan
Write-Host ""

# Configuration
$BASE_URL = "http://localhost:3000"
$TEST_USER_ID = "test_user_" + (Get-Date -Format "HHmmss")

Write-Host "📌 Base URL: $BASE_URL" -ForegroundColor Yellow
Write-Host "📌 Test User ID: $TEST_USER_ID" -ForegroundColor Yellow
Write-Host ""

# =====================================
# Test 1: Health Check
# =====================================
Write-Host "🔍 Test 1: Health Check Webhook Endpoint" -ForegroundColor Green
Write-Host "GET /api/webhook/payos" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/webhook/payos" -Method Get
    Write-Host "✅ Response:" -ForegroundColor Green
    $response | ConvertTo-Json
    Write-Host ""
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host ""
}

# =====================================
# Test 2: Create Payment
# =====================================
Write-Host "🔍 Test 2: Create Payment" -ForegroundColor Green
Write-Host "POST /api/create-payment" -ForegroundColor Gray

$paymentBody = @{
    userId = $TEST_USER_ID
    planName = "Premium"
    amount = 59000
    userEmail = "test@example.com"
    userName = "Test User"
} | ConvertTo-Json

try {
    $paymentResponse = Invoke-RestMethod `
        -Uri "$BASE_URL/api/create-payment" `
        -Method Post `
        -ContentType "application/json" `
        -Body $paymentBody

    Write-Host "✅ Payment Created:" -ForegroundColor Green
    $paymentResponse | ConvertTo-Json
    
    $orderCode = $paymentResponse.orderCode
    $checkoutUrl = $paymentResponse.checkoutUrl
    
    Write-Host ""
    Write-Host "💳 Order Code: $orderCode" -ForegroundColor Cyan
    Write-Host "🔗 Checkout URL: $checkoutUrl" -ForegroundColor Cyan
    Write-Host ""
    
    # Open browser (optional)
    # Start-Process $checkoutUrl
    
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host ""
    exit
}

# =====================================
# Test 3: Simulate Webhook (Success)
# =====================================
Write-Host "🔍 Test 3: Simulate Webhook - Payment Success" -ForegroundColor Green
Write-Host "POST /api/webhook/payos" -ForegroundColor Gray

$webhookBody = @{
    code = "00"
    desc = "Thành công"
    data = @{
        orderCode = $orderCode
        amount = 59000
        description = "Thanh toán gói Premium - User: $TEST_USER_ID"
        accountNumber = "9876543210"
        reference = "FT" + (Get-Date -Format "yyMMddHHmmss")
        transactionDateTime = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        currency = "VND"
        paymentLinkId = "test_link_123"
        code = "00"
        desc = "Thành công"
    }
} | ConvertTo-Json -Depth 10

try {
    $webhookResponse = Invoke-RestMethod `
        -Uri "$BASE_URL/api/webhook/payos" `
        -Method Post `
        -ContentType "application/json" `
        -Body $webhookBody

    Write-Host "✅ Webhook Response:" -ForegroundColor Green
    $webhookResponse | ConvertTo-Json
    Write-Host ""
    
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host ""
}

# =====================================
# Summary
# =====================================
Write-Host "📊 Test Summary" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta
Write-Host "✅ Health check completed"
Write-Host "✅ Payment created (Order Code: $orderCode)"
Write-Host "✅ Webhook simulated"
Write-Host ""
Write-Host "🔍 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Check Supabase subscriptions table:"
Write-Host "   SELECT * FROM subscriptions WHERE userid = '$TEST_USER_ID';"
Write-Host ""
Write-Host "2. Check payment logs:"
Write-Host "   SELECT * FROM payment_logs WHERE ordercode = $orderCode;"
Write-Host ""
Write-Host "3. Open checkout URL in browser:"
Write-Host "   $checkoutUrl"
Write-Host ""
Write-Host "4. Open pricing page:"
Write-Host "   $BASE_URL/pricing"
Write-Host ""
