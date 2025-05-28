#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

echo
echo "========================================"
echo "🦝 TanukiMCP Atlas - One-Click Setup"
echo "========================================"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    echo
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Recommended version: 18.x or higher"
    echo
    echo "On macOS with Homebrew: brew install node"
    echo "On Ubuntu/Debian: sudo apt install nodejs npm"
    echo "On CentOS/RHEL: sudo yum install nodejs npm"
    echo
    exit 1
fi

NODE_VERSION=$(node --version)
print_status "Node.js found: $NODE_VERSION"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    print_error "npm is not available!"
    echo "Please reinstall Node.js with npm included"
    exit 1
fi

NPM_VERSION=$(npm --version)
print_status "npm found: $NPM_VERSION"

# Check if Git is installed (optional but recommended)
if ! command -v git &> /dev/null; then
    print_warning "Git is not installed (optional but recommended)"
    echo "You can install it from: https://git-scm.com/"
else
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    print_status "Git found: $GIT_VERSION"
fi

echo
echo "📦 Installing dependencies..."
echo

# Install root dependencies
echo "Installing root dependencies..."
if ! npm install; then
    print_error "Failed to install root dependencies"
    exit 1
fi

# Install main package dependencies
echo
echo "Installing main package dependencies..."
cd packages/main
if ! npm install; then
    print_error "Failed to install main package dependencies"
    cd ../..
    exit 1
fi
cd ../..

# Install renderer package dependencies
echo
echo "Installing renderer package dependencies..."
cd packages/renderer
if ! npm install; then
    print_error "Failed to install renderer package dependencies"
    cd ../..
    exit 1
fi
cd ../..

echo
echo "🔧 Setting up development environment..."

# Create necessary directories
mkdir -p logs temp data

# Set up environment variables (create .env if it doesn't exist)
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# TanukiMCP Atlas Environment Variables
NODE_ENV=development
ELECTRON_IS_DEV=true
VITE_DEV_SERVER_URL=http://localhost:3000
# Add your custom environment variables below
EOF
fi

# Make scripts executable
chmod +x setup.sh
if [ -f "start.sh" ]; then
    chmod +x start.sh
fi

echo
echo "🧪 Running initial build test..."
if ! npm run build; then
    print_error "Build test failed"
    echo "Please check the error messages above"
    exit 1
fi

echo
print_status "Build test passed!"

echo
echo "🎉 Setup completed successfully!"
echo
echo "📋 Available commands:"
echo "  npm run dev        - Start development server"
echo "  npm start          - Start Electron app"
echo "  npm run build      - Build for production"
echo "  npm run test       - Run tests"
echo "  npm run lint       - Run linter"
echo
echo "🚀 To get started:"
echo "  1. Run: npm run dev"
echo "  2. In another terminal: npm start"
echo
echo "Press Enter to continue..."
read 