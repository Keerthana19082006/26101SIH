Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Pushing KarmaSiksha Project to GitHub Repository" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path $PSScriptRoot

Write-Host "[1/4] Staging modified files..." -ForegroundColor Yellow
git add -A

Write-Host "[2/4] Creating commit..." -ForegroundColor Yellow
git commit -m "Fix deployment ASGI entrypoint, bcrypt password hashing, and Procfile configuration"

Write-Host "[3/4] Ensuring main branch..." -ForegroundColor Yellow
git branch -M main

Write-Host "[4/4] Pushing changes to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSUCCESS: Project successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "`nNotice: Please verify your git credentials or origin remote." -ForegroundColor Yellow
}
