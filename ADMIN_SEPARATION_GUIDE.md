# Admin System - OCAI & Baldrige Separation Guide

## Overview
The admin system has been reorganized to clearly separate OCAI (Organizational Culture Assessment Instrument) and Baldrige (Excellence Framework) assessments, while maintaining them within the same unified admin dashboard.

## Admin Structure

### Main Admin Routes
```
/admin/dashboard         → Main admin dashboard with overview
/admin/organizations     → Manage client organizations
/admin/access-keys       → Generate and manage access keys
/admin/users             → Manage facilitators and users
/admin/ocai              → OCAI Assessment Management (NEW)
/admin/baldrige          → Baldrige Assessment Management
/admin/surveys           → Survey management
/admin/settings          → System settings
```

## Assessment Separation

### 1. OCAI Administration (`/admin/ocai`)

**Purpose**: Manage Organizational Culture Assessment Instrument responses

**Features**:
- ✅ View all OCAI responses by organization
- ✅ Organization-based grouping
- ✅ Culture profile display (Clan, Adhocracy, Market, Hierarchy)
- ✅ Current vs Preferred culture comparison
- ✅ CSV export per organization
- ✅ Excel export per organization
- ✅ Bulk export all organizations

**Data Structure**:
```typescript
{
  organizationId: string;
  organizationName: string;
  users: [{
    userId: string;
    userName: string;
    userEmail: string;
    accessKey: string;
    completedAt: string;
    responses: [{
      nowScores: {
        clan: number;
        adhocracy: number;
        market: number;
        hierarchy: number;
      },
      preferredScores: {
        clan: number;
        adhocracy: number;
        market: number;
        hierarchy: number;
      },
      demographics: object;
    }]
  }]
}
```

**Export Format**:
- **CSV/Excel Columns**:
  1. Organization
  2. User Name
  3. User Email
  4. Access Key
  5. Completed At
  6. Survey
  7. Now - Clan
  8. Now - Adhocracy
  9. Now - Market
  10. Now - Hierarchy
  11. Preferred - Clan
  12. Preferred - Adhocracy
  13. Preferred - Market
  14. Preferred - Hierarchy
  15. Demographics

**UI Features**:
- Blue theme (matches OCAI branding)
- Culture radar chart icon
- Expandable organization cards
- Color-coded score displays (Blue for Now, Green for Preferred)

### 2. Baldrige Administration (`/admin/baldrige`)

**Purpose**: Manage Baldrige Excellence Framework responses

**Features**:
- ✅ View all Baldrige responses by organization
- ✅ Organization-based grouping
- ✅ Unique assessment ID tracking
- ✅ Question-by-question response display
- ✅ CSV export per organization
- ✅ Excel export per organization
- ✅ Bulk export all organizations

**Data Structure**:
```typescript
{
  organizationId: string;
  organizationName: string;
  users: [{
    userId: string;
    userName: string;
    userEmail: string;
    accessKey: string;
    assessmentId: string;  // Unique: BLD-{ORG}-{YEAR}-{SEQ}
    completedAt: string;
    responses: [{
      itemCode: string;      // e.g., "1.1a(1)"
      questionText: string;
      categoryName: string;
      subcategoryName: string;
      responseText: string;  // Long-form text response
      timeSpent: number;
    }]
  }]
}
```

**Export Format**:
- **CSV/Excel Columns**:
  1. Assessment ID (Unique identifier)
  2. Organization
  3. User Name
  4. User Email
  5. Access Key
  6. Completed At
  7. Survey
  8. [All Baldrige questions as columns with item codes]

**UI Features**:
- Emerald green theme (matches Baldrige branding)
- Shield/document icon
- Expandable organization and user cards
- Assessment ID prominently displayed
- Time spent tracking per question

## Navigation Structure

### Global Admin Navigation
All admin pages share the same navigation bar:

```
Dashboard | Organizations | Users | OCAI | Baldrige | Surveys | Settings
```

**Active States**:
- `/admin/dashboard` → "Dashboard" is highlighted
- `/admin/ocai` → "OCAI" is highlighted (blue underline)
- `/admin/baldrige` → "Baldrige" is highlighted (emerald underline)

### Quick Actions (Dashboard)
The main dashboard provides quick access cards:

1. **Create Organization** → Add new client company
2. **Generate Access Key** → Create assessment access codes
3. **OCAI Responses** → Jump to OCAI admin
4. **Baldrige Responses** → Jump to Baldrige admin

## API Endpoints

### OCAI Admin API
```
GET /api/admin/ocai/responses
```
**Returns**: All OCAI responses organized by organization

**Response Structure**:
```json
{
  "success": true,
  "data": [OrganizationData],
  "summary": {
    "totalOrganizations": number,
    "totalUsers": number,
    "totalResponses": number
  }
}
```

### Baldrige Admin API
```
GET /api/admin/baldrige/responses
```
**Returns**: All Baldrige responses organized by organization with assessment IDs

**Response Structure**:
```json
{
  "success": true,
  "data": [OrganizationData],
  "summary": {
    "totalOrganizations": number,
    "totalUsers": number,
    "totalResponses": number,
    "totalSubmissions": number
  }
}
```

## Key Differences: OCAI vs Baldrige

| Feature | OCAI | Baldrige |
|---------|------|----------|
| **Assessment Type** | Culture profiling (quantitative) | Excellence framework (qualitative) |
| **Response Format** | Numeric scores (0-100 across 4 dimensions) | Long-form text responses |
| **Data Points** | 8 scores (4 Now + 4 Preferred) | 100+ question responses |
| **Assessment ID** | Not tracked separately | Unique ID per submission |
| **Export Focus** | Culture scores and comparison | Detailed question responses |
| **UI Color** | Blue theme | Emerald green theme |
| **Icon** | Bar chart / Radar | Shield / Document |
| **Time Tracking** | Not tracked | Per-question time spent |

## Organization-Based Separation

### How It Works
Both OCAI and Baldrige assessments are separated by organization through:

1. **Access Key Assignment**: Each access key is tied to an organization
2. **User Tracking**: When a user uses an access key, their `organizationId` and `accessKeyUsed` are recorded
3. **Data Grouping**: Admin views group responses by `organizationId`
4. **Independent Management**: Each assessment type can be viewed/exported separately

### Example Flow
```
1. Admin creates Organization "Acme Corp" (ID: clx123)
2. Admin generates Access Key "ACME2024" for Acme Corp
3. Employee uses "ACME2024" to access both assessments
4. User data is tagged: organizationId = "clx123", accessKeyUsed = "ACME2024"
5. Admin views:
   - /admin/ocai → Shows Acme Corp's OCAI responses
   - /admin/baldrige → Shows Acme Corp's Baldrige responses
6. Both can be exported independently
```

## Export Capabilities

### OCAI Exports
- **Format**: CSV or Excel
- **Scope**: Per organization or all organizations
- **Content**: Culture scores, demographics
- **File naming**: `ocai_{ORGANIZATION}_{TIMESTAMP}.{csv|xlsx}`

### Baldrige Exports
- **Format**: CSV or Excel
- **Scope**: Per organization or all organizations
- **Content**: All question responses with assessment IDs
- **File naming**: `baldrige_{ORGANIZATION}_{TIMESTAMP}.{csv|xlsx}`

### Export Buttons Location
1. **Organization Level**: Each organization card has CSV + Excel buttons
2. **Global Level**: Header has "Export All CSV" and "Export All Excel" buttons

## File Structure

```
src/app/admin/
├── dashboard/page.tsx          # Main admin dashboard
├── ocai/page.tsx              # OCAI assessment admin (NEW)
├── baldrige/page.tsx          # Baldrige assessment admin
├── organizations/page.tsx     # Organization management
├── access-keys/page.tsx       # Access key management
├── users/page.tsx             # User management
├── surveys/page.tsx           # Survey management
└── settings/page.tsx          # System settings

src/app/api/admin/
├── ocai/
│   └── responses/route.ts     # OCAI admin API (NEW)
└── baldrige/
    └── responses/route.ts     # Baldrige admin API
```

## Benefits of Separation

### 1. **Clear Organization**
- Each assessment type has dedicated admin page
- No confusion between different assessment formats
- Easy to locate specific assessment data

### 2. **Independent Management**
- Export OCAI data without Baldrige interference
- Export Baldrige data without OCAI interference
- Separate analytics and reporting per type

### 3. **Scalability**
- Easy to add more assessment types in future
- Each type can have custom features
- Modular architecture

### 4. **User Experience**
- Admins can focus on one assessment type at a time
- Clear visual separation (colors, icons)
- Intuitive navigation

### 5. **Data Integrity**
- OCAI and Baldrige data stored separately
- No mixing of response formats
- Type-safe exports

## Usage Instructions

### For System Admins

#### Viewing OCAI Responses
1. Sign in as SYSTEM_ADMIN
2. Navigate to `/admin/ocai`
3. Click organization to expand
4. Click user to view culture scores
5. Export as needed (CSV or Excel)

#### Viewing Baldrige Responses
1. Sign in as SYSTEM_ADMIN
2. Navigate to `/admin/baldrige`
3. Click organization to expand
4. Click user to view assessment details
5. Note the unique Assessment ID
6. Export as needed (CSV or Excel)

#### Exporting Data
**Single Organization**:
- Click CSV or Excel button on organization card

**All Organizations**:
- Click "Export All CSV" or "Export All Excel" in header
- Separate files generated for each organization

## Future Enhancements

### Potential Additions
1. **Combined Analytics Dashboard**
   - Cross-reference OCAI and Baldrige data
   - Organization-wide insights
   - Correlation analysis

2. **Advanced Filtering**
   - Filter by date range
   - Filter by organization
   - Filter by completion status

3. **Report Builder**
   - Custom report templates
   - Automated report generation
   - Scheduled exports

4. **Data Visualization**
   - OCAI culture radar charts
   - Baldrige score heatmaps
   - Trend analysis over time

## Summary

✅ **OCAI and Baldrige are now completely separated**
✅ **Both accessible from unified admin navigation**
✅ **Independent data structures and exports**
✅ **Organization-based grouping for both**
✅ **Clear visual distinction (colors, icons)**
✅ **Scalable architecture for future assessments**

The admin system provides a clean, organized way to manage different assessment types while maintaining a unified user experience.
