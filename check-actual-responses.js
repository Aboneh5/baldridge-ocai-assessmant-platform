const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkActualResponses() {
  try {
    // Get all users with their responses
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 15,
    });

    console.log('=== CHECKING ALL RECENT USERS ===\n');

    for (const user of users) {
      const responses = await prisma.baldrigeResponse.findMany({
        where: {
          userId: user.id,
        },
      });

      const nonEmptyResponses = responses.filter(r => r.responseText && r.responseText.trim() !== '');

      if (responses.length > 0 || user.role === 'EMPLOYEE') {
        console.log(`User: ${user.name} (${user.email || 'no email'}) [${user.role}]`);
        console.log(`  ID: ${user.id}`);
        console.log(`  Total responses: ${responses.length}`);
        console.log(`  Non-empty responses: ${nonEmptyResponses.length}`);

        if (nonEmptyResponses.length > 0) {
          console.log(`  ✓ HAS RESPONSES - Checking details...`);

          // Group by surveyId
          const bySurveyId = {};
          responses.forEach(r => {
            const key = r.surveyId || 'null';
            if (!bySurveyId[key]) {
              bySurveyId[key] = { total: 0, nonEmpty: 0 };
            }
            bySurveyId[key].total++;
            if (r.responseText && r.responseText.trim() !== '') {
              bySurveyId[key].nonEmpty++;
            }
          });

          console.log(`  Responses by surveyId:`);
          Object.keys(bySurveyId).forEach(key => {
            const stats = bySurveyId[key];
            console.log(`    surveyId=${key}: ${stats.nonEmpty}/${stats.total} answered`);
          });
        }
        console.log('');
      }
    }

    // Check total count
    const totalResponses = await prisma.baldrigeResponse.count();
    const totalNonEmpty = await prisma.baldrigeResponse.count({
      where: {
        responseText: {
          not: '',
        },
      },
    });

    console.log(`\n=== DATABASE TOTALS ===`);
    console.log(`Total BaldrigeResponse records: ${totalResponses}`);
    console.log(`Non-empty responses: ${totalNonEmpty}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkActualResponses();
