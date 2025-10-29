# Test Create Payment API
$body = @{
    userId = "test_fixed"
    planName = "Premium"
    amount = 59000
    userEmail = "test@example.com"
    userName = "Test User"
} | ConvertTo-Json

Write-Host "Sending request to create payment..." -ForegroundColor Cyan
Write-Host "Body: $body" -ForegroundColor Gray

$response = Invoke-RestMethod `
    -Uri "http://localhost:3000/api/create-payment" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

Write-Host "`nResponse:" -ForegroundColor Green
$response | ConvertTo-Json -Depth 10
