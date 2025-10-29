@echo off
cd /d "%~dp0"
echo Starting DM Screen...
start "" cmd /k "node server.js"
timeout /t 2 > nul
start http://localhost:8080