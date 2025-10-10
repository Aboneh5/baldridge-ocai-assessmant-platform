const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCredentialUsers() {
  try {
    // Get credential users with Baldrige access
    const credUsers = await prisma.assessmentCredential.findMany({
      where: {
        assessmentTypes: {
          has: 'BALDRIGE',
        },
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(`Found ${credUsers.length} credential users with Baldrige access:`);

    for (const cred of credUsers) {
      console.log(`\n=== ${cred.userName} (Org: ${cred.organization.name}) ===`);
      console.log(`User ID: ${cred.userId}`);
      console.log(`Credential ID: ${cred.credentialId}`);

      // Check if this userId has responses
      const responses = await prisma.baldrigeResponse.findMany({
        where: {
          userId: cred.userId,
        },
      });

      const nonEmptyResponses = responses.filter(r => r.responseText && r.responseText.trim() !== '');

      console.log(`Total responses: ${responses.length}`);
      console.log(`Non-empty responses: ${nonEmptyResponses.length}`);

      if (nonEmptyResponses.length > 0) {
        console.log('>>> THIS USER HAS RESPONSES <<<');

        // Check what questions are missing
        const allQuestions = await prisma.baldrigeQuestion.findMany({
          include: {
            subcategory: {
              include: {
                category: true,
              },
            },
          },
        });

        const answeredQuestionIds = new Set(nonEmptyResponses.map(r => r.questionId));
        const unansweredQuestions = allQuestions.filter(q => !answeredQuestionIds.has(q.id));

        console.log(`\nUnanswered questions (${unansweredQuestions.length}):`);
        unansweredQuestions.forEach(q => {
          console.log(`  - ${q.itemCode}: ${q.questionText.substring(0, 60)}... (Cat: ${q.subcategory.category.name})`);
        });
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCredentialUsers();
