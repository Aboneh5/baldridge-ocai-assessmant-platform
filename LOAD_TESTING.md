# Load Testing Guide for Tenadam Assessment Platform

## Installation

### 1. Install Locust

```bash
# Install Locust and dependencies
pip install -r load-test-requirements.txt

# Or install Locust directly
pip install locust
```

## Running Load Tests

### Basic Test (Web UI)

```bash
# Run Locust with web interface
locust -f locustfile.py --host=https://hub.tenadamconsulting.com

# Then open: http://localhost:8089
```

### Headless Test (No UI)

```bash
# Run a quick test: 100 users, spawn rate of 10 users/sec, run for 60 seconds
locust -f locustfile.py \
  --host=https://hub.tenadamconsulting.com \
  --headless \
  --users 100 \
  --spawn-rate 10 \
  --run-time 60s

# Run a stress test: 500 users, spawn rate of 20 users/sec, run for 5 minutes
locust -f locustfile.py \
  --host=https://hub.tenadamconsulting.com \
  --headless \
  --users 500 \
  --spawn-rate 20 \
  --run-time 5m
```

### Test Specific User Types

You can also test specific user behaviors by specifying the user class:

```bash
# Test only anonymous users (public pages)
locust -f locustfile.py \
  --host=https://hub.tenadamconsulting.com \
  AnonymousUser

# Test only OCAI assessment users
locust -f locustfile.py \
  --host=https://hub.tenadamconsulting.com \
  OCAIAssessmentUser

# Test only Baldrige assessment users
locust -f locustfile.py \
  --host=https://hub.tenadamconsulting.com \
  BaldrigeAssessmentUser
```

## User Classes

The load test includes several user types:

1. **AnonymousUser** - Browses public pages (homepage, about, contact)
2. **AuthenticatedUser** - Accesses dashboard and checks assessments
3. **OCAIAssessmentUser** - Takes OCAI assessments
4. **BaldrigeAssessmentUser** - Takes Baldrige assessments
5. **AdminUser** - Accesses admin pages and statistics
6. **APIOnlyUser** - Tests API endpoints directly

## Test Scenarios

### Light Load Test
```bash
locust -f locustfile.py \
  --host=https://hub.tenadamconsulting.com \
  --headless \
  --users 50 \
  --spawn-rate 5 \
  --run-time 2m
```

### Medium Load Test
```bash
locust -f locustfile.py \
  --host=https://hub.tenadamconsulting.com \
  --headless \
  --users 200 \
  --spawn-rate 10 \
  --run-time 5m
```

### Heavy Load Test
```bash
locust -f locustfile.py \
  --host=https://hub.tenadamconsulting.com \
  --headless \
  --users 500 \
  --spawn-rate 20 \
  --run-time 10m
```

### Spike Test (sudden traffic)
```bash
locust -f locustfile.py \
  --host=https://hub.tenadamconsulting.com \
  --headless \
  --users 1000 \
  --spawn-rate 100 \
  --run-time 2m
```

## Monitoring During Tests

While running tests, monitor:

1. **VPS Resources**:
```bash
ssh root@75.119.156.107
htop  # CPU/Memory usage
pm2 monit  # PM2 app monitoring
```

2. **Application Logs**:
```bash
pm2 logs tenadam-assessment --lines 100
```

3. **Nginx Access Logs**:
```bash
sudo tail -f /var/log/nginx/access.log
```

4. **Database Performance** (if using PostgreSQL):
```bash
# Check active connections
psql -U your_user -d ocai_db -c "SELECT count(*) FROM pg_stat_activity;"
```

## Expected Results

### Healthy System Indicators:
- ✅ Response time < 200ms for static pages
- ✅ Response time < 500ms for API calls
- ✅ Response time < 1s for database queries
- ✅ 0% error rate
- ✅ CPU usage < 70%
- ✅ Memory usage stable

### Warning Signs:
- ⚠️ Response time > 1s consistently
- ⚠️ Error rate > 1%
- ⚠️ CPU usage > 80%
- ⚠️ Memory usage growing continuously

### Critical Issues:
- ❌ Response time > 3s
- ❌ Error rate > 5%
- ❌ CPU at 100%
- ❌ Memory exhausted
- ❌ App crashes/restarts

## Analyzing Results

Locust provides:
- **RPS** (Requests Per Second) - How many requests your app handles
- **Response Times** - 50th, 95th, 99th percentiles
- **Failures** - Number and percentage of failed requests

### Good Performance Benchmarks:
- 100+ RPS for a single-server setup
- 95th percentile < 500ms
- 99th percentile < 1s
- < 0.1% failure rate

## Optimization Tips

If you see performance issues:

1. **Enable PM2 Cluster Mode**:
```bash
# Use more CPU cores
pm2 delete tenadam-assessment
pm2 start npm --name "tenadam-assessment" -i max -- start
pm2 save
```

2. **Add Nginx Caching**:
```nginx
# In Nginx config
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;

location /_next/static {
    proxy_cache my_cache;
    proxy_cache_valid 200 1d;
    # ... rest of config
}
```

3. **Optimize Database**:
```bash
# Add indexes, optimize queries
# Monitor slow queries in PostgreSQL
```

4. **Use CDN** for static assets

5. **Add Redis** for session/cache storage

## Report Generation

```bash
# Generate HTML report
locust -f locustfile.py \
  --host=https://hub.tenadamconsulting.com \
  --headless \
  --users 200 \
  --spawn-rate 10 \
  --run-time 5m \
  --html=load-test-report.html
```

## Safety Notes

⚠️ **Important**:
- Don't run heavy load tests against production during business hours
- Start with small tests and gradually increase load
- Monitor your VPS to ensure it doesn't crash
- Have a backup plan if the server becomes unresponsive
- Consider testing against a staging environment first

## Need Help?

If performance is poor:
1. Check PM2 logs for errors
2. Monitor CPU/Memory usage with `htop`
3. Check database connections
4. Review Nginx access logs
5. Consider upgrading VPS resources

---

Created: October 2025



