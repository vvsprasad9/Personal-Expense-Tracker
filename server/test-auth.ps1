$ts = Get-Date -UFormat %s

# User 1
$u1 = "user1_$ts@example.com"
Write-Output "Registering $u1"
try {
  $r1 = Invoke-RestMethod -Uri 'http://localhost:5000/api/users/register' -Method Post -Body (@{name="User One"; email=$u1; password='pass123'} | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
  Write-Output "Register response:"
  $r1 | ConvertTo-Json -Depth 5
} catch { Write-Output "Register failed: $_" }

# Login user 1
Write-Output "Logging in $u1"
$login1 = Invoke-RestMethod -Uri 'http://localhost:5000/api/users/login' -Method Post -Body (@{email=$u1; password='pass123'} | ConvertTo-Json) -ContentType 'application/json'
$token1 = $login1.token
Write-Output "Token1: $token1"

# Add expense for user1
Write-Output "Adding expense for user1"
$exp1 = Invoke-RestMethod -Uri 'http://localhost:5000/api/expenses' -Method Post -Body (@{description='User1 expense'; amount=10; category='Food'; date=(Get-Date).ToString('yyyy-MM-dd')} | ConvertTo-Json) -ContentType 'application/json' -Headers @{Authorization = "Bearer $token1"}
Write-Output "Added expense1 id: $($exp1._id)"

# Fetch expenses for user1
Write-Output "Fetching expenses for user1"
$list1 = Invoke-RestMethod -Uri 'http://localhost:5000/api/expenses' -Method Get -Headers @{Authorization = "Bearer $token1"}
Write-Output ($list1 | ConvertTo-Json -Depth 5)

# User 2
$u2 = "user2_$ts@example.com"
Write-Output "Registering $u2"
try {
  $r2 = Invoke-RestMethod -Uri 'http://localhost:5000/api/users/register' -Method Post -Body (@{name="User Two"; email=$u2; password='pass123'} | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
  Write-Output "Register response:"
  $r2 | ConvertTo-Json -Depth 5
} catch { Write-Output "Register failed: $_" }

# Login user2
Write-Output "Logging in $u2"
$login2 = Invoke-RestMethod -Uri 'http://localhost:5000/api/users/login' -Method Post -Body (@{email=$u2; password='pass123'} | ConvertTo-Json) -ContentType 'application/json'
$token2 = $login2.token
Write-Output "Token2: $token2"

# Add expense for user2
Write-Output "Adding expense for user2"
$exp2 = Invoke-RestMethod -Uri 'http://localhost:5000/api/expenses' -Method Post -Body (@{description='User2 expense'; amount=20; category='Transport'; date=(Get-Date).ToString('yyyy-MM-dd')} | ConvertTo-Json) -ContentType 'application/json' -Headers @{Authorization = "Bearer $token2"}
Write-Output "Added expense2 id: $($exp2._id)"

# Fetch expenses for user2
Write-Output "Fetching expenses for user2"
$list2 = Invoke-RestMethod -Uri 'http://localhost:5000/api/expenses' -Method Get -Headers @{Authorization = "Bearer $token2"}
Write-Output ($list2 | ConvertTo-Json -Depth 5)

# Final: fetch with token1 again to ensure isolation
Write-Output "Fetching expenses for user1 again"
$list1b = Invoke-RestMethod -Uri 'http://localhost:5000/api/expenses' -Method Get -Headers @{Authorization = "Bearer $token1"}
Write-Output ($list1b | ConvertTo-Json -Depth 5)
