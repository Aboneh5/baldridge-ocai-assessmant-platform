#!/bin/bash

# Unified Assessment Hub Startup Script
# This script starts both the OCAI Hub and Baldrige Assessment App

echo "🚀 Starting Unified Assessment Hub..."
echo "=================================="

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check required ports
echo "🔍 Checking port availability..."
check_port 3010 || echo "   OCAI Hub port 3010 is in use - this is expected if already running"
check_port 3000 || echo "   Baldrige frontend port 3000 is in use - this is expected if already running"
check_port 5000 || echo "   Baldrige backend port 5000 is in use - this is expected if already running"

echo ""
echo "🎯 Starting OCAI Hub (Main Platform)..."
echo "======================================"

# Start OCAI Hub in background
echo "Starting OCAI Hub on port 3010..."
npm run dev &
OCAI_PID=$!

# Wait a moment for OCAI Hub to start
sleep 5

echo ""
echo "🏆 Starting Baldrige Assessment App..."
echo "===================================="

# Start Baldrige backend
echo "Starting Baldrige backend on port 5000..."
cd "Tenadam Assessment App/tenadam-assessment-app/backend"
npm run dev &
BALDRIGE_BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start Baldrige frontend
echo "Starting Baldrige frontend on port 3000..."
cd "../frontend"
npm run dev &
BALDRIGE_FRONTEND_PID=$!

# Go back to root directory
cd ../../..

echo ""
echo "🎉 Unified Assessment Hub is starting up!"
echo "========================================"
echo ""
echo "📍 Access Points:"
echo "   🏠 Main Assessment Hub: http://localhost:3010"
echo "   📊 OCAI Hub: http://localhost:3010"
echo "   🏆 Baldrige App: http://localhost:3000"
echo ""
echo "⏱️  Please wait 30-60 seconds for all services to fully start up"
echo ""
echo "🛑 To stop all services, press Ctrl+C"
echo ""

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $OCAI_PID 2>/dev/null
    kill $BALDRIGE_BACKEND_PID 2>/dev/null
    kill $BALDRIGE_FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
