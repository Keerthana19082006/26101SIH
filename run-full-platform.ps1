Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "  KarmaSiksha SIH 26101 - Launching Full Platform (Frontend + Backend)" -ForegroundColor Green
Write-Host "=========================================================================" -ForegroundColor Cyan

$pyPath = "python"
if (Test-Path "$PSScriptRoot\backend\venv\Scripts\python.exe") {
    $pyPath = "$PSScriptRoot\backend\venv\Scripts\python.exe"
} elseif (Test-Path "C:\Users\LENOVO\AppData\Local\Programs\Python\Python311\python.exe") {
    $pyPath = "C:\Users\LENOVO\AppData\Local\Programs\Python\Python311\python.exe"
}

Write-Host "Using Python path: $pyPath" -ForegroundColor Yellow

# 1. Start FastAPI Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; & '$pyPath' -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

# 2. Open Swagger Documentation
Start-Sleep -Seconds 1
Start-Process "http://localhost:8000/docs"

# 3. Start React Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm run dev"
