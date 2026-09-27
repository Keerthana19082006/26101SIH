@echo off
echo ========================================================
echo   Launching KarmaSiksha FastAPI Backend (Port 8000)...
echo ========================================================
cd /d "%~dp0"

set "PY_CMD=python"
if exist "%~dp0venv\Scripts\python.exe" (
    set "PY_CMD=%~dp0venv\Scripts\python.exe"
) else if exist "C:\Users\LENOVO\AppData\Local\Programs\Python\Python311\python.exe" (
    set "PY_CMD=C:\Users\LENOVO\AppData\Local\Programs\Python\Python311\python.exe"
) else (
    where py >nul 2>nul && set "PY_CMD=py"
)

echo Using Python: %PY_CMD%
"%PY_CMD%" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
