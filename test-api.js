const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAPI() {
  console.log('=== TESTING API QUERY ===\n');

  const organizationId = 'cmgbkw1ul0001uuxkezll33or'; // Mary Joy

  try {
    // This is what the API does
    const responses = await prisma.response.findMany({
      where: {
        user: {
          organizationId: organizationId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            accessKeyUsed: true,
            organizationId: true,
          },
        },
        survey: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    console.log(`Query: WHERE user.organizationId = '${organizationId}'`);
    console.log(`Found ${responses.length} responses\n`);

    if (responses.length > 0) {
      responses.forEach((r, i) => {
        console.log(`${i + 1}. Response ID: ${r.id}`);
        console.log(`   User: ${r.user?.name} (ID: ${r.user?.id})`);
        console.log(`   User OrgID: ${r.user?.organizationId}`);
        console.log(`   Survey: ${r.survey?.title || 'N/A'}`);
        console.log(`   Submitted: ${r.submittedAt}`);
        console.log(`   nowScores type: ${typeof r.nowScores}`);
        console.log(`   nowScores value:`, r.nowScores);
        console.log('');
      });
    } else {
      console.log('❌ No responses found!');
      console.log('\nDEBUG: Checking all responses...');

      const allResponses = await prisma.response.findMany({
        include: {
          user: true
        }
      });

      console.log(`Total responses in DB: ${allResponses.length}`);
      allResponses.forEach(r => {
        console.log(`- Response ${r.id}: userId=${r.userId}, user.orgId=${r.user?.organizationId}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI();
