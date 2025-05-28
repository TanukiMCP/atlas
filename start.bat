@echo off
setlocal

echo.
echo 🦝 Starting TanukiMCP Atlas...
echo.

:: Start the development server in a new window
echo 📡 Starting development server...
start "TanukiMCP Dev Server" cmd /k "npm run dev"

:: Wait for the dev server to start
echo ⏳ Waiting for server to be ready...
timeout /t 5 /nobreak >nul

:: Check if port 3000 is available (dev server should be running)
netstat -an | find "3000" >nul
if %errorlevel% neq 0 (
    echo ❌ Development server may not have started properly
    echo Please check the dev server window for errors
    pause
    exit /b 1
)

echo ✅ Development server appears to be running

:: Start Electron app
echo 🚀 Starting Electron app...
npm start

echo.
echo 🛑 Application closed
echo The development server is still running in the background
echo Close the dev server window manually if needed
pause 