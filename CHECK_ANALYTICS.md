# How to Check Cookie & Analytics Data Collection

## 🎯 Quick Test Checklist

### Step 1: Test Cookie Consent Banner
1. Visit: https://hub.tenadamconsulting.com/
2. Clear cookies first (if needed): `Ctrl+Shift+Delete` → Clear browsing data
3. Refresh page
4. ✅ You should see the cookie banner at the bottom

### Step 2: Accept Cookies
1. Click **"Accept all"** button (green)
2. Page will reload
3. ✅ Banner disappears (consent saved)

### Step 3: Check Browser Cookies
**Method 1 - DevTools:**
1. Press `F12`
2. Go to **Application** tab
3. Click **Cookies** → Your domain
4. Look for:
   - ✅ `cookie_consent` - Your consent data
   - ✅ `_ga` - Google Analytics ID
   - ✅ `_ga_7N78Y48KE5` - GA session

**Method 2 - Console:**
1. Press `F12` → Console
2. Type: `document.cookie`
3. Press Enter
4. ✅ See all cookies printed

**Method 3 - Built-in Test Page:**
1. Visit: https://hub.tenadamconsulting.com/test-cookies
2. ✅ See detailed cookie breakdown

### Step 4: Verify Google Analytics is Loading
**Check Console:**
1. Press `F12` → Console tab
2. Look for: `Google Analytics initialized with ID: G-7N78Y48KE5`
3. ✅ If you see this, GA is working

**Check Network Requests:**
1. Press `F12` → Network tab
2. Filter by "gtag" or "analytics"
3. Look for requests to:
   - ✅ `https://www.googletagmanager.com/gtag/js?id=G-7N78Y48KE5`
   - ✅ `https://www.google-analytics.com/g/collect?...`

### Step 5: See Real-Time Data in Google Analytics
1. Go to: https://analytics.google.com
2. Select your property (G-7N78Y48KE5)
3. Click **Reports** → **Real-time**
4. ✅ You should see yourself as an active user
5. ✅ See the pages you're visiting in real-time

## 📊 What Data is Being Collected?

### Essential Cookies (Always Active)
- `cookie_consent` - Stores your cookie preferences
- Session cookies for authentication (if logged in)

### Analytics Cookies (Only After Consent)
- `_ga` - User ID (anonymous, lasts 2 years)
- `_ga_7N78Y48KE5` - Session tracking (lasts 30 minutes)

### Data Google Analytics Collects:
- ✅ Page views (which pages visited)
- ✅ Session duration (how long on site)
- ✅ Bounce rate (left after one page)
- ✅ Device type (desktop/mobile/tablet)
- ✅ Browser (Chrome, Firefox, etc.)
- ✅ Location (city/country - IP-based)
- ✅ Traffic source (direct, referral, search)
- ✅ Custom events (if you've added tracking)

### Data NOT Collected:
- ❌ Personal information (names, emails)
- ❌ Passwords or sensitive data
- ❌ Credit card information
- ❌ Precise location (only city-level)

## 🔍 Where to See Each Type of Data

### 1. Cookie Consent Data
**Location:** Browser cookies
**View at:** https://hub.tenadamconsulting.com/test-cookies
**Shows:**
```json
{
  "version": 1,
  "timestamp": 1234567890,
  "given": true,
  "categories": {
    "essential": true,
    "analytics": true,
    "marketing": false,
    "preferences": false
  }
}
```

### 2. Google Analytics - Real-Time (0-5 min delay)
**Location:** Google Analytics Dashboard
**View at:** Reports → Real-time
**Shows:**
- Active users right now
- Current page views
- Events happening now
- User locations (map)

### 3. Google Analytics - Standard Reports (24-48 hour delay)
**Location:** Google Analytics Dashboard
**View at:** Reports → Engagement/Acquisition/User
**Shows:**
- Historical page views
- User demographics
- Behavior flow
- Conversion funnels

### 4. Browser Network Activity
**Location:** Browser DevTools
**View:** F12 → Network tab
**Shows:**
- GA script loading
- Tracking pixels firing
- Event data being sent

## 🧪 Testing Different Scenarios

### Test 1: Accept All Cookies
1. Visit site
2. Click "Accept all"
3. ✅ Check: `_ga` and `_ga_7N78Y48KE5` cookies exist
4. ✅ Check: Real-time shows you in GA dashboard

### Test 2: Accept Essential Only
1. Clear cookies
2. Visit site
3. Click "Accept essential only"
4. ✅ Check: Only `cookie_consent` exists
5. ✅ Check: NO `_ga` cookies
6. ✅ Check: NOT visible in GA dashboard

### Test 3: Reject All (2 clicks)
1. Clear cookies
2. Visit site
3. Click "Reject all" → Click "Are you sure?"
4. ✅ Check: Only `cookie_consent` exists (analytics: false)
5. ✅ Check: NO `_ga` cookies
6. ✅ Check: NOT visible in GA dashboard

## 📈 Google Analytics Dashboard Quick Links

After logging into https://analytics.google.com:

1. **Real-Time Report**
   - See current active users
   - Live page views
   - Events as they happen

2. **Engagement → Pages and Screens**
   - Most visited pages
   - Time on page
   - Exit rates

3. **Engagement → Events**
   - Custom events you're tracking
   - Button clicks, form submissions
   - Survey completions

4. **User Attributes → Overview**
   - New vs returning users
   - User demographics
   - Interests

5. **Acquisition → Traffic Acquisition**
   - Where users come from
   - Direct, search, social, referral
   - Campaign tracking

6. **Tech → Tech Details**
   - Browser versions
   - Operating systems
   - Screen resolutions

## 🔧 Troubleshooting

### Not Seeing Data in GA?
1. ✅ Did you accept analytics cookies?
2. ✅ Check console for "Google Analytics initialized"
3. ✅ Wait 5-10 minutes for real-time data
4. ✅ Disable ad blockers
5. ✅ Check network tab for blocked requests

### Cookie Banner Not Showing?
1. Visit: https://hub.tenadamconsulting.com/test-cookies
2. Click "Clear Consent Cookie"
3. Refresh the page

### Want to Test Again?
Clear cookies:
- Chrome: `Ctrl+Shift+Delete` → Cookies
- Firefox: `Ctrl+Shift+Delete` → Cookies
- Or use test page: `/test-cookies` → "Clear Consent Cookie"

## 📞 Need Help?

Check browser console for errors or warnings. All GA activity logs to console in development mode.

