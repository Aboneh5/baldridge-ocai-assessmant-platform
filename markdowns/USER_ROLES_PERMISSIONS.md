# User Roles & Permissions

## Overview

Assessment Hub has **3 user roles** with distinct permissions and capabilities.

---

## 🔷 1. SYSTEM_ADMIN (Platform Administrator)

**Who:** Tenadam staff, platform owners

**Authentication:** Email & Password

**Access Level:** **Full system access** across ALL organizations

### ✅ Capabilities

#### Organization Management
- Create new organizations
- Edit organization profiles and branding
- Delete organizations
- View all organizations

#### User Management
- Create users (all roles)
- Edit user information
- Delete users
- View all users across all organizations

#### Survey & Assessment Management
- Create surveys for any organization
- Edit/delete surveys
- View all survey responses across all organizations
- Manage survey settings

#### Access Key Management
- Generate access keys for any organization
- Set expiration dates and usage limits
- Deactivate/reactivate access keys
- View access key usage statistics

#### Reporting & Analytics
- View system-wide analytics
- Generate reports for any organization
- Export data (CSV, PDF)
- Access admin dashboard

#### Workshop Management
- Create workshops for any organization
- Manage workshop sessions
- Create and track action items
- Pin charts and create themes

#### Platform Settings
- Configure platform-wide settings
- Manage system integrations
- View system logs

### 🚫 Restrictions
- None (full access)

---

## 🔶 2. FACILITATOR (Organization Viewer)

**Who:** Client company staff, HR personnel, consultants

**Authentication:** Email & Password

**Access Level:** **View-only access** to their organization's data

### ✅ Capabilities

#### View Reports & Analytics
- View organization-wide reports
- View aggregate survey results
- View response statistics
- Access facilitator dashboard
- View team slice reports

#### Export Data
- Export reports as PDF
- Export data as CSV
- Download charts and visualizations

#### View Surveys
- See list of surveys for their organization
- View survey details and status
- See response counts

#### View Access Keys
- See access keys for their organization
- View usage statistics
- See expiration dates

#### Take Assessments
- Participate in OCAI assessments
- Participate in Baldrige assessments
- View their own results

### 🚫 Restrictions

**CANNOT Create or Modify:**
- ❌ Cannot create surveys
- ❌ Cannot edit surveys
- ❌ Cannot delete surveys
- ❌ Cannot generate access keys
- ❌ Cannot edit organization profile or branding
- ❌ Cannot create or manage workshops
- ❌ Cannot create users
- ❌ Cannot modify access keys
- ❌ Cannot delete responses
- ❌ Cannot access other organizations' data

**Facilitators are VIEW-ONLY for their organization**

---

## 🔵 3. EMPLOYEE (Assessment Participant)

**Who:** Regular employees, survey participants

**Authentication:** **Access Key** (no password required)

**Access Level:** Assessment participation only

### ✅ Capabilities

#### Take Assessments
- Participate in OCAI assessments
- Participate in Baldrige assessments
- Complete surveys assigned via access key

#### Provide Data
- Enter demographic information (optional)
- Submit responses anonymously (if configured)
- Add comments (if enabled)

#### View Results
- View their own assessment results (if configured)
- See personal culture profile (OCAI)
- See personal scores (Baldrige)

### 🚫 Restrictions

**CANNOT Access:**
- ❌ Cannot view other employees' responses
- ❌ Cannot see organization-wide data
- ❌ Cannot create surveys
- ❌ Cannot generate reports
- ❌ Cannot manage access keys
- ❌ Cannot edit organization settings
- ❌ Cannot create users
- ❌ Cannot access admin features

**Employees ONLY participate in assessments**

---

## 🔑 Access Key System

Access keys are special codes that allow employees to participate without creating accounts.

### Features
- 6-8 character unique codes (e.g., `ACME2024`)
- Can be restricted to specific assessments (OCAI only, Baldrige only, or both)
- Optional expiration dates
- Optional usage limits (e.g., max 50 uses)
- Tracking of usage count
- Can be deactivated by admins

### How It Works
1. Admin creates access key for organization
2. Organization shares key with employees
3. Employees enter key on login page
4. Optionally enter name (for tracking)
5. Immediately start assessment
6. Responses linked to organization

---

## Permission Matrix

| Action | SYSTEM_ADMIN | FACILITATOR | EMPLOYEE |
|--------|--------------|-------------|----------|
| **Organizations** | | | |
| Create organizations | ✅ | ❌ | ❌ |
| Edit organizations | ✅ | ❌ | ❌ |
| View own organization | ✅ | ✅ | ❌ |
| View all organizations | ✅ | ❌ | ❌ |
| Delete organizations | ✅ | ❌ | ❌ |
| **Users** | | | |
| Create users | ✅ | ❌ | ❌ |
| Edit users | ✅ | ❌ | ❌ |
| View users | ✅ | ❌ | ❌ |
| Delete users | ✅ | ❌ | ❌ |
| **Surveys** | | | |
| Create surveys | ✅ | ❌ | ❌ |
| Edit surveys | ✅ | ❌ | ❌ |
| View surveys | ✅ | ✅ (own org) | ❌ |
| Delete surveys | ✅ | ❌ | ❌ |
| Take assessments | ✅ | ✅ | ✅ |
| **Access Keys** | | | |
| Create access keys | ✅ | ❌ | ❌ |
| Edit access keys | ✅ | ❌ | ❌ |
| View access keys | ✅ | ✅ (own org) | ❌ |
| Deactivate keys | ✅ | ❌ | ❌ |
| Use access keys | ✅ | ✅ | ✅ |
| **Reports & Analytics** | | | |
| View all org reports | ✅ | ❌ | ❌ |
| View own org reports | ✅ | ✅ | ❌ |
| Export data | ✅ | ✅ | ❌ |
| View own results | ✅ | ✅ | ✅ (if allowed) |
| View all responses | ✅ | ❌ | ❌ |
| View org responses | ✅ | ✅ | ❌ |
| **Workshops** | | | |
| Create workshops | ✅ | ❌ | ❌ |
| Edit workshops | ✅ | ❌ | ❌ |
| View workshops | ✅ | ✅ (own org) | ❌ |
| Create action items | ✅ | ❌ | ❌ |
| **Platform** | | | |
| Access admin dashboard | ✅ | ❌ | ❌ |
| Access facilitator dashboard | ✅ | ✅ | ❌ |
| Platform settings | ✅ | ❌ | ❌ |

---

## Typical Workflow

### Scenario: Company Culture Assessment

1. **SYSTEM_ADMIN (Tenadam):**
   - Creates organization "ABC Corp"
   - Creates facilitator account `hr@abccorp.com`
   - Hands off to client

2. **FACILITATOR (HR Manager):**
   - Cannot create survey ❌
   - Contacts SYSTEM_ADMIN to create survey
   - Views survey status
   - Monitors response rates
   - Views and exports reports

3. **SYSTEM_ADMIN:**
   - Creates survey "Q1 2024 Culture Assessment"
   - Generates access key `ABC2024`
   - Shares with facilitator

4. **FACILITATOR:**
   - Distributes access key to employees
   - Monitors participation
   - Views aggregate results
   - Exports reports for leadership

5. **EMPLOYEES:**
   - Receive access key `ABC2024`
   - Enter key on assessment hub
   - Complete OCAI assessment
   - Submit responses

6. **FACILITATOR:**
   - Reviews organization-wide results
   - Exports reports for meetings
   - Shares insights with leadership

---

## Security Features

### SYSTEM_ADMIN
- Password authentication required
- Multi-factor authentication (optional)
- Session management
- Activity logging

### FACILITATOR
- Password authentication required
- Organization-scoped access enforced
- Cannot escalate to admin
- Read-only access to data

### EMPLOYEE
- Access key authentication
- Optional anonymity
- IP hashing for privacy
- Consent tracking

---

## Updated: January 2025

**Key Changes:**
- FACILITATOR role changed from "Organization Administrator" to "Organization Viewer"
- FACILITATORs can no longer create surveys, access keys, or workshops
- FACILITATORs can no longer edit organization settings
- FACILITATORs maintain view and export capabilities for reporting

**Reason:** Clearer separation of duties - only SYSTEM_ADMIN can make changes, FACILITATOR can view and analyze.

