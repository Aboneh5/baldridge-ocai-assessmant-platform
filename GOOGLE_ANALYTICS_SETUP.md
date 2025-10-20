# Google Analytics Setup Guide

## ✅ What's Been Configured

Your app now has a complete Google Analytics 4 (GA4) integration with cookie consent:

1. **Consent-Based Loading**: GA only loads after users accept analytics cookies
2. **Auto Page Tracking**: Tracks page views automatically
3. **Custom Event Tracking**: Helper functions for tracking surveys, forms, buttons, etc.
4. **Privacy Compliant**: Respects user cookie preferences

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Your Google Analytics Measurement ID

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new GA4 property (or use an existing one)
3. Go to **Admin** → **Data Streams** → Select your web stream
4. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Add to Environment Variables

Create or update your `.env.local` file:

```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

Replace `G-XXXXXXXXXX` with your actual measurement ID.

### Step 3: Restart Your Dev Server

```bash
npm run dev
```

That's it! Google Analytics is now active (only after users consent).

## 🧪 Testing

1. Visit your site: `http://localhost:3000`
2. You'll see the cookie consent banner
3. Click **"Accept all"** or **"Accept essential only"**
4. Open browser console - you should see: `"Google Analytics initialized with ID: G-XXXXXXXXXX"`
5. Visit [Google Analytics Real-Time](https://analytics.google.com) - you should see yourself in real-time reports

### Test Different Scenarios

- **Accept analytics**: GA loads and tracks
- **Reject all** (2 clicks): GA doesn't load
- **Accept essential only**: GA doesn't load

## 📊 Tracking Custom Events

Use the helper functions in `src/lib/analytics.ts`:

```typescript
import { trackEvent, trackSurveyStart, trackButtonClick } from '@/lib/analytics'

// Track a custom event
trackEvent({
  action: 'download_report',
  category: 'Reports',
  label: 'OCAI_Summary',
})

// Track survey start
trackSurveyStart('survey-123', 'OCAI')

// Track button click
trackButtonClick('export_pdf', 'dashboard')
```

### Example: Track Survey Completion

Add to your survey completion page:

```typescript
'use client'

import { useEffect } from 'react'
import { trackSurveyComplete } from '@/lib/analytics'

export default function ThankYouPage() {
  useEffect(() => {
    trackSurveyComplete('survey-id', 'OCAI')
  }, [])
  
  return <div>Thank you!</div>
}
```

## 🔧 Available Tracking Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `trackPageView(url)` | Track page views | `trackPageView('/dashboard')` |
| `trackEvent({...})` | Track custom events | `trackEvent({ action: 'click', category: 'Button' })` |
| `trackSurveyStart(id, type)` | Survey started | `trackSurveyStart('123', 'OCAI')` |
| `trackSurveyComplete(id, type)` | Survey completed | `trackSurveyComplete('123', 'Baldrige')` |
| `trackButtonClick(name, location)` | Button clicks | `trackButtonClick('submit', 'form')` |
| `trackFormSubmit(name)` | Form submissions | `trackFormSubmit('contact_form')` |
| `trackExport(type, format)` | Downloads/exports | `trackExport('report', 'pdf')` |
| `trackLogin(method)` | User login | `trackLogin('email')` |
| `trackSignup(method)` | User signup | `trackSignup('access_key')` |

## 🔒 Privacy & Compliance

### What We're Doing Right

✅ **Consent First**: GA only loads after explicit consent  
✅ **Cookie Banner**: Clear information about cookie usage  
✅ **Easy Opt-Out**: Users can reject analytics easily  
✅ **No Storage Before Consent**: No cookies/tracking before user agrees  

### GDPR/CCPA Compliance

This setup respects:
- **GDPR** (EU): Users must consent before analytics cookies
- **CCPA** (California): Users can opt-out of tracking
- **ePrivacy Directive**: Cookie consent before non-essential cookies

### Recommended: Privacy Policy

Make sure your privacy policy (`/privacy`) mentions:
- What analytics data you collect
- How long you retain it
- User's right to opt-out
- How to contact you about data requests

## 🛠️ Troubleshooting

### GA Not Loading?

1. **Check console**: Look for `"Google Analytics initialized"` message
2. **Verify env var**: Make sure `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
3. **Check consent**: Did you accept analytics cookies?
4. **Check cookie**: Visit `/test-cookies` to see consent state
5. **Browser extensions**: Disable ad blockers temporarily

### Events Not Showing in GA?

- **Wait 24-48 hours**: Standard reports have a delay
- **Use Real-Time**: Go to Real-Time reports for immediate feedback
- **Check console**: Events should log to console in development
- **Debug view**: Enable debug mode in GA4

### Reset Consent for Testing

Visit `/test-cookies` and click **"Clear Consent Cookie"** to reset the banner.

## 📝 What Files Were Changed

- ✅ `src/lib/analytics-gate.tsx` - Loads GA after consent
- ✅ `src/lib/analytics.ts` - Helper functions for tracking
- ✅ `src/lib/consent.ts` - Cookie consent utilities
- ✅ `src/components/cookie-consent.tsx` - Consent banner UI
- ✅ `src/components/client-consent-gate.tsx` - Client wrapper
- ✅ `src/app/layout.tsx` - Integrated into app
- ✅ `env.example` - Added GA measurement ID
- ✅ `src/app/test-cookies/page.tsx` - Testing page

## 🎯 Next Steps

1. **Add Your Measurement ID**: Follow Step 1-3 above
2. **Test It**: Accept cookies and check GA Real-Time
3. **Add Custom Tracking**: Use helper functions in your components
4. **Monitor**: Check GA dashboard regularly for insights

## 💡 Pro Tips

- **Use descriptive labels**: Makes filtering events easier
- **Track key user flows**: Survey completion, exports, logins
- **Set up Conversions**: Mark important events as conversions in GA4
- **Create Audiences**: Segment users based on behavior
- **Custom Dimensions**: Add custom properties to events for deeper insights

## 📚 Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GDPR Compliance Guide](https://support.google.com/analytics/answer/9019185)

---

Need help? Check the browser console for debug messages or visit the test page at `/test-cookies`.

