@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo 🦝 TanukiMCP Atlas - One-Click Setup
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Recommended version: 18.x or higher
    echo.
    pause
    exit /b 1
)

:: Check Node.js version
for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%

:: Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available!
    echo Please reinstall Node.js with npm included
    pause
    exit /b 1
)

for /f "tokens=1" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm found: %NPM_VERSION%

:: Check if Git is installed (optional but recommended)
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Git is not installed (optional but recommended)
    echo You can install it from: https://git-scm.com/
) else (
    for /f "tokens=3" %%i in ('git --version') do set GIT_VERSION=%%i
    echo ✅ Git found: !GIT_VERSION!
)

echo.
echo 📦 Installing dependencies...
echo.

:: Install root dependencies
echo Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

:: Install main package dependencies
echo.
echo Installing main package dependencies...
cd packages\main
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install main package dependencies
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

:: Install renderer package dependencies
echo.
echo Installing renderer package dependencies...
cd packages\renderer
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install renderer package dependencies
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

echo.
echo 🔧 Setting up development environment...

:: Create necessary directories
if not exist "logs" mkdir logs
if not exist "temp" mkdir temp
if not exist "data" mkdir data

:: Set up environment variables (create .env if it doesn't exist)
if not exist ".env" (
    echo Creating .env file...
    echo # TanukiMCP Atlas Environment Variables > .env
    echo NODE_ENV=development >> .env
    echo ELECTRON_IS_DEV=true >> .env
    echo VITE_DEV_SERVER_URL=http://localhost:3000 >> .env
    echo # Add your OpenRouter API key below >> .env
    echo # OPENROUTER_API_KEY=your_api_key_here >> .env
)

echo.
echo 🧪 Running initial build test...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build test failed
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo ✅ Build test passed!

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Available commands:
echo   npm run dev        - Start development server
echo   npm start          - Start Electron app
echo   npm run build      - Build for production
echo   npm run test       - Run tests
echo   npm run lint       - Run linter
echo.
echo 🚀 To get started:
echo   1. Set up your OpenRouter API key in the app settings or .env file
echo   2. Run: npm run dev
echo   3. In another terminal: npm start
echo.
echo Press any key to exit...
pause >nul 