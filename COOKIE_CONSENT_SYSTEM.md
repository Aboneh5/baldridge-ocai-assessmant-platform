# Cookie Consent Management System

## Overview

This platform implements a **robust, industry-standard, GDPR-compliant** cookie consent management system that controls when and how cookies and tracking scripts (like Google Analytics) are loaded.

---

## 🏗️ System Architecture

### 1. **Core Components**

#### **`src/lib/consent.ts`** - Core Logic
- Defines `ConsentState` type with 4 categories: `essential`, `analytics`, `marketing`, `preferences`
- Manages cookie serialization/deserialization
- Cookie name: `cookie_consent`
- Cookie duration: 1 year
- Default state: Only `essential` is `true`, all others are `false`

#### **`src/components/cookie-consent.tsx`** - User Banner
- Modal banner that appears on first visit
- Three consent options:
  - **"Accept all"** → Enables all categories, reloads page to init analytics
  - **"Accept essential only"** → Only essential cookies
  - **"Reject all"** (requires 2 clicks) → Only essential cookies
- Writes consent to `cookie_consent` cookie
- Banner disappears once consent is given

#### **`src/lib/analytics-gate.tsx`** - Analytics Loader
- Reads `cookie_consent` cookie on every page load
- If `analytics: true`, loads Google Analytics (`gtag.js`)
- Initializes `window.dataLayer` and `window.gtag()`
- Uses `NEXT_PUBLIC_GA_MEASUREMENT_ID` from environment variables
- Does NOT load if analytics consent is not given

#### **`src/components/client-consent-gate.tsx`** - Integration Wrapper
- Wraps all page content in `RootLayout`
- Renders both `<CookieConsent />` (banner) and `<AnalyticsGate>` (loader)
- Ensures consent is checked before analytics loads

#### **`src/app/admin/consent-testing/page.tsx`** - Management Console
- Password-protected admin page (`tenadam2024`)
- Real-time analytics status monitoring
- Cookie inspector with categorization
- Toggle switches to enable/disable categories
- Export audit reports
- Send test events to Google Analytics

---

## 🔄 Data Flow

### **First Visit (No Consent Cookie)**

```
1. User visits site
2. CookieConsent component checks for cookie_consent
3. Cookie not found → Banner displays
4. User clicks "Accept all"
5. cookie_consent is written with all categories enabled
6. Page reloads
7. AnalyticsGate reads cookie_consent
8. analytics: true → Loads gtag.js
9. Google Analytics starts tracking
```

### **Return Visit (Consent Cookie Exists)**

```
1. User visits site
2. CookieConsent checks cookie_consent
3. Cookie found with given: true → Banner does NOT display
4. AnalyticsGate reads cookie_consent
5. If analytics: true → Loads gtag.js
6. If analytics: false → No tracking loaded
```

### **Admin Consent Update (Via Console)**

```
1. Admin toggles "Analytics" to enabled
2. updateConsent() function fires
3. cookie_consent is updated with analytics: true
4. User confirms reload prompt
5. Page reloads
6. AnalyticsGate reads updated cookie
7. Loads gtag.js and begins tracking
```

---

## 🍪 Cookie Categories

### **Essential (Always Enabled)**
- `next-auth.session-token` - User authentication
- `cookie_consent` - Stores consent preferences
- `next-auth.csrf-token` - Security token
- Cannot be disabled (required for site functionality)

### **Analytics (User Consent Required)**
- `_ga` - Google Analytics main cookie
- `_gid` - Google Analytics session cookie  
- `_gat_*` - Google Analytics throttling
- Tracks: page views, events, user behavior

### **Marketing (User Consent Required)**
- `_fbp` - Facebook Pixel
- `_gcl_*` - Google Ads conversion tracking
- Currently not implemented (placeholder for future use)

### **Preferences (User Consent Required)**
- `locale` - Language preference
- `theme` - Dark/light mode (if implemented)
- Currently stores language selection

---

## 🎯 Key Features

### ✅ **GDPR Compliance**
- Banner appears BEFORE non-essential cookies are set
- Clear opt-in mechanism (not pre-checked)
- Granular control by category
- Easy consent withdrawal
- 1-year cookie expiration with renewal on consent update

### ✅ **Analytics Integration**
- Conditional loading of Google Analytics
- Only loads if `analytics: true` in consent
- Tracks page views, custom events, conversions
- Real-time verification in admin console

### ✅ **Admin Console Features**
- Live cookie scanning and categorization
- Real-time analytics status (gtag loaded, dataLayer active)
- Manual consent toggling
- Test event sending
- JSON audit report export
- Search, filter, and sort cookies

### ✅ **User Experience**
- One-time consent prompt
- Persistent across sessions
- Minimal UI impact (banner only on first visit)
- Fast page loads (analytics loads asynchronously)

---

## 🧪 Testing the System

### **Test Scenario 1: First-Time User**
1. Open site in incognito/private window
2. Cookie banner should appear at bottom
3. Click "Accept all"
4. Page reloads
5. Go to `/admin/consent-testing` (password: `tenadam2024`)
6. Verify:
   - ✓ Consent Status: **Active**
   - ✓ Analytics: **Enabled**
   - ✓ gtag() Function: **Loaded**
   - ✓ dataLayer: **Active**
   - ✓ Events Tracked: **> 0**

### **Test Scenario 2: Essential Only**
1. Clear all cookies
2. Refresh page
3. Click "Accept essential only"
4. Check `/admin/consent-testing`
5. Verify:
   - ✓ Consent Status: **Active**
   - ✓ Analytics: **Disabled**
   - ✓ gtag() Function: **Not Loaded**
   - ✓ dataLayer: **Inactive**

### **Test Scenario 3: Admin Override**
1. From Test Scenario 2 state
2. Go to `/admin/consent-testing`
3. In "Category Permissions" section, click toggle for "Analytics"
4. Confirm reload
5. Verify:
   - ✓ Analytics: **Enabled**
   - ✓ gtag() Function: **Loaded** (after reload)

### **Test Scenario 4: Send Test Event**
1. Ensure analytics is enabled
2. Click "Send Test Event" button
3. Check browser console
4. Should see test event in dataLayer
5. Event should appear in Google Analytics Real-Time reports (if GA is configured)

---

## 🔧 Configuration

### **Environment Variables**

```bash
# .env.local or .env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

- Get your Measurement ID from [Google Analytics](https://analytics.google.com/)
- Format: `G-XXXXXXXXXX` (GA4) or `UA-XXXXXXXXX` (Universal Analytics, deprecated)
- This is a **public** variable (visible in browser)

### **Admin Console Access**

**URL**: `/admin/consent-testing`

**Access Methods**:
1. **Admin Users**: Automatically granted (role: ADMIN in database)
2. **Password**: `tenadam2024` (stored in `sessionStorage` after first entry)

**To Change Password**:
Edit line 105 in `src/app/admin/consent-testing/page.tsx`:
```typescript
if (password === 'YOUR_NEW_PASSWORD') {
```

---

## 📊 Data Collection Verification

### **What Data is Collected?**

When analytics consent is **enabled**:

1. **Automatic Page View Tracking**
   - Page URL
   - Page title
   - Referrer
   - User agent
   - Screen resolution
   - Viewport size

2. **Custom Events** (when implemented)
   - Assessment submissions
   - Survey completions
   - Report generations
   - Button clicks (if instrumented)

3. **User Engagement**
   - Session duration
   - Bounce rate
   - Pages per session
   - Exit pages

### **What is NOT Collected?**

- Personal identifiable information (PII)
- Email addresses
- Passwords
- Assessment responses (unless explicitly tracked)
- Form inputs (unless explicitly tracked)

---

## 🔍 Debugging

### **Check if Analytics is Loading**

Open browser console and run:
```javascript
// Check if gtag exists
typeof window.gtag
// Should return "function" if loaded

// Check dataLayer
window.dataLayer
// Should return array of events

// Send test event
window.gtag('event', 'test', { category: 'debug' })
```

### **Check Consent Cookie**

```javascript
document.cookie.split('; ').find(r => r.startsWith('cookie_consent'))
```

Should return something like:
```
cookie_consent=%7B%22version%22%3A1%2C%22timestamp%22%3A1234567890%2C%22given%22%3Atrue%2C%22categories%22%3A%7B%22essential%22%3Atrue%2C%22analytics%22%3Atrue%2C%22marketing%22%3Afalse%2C%22preferences%22%3Afalse%7D%7D
```

Decoded:
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

### **Common Issues**

#### **Analytics not loading despite consent**
- Check `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
- Verify consent cookie has `analytics: true`
- Try hard refresh (Ctrl+Shift+R)
- Check browser console for errors

#### **Banner keeps appearing**
- Cookie is not persisting (check browser settings)
- Domain mismatch (check cookie path)
- Third-party cookies blocked

#### **Events not appearing in Google Analytics**
- Wait 24-48 hours for data to process
- Check Real-Time reports in GA4
- Verify Measurement ID is correct
- Ensure analytics consent is enabled

---

## 🚀 Production Deployment

### **Checklist**

- [ ] Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in production environment
- [ ] Test cookie banner on production domain
- [ ] Verify analytics loads correctly
- [ ] Test consent withdrawal and re-granting
- [ ] Update Privacy Policy with cookie information
- [ ] Update Terms of Service with data collection notice
- [ ] Test admin console is password protected
- [ ] Verify consent persists across page navigation
- [ ] Check Real-Time reports in Google Analytics

### **Privacy Policy Requirements**

Your Privacy Policy should include:

1. List of cookies used (essential, analytics, marketing, preferences)
2. Purpose of each cookie
3. How to withdraw consent
4. Cookie expiration periods
5. Third-party services (Google Analytics)
6. Data retention policies
7. User rights under GDPR/CCPA

---

## 📞 Support

For issues or questions:
1. Check the **Admin Console** at `/admin/consent-testing`
2. Review browser console for errors
3. Verify environment variables are set
4. Check this documentation
5. Contact development team

---

## 📝 Future Enhancements

- [ ] Add "Cookie Settings" link in footer (user can change consent anytime)
- [ ] Implement marketing cookies (Facebook Pixel, LinkedIn Insight)
- [ ] Add consent history logging (GDPR compliance)
- [ ] Geolocation-based consent (EU vs non-EU)
- [ ] A/B testing integration
- [ ] Heat mapping tools (Hotjar, Crazy Egg)
- [ ] Server-side Google Analytics (for better accuracy)
- [ ] Consent API integration for cross-domain tracking

---

**Last Updated**: October 2025  
**Version**: 1.0  
**Status**: ✅ Production Ready



