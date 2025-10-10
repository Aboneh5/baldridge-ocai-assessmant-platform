# Admin System - Quick Reference Card

## 🚀 Quick Access URLs

```
📊 Dashboard:        /admin/dashboard
🏢 Organizations:    /admin/organizations
🔑 Access Keys:      /admin/access-keys
👥 Users:            /admin/users
📈 OCAI:            /admin/ocai
🛡️ Baldrige:        /admin/baldrige
📋 Surveys:          /admin/surveys
⚙️ Settings:         /admin/settings
```

## 📊 OCAI Admin - Quick Guide

### Purpose
Manage Organizational Culture Assessment responses

### URL
`/admin/ocai`

### What You See
- Organizations listed with assessment counts
- Culture scores: Clan, Adhocracy, Market, Hierarchy
- Current vs Preferred comparison
- Blue theme 🔵

### Export Columns
1. Organization
2. User Name
3. User Email
4. Access Key
5. Completed At
6. Survey
7-10. Now Scores (4 dimensions)
11-14. Preferred Scores (4 dimensions)
15. Demographics

### Actions
- **View**: Click organization → Click user → See scores
- **Export Single**: Click CSV or Excel on organization card
- **Export All**: Click header buttons

## 🛡️ Baldrige Admin - Quick Guide

### Purpose
Manage Excellence Framework responses

### URL
`/admin/baldrige`

### What You See
- Organizations with assessment counts
- Assessment IDs (BLD-{ORG}-{YEAR}-{SEQ})
- Question responses with item codes
- Time spent per question
- Emerald green theme 🟢

### Export Columns
1. Assessment ID ⭐ (Unique)
2. Organization
3. User Name
4. User Email
5. Access Key
6. Completed At
7. Survey
8+. All questions as columns (100+)

### Actions
- **View**: Click organization → Click user → See responses
- **Export Single**: Click CSV or Excel on organization card
- **Export All**: Click header buttons

## 🔄 Common Workflows

### View OCAI Data
```
1. Login → 2. Click "OCAI" → 3. Expand org → 4. View scores
```

### View Baldrige Data
```
1. Login → 2. Click "Baldrige" → 3. Expand org → 4. Check Assessment ID
```

### Export Organization Data
```
1. Navigate to OCAI or Baldrige → 2. Find org → 3. Click CSV/Excel
```

### Export All Data
```
1. Navigate to OCAI or Baldrige → 2. Click "Export All CSV/Excel"
```

## 📦 Export File Names

### OCAI
```
ocai_{ORGANIZATION_NAME}_{TIMESTAMP}.csv
ocai_{ORGANIZATION_NAME}_{TIMESTAMP}.xlsx
```

### Baldrige
```
baldrige_{ORGANIZATION_NAME}_{TIMESTAMP}.csv
baldrige_{ORGANIZATION_NAME}_{TIMESTAMP}.xlsx
```

## 🎨 Visual Cues

| Assessment | Color | Icon | URL |
|------------|-------|------|-----|
| OCAI | Blue 🔵 | 📊 Bar Chart | /admin/ocai |
| Baldrige | Green 🟢 | 🛡️ Shield | /admin/baldrige |

## 🔑 Key Differences

| Feature | OCAI | Baldrige |
|---------|------|----------|
| Response Type | Numeric scores | Text responses |
| Questions | 6 dimensions | 100+ questions |
| Assessment ID | ❌ No | ✅ Yes (unique) |
| Time Tracking | ❌ No | ✅ Yes |
| Export Size | ~15 columns | ~107 columns |

## 🆔 Assessment ID Format (Baldrige Only)

```
BLD-{ORG_PREFIX}-{YEAR}-{SEQUENCE}

Examples:
- BLD-CLX123-2025-001
- BLD-CLY987-2025-001
- BLD-INDV-2025-001 (no org)
```

## 📋 Quick Checks

### Is data loading?
✅ Check organizations appear
✅ Check user counts are correct
✅ Expand and verify responses

### Is export working?
✅ Click CSV button → File downloads
✅ Click Excel button → File downloads
✅ Open file → Verify data present

### Is separation working?
✅ OCAI shows culture scores only
✅ Baldrige shows text responses only
✅ No data mixing between types

## 🐛 Troubleshooting

### No organizations showing
→ Check if organizations exist
→ Check if assessments completed
→ Verify user has SYSTEM_ADMIN role

### Export not working
→ Check browser console for errors
→ Verify data exists for organization
→ Try different format (CSV vs Excel)

### Assessment ID missing (Baldrige)
→ Ensure assessment was submitted after ID implementation
→ Old assessments won't have IDs
→ New submissions will auto-generate

## 🔐 Access Requirements

### SYSTEM_ADMIN
✅ Full access to all features
✅ Can view all organizations
✅ Can export all data

### FACILITATOR
✅ Can view own organization only
✅ Can export own organization data
❌ Cannot view other organizations

### EMPLOYEE
✅ Can take assessments
❌ Cannot access admin

## 📞 API Endpoints Reference

```
GET /api/admin/ocai/responses
→ Returns all OCAI responses by organization

GET /api/admin/baldrige/responses
→ Returns all Baldrige responses by organization
```

## 📚 Full Documentation

For detailed information, see:
- **ADMIN_SEPARATION_GUIDE.md** - Complete technical guide
- **ADMIN_STRUCTURE.md** - Visual architecture
- **ADMIN_IMPLEMENTATION_SUMMARY.md** - Implementation overview
- **BALDRIGE_ADMIN_IMPLEMENTATION.md** - Baldrige details

---

**Quick Tip**: Use the navigation tabs to switch between assessment types. Each maintains its own independent view and export functionality! 🎯
