const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBaldrigeQuestions() {
  try {
    // Total questions in database
    const totalQuestionsAll = await prisma.baldrigeQuestion.count();
    console.log('Total questions in database:', totalQuestionsAll);

    // Questions excluding organizational profile (displayOrder > 0)
    const totalQuestionsExcludingOrgProfile = await prisma.baldrigeQuestion.count({
      where: {
        subcategory: {
          category: {
            displayOrder: {
              gt: 0,
            },
          },
        },
      },
    });
    console.log('Questions excluding Org Profile (displayOrder > 0):', totalQuestionsExcludingOrgProfile);

    // Questions in organizational profile (displayOrder = 0)
    const orgProfileQuestions = await prisma.baldrigeQuestion.count({
      where: {
        subcategory: {
          category: {
            displayOrder: 0,
          },
        },
      },
    });
    console.log('Org Profile questions (displayOrder = 0):', orgProfileQuestions);

    // Show breakdown by category
    console.log('\n=== Questions by Category ===');
    const categories = await prisma.baldrigeCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        subcategories: {
          include: {
            questions: true,
          },
        },
      },
    });

    categories.forEach(cat => {
      const questionCount = cat.subcategories.reduce((total, sub) => total + sub.questions.length, 0);
      console.log(`Category ${cat.displayOrder}: ${cat.name} - ${questionCount} questions`);
      cat.subcategories.forEach(sub => {
        console.log(`  └─ ${sub.name}: ${sub.questions.length} questions`);
      });
    });

    console.log('\n=== Total Verification ===');
    console.log(`Expected: 97 questions total`);
    console.log(`Actual: ${totalQuestionsAll} questions total`);
    console.log(`Main assessment (excluding org profile): ${totalQuestionsExcludingOrgProfile} questions`);
    console.log(`Difference: ${97 - totalQuestionsAll} questions missing`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBaldrigeQuestions();
