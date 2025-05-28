#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo
echo "🦝 Starting TanukiMCP Atlas..."
echo

# Function to cleanup background processes
cleanup() {
    echo
    echo "🛑 Shutting down..."
    if [ ! -z "$DEV_PID" ]; then
        kill $DEV_PID 2>/dev/null
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start the development server in the background
echo -e "${BLUE}📡${NC} Starting development server..."
npm run dev &
DEV_PID=$!

# Wait a moment for the dev server to start
sleep 3

# Check if dev server is running
if ! kill -0 $DEV_PID 2>/dev/null; then
    echo -e "${RED}❌${NC} Failed to start development server"
    exit 1
fi

echo -e "${GREEN}✅${NC} Development server started (PID: $DEV_PID)"

# Wait a bit more for the server to be fully ready
echo -e "${YELLOW}⏳${NC} Waiting for server to be ready..."
sleep 2

# Start Electron app
echo -e "${BLUE}🚀${NC} Starting Electron app..."
npm start

# When Electron closes, cleanup
cleanup 