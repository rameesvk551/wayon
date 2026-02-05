$ErrorActionPreference = 'Stop'

$baseUrl = if ($env:AI_TRIP_BASE_URL) { $env:AI_TRIP_BASE_URL } else { 'http://localhost:4333' }

Write-Host "Testing AI trip server at $baseUrl"

Write-Host "`n1) Health check"
try {
    $health = Invoke-RestMethod -Method Get -Uri "$baseUrl/api/health"
    $health | ConvertTo-Json -Depth 6
} catch {
    Write-Host "Health check failed: $($_.Exception.Message)"
}

Write-Host "`n2) Chat request"
try {
    $payload = @{ message = 'Plan a weekend trip to Paris, France.' }
    $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/api/chat" -ContentType 'application/json' -Body ($payload | ConvertTo-Json)
    $response | ConvertTo-Json -Depth 8
} catch {
    Write-Host "Chat request failed: $($_.Exception.Message)"
}

Write-Host "`nManual stream test (run in a separate terminal):"
Write-Host "curl -N -H \"Content-Type: application/json\" -d '{\"message\":\"Plan a weekend trip to Paris, France.\"}' $baseUrl/api/chat/stream"
