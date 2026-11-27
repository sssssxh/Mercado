@echo off
setlocal
cd /d "%~dp0"
set "PY=python"
if exist "..\..\..\work\streamlit-env\Scripts\python.exe" set "PY=..\..\..\work\streamlit-env\Scripts\python.exe"
if exist ".venv\Scripts\python.exe" set "PY=.venv\Scripts\python.exe"
echo Open http://127.0.0.1:18627/ in your browser after startup.
set PYTHONDONTWRITEBYTECODE=1
"%PY%" -B -m streamlit run app.py --server.address=127.0.0.1 --server.port=18627 --server.headless=true --browser.gatherUsageStats=false
if errorlevel 1 pause
