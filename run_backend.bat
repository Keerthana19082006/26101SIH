@echo off
echo =========================================================================
echo   KarmaSiksha SIH 26101 - Launching Groq AI Enabled Backend
echo =========================================================================

set "PY_CMD=python"
if exist "%~dp0backend\venv\Scripts\python.exe" (
    set "PY_CMD=%~dp0backend\venv\Scripts\python.exe"
) else if exist "C:\Users\LENOVO\AppData\Local\Programs\Python\Python311\python.exe" (
    set "PY_CMD=C:\Users\LENOVO\AppData\Local\Programs\Python\Python311\python.exe"
) else (
    where py >nul 2>nul && set "PY_CMD=py"
)

cd /d "%~dp0backend"
echo [KarmaSiksha Backend] Starting FastAPI on http://localhost:8000 using %PY_CMD%...
"%PY_CMD%" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
