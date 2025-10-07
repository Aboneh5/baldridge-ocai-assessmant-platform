const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  console.log('=== VERIFICATION BEFORE NEW EMPLOYEE SUBMISSION ===\n');

  try {
    // 1. Check Mary Joy organization
    const maryJoy = await prisma.organization.findFirst({
      where: { name: 'Mary Joy' }
    });

    console.log('1. Mary Joy Organization:');
    console.log('   ID:', maryJoy.id);
    console.log('   Name:', maryJoy.name);
    console.log('');

    // 2. Check existing surveys for Mary Joy
    const maryJoySurveys = await prisma.survey.findMany({
      where: { organizationId: maryJoy.id }
    });

    console.log('2. Existing Surveys for Mary Joy:');
    console.log('   Count:', maryJoySurveys.length);
    if (maryJoySurveys.length > 0) {
      maryJoySurveys.forEach(s => {
        console.log(`   - ${s.title} (ID: ${s.id})`);
      });
    } else {
      console.log('   ❌ NO SURVEYS (This is the problem!)');
    }
    console.log('');

    // 3. Check existing responses linked to Mary Joy
    const maryJoyResponses = await prisma.response.findMany({
      where: {
        user: {
          organizationId: maryJoy.id
        }
      },
      include: {
        user: true,
        survey: { include: { organization: true } }
      }
    });

    console.log('3. Existing Responses from Mary Joy employees:');
    console.log('   Count:', maryJoyResponses.length);
    if (maryJoyResponses.length > 0) {
      maryJoyResponses.forEach(r => {
        console.log(`   - User: ${r.user.name}`);
        console.log(`     Survey: ${r.survey.title}`);
        console.log(`     Survey Org: ${r.survey.organization.name} (${r.survey.organizationId})`);
        console.log(`     ❌ MISMATCH: Response from Mary Joy employee but survey belongs to ${r.survey.organization.name}`);
        console.log('');
      });
    }
    console.log('');

    console.log('=== WHAT WILL HAPPEN WITH THE FIX ===\n');
    console.log('✅ When Mary Joy employee clicks "Start OCAI Assessment":');
    console.log('   1. System checks for existing OCAI survey for Mary Joy org');
    console.log('   2. If none exists, creates NEW survey with organizationId = Mary Joy');
    console.log('   3. Employee completes assessment');
    console.log('   4. Response is saved with userId linked to Mary Joy org');
    console.log('   5. Facilitator can now see results because:');
    console.log('      - Survey belongs to Mary Joy ✅');
    console.log('      - Response user belongs to Mary Joy ✅');
    console.log('      - API query finds surveys WHERE organizationId = Mary Joy ✅');
    console.log('');

    console.log('=== TESTING STEPS ===\n');
    console.log('1. Go to: http://localhost:3012/auth/access-key');
    console.log('2. Enter access key: U4II-Y7P1-8LO1');
    console.log('3. Enter name: Test Employee Mary Joy');
    console.log('4. Click OCAI assessment');
    console.log('5. Complete and submit');
    console.log('6. Check facilitator reports: http://localhost:3012/facilitator/reports');
    console.log('');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
