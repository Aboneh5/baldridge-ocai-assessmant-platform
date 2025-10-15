# Survey 403 Forbidden Error - Solution

## Error
```
Failed to load resource: the server responded with a status of 403 (Forbidden)
GET /api/surveys/cmgpw60hk0009u0u0gw2mq0cq
```

And seeing: **"Survey Not Found - The survey you're looking for doesn't exist or has been removed."**

## Root Cause

The survey exists in the database but has status `DRAFT`. The API only allows accessing surveys with status `OPEN`.

**Survey Details:**
- ID: `cmgpw60hk0009u0u0gw2mq0cq`
- Title: "Mary Joy - OCAI Culture Assessment"
- Type: OCAI
- **Status: DRAFT** ❌
- Organization: Mary Joy

**API Logic** (`src/app/api/surveys/[id]/route.ts:35-40`):
```typescript
if (survey.status !== 'OPEN') {
  return NextResponse.json(
    { error: 'Survey is not currently open' },
    { status: 403 }
  )
}
```

## Solution

You need to **change the survey status from DRAFT to OPEN**.

### Option 1: Update via Script (Quick Fix)

Run this command:
```bash
cd "tenadam-assessment"
npx tsx -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const updated = await prisma.survey.update({
    where: { id: 'cmgpw60hk0009u0u0gw2mq0cq' },
    data: { status: 'OPEN' }
  });
  console.log('✓ Survey opened:', updated.title, '- Status:', updated.status);
  await prisma.\$disconnect();
})();
"
```

### Option 2: Update via Prisma Studio

1. **Open Prisma Studio** (if not already open):
   ```bash
   npx prisma studio
   ```
   Opens at: http://localhost:5555

2. **Navigate to Survey table**

3. **Find survey** `cmgpw60hk0009u0u0gw2mq0cq`

4. **Click to edit**

5. **Change status** from `DRAFT` to `OPEN`

6. **Save**

### Option 3: Create a Quick Fix Script

I'll create a script for you:

```typescript
// scripts/open-survey.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const surveyId = 'cmgpw60hk0009u0u0gw2mq0cq';

async function openSurvey() {
  const survey = await prisma.survey.update({
    where: { id: surveyId },
    data: {
      status: 'OPEN',
      openAt: new Date()  // Optional: track when it was opened
    },
    include: { organization: { select: { name: true } } }
  });

  console.log('✅ Survey Opened!');
  console.log('  Title:', survey.title);
  console.log('  Organization:', survey.organization?.name);
  console.log('  Status:', survey.status);
  console.log('  Open At:', survey.openAt);

  await prisma.$disconnect();
}

openSurvey().catch(console.error);
```

Run it:
```bash
npx tsx scripts/open-survey.ts
```

## Understanding Survey Statuses

Your app has 3 survey statuses:

### DRAFT
- Survey is being created/configured
- **Not accessible to participants**
- Can be edited by admin/facilitator
- ❌ Returns 403 when accessed

### OPEN
- Survey is live and accepting responses
- **Accessible to participants**
- Can be filled out
- ✅ Returns survey data

### CLOSED
- Survey has ended
- No longer accepting responses
- Can view results
- ❌ Returns 403 when accessed (for new responses)

## Survey Workflow

1. **Create Survey** → Status: `DRAFT`
2. **Configure** (add questions, invitations, etc.)
3. **Open Survey** → Status: `OPEN` ✅
4. **Collect Responses**
5. **Close Survey** → Status: `CLOSED`
6. **View Results**

You're at step 2 trying to access step 3. Need to **open the survey** first!

## Verification

After changing status to OPEN:

### Test the API:
```bash
curl http://localhost:3010/api/surveys/cmgpw60hk0009u0u0gw2mq0cq
```

**Expected Response:**
```json
{
  "id": "cmgpw60hk0009u0u0gw2mq0cq",
  "title": "Mary Joy - OCAI Culture Assessment",
  "status": "OPEN",
  ...
}
```

### Access in Browser:
Navigate to the survey URL and it should load without the "Survey Not Found" error.

## Why This Happens

Common scenario:
1. Admin creates a survey (status: DRAFT)
2. Admin forgets to click "Open Survey" button
3. User tries to access survey URL
4. API checks: status !== 'OPEN' → returns 403
5. Frontend shows "Survey Not Found"

## Prevention

Add a clear UI indicator in the admin panel:
- Show survey status badge (Draft/Open/Closed)
- Add "Open Survey" button that's prominently displayed
- Warning when trying to share a DRAFT survey link

## All Surveys in Database

Current surveys:
1. **Q4 2024 Culture Assessment** - `cmgatg7960008uun4gmpz5fns`
2. **Q1 2024 Culture Assessment** - `cmgbd29a60009uuj8d0yhxtq3`
3. **Mary Joy - OCAI Culture Assessment** - `cmgpw60hk0009u0u0gw2mq0cq` ← This one

Check their statuses and open as needed!

---

## Quick Fix Command

Run this now to fix the issue:

```bash
cd "C:\Users\Lu\prog\baldrige work\tenadam-assessment"

node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const survey = await prisma.survey.update({
    where: { id: 'cmgpw60hk0009u0u0gw2mq0cq' },
    data: { status: 'OPEN', openAt: new Date() }
  });
  console.log('✅ Survey opened:', survey.title);
  await prisma.\$disconnect();
})();
"
```

After running this, refresh your browser and the survey should load! 🎉
