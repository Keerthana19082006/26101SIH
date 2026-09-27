@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   Pushing KarmaSiksha Project to GitHub Repository
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/4] Staging modified files...
git add -A

echo [2/4] Creating commit...
git commit -m "Fix deployment ASGI entrypoint, bcrypt password hashing, and Procfile configuration"

echo [3/4] Ensuring main branch...
git branch -M main

echo [4/4] Pushing changes to GitHub...
git push origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   SUCCESS: Project pushed to GitHub successfully!
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   Note: Please verify your git credentials or origin remote.
    echo ========================================================
)

pause
