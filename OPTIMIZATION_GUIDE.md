# Performance Optimization Guide

## Quick Optimization (VPS)

### Step 1: Upload optimization script
```bash
# From your local machine
scp optimize-performance.sh root@75.119.156.107:~/baldridge-ocai-assessmant-platform/
```

### Step 2: Run optimization on VPS
```bash
ssh root@75.119.156.107
cd ~/baldridge-ocai-assessmant-platform
chmod +x optimize-performance.sh
./optimize-performance.sh
```

That's it! Your app will be optimized automatically.

---

## What Gets Optimized

### 1. PM2 Cluster Mode
- **Before**: 1 process using 1 CPU core
- **After**: Multiple processes using ALL CPU cores
- **Expected**: 3-5x better throughput

### 2. Nginx Caching
- **Before**: No caching
- **After**: Aggressive caching for static files
- **Expected**: 50-70% faster load times for static content

### 3. Next.js Optimizations
- Enabled gzip compression
- Optimized images (AVIF/WebP)
- Disabled source maps in production
- Optimized CSS and package imports
- Better caching headers

### 4. Memory Optimization
- Increased Node.js heap size
- Better garbage collection
- Automatic restart on memory leaks

---

## Manual Steps (if needed)

### Enable PM2 Cluster Mode
```bash
pm2 delete tenadam-assessment
pm2 start ecosystem.config.js
pm2 save
```

### Clear Nginx Cache
```bash
sudo rm -rf /var/cache/nginx/tenadam/*
sudo systemctl reload nginx
```

### Rebuild with Optimizations
```bash
cd ~/baldridge-ocai-assessmant-platform
git pull origin new
npm run build
pm2 restart tenadam-assessment
```

---

## Testing After Optimization

### Run Load Test Again
```bash
# On your local machine
cd "C:\Users\Lu\prog\baldrige work\tenadam-assessment"
py simple-load-test.py
```

### Expected Improvements

**Before Optimization:**
- Success Rate: 99.54%
- Avg Response Time: 1412ms
- 95th Percentile: 1711ms
- Throughput: 6.85 req/s
- Rating: [WARNING]

**After Optimization (Expected):**
- Success Rate: 99.9%+
- Avg Response Time: 300-500ms (3x faster)
- 95th Percentile: 500-800ms (2x faster)
- Throughput: 30-50+ req/s (5-7x better)
- Rating: [GOOD] or [EXCELLENT]

---

## Monitoring Performance

### Check PM2 Cluster Status
```bash
pm2 status
# Should show multiple instances now
```

### Monitor in Real-Time
```bash
pm2 monit
# Watch CPU/Memory across all instances
```

### Check Nginx Cache Hit Rate
```bash
# View cache status in response headers
curl -I https://hub.tenadamconsulting.com/_next/static/...
# Look for: X-Cache-Status: HIT
```

### View Logs
```bash
pm2 logs tenadam-assessment --lines 100
```

---

## Advanced Optimizations

### 1. Add Redis for Session Storage (Optional)
```bash
# Install Redis
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Update your app to use Redis for sessions
# (requires code changes)
```

### 2. Database Connection Pooling
Already configured in Prisma, but verify:
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Add connection pool settings in DATABASE_URL
  // ?connection_limit=10&pool_timeout=10
}
```

### 3. CDN for Static Assets (Future)
Consider using:
- Cloudflare CDN
- AWS CloudFront
- Vercel Edge Network

### 4. Database Indexes
Ensure indexes exist on frequently queried fields:
```sql
-- Check existing indexes
\d+ users
\d+ baldrige_responses

-- Add indexes if missing
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_baldrige_user ON baldrige_responses(user_id);
```

---

## Troubleshooting

### If PM2 Cluster Mode Fails
```bash
# Restart in single instance mode
pm2 delete tenadam-assessment
pm2 start npm --name "tenadam-assessment" -- start
pm2 save
```

### If Nginx Cache Causes Issues
```bash
# Clear cache
sudo rm -rf /var/cache/nginx/tenadam/*
sudo systemctl reload nginx
```

### If Memory Issues Occur
```bash
# Reduce instance count
pm2 scale tenadam-assessment 2  # Use only 2 instances
pm2 save
```

### Check for Errors
```bash
# Check Nginx errors
sudo tail -f /var/log/nginx/error.log

# Check PM2 errors  
pm2 logs tenadam-assessment --err

# Check system resources
htop
```

---

## Performance Benchmarks

### Target Metrics

| Metric | Poor | Acceptable | Good | Excellent |
|--------|------|------------|------|-----------|
| Avg Response | >2s | 500ms-2s | 200-500ms | <200ms |
| 95th Percentile | >3s | 1-3s | 500ms-1s | <500ms |
| Success Rate | <95% | 95-99% | 99-99.9% | >99.9% |
| Throughput | <10 req/s | 10-50 req/s | 50-100 req/s | >100 req/s |

### Your VPS Specs
- CPU: Check with `lscpu`
- RAM: Check with `free -h`
- Disk: Check with `df -h`

Expected performance varies based on VPS specs.

---

## Rollback Plan

If optimization causes issues:

```bash
# Restore old config
git checkout ecosystem.config.js

# Restart in single mode
pm2 delete tenadam-assessment
pm2 start npm --name "tenadam-assessment" -- start
pm2 save

# Restore old Nginx config (if backed up)
sudo cp /etc/nginx/sites-available/hub.tenadamconsulting.com.backup \
     /etc/nginx/sites-available/hub.tenadamconsulting.com
sudo nginx -t
sudo systemctl reload nginx
```

---

## Next Steps

1. ✅ Run optimization script
2. ✅ Test with load testing tool
3. ✅ Monitor for 24 hours
4. ✅ Adjust based on real usage
5. ⚡ Consider upgrading VPS if needed

---

**Created**: October 2025
**Last Updated**: October 2025





