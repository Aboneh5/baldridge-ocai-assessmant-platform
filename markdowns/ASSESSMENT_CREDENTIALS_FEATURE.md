# Assessment Credentials Feature

## 📋 Overview

The **Assessment Credentials** feature allows administrators to upload bulk email/password combinations that employees can use to access assessments. This provides more control and tracking compared to shared access keys.

---

## 🎯 Key Benefits

1. **Individual Accountability**: Each employee has unique credentials
2. **Better Tracking**: Know exactly who completed which assessment
3. **Progress Saving**: Users can stop and resume assessments
4. **Privacy Controls**: Facilitators see aggregate data, not individual emails
5. **Bulk Management**: Upload hundreds of credentials at once
6. **Flexible Access**: Grant access to OCAI, Baldrige, or both

---

## 🔑 Comparison: Access Keys vs Assessment Credentials

| Feature | Access Keys | Assessment Credentials |
|---------|-------------|------------------------|
| **Authentication** | One code shared | Individual email/password |
| **Anonymity** | More anonymous | Identified by email |
| **Tracking** | By access key group | By individual email |
| **Progress Saving** | localStorage only | Server + localStorage |
| **Admin Visibility** | Limited | Full (emails visible) |
| **Facilitator Visibility** | Aggregate only | Aggregate only (emails hidden) |
| **Best For** | Anonymous surveys | Tracked assessments |
| **Accountability** | Low | High |

---

## 🚀 How to Use (Admin)

### Step 1: Access the Feature

1. Log in as **SYSTEM_ADMIN**
2. Go to **Admin Dashboard**
3. Click **"Upload Credentials"** or navigate to **Credentials** tab

### Step 2: Prepare Your CSV File

Create a CSV file with exactly 2 columns:

```csv
email,password
john.doe@company.com,temp123
jane.smith@company.com,temp456
bob.johnson@company.com,temp789
```

**Requirements:**
- ✅ Valid email format
- ✅ Password minimum 6 characters
- ✅ No duplicate emails in same file
- ✅ First row must be header: `email,password`

**Download Sample:** Click "Sample CSV" button on the upload page

### Step 3: Upload Credentials

1. **Select Organization**: Choose which company these credentials are for
2. **Select Assessment Type(s)**: Check one or both:
   - ☐ OCAI
   - ☐ Baldrige
3. **Upload File**: Choose your CSV file
4. **Set Expiration Date**: When should credentials stop working?
5. **Batch Name (Optional)**: e.g., "Q1 2025 Leadership Team"
6. Click **"Upload & Create Credentials"**

### Step 4: Review Results

You'll see:
- ✅ **Success**: "Successfully created X credentials"
- ⚠️ **Validation Errors**: List of any rows that failed
- 📊 **Batch Stats**: Total, Used, Unused counts

### Step 5: Share with Employees

Send each employee their unique credentials:
```
Assessment Hub Access:
URL: http://localhost:3010
Email: john.doe@company.com
Password: temp123
Expires: March 31, 2025
```

---

## 👤 How to Use (Employee)

### Step 1: Receive Credentials

You'll receive an email with:
- Login URL
- Your email address
- Your temporary password
- Expiration date

### Step 2: Log In

1. Go to the assessment hub URL
2. Click **"Sign In"**
3. Select **"Email & Password"** tab
4. Enter your email and password
5. Click **"Sign in"**

### Step 3: Take Assessment

1. You'll see available assessments (OCAI and/or Baldrige)
2. Click **"Start Assessment"**
3. Complete the questionnaire
4. Your progress is automatically saved

### Step 4: Resume Anytime

- Log in again with same credentials
- Your progress is restored
- Continue from where you left off
- Complete before expiration date

---

## 🔒 Privacy & Security

### For SYSTEM_ADMIN:
- ✅ Can see all individual emails
- ✅ Can see who completed assessments
- ✅ Can see credential usage stats
- ✅ Can extend expiration dates
- ✅ Can deactivate credentials

### For FACILITATOR:
- ✅ Can see aggregate results
- ✅ Can see response counts
- ❌ **CANNOT** see individual emails
- ❌ **CANNOT** see credentialEmail field
- ❌ **CANNOT** identify who submitted what

### For Employees:
- ✅ Can only see their own progress
- ✅ Can only see their own results
- ❌ Cannot see other employees' data

---

## 📊 Batch Management

### View Batches

Each batch shows:
- **Organization name**
- **Created date**
- **Expiration date**
- **Assessment types** (OCAI, Baldrige, or both)
- **Statistics:**
  - Total credentials
  - Used credentials
  - Unused credentials
  - Expired status

### Extend Expiration

1. Find the batch
2. Click **"Extend"**
3. Enter new expiration date
4. All credentials in batch updated

### Delete Batch

1. Find the batch
2. Click **"Delete"**
3. Confirm deletion
4. All credentials permanently removed

---

## 🔄 Handling Duplicates

### Same Batch
- ❌ **Rejected**: CSV upload will show error for duplicate emails
- Must fix CSV and re-upload

### Different Batches
- ✅ **Overwritten**: New credential replaces old one
- New password, expiration, and assessment types apply
- Old credential is deleted
- User notification: "System shows overwritten count"

---

## ⚙️ Technical Details

### Database Model: `AssessmentCredential`

```typescript
{
  id: string                // Unique identifier
  email: string             // Login email
  password: string          // Hashed password (bcrypt)
  organizationId: string    // Which organization
  assessmentTypes: string   // "OCAI", "BALDRIGE", or "OCAI,BALDRIGE"
  isActive: boolean         // Can be deactivated
  expiresAt: DateTime       // Expiration date
  batchId: string           // Groups uploads together
  batchName: string?        // Optional batch name
  lastUsedAt: DateTime?     // Last login time
  loginCount: number        // How many times logged in
  createdBy: string?        // Admin who created it
  createdAt: DateTime       // When created
  updatedAt: DateTime       // Last updated
}
```

### Progress Tracking

When employees use credentials, their progress is saved:

**In Response Model:**
```typescript
{
  credentialEmail: string?  // Email (only visible to admins)
  isComplete: boolean       // Fully finished?
  progressData: JSON        // Saved state
  lastSavedAt: DateTime?    // Last auto-save
}
```

**Auto-save Triggers:**
- Every dimension change (OCAI)
- Every question answer (Baldrige)
- Moving to next page
- Browser closes (localStorage)

---

## 📝 CSV Validation Rules

The system validates each row:

1. **Email Format**
   - Must be valid email (user@domain.com)
   - Cannot be empty

2. **Password Requirements**
   - Minimum 6 characters
   - Cannot be empty

3. **Duplicates**
   - No duplicate emails within same CSV
   - Overwrites if email exists in different batch

4. **Error Reporting**
   - Shows row number for each error
   - Shows first 10 errors (if more, shows count)
   - Allows admin to fix and re-upload

---

## 🎯 Use Cases

### Use Case 1: Annual Culture Survey

**Scenario**: HR wants all 200 employees to complete OCAI

**Setup:**
```
Organization: XYZ Corp
Assessment Types: ☑ OCAI
CSV: 200 employees
Expires: 2025-03-31
Batch Name: Annual Culture Survey 2025
```

**Result**: 200 unique logins, each tracked individually

### Use Case 2: Leadership Baldrige Assessment

**Scenario**: 15 executives complete Baldrige framework

**Setup:**
```
Organization: ABC Inc
Assessment Types: ☑ Baldrige
CSV: 15 executives
Expires: 2025-06-30
Batch Name: Executive Leadership Assessment
```

**Result**: High-accountability tracking for leadership team

### Use Case 3: Both Assessments

**Scenario**: Management team does both OCAI and Baldrige

**Setup:**
```
Organization: Tech Corp
Assessment Types: ☑ OCAI ☑ Baldrige
CSV: 25 managers
Expires: 2025-12-31
Batch Name: Management Team - Full Assessment
```

**Result**: Each manager can access both assessments with one login

---

## 🔍 Monitoring & Analytics

### Admin View

**Batch List** shows:
- Total credentials created
- How many have been used
- How many are unused
- Expiration status
- Last login times
- Completion rates

**Individual Tracking**:
- Which emails logged in
- When they logged in (timestamp)
- How many times they logged in
- Which assessments they completed
- Their full responses (with email)

### Facilitator View

**Aggregate Data** shows:
- Total responses count
- Average scores
- Distribution charts
- Completion rate
- **Does NOT show individual emails**

---

## 🔄 Workflow Diagram

```
[ADMIN]
  │
  ├─ Create Organization
  │
  ├─ Prepare CSV (email,password)
  │
  ├─ Upload to /admin/assessment-credentials
  │     └─ Select org, assessment types, expiration
  │
  ├─ System creates credentials
  │     └─ Validates, hashes passwords, creates batch
  │
  └─ Share credentials with employees

[EMPLOYEE]
  │
  ├─ Receive email with credentials
  │
  ├─ Go to assessment hub
  │
  ├─ Enter email/password
  │     └─ System checks: valid? not expired?
  │
  ├─ Redirected to assessments
  │     └─ See OCAI and/or Baldrige (based on granted access)
  │
  ├─ Start assessment
  │     └─ Progress auto-saves (localStorage + server)
  │
  ├─ Can leave and return
  │     └─ Progress restored on next login
  │
  └─ Complete assessment
        └─ Marked as complete in database

[FACILITATOR]
  │
  ├─ Log in to dashboard
  │
  └─ View reports
        └─ See aggregate data only
        └─ Emails are hidden (***HIDDEN***)
```

---

## ⚡ Quick Reference

### Admin Actions

| Action | How To |
|--------|--------|
| Create credentials | Upload CSV file |
| View batches | Go to "Credentials" tab |
| Extend expiration | Click "Extend" on batch |
| Delete batch | Click "Delete" on batch |
| Track usage | View "Used" count in stats |
| See who logged in | Expand batch → view credential list |

### Employee Actions

| Action | How To |
|--------|--------|
| Log in | Use email/password |
| Start assessment | Click assessment card |
| Save progress | Automatic on each change |
| Resume assessment | Log in again |
| View results | After completion |

---

## 🛡️ Security Features

1. **Password Hashing**: All passwords hashed with bcrypt (10 rounds)
2. **Email Validation**: Strict email format checking
3. **Expiration Enforcement**: Expired credentials rejected automatically
4. **Role-Based Privacy**: Facilitators can't see emails
5. **Login Tracking**: Monitor for suspicious activity
6. **Batch Isolation**: Emails unique per batch
7. **Secure Storage**: Credentials never stored in plain text

---

## 🐛 Troubleshooting

### "Credential has expired"
- **Fix**: Admin extends expiration date for the batch

### "Invalid email or password"
- **Fix**: Check for typos, ensure not expired

### CSV upload validation errors
- **Fix**: Review error list, fix CSV, re-upload

### Employee can't see assessment
- **Fix**: Check assessment types selected when batch was created

### Progress not saving
- **Fix**: Ensure browser allows localStorage
- Fallback: Progress still in localStorage

---

## 📦 Installation (Already Completed)

✅ Database model created  
✅ API endpoints implemented  
✅ Admin UI created  
✅ Login page updated  
✅ Progress saving implemented  
✅ Privacy controls added  

---

## 🎉 Feature Complete!

The Assessment Credentials feature is now fully implemented and ready for use.

**Created:** October 7, 2025  
**Version:** 1.0  
**Status:** Production Ready ✅










