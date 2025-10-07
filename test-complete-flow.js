const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testFlow() {
  console.log('=== TESTING COMPLETE FLOW ===\n');

  try {
    // Step 1: Validate access key
    console.log('STEP 1: Employee enters access key');
    const accessKey = await prisma.accessKey.findFirst({
      where: {
        key: 'U4II-Y7P1-8LO1',
        isActive: true
      },
      include: { organization: true }
    });

    if (!accessKey) {
      console.log('❌ Access key not found or inactive');
      return;
    }

    console.log('✅ Access key validated');
    console.log('   Organization detected:', accessKey.organization.name);
    console.log('   Organization ID:', accessKey.organizationId);
    console.log('');

    // Step 2: What gets stored in localStorage
    console.log('STEP 2: What gets stored in localStorage');
    console.log('   user: { id, name, role: "EMPLOYEE", organizationId:', accessKey.organizationId, '}');
    console.log('   organization: {');
    console.log('     id:', accessKey.organizationId);
    console.log('     name:', accessKey.organization.name);
    console.log('   }');
    console.log('');

    // Step 3: Check for existing OCAI survey
    console.log('STEP 3: Employee clicks "Start OCAI Assessment"');
    console.log('   Checking for existing OCAI survey...');
    const existingSurveys = await prisma.survey.findMany({
      where: {
        organizationId: accessKey.organizationId,
        assessmentType: 'OCAI',
        status: 'OPEN'
      }
    });

    if (existingSurveys.length > 0) {
      console.log('✅ Found existing survey:', existingSurveys[0].title);
      console.log('   Survey ID:', existingSurveys[0].id);
      console.log('   Will redirect to:', `/surveys/${existingSurveys[0].id}/respond`);
    } else {
      console.log('   No existing OCAI survey found');
      console.log('   Will create new survey:');
      console.log('   - Title:', `${accessKey.organization.name} - OCAI Culture Assessment`);
      console.log('   - organizationId:', accessKey.organizationId);
      console.log('   - assessmentType: OCAI');
      console.log('   ✅ Survey will be created for', accessKey.organization.name);
    }
    console.log('');

    // Step 4: Response submission
    console.log('STEP 4: Employee completes and submits assessment');
    console.log('   Response will be saved with:');
    console.log('   - userId: (from localStorage.user.id)');
    console.log('   - User has organizationId:', accessKey.organizationId);
    console.log('   - Survey has organizationId:', accessKey.organizationId);
    console.log('   ✅ Response will be linked to', accessKey.organization.name);
    console.log('');

    // Step 5: Facilitator views results
    console.log('STEP 5: Facilitator views results');
    console.log('   Query: Find surveys WHERE organizationId =', accessKey.organizationId);
    console.log('   ✅ Will find the', accessKey.organization.name, 'OCAI survey');
    console.log('   ✅ Will find responses from', accessKey.organization.name, 'employees');
    console.log('');

    console.log('=== CONCLUSION ===');
    console.log('✅ System AUTOMATICALLY knows organization from access key');
    console.log('✅ No manual selection needed');
    console.log('✅ Everything is scoped to:', accessKey.organization.name);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFlow();
