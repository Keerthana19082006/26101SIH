@echo off
echo =========================================================================
echo   KarmaSiksha SIH 26101 - Launching Full Platform (Frontend + Backend)
echo =========================================================================

set "PY_CMD=python"
if exist "%~dp0backend\venv\Scripts\python.exe" (
    set "PY_CMD=%~dp0backend\venv\Scripts\python.exe"
) else if exist "C:\Users\LENOVO\AppData\Local\Programs\Python\Python311\python.exe" (
    set "PY_CMD=C:\Users\LENOVO\AppData\Local\Programs\Python\Python311\python.exe"
) else (
    where py >nul 2>nul && set "PY_CMD=py"
)

echo 1. Starting FastAPI Production Backend on http://localhost:8000 using: %PY_CMD%
start "KarmaSiksha Backend API" cmd /k "cd /d %~dp0backend && "%PY_CMD%" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo 2. Opening Swagger OpenAPI Documentation on http://localhost:8000/docs
start http://localhost:8000/docs

echo 3. Starting React 19 Frontend on http://localhost:5173
start "KarmaSiksha Web Portal" cmd /k "cd /d %~dp0client && npm run dev"

echo Done. Platform initialized.
