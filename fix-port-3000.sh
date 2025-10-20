#!/bin/bash

echo "=== Diagnostic: Checking what's using port 3000 ==="
lsof -i :3000 2>/dev/null || netstat -tlnp | grep :3000 2>/dev/null || fuser 3000/tcp 2>/dev/null

echo -e "\n=== Finding all Node/Next.js processes ==="
ps aux | grep -E "(node|next)" | grep -v grep

echo -e "\n=== Killing everything on port 3000 ==="
fuser -k 3000/tcp 2>/dev/null && echo "✓ Killed process via fuser" || echo "⚠ fuser failed, trying alternatives..."

# Alternative kill methods
PID=$(lsof -t -i :3000 2>/dev/null)
if [ ! -z "$PID" ]; then
    kill -9 $PID && echo "✓ Killed PID $PID via lsof"
fi

echo -e "\n=== Killing all orphaned Node/Next processes ==="
pkill -9 node
pkill -9 next

echo -e "\n=== Waiting 5 seconds for cleanup ==="
sleep 5

echo -e "\n=== Verifying port 3000 is free ==="
lsof -i :3000 2>/dev/null && echo "⚠ Port still in use!" || echo "✓ Port 3000 is FREE"

echo -e "\n=== Completely removing PM2 process ==="
pm2 delete tenadam-assessment 2>/dev/null || echo "Already deleted"

echo -e "\n=== Starting fresh PM2 process ==="
cd ~/baldridge-ocai-assessmant-platform
pm2 start npm --name "tenadam-assessment" -- start

echo -e "\n=== Saving PM2 configuration ==="
pm2 save

echo -e "\n=== Checking PM2 status ==="
pm2 status

echo -e "\n=== Tailing logs (Ctrl+C to exit) ==="
pm2 logs tenadam-assessment --lines 30
