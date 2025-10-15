# 🚀 Assessment Credentials - Quick Start

## ⚡ 3-Minute Setup Guide

### 1️⃣ Access Admin Panel
```
URL: http://localhost:3010
Login: admin@tenadam.com / admin123
Click: Admin Dashboard → "Upload Credentials"
```

### 2️⃣ Prepare CSV File
```csv
email,password
john@company.com,temp123
jane@company.com,temp456
```
**Requirements**: Valid emails, passwords 6+ characters

### 3️⃣ Upload
```
1. Select Organization
2. Check: ☑ OCAI and/or ☑ Baldrige
3. Choose CSV file
4. Set expiration date
5. Click "Upload & Create Credentials"
```

### 4️⃣ Share with Employees
```
Send them:
- URL: http://localhost:3010
- Their email from CSV
- Their password from CSV
```

### 5️⃣ Employees Log In
```
1. Go to assessment hub
2. Click "Sign In"
3. Enter email/password
4. Start assessment
5. Progress auto-saves
6. Can resume anytime
```

---

## 📊 Key Features

✅ Bulk upload (100s at once)  
✅ Individual tracking  
✅ Progress auto-save  
✅ Resume capability  
✅ Privacy controls  
✅ Expiration management  

---

## 🔐 Privacy

- **Admin**: Sees ALL emails and responses
- **Facilitator**: Sees ONLY aggregate data (emails hidden)
- **Employee**: Sees ONLY their own data

---

## 📁 Sample CSV

```csv
email,password
test.user1@company.com,pass123456
test.user2@company.com,pass123456
mary.johnson@acme.com,welcome2025
david.lee@acme.com,secure999
```

**Download**: Click "Sample CSV" button in upload form

---

## 🎯 Common Actions

### Extend Expiration
```
Credentials tab → Find batch → Click "Extend" → Enter new date
```

### Delete Batch
```
Credentials tab → Find batch → Click "Delete" → Confirm
```

### View Usage
```
Credentials tab → Expand batch → See login counts
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| CSV validation errors | Check format: `email,password` |
| Login fails | Check expiration date |
| No progress saved | Check localStorage enabled |
| Can't see emails | Check you're SYSTEM_ADMIN (not facilitator) |

---

## 📞 Files & Documentation

- **Feature Guide**: `markdowns/ASSESSMENT_CREDENTIALS_FEATURE.md`
- **Testing Guide**: `markdowns/CREDENTIAL_TESTING_GUIDE.md`
- **Role Permissions**: `markdowns/USER_ROLES_PERMISSIONS.md`
- **Test CSV**: `test-credentials.csv`

---

**✅ Ready to use NOW!**

Go to: http://localhost:3010 → Admin Dashboard → Upload Credentials





