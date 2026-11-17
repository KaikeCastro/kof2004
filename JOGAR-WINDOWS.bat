@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
 echo Instale Node.js 20 ou superior: https://nodejs.org/
 pause
 exit /b 1
)
start "Brasil Fighters - servidor" cmd /k node server.mjs
timeout /t 2 /nobreak >nul
start "" http://localhost:3000
