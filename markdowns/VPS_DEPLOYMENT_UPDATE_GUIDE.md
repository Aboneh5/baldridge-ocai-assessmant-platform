# VPS Deployment & Update Guide (PM2)

## Quick Update Commands

### Method 1: Manual Update (Step by Step)

```bash
# 1. Navigate to project directory
cd /path/to/tenadam-assessment

# 2. Pull latest changes from repository
git pull origin main  # or 'master' depending on your branch

# 3. Install any new dependencies
npm install

# 4. Build the application
npm run build

# 5. Restart PM2
pm2 restart tenadam-assessment  # or your PM2 app name
# OR if not named:
pm2 restart 0  # replace 0 with your app ID

# 6. Save PM2 configuration
pm2 save
```

### Method 2: Quick Update Script

Create this script for faster updates:

```bash
#!/bin/bash
# update-app.sh

echo "🔄 Updating Tenadam Assessment..."

# Pull latest code
echo "📥 Pulling latest changes..."
git pull origin main

# Check if pull was successful
if [ $? -ne 0 ]; then
    echo "❌ Git pull failed!"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart tenadam-assessment

# Save PM2 state
pm2 save

echo "✅ Update complete!"
echo "📊 Current status:"
pm2 status
```

**To use:**
```bash
# Make it executable (first time only)
chmod +x update-app.sh

# Run it
./update-app.sh
```

---

## Initial VPS Setup (If Not Done Yet)

### 1. Install Node.js and PM2

```bash
# Install Node.js (v18 or higher)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Verify installations
node --version
npm --version
pm2 --version
```

### 2. Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql

# In PostgreSQL:
CREATE DATABASE ocai_hub;
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ocai_hub TO your_user;
\q
```

### 3. Clone Repository

```bash
# Navigate to web directory
cd /var/www  # or your preferred location

# Clone your repository
git clone https://github.com/your-username/tenadam-assessment.git
cd tenadam-assessment

# Install dependencies
npm install
```

### 4. Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add your production environment variables:
```env
# Database
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/ocai_hub?schema=public"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-a-strong-random-secret-here"

# Email (optional)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@your-domain.com"

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# IP Hashing Salt
IP_HASH_SALT="generate-random-salt-here"
```

**Generate secrets:**
```bash
# Generate NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate IP_HASH_SALT
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### 5. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:deploy

# Seed database (if needed)
npm run db:seed
```

### 6. Build Application

```bash
npm run build
```

### 7. Start with PM2

```bash
# Start the application
pm2 start npm --name "tenadam-assessment" -- start

# Or use ecosystem file (recommended)
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
# Follow the command it outputs
```

---

## PM2 Configuration File (Recommended)

Create `ecosystem.config.js` in your project root:

```javascript
module.exports = {
  apps: [{
    name: 'tenadam-assessment',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3010',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3010
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
  }]
};
```

**Start with ecosystem file:**
```bash
pm2 start ecosystem.config.js
pm2 save
```

---

## Useful PM2 Commands

### Status & Monitoring

```bash
# View all running apps
pm2 status
pm2 list

# Monitor resources in real-time
pm2 monit

# View logs (all apps)
pm2 logs

# View logs for specific app
pm2 logs tenadam-assessment

# View last 200 lines of logs
pm2 logs tenadam-assessment --lines 200

# Clear logs
pm2 flush
```

### App Management

```bash
# Restart app
pm2 restart tenadam-assessment
pm2 restart 0  # by ID

# Stop app
pm2 stop tenadam-assessment

# Delete app from PM2
pm2 delete tenadam-assessment

# Reload app (zero-downtime restart)
pm2 reload tenadam-assessment

# Restart all apps
pm2 restart all
```

### Configuration

```bash
# Save current PM2 configuration
pm2 save

# Resurrect saved processes
pm2 resurrect

# Update PM2
npm install -g pm2
pm2 update
```

---

## Nginx Configuration (Reverse Proxy)

If using Nginx as a reverse proxy:

```nginx
# /etc/nginx/sites-available/tenadam-assessment

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/tenadam-assessment /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## Deployment Workflow

### Standard Update Process

1. **Develop locally** → Make changes, test
2. **Commit & push** → `git commit -am "Feature description" && git push`
3. **Pull on VPS** → `git pull origin main`
4. **Install deps** → `npm install` (if package.json changed)
5. **Build** → `npm run build`
6. **Restart** → `pm2 restart tenadam-assessment`

### Zero-Downtime Deployment

```bash
# Use reload instead of restart
pm2 reload tenadam-assessment

# Or with ecosystem file
pm2 reload ecosystem.config.js
```

---

## Automation with GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/tenadam-assessment
            git pull origin main
            npm install
            npm run build
            pm2 restart tenadam-assessment
            pm2 save
```

---

## Troubleshooting

### App Won't Start

```bash
# Check logs
pm2 logs tenadam-assessment --lines 100

# Check PM2 status
pm2 status

# Check if port is in use
sudo lsof -i :3010

# Restart app in development mode to see errors
npm run dev
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test database connection
psql -U your_user -d ocai_hub

# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL
```

### Build Failures

```bash
# Clear build cache
rm -rf .next
npm run build

# Check Node version
node --version  # Should be v18+

# Check for TypeScript errors
npm run type-check
```

### PM2 Not Starting on Boot

```bash
# Reinstall startup script
pm2 unstartup
pm2 startup
# Run the command it outputs

pm2 save
```

---

## Monitoring & Logs

### View Application Logs

```bash
# Real-time logs
pm2 logs tenadam-assessment

# Error logs only
pm2 logs tenadam-assessment --err

# Output logs only
pm2 logs tenadam-assessment --out

# Save logs to file
pm2 logs tenadam-assessment > app-logs.txt
```

### Performance Monitoring

```bash
# Real-time monitoring
pm2 monit

# Get detailed info
pm2 show tenadam-assessment

# Web-based monitoring (optional)
pm2 plus  # Sign up at pm2.io
```

---

## Security Checklist

- [ ] Strong `NEXTAUTH_SECRET` generated
- [ ] Database user with limited permissions
- [ ] `.env` file not committed to git
- [ ] Firewall configured (UFW)
- [ ] SSH key authentication enabled
- [ ] SSL certificate installed
- [ ] Regular backups configured
- [ ] PM2 logs rotated

---

## Quick Reference Card

```bash
# Update app
cd /var/www/tenadam-assessment
git pull && npm install && npm run build && pm2 restart tenadam-assessment

# View logs
pm2 logs tenadam-assessment --lines 50

# Monitor
pm2 monit

# Status
pm2 status

# Restart
pm2 restart tenadam-assessment

# Save config
pm2 save
```

---

## Date Created
October 15, 2025






