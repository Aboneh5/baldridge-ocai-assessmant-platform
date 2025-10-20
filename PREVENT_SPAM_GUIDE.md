# How to Prevent Emails from Going to Spam - Complete Guide

## 🎯 Current Issue
Emails are sent from `onboarding@resend.dev` which email providers don't trust, causing them to go to spam.

## ✅ SOLUTION: Set Up Custom Domain (tenadamconsulting.com)

This will make emails come from `noreply@tenadamconsulting.com` instead, dramatically improving deliverability.

---

## 📋 Step-by-Step Setup Guide

### Step 1: Access Resend Dashboard

1. Go to: **https://resend.com**
2. **Log in** with your Resend account credentials
3. Navigate to: **https://resend.com/domains**

### Step 2: Add Your Domain

1. Click the **"Add Domain"** button
2. Enter your domain: `tenadamconsulting.com`
3. Click **"Add Domain"**

### Step 3: Get DNS Records

Resend will provide you with DNS records to add. You'll see something like this:

```
Record 1 - SPF (Sender Policy Framework)
Type: TXT
Name: @ (or leave blank)
Value: v=spf1 include:resend.com ~all

Record 2 - DKIM (DomainKeys Identified Mail)
Type: TXT
Name: resend._domainkey
Value: [Long string starting with p=...]

Record 3 - DMARC (Domain-based Message Authentication)
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@tenadamconsulting.com
```

### Step 4: Add DNS Records to Your Domain Registrar

**Where is your domain registered?**
- GoDaddy
- Namecheap
- Cloudflare
- HostGator
- Other?

#### Example for GoDaddy:

1. Log into **GoDaddy.com**
2. Go to **"My Products"**
3. Find `tenadamconsulting.com` and click **"DNS"**
4. Click **"Add"** to add new records
5. For each record provided by Resend:
   - Select **Type**: TXT
   - Enter **Name**: (from Resend)
   - Enter **Value**: (copy from Resend)
   - Set **TTL**: 600 seconds (or leave default)
   - Click **"Save"**

#### Example for Namecheap:

1. Log into **Namecheap.com**
2. Go to **"Domain List"**
3. Click **"Manage"** next to `tenadamconsulting.com`
4. Click **"Advanced DNS"** tab
5. Click **"Add New Record"**
6. Add each TXT record from Resend
7. Click **"Save All Changes"**

#### Example for Cloudflare:

1. Log into **Cloudflare.com**
2. Select `tenadamconsulting.com`
3. Go to **"DNS"** section
4. Click **"Add record"**
5. Select **Type**: TXT
6. Enter Name and Value from Resend
7. Disable **Proxy** (click the cloud icon to make it gray)
8. Click **"Save"**

### Step 5: Verify Domain in Resend

1. After adding all DNS records, wait **5-10 minutes** for propagation
2. Go back to Resend dashboard: https://resend.com/domains
3. Find your domain `tenadamconsulting.com`
4. Click **"Verify Domain"**
5. Wait for verification (green checkmark ✅)

**If verification fails:**
- Wait 30 minutes and try again (DNS can take time)
- Double-check all DNS records are correct
- Make sure there are no typos
- Check TTL is not too high

### Step 6: Update Your Code

Once domain is verified, I'll update the email sender addresses in the code to:
- From: `Tenadam Assessment Hub <noreply@tenadamconsulting.com>`
- Reply-to: User's email address

---

## 🚀 Quick Fix While Waiting (Whitelist Current Sender)

### For Gmail Users:

1. **Check Spam Folder:**
   ```
   Gmail → Spam folder
   Find: onboarding@resend.dev
   Click: "Not Spam"
   ```

2. **Create Whitelist Filter:**
   - Click the **search bar** in Gmail
   - Type: `from:onboarding@resend.dev`
   - Click the **filter icon** (⋮) on the right
   - Click **"Create filter"**
   - Check these boxes:
     - ☑ **Never send it to Spam**
     - ☑ **Mark as important**
     - ☑ **Categorize as Primary**
   - Click **"Create filter"**

3. **Add to Safe Senders:**
   - Go to **Settings** (⚙️) → **See all settings**
   - Click **"Filters and Blocked Addresses"**
   - Click **"Create a new filter"**
   - From: `resend.dev`
   - Click **"Create filter"**
   - Select: **Never send it to Spam**
   - Click **"Create filter"**

### For Microsoft Outlook/Office 365:

1. **Go to Settings:**
   - Click **⚙️ Settings** → **View all Outlook settings**
   - Click **Mail** → **Junk email**

2. **Add Safe Senders:**
   - Click **"Safe senders and domains"**
   - Click **"+ Add"**
   - Add: `onboarding@resend.dev`
   - Add: `resend.dev`
   - Click **"Save"**

3. **Check Junk Folder:**
   - Open **Junk Email** folder
   - Find emails from Resend
   - Right-click → **"Mark as not junk"**
   - Check: ☑ **Always trust email from onboarding@resend.dev**
   - Click **"OK"**

### For Yahoo Mail:

1. **Add to Contacts:**
   - Click **Contacts** icon
   - Click **"+ New Contact"**
   - Email: `onboarding@resend.dev`
   - Name: Tenadam Assessment Hub
   - Click **"Save"**

2. **Create Filter:**
   - Click **⚙️ Settings** → **More Settings**
   - Click **"Filters"**
   - Click **"Add new filters"**
   - From: `onboarding@resend.dev`
   - Move to: **Inbox**
   - Click **"Save"**

---

## 🔍 How to Check if Emails Are Being Sent

### Method 1: Resend Dashboard

1. Go to: **https://resend.com/emails**
2. You'll see a list of all sent emails
3. Check status:
   - ✅ **Delivered** - Email was sent successfully
   - ⚠️ **Bounced** - Email address invalid
   - ⏳ **Queued** - Still sending
   - ❌ **Failed** - Error occurred

4. Click on any email to see:
   - Full email content
   - Delivery status
   - Timestamps
   - Error messages (if any)

### Method 2: Test the Contact Form

1. **Start your dev server** (if not running):
   ```bash
   npm run dev -- --port 3010
   ```

2. **Go to contact page:**
   ```
   http://localhost:3010/contact
   ```

3. **Fill out form with YOUR email** (one you can check):
   - First Name: Test
   - Last Name: User
   - Email: your.email@gmail.com (YOUR email)
   - Message: Testing email delivery
   - Submit

4. **Check TWO places:**
   - ✅ YOUR email inbox for confirmation
   - ✅ info@tenadamconsulting.com for notification

5. **Check Resend Dashboard** to see if both emails show as "Delivered"

### Method 3: Check Browser Console

1. **Open browser DevTools** (F12)
2. Go to **Console** tab
3. Submit contact form
4. Look for:
   ```
   Notification email sent: re_abc123xyz
   Confirmation email sent: re_def456uvw
   ```

If you see email IDs, emails were sent successfully!

---

## 📊 Deliverability Best Practices

### What We've Already Implemented:

✅ **Reply-To Header** - Recipients can reply directly to the contact person
✅ **High Priority Headers** - Marks emails as important
✅ **Professional HTML Design** - Beautiful, well-formatted emails
✅ **Plain Text Alternative** - For email clients that don't support HTML
✅ **Proper Subject Lines** - Clear, descriptive subjects

### What Adding Your Domain Does:

✅ **SPF Authentication** - Proves email is from authorized server
✅ **DKIM Signature** - Cryptographic proof email wasn't tampered with
✅ **DMARC Policy** - Tells email providers how to handle authentication failures
✅ **Brand Trust** - Emails from `@tenadamconsulting.com` look professional
✅ **Improved Deliverability** - 95%+ inbox rate instead of spam

---

## ⚡ After Domain Verification: Code Updates

Once your domain is verified in Resend, I will update the code to:

**Current (Temporary):**
```typescript
from: 'Tenadam Assessment Hub <onboarding@resend.dev>'
```

**After Domain Setup:**
```typescript
from: 'Tenadam Assessment Hub <noreply@tenadamconsulting.com>'
```

**Benefits:**
- Emails appear to come from your company
- Much better deliverability
- Professional appearance
- Brand consistency

---

## 🆘 Troubleshooting

### Issue: "Domain verification failed"

**Solutions:**
1. Wait 30-60 minutes for DNS propagation
2. Check DNS records are EXACTLY as Resend provided
3. Make sure there are no extra spaces in values
4. Verify you added records to the correct domain
5. Some registrars need "@" instead of blank for root domain

### Issue: "Still going to spam after domain setup"

**Solutions:**
1. Make sure domain is fully verified (green checkmark)
2. Wait 24 hours for email reputation to build
3. Ask recipients to mark as "Not Spam" first few times
4. Check DMARC policy is set to "p=none" initially
5. Monitor Resend analytics for bounce rates

### Issue: "Emails not sending at all"

**Check:**
1. ✅ Resend API key in `.env.local`
2. ✅ Dev server restarted after adding API key
3. ✅ No console errors in browser
4. ✅ Resend dashboard shows attempts
5. ✅ Check PM2 logs: `pm2 logs tenadam-assessment`

### Issue: "DNS records not propagating"

**Solutions:**
1. Use DNS checker: https://dnschecker.org
2. Search for: `tenadamconsulting.com TXT`
3. Wait up to 48 hours (usually faster)
4. Clear DNS cache on your computer:
   ```bash
   # Windows
   ipconfig /flushdns

   # Mac
   sudo dscacheutil -flushcache
   ```

---

## 📞 Need Help?

### Resend Support:
- Documentation: https://resend.com/docs
- Support: https://resend.com/support
- Community: https://resend.com/discord

### DNS Help by Registrar:
- **GoDaddy**: https://www.godaddy.com/help/add-a-txt-record-19232
- **Namecheap**: https://www.namecheap.com/support/knowledgebase/article.aspx/317/2237/how-do-i-add-txtspfdkimdmarc-records-for-my-domain/
- **Cloudflare**: https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/

---

## ✨ Summary: What To Do Now

**Immediate (5 minutes):**
1. ✅ Whitelist `onboarding@resend.dev` in Gmail (see instructions above)
2. ✅ Check spam folder for existing emails
3. ✅ Test contact form with your own email

**Within 24 hours:**
1. ✅ Log into Resend and add `tenadamconsulting.com` domain
2. ✅ Add DNS records to your domain registrar
3. ✅ Verify domain in Resend
4. ✅ Let me know when verified, and I'll update the code

**Result:**
- ✅ Emails will go to inbox (not spam)
- ✅ Professional sender address
- ✅ Better email reputation
- ✅ Higher deliverability rate

---

**Questions? Let me know which domain registrar you use, and I can provide specific instructions!**
