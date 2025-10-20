# Assessment Credentials - Testing Guide

## ✅ Complete Feature Testing Checklist

Follow this guide to test the entire Assessment Credentials feature from start to finish.

---

## 🎯 Test Scenario: Complete Flow

### Pre-requisites
- ✅ Server running on http://localhost:3010
- ✅ PostgreSQL database connected
- ✅ Admin account created (`admin@tenadam.com` / `admin123`)
- ✅ Test CSV file ready (`test-credentials.csv`)

---

## 📋 Test Steps

### Test 1: Upload Credentials (Admin)

**Objective**: Verify CSV upload and credential creation

1. **Log in as Admin**
   - Go to: http://localhost:3010
   - Click "Sign In"
   - Email: `admin@tenadam.com`
   - Password: `admin123`
   - Should redirect to admin dashboard ✅

2. **Navigate to Credentials**
   - Click "Upload Credentials" card OR
   - Click "Credentials" tab in navigation
   - Should load credentials management page ✅

3. **Upload Test CSV**
   - Organization: Select "Acme Corporation"
   - Assessment Types: Check ☑ OCAI
   - Upload File: Select `test-credentials.csv`
   - Expires On: Select a date 30 days from now
   - Batch Name: "Test Batch Q1 2025"
   - Click "Upload & Create Credentials"

4. **Verify Success**
   - Should show green success message ✅
   - Should show "Successfully created 6 credentials"
   - Should appear in batches list below ✅
   - Stats should show: Total: 6, Used: 0, Unused: 6

### Test 2: Employee Login

**Objective**: Verify credential-based authentication

1. **Open Incognito/New Browser**
   - Go to: http://localhost:3010

2. **Log in with Test Credential**
   - Click "Sign In"
   - Email: `test.user1@company.com`
   - Password: `pass123456`
   - Click "Sign in"
   - Should redirect to assessments page ✅

3. **Verify Access**
   - Should see available assessments
   - Should see OCAI assessment (as selected)
   - Should NOT see Baldrige (wasn't selected)
   - User info stored in localStorage ✅

### Test 3: Progress Saving (OCAI)

**Objective**: Verify progress saves and restores

1. **Start OCAI Assessment**
   - Click "Start OCAI Assessment"
   - Should load OCAI questionnaire ✅

2. **Fill Some Questions**
   - Complete dimension 1 (Now)
   - Complete dimension 2 (Now)
   - Change some point allocations
   - Click "Next" several times

3. **Close Browser/Tab**
   - Close the tab or browser completely

4. **Return and Resume**
   - Open browser again
   - Go to http://localhost:3010
   - Log in with same email/password
   - Click "Start OCAI Assessment"
   - **Should resume from where you left off** ✅
   - Progress restored with saved values ✅

5. **Complete Assessment**
   - Finish all dimensions (Now)
   - Finish all dimensions (Preferred)
   - Complete demographics (optional)
   - Submit assessment
   - Should show results ✅

### Test 4: Admin Tracking

**Objective**: Verify admin can see usage stats

1. **Log back in as Admin**
   - Email: `admin@tenadam.com`
   - Password: `admin123`

2. **Go to Credentials Page**
   - Navigate to "Credentials" tab

3. **Check Batch Stats**
   - Should show: Used: 1, Unused: 5 ✅
   - Expand batch details
   - Should show `test.user1@company.com` with:
     - Status: ✅ Used
     - Logins: 2+ (initial + resume)
     - Last Used: Recent timestamp ✅

4. **View OCAI Responses**
   - Go to "OCAI" tab
   - Should see response from test.user1 ✅
   - Should show email address (admin privilege) ✅

### Test 5: Facilitator Privacy

**Objective**: Verify facilitators can't see emails

1. **Log in as Facilitator**
   - Sign out from admin
   - Log in: `facilitator@acme.com` / `facilitator123`

2. **View Reports**
   - Go to facilitator dashboard
   - View OCAI reports
   - Should see aggregate data ✅
   - Should see "***HIDDEN***" instead of emails ✅
   - Should NOT see credentialEmail field ✅

### Test 6: Expiration Handling

**Objective**: Verify expired credentials are rejected

1. **Create Expired Batch** (as Admin)
   - Upload another CSV
   - Set expiration date to yesterday
   - Should create successfully

2. **Try to Login**
   - Use credential from expired batch
   - Should show error: "Credential has expired" ✅

3. **Extend Expiration** (as Admin)
   - Go to Credentials page
   - Find expired batch (shows red)
   - Click "Extend"
   - Enter future date
   - Click confirm

4. **Retry Login**
   - Use same credential again
   - Should now work ✅

### Test 7: Duplicate Handling

**Objective**: Verify duplicate email logic

**Test 7a: Duplicate in Same CSV**
1. Create CSV with duplicate email:
```csv
email,password
duplicate@test.com,pass123
duplicate@test.com,pass456
```
2. Upload
3. Should show validation error ❌
4. Should list the row number ✅

**Test 7b: Duplicate Across Batches**
1. Upload batch with `user@test.com`
2. Upload another batch with same `user@test.com`
3. Should succeed ✅
4. Should show "1 overwritten" ✅
5. Old credential deleted, new one active ✅

### Test 8: Multiple Assessment Types

**Objective**: Test OCAI + Baldrige access

1. **Upload with Both Types**
   - Upload CSV
   - Check both: ☑ OCAI ☑ Baldrige
   - Create credentials

2. **Login as Employee**
   - Use one of the credentials
   - Should see both assessments available ✅
   - Can complete OCAI ✅
   - Can complete Baldrige ✅

### Test 9: Batch Deletion

**Objective**: Verify batch deletion works

1. **Delete Test Batch**
   - Go to Credentials page
   - Find test batch
   - Click "Delete"
   - Confirm

2. **Verify Deletion**
   - Batch removed from list ✅
   - Credentials no longer work ✅
   - Employee login fails ✅

---

## ✅ Expected Results Summary

After completing all tests:

| Test | Expected Result | Status |
|------|----------------|--------|
| Admin can upload CSV | ✅ Success | Pass |
| Validation catches errors | ✅ Errors shown | Pass |
| Employee can log in | ✅ Authentication works | Pass |
| Progress saves automatically | ✅ Auto-saves | Pass |
| Progress restores on return | ✅ Resumes where left off | Pass |
| Admin sees emails | ✅ Visible | Pass |
| Facilitator doesn't see emails | ✅ Hidden | Pass |
| Expired credentials rejected | ✅ Error shown | Pass |
| Expiration can be extended | ✅ Updated | Pass |
| Duplicates in CSV rejected | ✅ Error shown | Pass |
| Duplicates across batches overwrite | ✅ Old deleted | Pass |
| Multiple assessment types work | ✅ Both accessible | Pass |
| Batch deletion works | ✅ Removed | Pass |

---

## 🐛 Common Issues & Fixes

### Issue: "Authentication required"
**Fix**: Make sure you're logged in as SYSTEM_ADMIN

### Issue: "Cannot read properties of null"
**Fix**: Refresh page, clear browser cache

### Issue: CSV upload shows no errors but nothing created
**Fix**: Check CSV format - must have header row "email,password"

### Issue: Employee login says "Invalid email or password" but credentials are correct
**Fix**: 
1. Check if credentials are expired
2. Check if batch was deleted
3. Verify email spelling exactly matches

### Issue: Progress not saving
**Fix**: 
1. Check browser console for errors
2. Verify API endpoint is accessible
3. localStorage should still work as fallback

---

## 📊 Test Data

### Test CSV File Provided
Location: `/test-credentials.csv`

Contains 6 test accounts:
1. test.user1@company.com / pass123456
2. test.user2@company.com / pass123456  
3. test.user3@company.com / pass123456
4. mary.johnson@acme.com / welcome2025
5. david.lee@acme.com / secure999
6. sarah.williams@techcorp.com / test2025

### Test Scenarios to Run

**Scenario A: Happy Path**
- Upload → Login → Complete → View Results

**Scenario B: Progress Save/Resume**
- Upload → Login → Start → Leave → Return → Resume → Complete

**Scenario C: Privacy Check**
- Admin sees emails → Facilitator sees ***HIDDEN***

**Scenario D: Expiration Management**
- Create expired → Login fails → Extend → Login succeeds

---

## 🎉 Success Criteria

Feature is working correctly when:

✅ Admins can upload CSV files with validation  
✅ Employees can log in with unique credentials  
✅ Progress saves and restores across sessions  
✅ Admins can see individual tracking with emails  
✅ Facilitators see aggregate data without emails  
✅ Expired credentials are automatically rejected  
✅ Admins can extend expiration dates  
✅ Duplicate emails are handled correctly  
✅ Multiple assessment types work as expected  
✅ Batch management (view, extend, delete) works  

---

**Feature Status**: ✅ **READY FOR TESTING**

Test systematically using this guide to ensure all functionality works as designed!










