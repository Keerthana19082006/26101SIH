@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   Pushing KarmaSiksha Project to GitHub Repository
echo   Repo: https://github.com/upoornalakshminarayana-commits/sihprototype.git
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/5] Configuring remote URL and Git identity...
git remote set-url origin https://github.com/upoornalakshminarayana-commits/sihprototype.git
git config user.name "upoornalakshminarayana-commits"
git config user.email "upoornalakshminarayana@gmail.com"

echo [2/5] Removing Netlify configuration files...
if exist "netlify.toml" del /f /q "netlify.toml"
if exist "client\netlify.toml" del /f /q "client\netlify.toml"

echo [3/5] Staging all files...
git add -A

echo [4/5] Creating commit...
git commit -m "KarmaSiksha complete platform with Groq AI competency assessment integration"

echo [5/5] Setting primary branch to main and pushing to GitHub...
git branch -M main
git push -u origin main --force

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   SUCCESS: Project pushed to https://github.com/upoornalakshminarayana-commits/sihprototype
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   Note: If GitHub requested credentials, please authenticate
    echo   in the browser or terminal prompt and run this script again.
    echo ========================================================
)

pause
