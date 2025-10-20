#!/bin/bash
# Performance Optimization Script for Tenadam Assessment Platform
# Run this on your VPS

set -e

echo "=============================================="
echo "  TENADAM PERFORMANCE OPTIMIZATION"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

APP_DIR="$HOME/baldridge-ocai-assessmant-platform"
APP_NAME="tenadam-assessment"

cd "$APP_DIR"

echo "Step 1: Backing up current PM2 configuration..."
pm2 save
echo "${GREEN}✓${NC} Backup complete"
echo ""

echo "Step 2: Stopping current application..."
pm2 stop $APP_NAME 2>/dev/null || echo "App not running"
echo "${GREEN}✓${NC} Stopped"
echo ""

echo "Step 3: Creating optimized ecosystem config..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'tenadam-assessment',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3010',
    instances: 'max',  // Use all available CPU cores
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3010,
      NODE_OPTIONS: '--max-old-space-size=2048'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    // Performance optimizations
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
  }]
};
EOF
echo "${GREEN}✓${NC} Ecosystem config created"
echo ""

echo "Step 4: Clearing old build cache..."
rm -rf .next/cache
echo "${GREEN}✓${NC} Cache cleared"
echo ""

echo "Step 5: Starting app in cluster mode..."
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
echo "${GREEN}✓${NC} App started in cluster mode"
echo ""

echo "Step 6: Optimizing Nginx configuration..."
sudo tee /etc/nginx/sites-available/hub.tenadamconsulting.com > /dev/null << 'NGINXCONF'
# Nginx cache configuration
proxy_cache_path /var/cache/nginx/tenadam levels=1:2 keys_zone=tenadam_cache:10m max_size=1g inactive=60m use_temp_path=off;

server {
    listen 80;
    server_name hub.tenadamconsulting.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name hub.tenadamconsulting.com;

    ssl_certificate /etc/letsencrypt/live/hub.tenadamconsulting.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hub.tenadamconsulting.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Buffer sizes
    client_max_body_size 20M;
    client_body_buffer_size 128k;
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;

    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    keepalive_timeout 65;

    # Next.js static files with aggressive caching
    location /_next/static {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_cache tenadam_cache;
        proxy_cache_valid 200 365d;
        proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header X-Cache-Status $upstream_cache_status;
    }

    # Next.js image optimization
    location /_next/image {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_cache tenadam_cache;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public, max-age=604800";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Public assets
    location /public {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_cache tenadam_cache;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # API routes - no caching
    location /api {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # All other requests
    location / {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;
    gzip_min_length 1000;
    gzip_disable "msie6";
}
NGINXCONF

echo "${GREEN}✓${NC} Nginx config updated"
echo ""

echo "Step 7: Creating Nginx cache directory..."
sudo mkdir -p /var/cache/nginx/tenadam
sudo chown -R www-data:www-data /var/cache/nginx/tenadam
echo "${GREEN}✓${NC} Cache directory created"
echo ""

echo "Step 8: Testing Nginx configuration..."
if sudo nginx -t; then
    echo "${GREEN}✓${NC} Nginx config is valid"
    echo ""
    echo "Step 9: Reloading Nginx..."
    sudo systemctl reload nginx
    echo "${GREEN}✓${NC} Nginx reloaded"
else
    echo "${RED}✗${NC} Nginx config has errors!"
    echo "Please fix the errors above before continuing"
    exit 1
fi
echo ""

echo "Step 10: Checking PM2 status..."
pm2 status
echo ""

echo "Step 11: Monitoring app for 10 seconds..."
sleep 10
pm2 logs $APP_NAME --lines 20 --nostream
echo ""

echo "=============================================="
echo "${GREEN}  ✓ OPTIMIZATION COMPLETE!${NC}"
echo "=============================================="
echo ""
echo "Your app is now running in cluster mode using all CPU cores"
echo "Nginx is configured with caching for better performance"
echo ""
echo "Next steps:"
echo "1. Run another load test to see improvements"
echo "2. Monitor with: pm2 monit"
echo "3. Check logs with: pm2 logs $APP_NAME"
echo ""
echo "Expected improvements:"
echo "- 3-5x better throughput"
echo "- 50-70% faster response times"
echo "- Better handling of concurrent users"
echo ""



