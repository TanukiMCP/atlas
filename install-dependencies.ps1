# TanukiMCP Atlas - PowerShell Setup Script
# Requires PowerShell 5.0 or higher

param(
    [switch]$SkipBuild,
    [switch]$Verbose
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
$Colors = @{
    Success = "Green"
    Error = "Red"
    Warning = "Yellow"
    Info = "Cyan"
}

function Write-Status {
    param([string]$Message, [string]$Type = "Info")
    $emoji = switch ($Type) {
        "Success" { "✅" }
        "Error" { "❌" }
        "Warning" { "⚠️" }
        default { "ℹ️" }
    }
    Write-Host "$emoji $Message" -ForegroundColor $Colors[$Type]
}

function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🦝 TanukiMCP Atlas - PowerShell Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check PowerShell version
$psVersion = $PSVersionTable.PSVersion
if ($psVersion.Major -lt 5) {
    Write-Status "PowerShell version $($psVersion.Major).$($psVersion.Minor) detected. PowerShell 5.0 or higher is recommended." "Warning"
}

# Check if Node.js is installed
if (-not (Test-Command "node")) {
    Write-Status "Node.js is not installed!" "Error"
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/"
    Write-Host "Recommended version: 18.x or higher"
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

$nodeVersion = node --version
Write-Status "Node.js found: $nodeVersion" "Success"

# Check if npm is available
if (-not (Test-Command "npm")) {
    Write-Status "npm is not available!" "Error"
    Write-Host "Please reinstall Node.js with npm included"
    Read-Host "Press Enter to exit"
    exit 1
}

$npmVersion = npm --version
Write-Status "npm found: $npmVersion" "Success"

# Check if Git is installed (optional but recommended)
if (-not (Test-Command "git")) {
    Write-Status "Git is not installed (optional but recommended)" "Warning"
    Write-Host "You can install it from: https://git-scm.com/"
} else {
    $gitVersion = (git --version).Split(' ')[2]
    Write-Status "Git found: $gitVersion" "Success"
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Write-Host ""

try {
    # Install root dependencies
    Write-Host "Installing root dependencies..."
    if ($Verbose) {
        npm install --verbose
    } else {
        npm install
    }
    
    # Install main package dependencies
    Write-Host ""
    Write-Host "Installing main package dependencies..."
    Push-Location "packages\main"
    try {
        if ($Verbose) {
            npm install --verbose
        } else {
            npm install
        }
    }
    finally {
        Pop-Location
    }
    
    # Install renderer package dependencies
    Write-Host ""
    Write-Host "Installing renderer package dependencies..."
    Push-Location "packages\renderer"
    try {
        if ($Verbose) {
            npm install --verbose
        } else {
            npm install
        }
    }
    finally {
        Pop-Location
    }
    
    Write-Host ""
    Write-Host "🔧 Setting up development environment..." -ForegroundColor Yellow
    
    # Create necessary directories
    $directories = @("logs", "temp", "data")
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir | Out-Null
            Write-Status "Created directory: $dir" "Success"
        }
    }
    
    # Set up environment variables (create .env if it doesn't exist)
    if (-not (Test-Path ".env")) {
        Write-Host "Creating .env file..."
        $envContent = @"
# TanukiMCP Atlas Environment Variables
NODE_ENV=development
ELECTRON_IS_DEV=true
VITE_DEV_SERVER_URL=http://localhost:3000
# Add your custom environment variables below
"@
        Set-Content -Path ".env" -Value $envContent
        Write-Status "Created .env file" "Success"
    }
    
    if (-not $SkipBuild) {
        Write-Host ""
        Write-Host "🧪 Running initial build test..." -ForegroundColor Yellow
        npm run build
        Write-Status "Build test passed!" "Success"
    }
    
    Write-Host ""
    Write-Status "Setup completed successfully!" "Success"
    Write-Host ""
    Write-Host "📋 Available commands:" -ForegroundColor Cyan
    Write-Host "  npm run dev        - Start development server"
    Write-Host "  npm start          - Start Electron app"
    Write-Host "  npm run build      - Build for production"
    Write-Host "  npm run test       - Run tests"
    Write-Host "  npm run lint       - Run linter"
    Write-Host ""
    Write-Host "🚀 To get started:" -ForegroundColor Green
    Write-Host "  1. Run: npm run dev"
    Write-Host "  2. In another terminal: npm start"
    Write-Host ""
    Write-Host "Or use the convenience scripts:"
    Write-Host "  .\start.bat        - Start both dev server and Electron app"
    Write-Host ""
    
}
catch {
    Write-Status "Setup failed: $($_.Exception.Message)" "Error"
    Write-Host ""
    Write-Host "Error details:" -ForegroundColor Red
    Write-Host $_.Exception.ToString()
    exit 1
}

Read-Host "Press Enter to exit" 