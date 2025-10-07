const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSurveys() {
  try {
    const surveys = await prisma.survey.findMany({
      include: { organization: true }
    });

    console.log('=== ALL SURVEYS ===\n');
    console.log(`Total: ${surveys.length}\n`);

    surveys.forEach(s => {
      console.log(`Survey: ${s.title}`);
      console.log(`  Type: ${s.assessmentType}`);
      console.log(`  Org: ${s.organization?.name || 'NO ORG'}`);
      console.log(`  OrgID: ${s.organizationId}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSurveys();
