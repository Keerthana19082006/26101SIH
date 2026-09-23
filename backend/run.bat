@echo off
set "PY_CMD=C:\Users\LENOVO\AppData\Local\Programs\Python\Python311\python.exe"
if not exist "%PY_CMD%" set "PY_CMD=python"
echo Starting KarmaSiksha Backend on http://localhost:8000 ...
"%PY_CMD%" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
