#!/bin/bash

# Tenadam Assessment Update Script for VPS
# Make executable: chmod +x update-app.sh
# Run: ./update-app.sh

set -e  # Exit on any error

APP_NAME="tenadam-assessment"
BRANCH="main"  # Change to 'master' if needed

echo "🚀 ====================================="
echo "   Tenadam Assessment Update Script"
echo "====================================="
echo ""

# Get current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "📁 Working directory: $SCRIPT_DIR"
echo ""

# Check if git repo
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository!"
    exit 1
fi

# Stash any local changes
echo "💾 Stashing local changes (if any)..."
git stash

# Pull latest changes
echo "📥 Pulling latest changes from origin/$BRANCH..."
git pull origin $BRANCH

if [ $? -ne 0 ]; then
    echo "❌ Git pull failed!"
    exit 1
fi

echo "✅ Code updated successfully"
echo ""

# Check if package.json changed
if git diff HEAD@{1} --name-only | grep -q "package.json"; then
    echo "📦 package.json changed, installing dependencies..."
    npm install
    echo "✅ Dependencies updated"
else
    echo "⏭️  No dependency changes detected"
fi
echo ""

# Generate Prisma client (in case schema changed)
echo "🔧 Generating Prisma client..."
npm run db:generate

# Run database migrations (production)
echo "🗄️  Running database migrations..."
npm run db:deploy

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed!"
    echo "Install it with: sudo npm install -g pm2"
    exit 1
fi

# Check if app is running in PM2
if pm2 list | grep -q "$APP_NAME"; then
    echo "🔄 Restarting PM2 app: $APP_NAME..."
    pm2 restart $APP_NAME
    pm2 save
    echo "✅ PM2 restarted successfully"
else
    echo "⚠️  App not found in PM2. Starting fresh..."
    pm2 start npm --name "$APP_NAME" -- start
    pm2 save
    echo "✅ PM2 started successfully"
fi

echo ""
echo "📊 Current PM2 Status:"
pm2 status

echo ""
echo "🎉 ====================================="
echo "   Update Complete!"
echo "====================================="
echo ""
echo "📝 To view logs: pm2 logs $APP_NAME"
echo "📊 To monitor: pm2 monit"
echo "🔄 To restart: pm2 restart $APP_NAME"
echo ""




