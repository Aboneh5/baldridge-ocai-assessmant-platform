# Quick Load Test Guide 🚀

## Super Quick Start (Windows)

1. **Run the batch file:**
   ```cmd
   run-load-test.bat
   ```

2. **Choose option 1** (Web UI) for first time

3. **Open browser** at http://localhost:8089

4. **Set parameters:**
   - Number of users: 50
   - Spawn rate: 10
   - Host: Already set to your production site

5. **Click "Start Swarm"** and watch!

---

## What Each Test Does

### Option 1: Web UI
- Opens a web interface where you can control the test
- **Best for:** First time users, exploring different loads
- **Access:** http://localhost:8089

### Option 2: Light Test
- 50 users
- Duration: 2 minutes
- **Best for:** Quick health check

### Option 3: Medium Test
- 200 users
- Duration: 5 minutes
- **Best for:** Regular performance testing

### Option 4: Heavy Test
- 500 users
- Duration: 10 minutes
- **Best for:** Stress testing your limits

### Option 5: Spike Test
- 1000 users instantly
- Duration: 2 minutes
- **Best for:** Testing how your app handles sudden traffic

### Option 6: Anonymous Users Only
- Tests public pages only
- No authentication needed
- **Best for:** Testing static content delivery

---

## Reading the Results

### Green = Good ✅
- Response time < 500ms
- 0% errors
- Steady performance

### Yellow = Warning ⚠️
- Response time 500ms - 2s
- Some errors (< 1%)
- Performance degrading

### Red = Problem ❌
- Response time > 2s
- Many errors (> 5%)
- System struggling

---

## Important Metrics

1. **RPS (Requests Per Second)**
   - How many requests your server handles
   - Good: 100+ RPS
   - Great: 500+ RPS

2. **Response Time (95th percentile)**
   - 95% of requests should be faster than this
   - Good: < 500ms
   - Acceptable: < 1s
   - Slow: > 2s

3. **Failure Rate**
   - Percentage of failed requests
   - Good: 0%
   - Acceptable: < 0.1%
   - Bad: > 1%

---

## What to Monitor on VPS

While test is running, SSH to your VPS and run:

```bash
# Monitor CPU/Memory
htop

# Monitor PM2 app
pm2 monit

# Check logs
pm2 logs tenadam-assessment --lines 50
```

---

## Quick Fixes if Performance is Bad

### 1. Enable PM2 Cluster Mode
```bash
pm2 delete tenadam-assessment
pm2 start npm --name "tenadam-assessment" -i max -- start
pm2 save
```

### 2. Check if Build is Optimized
```bash
# Should be in production mode
pm2 env tenadam-assessment | grep NODE_ENV
```

### 3. Restart Everything
```bash
pm2 restart tenadam-assessment
sudo systemctl restart nginx
```

---

## Sample Good Results

```
Type     Name                 # reqs    # fails  Avg   Min   Max  Median  req/s
------------------------------------------------------------------------
GET      /                      5000      0      120ms  50ms  300ms  100ms  100
GET      /about                 2000      0      110ms  40ms  250ms   90ms   40
GET      /dashboard             1500      0      200ms  80ms  500ms  180ms   30
POST     /api/auth/session      1000      0      150ms  60ms  400ms  130ms   20
```

---

## Troubleshooting

### "Locust not found"
```bash
pip install locust
```

### "Connection refused"
- Check if your site is up: https://hub.tenadamconsulting.com
- Try with `--host=http://localhost:3010` to test locally

### High failure rate
- Check PM2 logs: `pm2 logs tenadam-assessment`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Reduce number of users and try again

### App crashes during test
- Your VPS might be undersized
- Try enabling PM2 cluster mode
- Consider upgrading VPS

---

## Next Steps

After running tests:
1. Review the HTML report (opens automatically)
2. Check VPS resource usage
3. Identify slow endpoints
4. Optimize based on results
5. Test again to confirm improvements

---

**Created:** October 2025
**Platform:** Tenadam Assessment Platform


