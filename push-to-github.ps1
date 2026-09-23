Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Pushing KarmaSiksha Project to GitHub Repository" -ForegroundColor Cyan
Write-Host "  Repo: https://github.com/upoornalakshminarayana-commits/sihprototype.git" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path $PSScriptRoot

Write-Host "[1/5] Configuring remote URL and Git identity..." -ForegroundColor Yellow
git remote set-url origin https://github.com/upoornalakshminarayana-commits/sihprototype.git
git config user.name "upoornalakshminarayana-commits"
git config user.email "upoornalakshminarayana@gmail.com"

Write-Host "[2/5] Removing Netlify configuration files..." -ForegroundColor Yellow
Remove-Item -Path "netlify.toml", "client/netlify.toml" -Force -ErrorAction SilentlyContinue

Write-Host "[3/5] Staging all files..." -ForegroundColor Yellow
git add -A

Write-Host "[4/5] Creating commit..." -ForegroundColor Yellow
git commit -m "KarmaSiksha complete platform with Groq AI competency assessment integration"

Write-Host "[5/5] Setting primary branch to main and pushing to GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSUCCESS: Project successfully pushed to https://github.com/upoornalakshminarayana-commits/sihprototype" -ForegroundColor Green
} else {
    Write-Host "`nNotice: If authentication or credentials were required, please authenticate with GitHub and re-run." -ForegroundColor Yellow
}
