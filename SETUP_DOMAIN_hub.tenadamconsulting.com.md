# Setting Up hub.tenadamconsulting.com in Resend

## 🎯 Goal
Verify `hub.tenadamconsulting.com` in Resend so you can send emails from `noreply@hub.tenadamconsulting.com` to `info@tenadamconsulting.com` and any other email address.

---

## 📋 Step 1: Add Domain to Resend

1. **Log into Resend Dashboard:**
   - Go to: **https://resend.com/domains**
   - Sign in with: `oliyadbekele.0@gmail.com`

2. **Click "Add Domain"**

3. **Enter your domain:**
   ```
   hub.tenadamconsulting.com
   ```

4. **Click "Add"**

---

## 📋 Step 2: Get DNS Records from Resend

After adding the domain, Resend will show you **3 DNS records** that you need to add:

### Record 1: SPF (Sender Policy Framework)
```
Type: TXT
Name: hub.tenadamconsulting.com  (or just "hub" or "@" depending on your registrar)
Value: v=spf1 include:resend.com ~all
TTL: 600 (or default)
```

### Record 2: DKIM (DomainKeys Identified Mail)
```
Type: TXT
Name: resend._domainkey.hub.tenadamconsulting.com  (or "resend._domainkey.hub")
Value: [Long string starting with "p=" - copy EXACTLY from Resend]
TTL: 600 (or default)
```

### Record 3: DMARC (Optional but Recommended)
```
Type: TXT
Name: _dmarc.hub.tenadamconsulting.com  (or "_dmarc.hub")
Value: v=DMARC1; p=none; rua=mailto:dmarc@tenadamconsulting.com
TTL: 600 (or default)
```

---

## 📋 Step 3: Add DNS Records

**Where is your domain registered?**
You need to add these DNS records to wherever `tenadamconsulting.com` is registered.

Common providers:
- GoDaddy
- Namecheap
- Cloudflare
- HostGator
- Bluehost
- Other?

### If using Cloudflare (Common for Ethiopian sites):

1. **Log into Cloudflare:**
   - Go to: **https://dash.cloudflare.com**
   - Select `tenadamconsulting.com`

2. **Go to DNS section:**
   - Click **"DNS"** in the left menu
   - Click **"Records"**

3. **Add Record 1 (SPF):**
   - Click **"Add record"**
   - Type: **TXT**
   - Name: **hub** (or **hub.tenadamconsulting.com**)
   - Content: **v=spf1 include:resend.com ~all**
   - Proxy status: **DNS only** (click cloud icon to turn OFF proxy - it should be gray)
   - TTL: **Auto** or **600**
   - Click **"Save"**

4. **Add Record 2 (DKIM):**
   - Click **"Add record"**
   - Type: **TXT**
   - Name: **resend._domainkey.hub** (or full: **resend._domainkey.hub.tenadamconsulting.com**)
   - Content: **[Paste the long DKIM value from Resend - starts with "p="]**
   - Proxy status: **DNS only** (gray cloud)
   - TTL: **Auto** or **600**
   - Click **"Save"**

5. **Add Record 3 (DMARC - Optional):**
   - Click **"Add record"**
   - Type: **TXT**
   - Name: **_dmarc.hub**
   - Content: **v=DMARC1; p=none; rua=mailto:dmarc@tenadamconsulting.com**
   - Proxy status: **DNS only** (gray cloud)
   - TTL: **Auto** or **600**
   - Click **"Save"**

### If using GoDaddy:

1. Log into **GoDaddy.com**
2. Go to **"My Products"**
3. Find `tenadamconsulting.com` and click **"DNS"**
4. Click **"Add"** for each record
5. For **Name** field, use:
   - Record 1: **hub**
   - Record 2: **resend._domainkey.hub**
   - Record 3: **_dmarc.hub**
6. Set **Type**: TXT
7. Paste the **Value** from Resend
8. Click **"Save"**

### If using Namecheap:

1. Log into **Namecheap.com**
2. Go to **"Domain List"**
3. Click **"Manage"** next to `tenadamconsulting.com`
4. Click **"Advanced DNS"**
5. Click **"Add New Record"**
6. For each record:
   - Type: **TXT Record**
   - Host: **hub**, **resend._domainkey.hub**, **_dmarc.hub**
   - Value: Paste from Resend
   - TTL: **Automatic**
7. Click **"Save All Changes"**

---

## 📋 Step 4: Verify Domain in Resend

1. **Wait 5-10 minutes** for DNS propagation (sometimes takes up to 1 hour)

2. **Go back to Resend Dashboard:**
   - https://resend.com/domains

3. **Click "Verify" button** next to `hub.tenadamconsulting.com`

4. **Check status:**
   - ✅ **Green checkmark** = Success! Domain verified
   - ⏳ **Pending** = Wait longer, try again in 10 minutes
   - ❌ **Failed** = Check DNS records are correct

---

## 📋 Step 5: Test DNS Records (Optional)

You can check if DNS records are propagated:

**Using online tool:**
1. Go to: **https://dnschecker.org**
2. Enter: `hub.tenadamconsulting.com`
3. Select: **TXT** from dropdown
4. Click **"Search"**
5. You should see your SPF record: `v=spf1 include:resend.com ~all`

**Check DKIM:**
1. Enter: `resend._domainkey.hub.tenadamconsulting.com`
2. Select: **TXT**
3. Click **"Search"**
4. You should see your DKIM record (long string starting with `p=`)

---

## 📋 Step 6: Update Code (I'll do this after verification)

Once your domain is verified, I'll update the contact form API to use:

**Current (temporary):**
```typescript
from: 'Tenadam Assessment Hub <onboarding@resend.dev>'
to: ['oliyadbekele.0@gmail.com']
```

**After domain verification:**
```typescript
from: 'Tenadam Assessment Hub <noreply@hub.tenadamconsulting.com>'
to: ['info@tenadamconsulting.com']
```

---

## ✅ Benefits of Using hub.tenadamconsulting.com

1. **Professional Branding**
   - Emails come from: `noreply@hub.tenadamconsulting.com`
   - Matches your platform URL
   - Looks more trustworthy

2. **Better Deliverability**
   - SPF + DKIM authentication
   - Less likely to go to spam
   - 95%+ inbox rate

3. **Send to Anyone**
   - No restrictions on recipient emails
   - Can send to `info@tenadamconsulting.com`
   - Can send to any customer email

4. **Unlimited Recipients**
   - Still 3,000 emails/month free tier
   - Can send to multiple people
   - No domain verification issues

---

## 🆘 Troubleshooting

### Issue: "Domain verification failed"

**Check these:**
1. ✅ DNS records added to correct domain (`tenadamconsulting.com`)
2. ✅ Record names are EXACTLY as Resend provided
3. ✅ No extra spaces in DNS values
4. ✅ Cloudflare proxy is OFF (gray cloud, not orange)
5. ✅ Wait 30-60 minutes for DNS propagation

### Issue: "DNS records not found"

**Solutions:**
1. Use **DNS Checker** to verify: https://dnschecker.org
2. Check TTL - lower TTL = faster propagation
3. Some registrars need `@` instead of domain name for root
4. For subdomains, some need full name, some need just subdomain part

### Issue: "Still can't send emails after verification"

**Check:**
1. ✅ Domain shows green checkmark in Resend
2. ✅ Code updated to use new email address
3. ✅ Dev server restarted after code change
4. ✅ Check Resend dashboard for error logs

---

## 📞 Need Help?

**Tell me:**
1. Where is `tenadamconsulting.com` registered? (GoDaddy, Namecheap, Cloudflare, etc.)
2. Do you have access to the DNS settings?
3. If you get stuck, send me a screenshot of the Resend DNS records

I can provide specific instructions for your DNS provider!

---

## ⏱️ Time Estimate

- **Add DNS Records:** 10 minutes
- **DNS Propagation:** 5 minutes - 1 hour (usually ~10 minutes)
- **Verification:** 1 minute
- **Code Update:** I'll do this in 2 minutes after you confirm verification

**Total:** 15-60 minutes depending on DNS propagation

---

## 🚀 Quick Start Checklist

- [ ] Log into Resend Dashboard
- [ ] Add domain: `hub.tenadamconsulting.com`
- [ ] Copy the 3 DNS records (SPF, DKIM, DMARC)
- [ ] Log into your domain registrar (Cloudflare/GoDaddy/etc)
- [ ] Add all 3 TXT records
- [ ] If using Cloudflare, turn OFF proxy (gray cloud)
- [ ] Wait 10-30 minutes
- [ ] Click "Verify" in Resend dashboard
- [ ] Let me know when it's verified ✅
- [ ] I'll update the code to use the new email address

---

**Let me know which DNS provider you use, and I can give you exact screenshots/steps!**
