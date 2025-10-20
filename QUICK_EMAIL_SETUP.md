# ⚡ Quick Email Setup (2 Minutes)

## What You Need To Do NOW:

### 1️⃣ Get Your FREE API Key (30 seconds)
```
https://resend.com/signup
```
→ Sign up → Create API Key → Copy it (starts with `re_`)

### 2️⃣ Add to Your Local Project (30 seconds)
Create file: `.env.local` in `tenadam-assessment` folder

Add this line:
```
RESEND_API_KEY=re_paste_your_key_here
```

### 3️⃣ Add to Your VPS (1 minute)
```bash
ssh root@your-vps-ip
cd ~/baldridge-ocai-assessmant-platform
nano .env
```

Add this line:
```
RESEND_API_KEY=re_paste_your_key_here
```

Save (Ctrl+X, Y, Enter), then:
```bash
pm2 restart tenadam-assessment
pm2 save
```

### 4️⃣ Test It! (30 seconds)
Go to: `http://localhost:3010/contact` or `http://hub.tenadamconsulting.com/contact`

Fill the form and submit!

## ✅ What Happens:
1. **You get an email** at `info@tenadamconsulting.com` with contact details
2. **User gets an email** confirming you received their message

## 📧 Where to Check:
- **Your inbox:** info@tenadamconsulting.com
- **Resend dashboard:** https://resend.com/emails
- **PM2 logs:** `pm2 logs tenadam-assessment`

---

**Need help?** Read the full guide: `RESEND_SETUP.md`

