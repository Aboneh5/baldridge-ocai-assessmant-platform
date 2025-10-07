const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  console.log('=== CLEANUP MISMATCHED RESPONSES ===\n');

  try {
    // Find responses where user org doesn't match survey org
    const allResponses = await prisma.response.findMany({
      include: {
        user: { include: { organization: true } },
        survey: { include: { organization: true } }
      }
    });

    console.log(`Total responses: ${allResponses.length}\n`);

    const mismatched = [];
    allResponses.forEach(r => {
      const userOrg = r.user?.organizationId;
      const surveyOrg = r.survey?.organizationId;

      if (userOrg && surveyOrg && userOrg !== surveyOrg) {
        mismatched.push(r);
        console.log(`❌ MISMATCH FOUND:`);
        console.log(`   Response ID: ${r.id}`);
        console.log(`   User: ${r.user.name}`);
        console.log(`   User Org: ${r.user.organization?.name || 'NO ORG'} (${userOrg})`);
        console.log(`   Survey: ${r.survey.title}`);
        console.log(`   Survey Org: ${r.survey.organization?.name || 'NO ORG'} (${surveyOrg})`);
        console.log('');
      }
    });

    if (mismatched.length > 0) {
      console.log(`\nFound ${mismatched.length} mismatched response(s)`);
      console.log('\nDeleting mismatched responses...');

      for (const r of mismatched) {
        await prisma.response.delete({ where: { id: r.id } });
        console.log(`✅ Deleted response ${r.id}`);
      }

      console.log('\n✅ Cleanup complete!');
    } else {
      console.log('✅ No mismatched responses found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();
