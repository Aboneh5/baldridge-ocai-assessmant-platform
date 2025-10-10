const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserResponses() {
  try {
    // Find the user who's filling the assessment
    const user = await prisma.user.findFirst({
      where: {
        email: 'o.b@gmail.com'
      }
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log(`User: ${user.name} (${user.id})\n`);

    // Get all responses for this user
    const responses = await prisma.baldrigeResponse.findMany({
      where: {
        userId: user.id,
        surveyId: null,
      },
      include: {
        question: {
          include: {
            subcategory: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    console.log(`Total responses in DB: ${responses.length}`);

    const nonEmptyResponses = responses.filter(r => r.responseText && r.responseText.trim() !== '');
    console.log(`Non-empty responses: ${nonEmptyResponses.length}`);

    // Group by category
    const byCategory = {};
    responses.forEach(r => {
      const cat = r.question.subcategory.category;
      const key = `${cat.displayOrder}: ${cat.name}`;
      if (!byCategory[key]) {
        byCategory[key] = { total: 0, nonEmpty: 0, questions: [] };
      }
      byCategory[key].total++;
      if (r.responseText && r.responseText.trim() !== '') {
        byCategory[key].nonEmpty++;
      }
      byCategory[key].questions.push({
        code: r.question.itemCode,
        answered: !!(r.responseText && r.responseText.trim()),
        length: r.responseText?.length || 0,
      });
    });

    console.log('\n=== Responses by Category ===');
    Object.keys(byCategory).sort().forEach(key => {
      const stats = byCategory[key];
      console.log(`\n${key}: ${stats.nonEmpty}/${stats.total} answered`);
      stats.questions.forEach(q => {
        const status = q.answered ? '✓' : '✗';
        console.log(`  ${status} ${q.code} (${q.length} chars)`);
      });
    });

    // Get total question count
    const totalQuestions = await prisma.baldrigeQuestion.count();
    console.log(`\n=== Summary ===`);
    console.log(`Total questions in system: ${totalQuestions}`);
    console.log(`User has answered: ${nonEmptyResponses.length}/${totalQuestions}`);
    console.log(`Missing: ${totalQuestions - nonEmptyResponses.length} questions`);

    // Get the questions that haven't been answered
    const answeredQuestionIds = new Set(responses.map(r => r.questionId));
    const allQuestions = await prisma.baldrigeQuestion.findMany({
      include: {
        subcategory: {
          include: {
            category: true,
          },
        },
      },
      orderBy: [
        { subcategory: { category: { displayOrder: 'asc' } } },
        { orderIndex: 'asc' },
      ],
    });

    const unansweredQuestions = allQuestions.filter(q => !answeredQuestionIds.has(q.id));
    if (unansweredQuestions.length > 0) {
      console.log(`\n=== Unanswered Questions (${unansweredQuestions.length}) ===`);
      let currentCat = null;
      unansweredQuestions.forEach(q => {
        const catName = `${q.subcategory.category.displayOrder}: ${q.subcategory.category.name}`;
        if (catName !== currentCat) {
          console.log(`\n${catName}:`);
          currentCat = catName;
        }
        console.log(`  - ${q.itemCode}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserResponses();
