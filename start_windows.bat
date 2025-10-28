
@echo off
cd /d "%~dp0"
echo Installing dependencies...
call npm install
echo Starting app...
start "" cmd /k "node server.js"
timeout /t 2 > nul
start http://localhost:8080
