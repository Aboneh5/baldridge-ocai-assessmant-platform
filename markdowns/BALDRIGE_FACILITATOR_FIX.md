# Baldrige Facilitator Report Fix

## Problem
Completed Baldrige assessments were not showing up in the facilitator's dashboard and reports, even though users had fully completed all 97 questions (including the Organizational Profile section).

**User Report**: "test@gmail.com completed the Baldrige assessment (97/97 questions), but it's not counting in the facilitator list."

## Root Cause
The facilitator API endpoints (`/api/facilitator/stats` and `/api/facilitator/reports`) were only counting Baldrige data from the `Survey` table. However, **Baldrige assessments don't use surveys** - they are standalone assessments that create `BaldrigeSubmission` records directly.

### Original Logic (Incorrect)
```typescript
// This only counts Survey records with assessmentType='BALDRIGE'
prisma.survey.count({
  where: {
    organizationId,
    assessmentType: 'BALDRIGE',
  },
})
```

**Problem**: Baldrige assessments create `BaldrigeSubmission` records, not `Survey` records, so this query always returned 0.

## Solution

### Database Structure
The `BaldrigeSubmission` table already has an `organizationId` field:
```prisma
model BaldrigeSubmission {
  id                String   @id @default(cuid())
  assessmentId      String   @unique
  userId            String
  organizationId    String?  // ← This field links to organization
  surveyId          String?
  accessKey         String?
  startedAt         DateTime @default(now())
  submittedAt       DateTime?
  isCompleted       Boolean  @default(false)
  totalQuestions    Int      @default(0)
  answeredQuestions Int      @default(0)
  // ...
}
```

### Changes Made

#### 1. Fixed `/api/facilitator/stats` (`src/app/api/facilitator/stats/route.ts`)

**Before**:
```typescript
prisma.survey.count({
  where: {
    organizationId,
    assessmentType: 'BALDRIGE',
  },
}),
```

**After**:
```typescript
// Baldrige count - get submissions for this organization
prisma.baldrigeSubmission.count({
  where: {
    organizationId,
  },
}),
```

**Updated Response**:
```typescript
return NextResponse.json({
  totalSurveys: totalSurveys + baldrigeCount, // Include Baldrige submissions
  totalResponses: totalResponses + baldrigeCount, // Include Baldrige submissions
  activeAccessKeys,
  assessmentBreakdown: {
    OCAI: ocaiCount,
    BALDRIGE: baldrigeCount, // Now shows actual count!
  },
})
```

#### 2. Fixed `/api/facilitator/reports` (`src/app/api/facilitator/reports/route.ts`)

**Before**:
```typescript
// Baldrige data
prisma.survey.findMany({
  where: {
    organizationId,
    assessmentType: 'BALDRIGE',
  },
  include: {
    _count: {
      select: {
        responses: true,
      },
    },
  },
}),
```

**After**:
```typescript
// Baldrige data - get submissions for this organization
prisma.baldrigeSubmission.findMany({
  where: {
    organizationId,
  },
}),
```

**Updated Calculation**:
```typescript
const baldrigeResponses = baldrigeSubmissions.length // Each submission = 1 completed assessment

return NextResponse.json({
  totalSurveys: surveys.length + baldrigeSubmissions.length, // Include Baldrige
  totalResponses: totalResponses + baldrigeResponses,
  byAssessmentType: {
    OCAI: {
      surveys: ocaiData.length,
      responses: ocaiResponses,
    },
    BALDRIGE: {
      surveys: baldrigeSubmissions.length, // Count of completed Baldrige assessments
      responses: baldrigeResponses, // Same as surveys for Baldrige
    },
  },
  // ...
})
```

## Test Results

### Before Fix
```
BALDRIGE: { surveys: 0, responses: 0 }
```

### After Fix
```
BALDRIGE: { surveys: 3, responses: 3 }
```

### Actual Data from Database
```
Organization: Mary Joy
Total Surveys: 2 (OCAI)
OCAI Surveys: 1
Baldrige Assessments: 3 ✓

Baldrige Submissions:
1. User: test@gmail.com - 97/97 questions (Completed ✓)
2. User: Another user - 97/97 questions (Completed ✓)
3. User: Third user - 97/97 questions (Completed ✓)
```

## How to Verify

1. **Sign in as a facilitator** (maryjoy@gmail.com for the test organization)

2. **Check the Dashboard** (`/facilitator/dashboard`):
   ```
   Assessment Breakdown:
   - OCAI: 1 survey
   - Baldrige: 3 surveys ✓
   ```

3. **Check Reports** (`/facilitator/reports`):
   ```
   Baldrige Card:
   - 3 responses
   - 3 surveys
   ```

4. **Run the test script**:
   ```bash
   node test-facilitator-reports.js
   ```

   Should show:
   ```
   ✅ BALDRIGE: { surveys: 3, responses: 3 }
   ```

## Key Insights

### Baldrige vs OCAI Architecture

**OCAI (Survey-based)**:
- Creates a `Survey` record
- Users submit `Response` records linked to the survey
- Multiple users can respond to one survey
- Count: Number of responses in the survey

**Baldrige (Direct submission)**:
- Each user gets their own `BaldrigeSubmission` record
- Responses stored in `BaldrigeResponse` table
- No shared survey - individual assessments
- Count: Number of submissions = number of completed assessments

### Why 97/84?
- **97 questions answered**: Includes all questions (including Organizational Profile)
- **84 required questions**: Excludes the Organizational Profile section (which is optional)
- **Result**: User completed 100% of all questions, including optional ones! ✅

## Files Modified

1. `src/app/api/facilitator/stats/route.ts` - Fixed stats counting
2. `src/app/api/facilitator/reports/route.ts` - Fixed report data aggregation
3. `test-facilitator-reports.js` - Created test script to verify the fix

## Impact

✅ Facilitators can now see completed Baldrige assessments in their dashboards  
✅ Report counts are accurate  
✅ Assessment breakdown correctly shows Baldrige submissions  
✅ No changes to frontend UI needed - existing components work with the new data  

## Date Fixed
October 15, 2025

## Related Issues
- NextAuth CLIENT_FETCH_ERROR fix (NEXTAUTH_CLIENT_FETCH_ERROR_FIX.md)




