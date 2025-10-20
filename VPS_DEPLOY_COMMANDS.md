# VPS Deployment Commands

## 🚀 Quick Deploy (Copy and Paste These Commands)

```bash
# 1. SSH into your VPS
ssh root@your-vps-ip

# 2. Navigate to project directory
cd ~/baldridge-ocai-assessmant-platform

# 3. Pull latest changes from Git
git pull origin master

# 4. Install any new dependencies (if package.json changed)
npm install

# 5. Build the Next.js application
npm run build

# 6. Restart PM2 to apply changes
pm2 restart tenadam-assessment

# 7. Save PM2 configuration
pm2 save

# 8. Check if the app is running
pm2 status

# 9. View logs to confirm everything is working
pm2 logs tenadam-assessment --lines 50
```

---

## 📋 Step-by-Step Explanation

### Step 1: SSH into VPS
```bash
ssh root@your-vps-ip
```
Replace `your-vps-ip` with your actual VPS IP address.

### Step 2: Go to Project Directory
```bash
cd ~/baldridge-ocai-assessmant-platform
```

### Step 3: Check Current Status (Optional)
```bash
git status
pm2 status
```

### Step 4: Stash Any Local Changes (If Needed)
If you have uncommitted changes on the VPS:
```bash
git stash
```

### Step 5: Pull Latest Code
```bash
git pull origin master
```

If you see merge conflicts or errors:
```bash
# Reset to remote version (discards local changes)
git fetch origin
git reset --hard origin/master
```

### Step 6: Install Dependencies
```bash
npm install
```

### Step 7: Update Environment Variables (If Needed)
If you need to update `.env` file:
```bash
nano .env
```

Add or update:
```
RESEND_API_KEY=re_cXVwudrx_NBazer4UmLKddaNizq64EDmu
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

### Step 8: Build Application
```bash
npm run build
```

This will create an optimized production build.

### Step 9: Restart PM2
```bash
pm2 restart tenadam-assessment
```

Or for a clean restart:
```bash
pm2 stop tenadam-assessment
pm2 delete tenadam-assessment
pm2 start npm --name "tenadam-assessment" -- start
pm2 save
```

### Step 10: Verify Deployment
```bash
# Check PM2 status
pm2 status

# View recent logs
pm2 logs tenadam-assessment --lines 50

# Monitor logs in real-time
pm2 logs tenadam-assessment
```

Press `Ctrl+C` to exit log monitoring.

---

## 🔄 Alternative: One-Line Deploy Script

Create a deploy script for faster updates:

```bash
# Create deploy script
nano ~/deploy.sh
```

Paste this content:
```bash
#!/bin/bash
echo "🚀 Starting deployment..."
cd ~/baldridge-ocai-assessmant-platform
echo "📥 Pulling latest code..."
git pull origin master
echo "📦 Installing dependencies..."
npm install
echo "🔨 Building application..."
npm run build
echo "♻️  Restarting PM2..."
pm2 restart tenadam-assessment
pm2 save
echo "✅ Deployment complete!"
pm2 status
```

Make it executable:
```bash
chmod +x ~/deploy.sh
```

Now you can deploy with just:
```bash
~/deploy.sh
```

---

## 🆘 Troubleshooting

### If Git Pull Fails:
```bash
# Check what changes exist locally
git status

# Discard all local changes
git reset --hard origin/master

# Pull again
git pull origin master
```

### If Build Fails:
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Build again
npm run build
```

### If PM2 Won't Start:
```bash
# Check PM2 logs for errors
pm2 logs tenadam-assessment --err

# Delete and recreate PM2 process
pm2 delete tenadam-assessment
pm2 start npm --name "tenadam-assessment" -- start -- -p 3010
pm2 save
```

### If Port 3010 is Already in Use:
```bash
# Find process using port 3010
lsof -i :3010

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or use PM2 to restart
pm2 restart tenadam-assessment
```

### Check Application Logs:
```bash
# View all logs
pm2 logs tenadam-assessment

# View only errors
pm2 logs tenadam-assessment --err

# View specific number of lines
pm2 logs tenadam-assessment --lines 100
```

---

## 🔍 Verify Changes Are Live

After deployment, check these:

### 1. Check Contact Form Email
```bash
# Test if email works
curl -X POST https://hub.tenadamconsulting.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "message": "Testing deployment"
  }'
```

### 2. Check Sign-in Page
Visit: `https://hub.tenadamconsulting.com/auth/signin`

Verify the demo access keys box is removed.

### 3. Check Resend Dashboard
Go to: https://resend.com/emails

You should see emails being sent from `noreply@hub.tenadamconsulting.com`

---

## 📊 PM2 Useful Commands

```bash
# View all running processes
pm2 list

# View detailed info
pm2 show tenadam-assessment

# Monitor CPU/Memory
pm2 monit

# Restart app
pm2 restart tenadam-assessment

# Stop app
pm2 stop tenadam-assessment

# Start app
pm2 start tenadam-assessment

# Delete app from PM2
pm2 delete tenadam-assessment

# View logs
pm2 logs tenadam-assessment

# Clear logs
pm2 flush tenadam-assessment

# Save current PM2 configuration
pm2 save

# Resurrect saved processes after reboot
pm2 resurrect
```

---

## ⚡ Quick Deploy Checklist

- [ ] SSH into VPS
- [ ] Navigate to project directory
- [ ] Pull latest code (`git pull`)
- [ ] Install dependencies (`npm install`)
- [ ] Build application (`npm run build`)
- [ ] Restart PM2 (`pm2 restart tenadam-assessment`)
- [ ] Save PM2 config (`pm2 save`)
- [ ] Check status (`pm2 status`)
- [ ] View logs (`pm2 logs`)
- [ ] Test the website
- [ ] Verify email works
- [ ] Check sign-in page

---

## 🎯 Super Quick Deploy (Copy-Paste This)

```bash
ssh root@your-vps-ip << 'EOF'
cd ~/baldridge-ocai-assessmant-platform
git pull origin master
npm install
npm run build
pm2 restart tenadam-assessment
pm2 save
pm2 status
pm2 logs tenadam-assessment --lines 20
EOF
```

Replace `your-vps-ip` with your actual IP and run this from your local machine!

---

**All set!** 🚀 Run these commands and your changes will be live!
