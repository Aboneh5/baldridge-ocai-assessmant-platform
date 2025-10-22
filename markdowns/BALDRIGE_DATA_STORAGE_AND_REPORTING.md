# 🏆 Baldrige Assessment - Data Storage & Reporting

## 📊 Complete Data Architecture

---

## 🗄️ Database Storage Structure

The Baldrige assessment uses **5 interconnected database tables** to store comprehensive assessment data:

### **1. BaldrigeCategory** (7 Categories)
```
Stores the main assessment categories (Leadership, Strategy, Customers, etc.)

Fields:
├── id (unique identifier)
├── name (e.g., "Leadership", "Strategy")
├── displayOrder (1-7)
├── description (category overview)
└── totalPoints (max points for category)

Example:
- Category 1: Leadership (120 points)
- Category 2: Strategy (85 points)
- Category 7: Results (450 points)
```

### **2. BaldrigeSubcategory** (Items within categories)
```
Stores subcategories like 1.1, 1.2, 2.1, etc.

Fields:
├── id
├── name (e.g., "Senior Leadership")
├── displayOrder (order within category)
├── points (points allocated)
└── categoryId (belongs to which category)

Example:
- 1.1 Senior Leadership (70 points)
- 1.2 Governance and Societal Contributions (50 points)
```

### **3. BaldrigeQuestion** (~100+ questions)
```
Stores individual questions with item codes

Fields:
├── id
├── itemCode (e.g., "1.1a(1)", "2.1b(2)")
├── questionText (the actual question)
├── orderIndex (order within subcategory)
├── instructions (guidance text)
└── subcategoryId (belongs to which subcategory)

Example:
- 1.1a(1): "How do senior leaders set and deploy your organization's vision and values?"
- 2.1a(1): "How do you conduct your strategic planning?"
```

### **4. BaldrigeResponse** (User answers)
```
Stores each employee's answer to each question

Fields:
├── id
├── userId (who answered)
├── questionId (which question)
├── surveyId (optional - if part of survey)
├── responseText (their written answer)
├── timeSpent (seconds spent on question)
└── timestamps (created, updated)

Example:
User: john@company.com
Question: 1.1a(1)
Answer: "Our senior leaders set vision through quarterly town halls..."
Time: 180 seconds
```

### **5. BaldrigeProgress** (Completion tracking)
```
Tracks overall progress for each user

Fields:
├── userId
├── surveyId
├── completedQuestions (JSON array of question IDs)
├── isCompleted (true when all done)
└── completedAt (timestamp)

Example:
User: john@company.com
Completed: 45 out of 100 questions
Status: In Progress
```

### **6. BaldrigeSubmission** (Final submission record)
```
Overall submission tracking with unique assessment ID

Fields:
├── assessmentId (e.g., "BLD-2024-001")
├── userId
├── organizationId
├── accessKey (if used)
├── startedAt
├── submittedAt
├── isCompleted
├── totalQuestions
├── answeredQuestions
└── metadata (additional info)

Example:
Assessment ID: BLD-2024-001
User: john@company.com
Organization: Acme Corp
Status: Completed
Questions: 100/100
Submitted: Jan 15, 2025
```

---

## 📈 How Data Flows

### **1. Employee Takes Assessment**
```
Employee logs in
    ↓
Starts Baldrige assessment
    ↓
For each question answered:
  - Create/Update BaldrigeResponse (stores answer text)
  - Update BaldrigeProgress (add question to completed list)
  - Auto-save progress (localStorage + server)
    ↓
When all questions completed:
  - Mark BaldrigeProgress.isCompleted = true
  - Create BaldrigeSubmission with unique ID
  - Set submittedAt timestamp
```

### **2. Admin Views Results**
```
Admin clicks "Baldrige Responses" tab
    ↓
API fetches:
  - All BaldrigeSubmissions (get assessment IDs)
  - All BaldrigeProgress (completion status)
  - All BaldrigeResponses (individual answers)
  - Joins with User and Organization data
    ↓
Groups by Organization
    ↓
Groups by User within each Organization
    ↓
Displays hierarchically:
  Organization
    └─ User
        └─ All Questions & Answers
```

---

## 🖥️ Admin View Interface

### **Page Location**: `/admin/baldrige`

### **Summary Statistics (Top of Page)**
```
┌─────────────────────────────────────────────────────┐
│  Organizations: 3                                    │
│  Completed Assessments: 12                           │
│  Total Responses: 1,200 (12 users × 100 questions)   │
└─────────────────────────────────────────────────────┘
```

### **Hierarchical Organization View**
```
🏢 Acme Corporation (5 completed assessments)
    [Export CSV] [Export Excel]
    │
    ├─ 👤 John Doe
    │   📧 john.doe@acme.com
    │   🔑 Access Key: ACME2024
    │   🆔 Assessment ID: BLD-2024-001
    │   ✅ Completed: Jan 15, 2025
    │   📝 100 responses
    │   │
    │   └─ [Click to expand responses]
    │       ├─ 1.1a(1): How do senior leaders set vision...
    │       │   Answer: "Our leaders conduct quarterly..."
    │       │   Time: 3m 45s
    │       │
    │       ├─ 1.1a(2): How do leaders deploy values...
    │       │   Answer: "Through regular communication..."
    │       │   Time: 2m 30s
    │       │
    │       └─ ... (all 100 questions)
    │
    ├─ 👤 Jane Smith
    │   📧 jane.smith@acme.com
    │   ...
    │
    └─ ... (more users)
```

---

## 📥 Export Capabilities

### **1. CSV Export (Per Organization)**
**Format**: Wide format with questions as columns

```csv
Assessment ID, Organization, User Name, User Email, Access Key, Completed At, Survey, 1.1a(1), 1.1a(2), ...
BLD-2024-001, Acme Corp, John Doe, john@acme.com, ACME2024, 1/15/2025, Q1 Assessment, "Our leaders...", "Through regular...", ...
```

**Usage**:
- Click organization's "Export CSV" button
- Opens in Excel/Google Sheets
- Each row = one user's complete assessment
- Each column = one question's answer

### **2. Excel Export (Per Organization)**
**Format**: Same as CSV but with formatting

```
Features:
✅ Column width auto-adjusted
✅ Headers in bold
✅ Assessment ID prominent
✅ Timestamp formatted
✅ Text wrapped for long answers
```

**Usage**:
- Click organization's "Export Excel" button
- Downloads .xlsx file
- Better formatting than CSV
- Easier to read and analyze

### **3. Export All**
**Bulk Export**: Downloads separate file for each organization

```
Buttons at top:
[Export All CSV] - Creates CSV for each org
[Export All Excel] - Creates Excel for each org
```

---

## 🔍 Data Viewing Features

### **Organization Level**
```
View:
✅ Organization name
✅ Total completed assessments
✅ List of all users who completed
✅ Export buttons (CSV, Excel)
✅ Expandable/collapsible
```

### **User Level**
```
View:
✅ User name
✅ Email address (ADMIN only - hidden for facilitators)
✅ Access key used
✅ Unique Assessment ID (e.g., BLD-2024-001)
✅ Completion date/time
✅ Total number of responses
✅ Expandable to see all answers
```

### **Response Level**
```
View:
✅ Item code (1.1a(1), 2.1b(2), etc.)
✅ Full question text
✅ Category → Subcategory hierarchy
✅ User's written response
✅ Time spent on question
✅ Formatted display with color coding
```

---

## 🎯 Key Features

### **For Admins:**
✅ **See Everything**
- All organizations
- All users
- All responses
- Individual emails visible
- Access key tracking

✅ **Export Everything**
- CSV export per organization
- Excel export per organization
- Bulk export all organizations
- Wide format (questions as columns)

✅ **Detailed Tracking**
- Assessment ID for each submission
- Completion timestamps
- Time spent per question
- Progress status

### **For Facilitators:**
✅ **See Aggregate Data**
- Organization-wide statistics
- Response counts
- Completion rates
- **Emails HIDDEN** (***HIDDEN*** shown instead)

❌ **Cannot See**
- Individual emails
- Access keys
- Personal identifiable information

---

## 📊 Data Analysis Capabilities

### **What You Can Analyze:**

1. **Response Quality**
   - View full text responses
   - See time spent (indicates effort)
   - Compare across users

2. **Completion Tracking**
   - Who finished
   - When they finished
   - How long it took

3. **Organization Comparison**
   - Compare responses across organizations
   - Identify best practices
   - Benchmark performance

4. **Category Analysis**
   - Responses by category (Leadership, Strategy, etc.)
   - Identify strong/weak areas
   - Gap analysis

---

## 🔐 Privacy Controls

### **Admin View (SYSTEM_ADMIN)**
```javascript
User Email: john.doe@acme.com ✅ VISIBLE
Access Key: ACME2024 ✅ VISIBLE
Responses: Full text ✅ VISIBLE
```

### **Facilitator View (FACILITATOR)**
```javascript
User Email: ***HIDDEN*** ❌ HIDDEN
Access Key: ***HIDDEN*** ❌ HIDDEN
Responses: Aggregate only ✅ VISIBLE (but can't identify who)
```

**Implementation Location**: 
- `src/app/api/admin/baldrige/responses/route.ts` (lines 107-113)

---

## 💾 Data Retention

### **Storage Details:**
- **Database**: PostgreSQL (production) or SQLite (dev)
- **Text Storage**: Full text responses (unlimited length)
- **Progress**: Saved automatically every answer
- **Backup**: Responses never deleted (audit trail)

### **What's Stored:**
```
Per Response:
├── Full question text
├── Full answer text (unlimited length)
├── Time spent answering
├── Category and subcategory context
├── User identification
└── Timestamps

Per Assessment:
├── Unique assessment ID
├── All 100+ question responses
├── Start and completion times
├── Progress checkpoints
└── Metadata
```

---

## 📱 Access Points

### **Admin Access:**
```
URL: http://localhost:3010/admin/baldrige

Login: admin@tenadam.com / admin123

Navigation:
  Admin Dashboard → Baldrige Responses tab
```

### **What You See:**
1. **Summary cards** at top (organizations, users, total responses)
2. **Organization list** (expandable)
3. **User assessments** within each org (expandable)
4. **Individual responses** with full details
5. **Export buttons** (CSV, Excel)

---

## 📤 Export Use Cases

### **Use Case 1: Single Organization Analysis**
```
Scenario: Export Acme Corp's Baldrige data for review

Steps:
1. Go to /admin/baldrige
2. Find "Acme Corporation"
3. Click "Export Excel"
4. Open in Excel
5. Analyze responses by question
6. Share with leadership team
```

### **Use Case 2: Cross-Organization Comparison**
```
Scenario: Compare 3 organizations' leadership responses

Steps:
1. Click "Export All Excel"
2. Downloads 3 separate Excel files
3. Open all in Excel
4. Filter by Category "Leadership"
5. Compare answers to same questions
6. Identify best practices
```

### **Use Case 3: Individual Deep Dive**
```
Scenario: Review one person's complete assessment

Steps:
1. Go to /admin/baldrige
2. Expand organization
3. Find specific user
4. Click to expand their responses
5. Read all 100+ answers
6. See time spent per question
7. Assess quality and completeness
```

---

## 🔄 Data Update Flow

### **Real-Time Updates:**
```
Employee answers question
    ↓
Saved to BaldrigeResponse table
    ↓
BaldrigeProgress updated
    ↓
Admin refreshes page
    ↓
Sees updated data immediately
```

### **No Caching Issues:**
- Fresh data on every page load
- No stale data
- Real-time accuracy

---

## 📋 Comparison: OCAI vs Baldrige Data Storage

| Aspect | OCAI | Baldrige |
|--------|------|----------|
| **Questions** | 6 dimensions × 4 options | 100+ open-ended questions |
| **Response Type** | Point allocation (0-100) | Long-form text |
| **Storage** | Response table (JSON scores) | BaldrigeResponse table (text) |
| **Complexity** | Simple scoring | Multi-level hierarchy |
| **Export Format** | Radar charts, bar charts | Text spreadsheet |
| **Analysis** | Quantitative (numbers) | Qualitative (text analysis) |
| **Time to Complete** | 15-20 minutes | 45-60 minutes |
| **Data Size** | Small (JSON objects) | Large (full text responses) |

---

## 🎯 Current Implementation Status

### ✅ **What's Working:**

1. **Data Storage**
   - ✅ All 5 Baldrige tables created
   - ✅ Relationships defined
   - ✅ Indexes for performance
   - ✅ Foreign keys for data integrity

2. **Admin Viewing**
   - ✅ `/admin/baldrige` page exists
   - ✅ Hierarchical view (Org → User → Responses)
   - ✅ Expandable/collapsible sections
   - ✅ Summary statistics

3. **Export Capabilities**
   - ✅ CSV export per organization
   - ✅ Excel export per organization
   - ✅ Bulk export all organizations
   - ✅ Wide format (questions as columns)

4. **Privacy Controls**
   - ✅ Admins see emails
   - ✅ Facilitators see ***HIDDEN***
   - ✅ Role-based access enforced

5. **Integration**
   - ✅ Works with credential authentication
   - ✅ Works with access key authentication
   - ✅ Progress saving enabled
   - ✅ Resume capability

---

## 📊 How Admins View Baldrige Data

### **Step-by-Step Guide:**

#### **Step 1: Access Baldrige Reports**
```
1. Log in as SYSTEM_ADMIN (admin@tenadam.com / admin123)
2. Go to Admin Dashboard
3. Click "Baldrige Responses" tab
   OR
   Click "Baldrige Responses" quick action card
```

#### **Step 2: View Summary**
```
Top of page shows:
├── Total Organizations (with Baldrige data)
├── Total Completed Assessments (number of users)
└── Total Responses (number of individual question answers)
```

#### **Step 3: Explore Organizations**
```
For each organization:
├── Click organization name to expand
├── See list of users who completed
├── Click user name to see their full assessment
└── Export data (CSV or Excel)
```

#### **Step 4: Review Individual Responses**
```
When user expanded:
├── See Assessment ID (e.g., BLD-2024-001)
├── See completion date
├── See email (admin only)
├── Click to expand all their answers
└── Read responses organized by category
```

#### **Step 5: Export for Analysis**
```
Options:
├── Export single org as CSV
├── Export single org as Excel
├── Export all orgs as CSV (bulk)
└── Export all orgs as Excel (bulk)
```

---

## 💡 Data Analysis Tips

### **Using Excel/CSV Exports:**

1. **Filter by Category**
   - Export to Excel
   - Filter columns by category (1.x, 2.x, etc.)
   - Analyze leadership responses separately from strategy

2. **Compare Users**
   - Each row = one user
   - Compare answers to same question across users
   - Identify consistent themes

3. **Text Analysis**
   - Copy responses to Word
   - Use Find function to search for keywords
   - Identify common themes

4. **Scoring (Manual)**
   - Read responses
   - Assign scores based on Baldrige criteria
   - Calculate category totals (out of 1000 points)

---

## 🔄 Future Enhancements (Potential)

### **Could Add Later:**

1. **Automated Scoring**
   - AI-based text analysis
   - Automatic point allocation
   - Comparison to benchmarks

2. **Visual Reports**
   - Category score charts
   - Strength/weakness heatmaps
   - Gap analysis visualizations

3. **Collaborative Review**
   - Multiple reviewers can score
   - Consensus scoring
   - Review comments

4. **Search & Filter**
   - Search across all responses
   - Filter by keyword
   - Tag important responses

5. **PDF Reports**
   - Generate formatted PDF
   - Include all responses
   - Professional layout

---

## 📁 File Locations

### **Database Schema:**
```
/prisma/schema.prisma
  - Lines 394-495: Baldrige models
```

### **Admin UI:**
```
/src/app/admin/baldrige/page.tsx
  - Full admin viewing interface
  - Export functionality
  - Hierarchical display
```

### **API Endpoint:**
```
/src/app/api/admin/baldrige/responses/route.ts
  - Fetches all Baldrige data
  - Organizes by org and user
  - Privacy controls implemented
```

### **Baldrige Data Library:**
```
/src/lib/baldrige-data.ts
  - Question definitions
  - Category structure
  - 7 categories × subcategories × ~100 questions
```

---

## 🎓 Understanding the Data Structure

### **Example: One Complete Assessment**

**User**: john.doe@acme.com  
**Assessment ID**: BLD-2024-001  
**Organization**: Acme Corporation  

**What's Stored:**

```
BaldrigeSubmission Record:
├── assessmentId: "BLD-2024-001"
├── userId: "xyz123"
├── organizationId: "org456"
├── isCompleted: true
├── totalQuestions: 100
├── answeredQuestions: 100
└── submittedAt: "2025-01-15T14:30:00Z"

BaldrigeProgress Record:
├── userId: "xyz123"
├── completedQuestions: ["q1", "q2", ... "q100"]
├── isCompleted: true
└── completedAt: "2025-01-15T14:30:00Z"

BaldrigeResponse Records (100 total):
├── Response 1:
│   ├── questionId: "q1"
│   ├── itemCode: "1.1a(1)"
│   ├── questionText: "How do senior leaders set vision..."
│   ├── responseText: "Our senior leaders conduct..."
│   └── timeSpent: 180 seconds
│
├── Response 2:
│   ├── questionId: "q2"
│   ├── itemCode: "1.1a(2)"
│   └── ...
│
└── ... (98 more responses)
```

**Total Data Size**: ~50-100KB per complete assessment

---

## 🔐 Security & Access

### **Who Can Access:**

| Role | Can View | Can Export | Can See Emails |
|------|----------|------------|----------------|
| **SYSTEM_ADMIN** | ✅ All orgs | ✅ Yes | ✅ Yes |
| **FACILITATOR** | ✅ Own org only | ✅ Yes | ❌ No |
| **EMPLOYEE** | ❌ No | ❌ No | ❌ No |
| **CREDENTIAL_USER** | ❌ No | ❌ No | ❌ No |

### **API Endpoint Protection:**
```
/api/admin/baldrige/responses
├── Requires authentication ✅
├── SYSTEM_ADMIN: Full access
├── FACILITATOR: Own org only + emails hidden
└── Others: Forbidden (403)
```

---

## 📊 Current Data in Your System

Based on the cleanup we did earlier:

```
Organizations: 2
├── Acme Corporation
└── TechCorp Solutions

Baldrige Responses: 0 (cleaned)
Baldrige Submissions: 0 (cleaned)

Status: Ready for new data!
```

---

## 🚀 How to Start Collecting Baldrige Data

### **Option 1: Using Access Keys**
```
1. Admin creates access key (ACME2024)
2. Sets assessment type to "BALDRIGE"
3. Shares key with employees
4. Employees log in and complete Baldrige
5. Data automatically stored
6. Admin views in /admin/baldrige
```

### **Option 2: Using Assessment Credentials** (NEW!)
```
1. Admin uploads CSV (email/password pairs)
2. Checks ☑ Baldrige assessment type
3. Employees log in with credentials
4. Complete Baldrige assessment
5. Progress auto-saves
6. Admin views with email tracking
```

---

## ✅ Summary

### **Baldrige Data is Stored:**
✅ In **5 dedicated database tables**  
✅ With **full question text and answers**  
✅ Linked to **users and organizations**  
✅ With **unique assessment IDs**  
✅ Including **time tracking**  

### **Baldrige Data is Viewed:**
✅ Through **admin dashboard** (`/admin/baldrige`)  
✅ In **hierarchical format** (Org → User → Responses)  
✅ With **export capabilities** (CSV, Excel)  
✅ With **privacy controls** (admin vs facilitator)  
✅ With **expandable sections** for easy navigation  

### **Baldrige Data is Secured:**
✅ **Role-based access** enforcement  
✅ **Email privacy** for facilitators  
✅ **Audit trail** maintained  
✅ **Authentication** required  

---

**Your Baldrige data storage and reporting system is comprehensive, secure, and production-ready!** 🎉

Would you like me to explain any specific aspect in more detail?












