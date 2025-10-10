# Admin System Structure - Visual Guide

## 🏗️ Admin Dashboard Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     TENADAM ASSESSMENT HUB                          │
│                    System Administration                            │
│                                                                     │
│  [Dashboard] [Organizations] [Users] [OCAI] [Baldrige] [Surveys]  │
└─────────────────────────────────────────────────────────────────────┘
```

## 📊 Assessment Type Separation

```
                    ADMIN DASHBOARD
                          │
          ┌───────────────┴───────────────┐
          │                               │
    ┌─────▼─────┐                   ┌─────▼─────┐
    │   OCAI    │                   │  BALDRIGE │
    │ (Culture) │                   │(Excellence)│
    └─────┬─────┘                   └─────┬─────┘
          │                               │
    ┌─────▼──────────────┐          ┌─────▼──────────────┐
    │ • Culture Scores   │          │ • Assessment IDs   │
    │ • Now vs Preferred │          │ • Text Responses   │
    │ • 4 Dimensions     │          │ • 100+ Questions   │
    │ • Blue Theme       │          │ • Green Theme      │
    │ • Bar Chart Icon   │          │ • Shield Icon      │
    └────────────────────┘          └────────────────────┘
```

## 🗂️ Organization-Based Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    ORGANIZATION: Acme Corp                    │
│                    Access Key: ACME2024                       │
└──────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
         ┌──────▼──────┐             ┌──────▼──────┐
         │ OCAI Data   │             │Baldrige Data│
         └─────────────┘             └─────────────┘
         │                           │
         │ User: John Doe            │ User: John Doe
         │ Clan: 35                  │ ID: BLD-CLX123-2025-001
         │ Adhocracy: 25             │ Q1.1a(1): "Response..."
         │ Market: 20                │ Q1.1a(2): "Response..."
         │ Hierarchy: 20             │ ... (100+ questions)
         │                           │
         └──── CSV/Excel ────────────┴──── CSV/Excel ─────┐
                                                           │
                              ┌────────────────────────────▼──┐
                              │  INDEPENDENT EXPORT FILES     │
                              │  • ocai_Acme_Corp.xlsx       │
                              │  • baldrige_Acme_Corp.xlsx   │
                              └──────────────────────────────┘
```

## 📁 File & Route Structure

```
ocai-hub/
│
├── src/app/admin/
│   ├── dashboard/page.tsx ──────────► /admin/dashboard
│   │                                   • Overview stats
│   │                                   • Quick actions
│   │                                   • System status
│   │
│   ├── ocai/page.tsx ───────────────► /admin/ocai
│   │                                   • OCAI responses
│   │                                   • Culture scores
│   │                                   • Blue theme
│   │
│   ├── baldrige/page.tsx ───────────► /admin/baldrige
│   │                                   • Baldrige responses
│   │                                   • Assessment IDs
│   │                                   • Green theme
│   │
│   ├── organizations/page.tsx ──────► /admin/organizations
│   ├── access-keys/page.tsx ────────► /admin/access-keys
│   ├── users/page.tsx ──────────────► /admin/users
│   ├── surveys/page.tsx ────────────► /admin/surveys
│   └── settings/page.tsx ───────────► /admin/settings
│
└── src/app/api/admin/
    ├── ocai/responses/route.ts ─────► GET /api/admin/ocai/responses
    │                                   Returns: OCAI data by org
    │
    └── baldrige/responses/route.ts ─► GET /api/admin/baldrige/responses
                                        Returns: Baldrige data by org
```

## 🎨 Visual Distinction

### OCAI Admin Page
```
┌────────────────────────────────────────────────────────┐
│ 📊 OCAI Assessment Data                                │
│ Organizational Culture Assessment Instrument           │
│                                                        │
│ [Export All CSV] [Export All Excel]                   │
└────────────────────────────────────────────────────────┘
│
├── 🏢 Acme Corp (5 assessments)          [CSV] [Excel]
│   ├── 👤 John Doe
│   │   ├── 🔵 Current: Clan 35 | Adhoc 25 | Market 20
│   │   └── 🟢 Preferred: Clan 40 | Adhoc 30 | Market 15
│   └── 👤 Jane Smith
│       └── ...
│
└── 🏢 Tech Solutions (3 assessments)     [CSV] [Excel]
    └── ...
```

### Baldrige Admin Page
```
┌────────────────────────────────────────────────────────┐
│ 🛡️ Baldrige Assessment Data                           │
│ Excellence Framework Assessment                        │
│                                                        │
│ [Export All CSV] [Export All Excel]                   │
└────────────────────────────────────────────────────────┘
│
├── 🏢 Acme Corp (5 assessments)          [CSV] [Excel]
│   ├── 👤 John Doe
│   │   ├── 🆔 BLD-CLX123-2025-001
│   │   ├── 📝 1.1a(1): "Our leadership approach..."
│   │   ├── 📝 1.1a(2): "We communicate vision by..."
│   │   └── ... (100+ questions)
│   └── 👤 Jane Smith
│       ├── 🆔 BLD-CLX123-2025-002
│       └── ...
│
└── 🏢 Tech Solutions (3 assessments)     [CSV] [Excel]
    └── ...
```

## 🔄 User Journey

### Assessment Taker Journey
```
1. Get Access Key ────► 2. Choose Assessment ────► 3. Complete
   (ACME2024)              OCAI or Baldrige           Submit
                                                         │
                                                         ▼
4. Data Stored ◄───────────────────────────────── Tagged with:
   in Database                                     • Organization ID
                                                   • Access Key
                                                   • Assessment Type
```

### Admin Journey
```
1. Login as Admin ──► 2. Navigate to Dashboard ──► 3. Choose Type
                                                      /          \
                                                     /            \
                                            ┌───────▼──┐      ┌───▼──────┐
                                            │   OCAI   │      │ BALDRIGE │
                                            └───────┬──┘      └───┬──────┘
                                                    │             │
4. View by Organization ◄───────────────────────────┴─────────────┘
   • Expand org
   • View users
   • See responses
   • Export data
```

## 📤 Export System

```
                    ADMIN SELECTS EXPORT
                            │
            ┌───────────────┴────────────────┐
            │                                │
      ┌─────▼─────┐                    ┌─────▼─────┐
      │ Per Org   │                    │ All Orgs  │
      └─────┬─────┘                    └─────┬─────┘
            │                                │
            ▼                                ▼
    Single File                      Multiple Files
    Generated                        (One per org)
            │                                │
            └────────────┬───────────────────┘
                         │
                    ┌────▼────┐
                    │ Format? │
                    └────┬────┘
                         │
              ┌──────────┴──────────┐
              │                     │
         ┌────▼────┐           ┌────▼────┐
         │   CSV   │           │  Excel  │
         └────┬────┘           └────┬────┘
              │                     │
              ▼                     ▼
         Download              Download
```

## 🔐 Access Control

```
┌─────────────────────────────────────────────────┐
│              USER ROLES & ACCESS                │
├─────────────────────────────────────────────────┤
│                                                 │
│  SYSTEM_ADMIN (Full Access)                    │
│  ├── ✅ View Dashboard                         │
│  ├── ✅ Manage Organizations                   │
│  ├── ✅ Generate Access Keys                   │
│  ├── ✅ View OCAI Responses                    │
│  ├── ✅ View Baldrige Responses                │
│  ├── ✅ Export All Data                        │
│  └── ✅ System Settings                        │
│                                                 │
│  FACILITATOR (Org-Scoped)                      │
│  ├── ✅ View Own Org Dashboard                 │
│  ├── ✅ View Own Org Responses                 │
│  ├── ✅ Export Own Org Data                    │
│  └── ❌ No Cross-Org Access                    │
│                                                 │
│  EMPLOYEE (Assessment Only)                     │
│  ├── ✅ Take Assessments                       │
│  └── ❌ No Admin Access                        │
└─────────────────────────────────────────────────┘
```

## 📊 Data Model Relationships

```
Organization
    │
    ├──── Access Keys (1:many)
    │        │
    │        └──── Used by Users (many:1)
    │                    │
    ├──── Users (1:many) ┤
    │                    │
    │              ┌─────┴─────┐
    │              │           │
    │         OCAI Data    Baldrige Data
    │              │           │
    │         Responses    Submissions
    │         (scores)     (text + ID)
    │
    └──── Surveys (1:many)
              │
              └──── Can be OCAI or Baldrige type
```

## 🎯 Key Features Summary

### ✅ Completed Features

| Feature | OCAI | Baldrige |
|---------|:----:|:--------:|
| Organization Grouping | ✅ | ✅ |
| CSV Export | ✅ | ✅ |
| Excel Export | ✅ | ✅ |
| Bulk Export | ✅ | ✅ |
| Unique IDs | ➖ | ✅ |
| Time Tracking | ➖ | ✅ |
| Score Display | ✅ | ➖ |
| Text Responses | ➖ | ✅ |
| Demographics | ✅ | ➖ |
| Visual Distinction | ✅ (Blue) | ✅ (Green) |

### 🚀 System Benefits

1. **Clear Separation**: Each assessment type has dedicated admin space
2. **Independent Management**: Export and view without interference
3. **Organization-Based**: All data grouped by company/access key
4. **Scalable**: Easy to add new assessment types
5. **User-Friendly**: Intuitive navigation and visual cues
6. **Data Integrity**: Type-safe exports and storage

## 🔗 Quick Navigation

```
Main Entry Points:
• /admin/dashboard    → Start here
• /admin/ocai        → Culture assessments
• /admin/baldrige    → Excellence assessments

API Endpoints:
• GET /api/admin/ocai/responses       → OCAI data
• GET /api/admin/baldrige/responses   → Baldrige data
```

---

**The admin system is now fully organized with clear separation between OCAI and Baldrige assessments, while maintaining unified management capabilities!** 🎉
