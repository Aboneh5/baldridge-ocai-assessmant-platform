const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCompletion() {
  try {
    const email = 'o.b@gmail.com'; // Change this to your email

    // Find user
    const user = await prisma.user.findFirst({
      where: { email },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      console.log('User not found with email:', email);
      return;
    }

    console.log('User found:', user);
    console.log('\n=== CHECKING BALDRIGE COMPLETION ===\n');

    // Get total questions (excluding Organizational Profile - displayOrder 0)
    const totalQuestions = await prisma.baldrigeQuestion.count({
      where: {
        subcategory: {
          category: {
            displayOrder: { gt: 0 }
          }
        }
      }
    });

    // Get total questions INCLUDING Organizational Profile
    const totalQuestionsWithProfile = await prisma.baldrigeQuestion.count();

    console.log('Total questions (excluding Org Profile):', totalQuestions);
    console.log('Total questions (including Org Profile):', totalQuestionsWithProfile);

    // Get user's responses
    const responses = await prisma.baldrigeResponse.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        responseText: true,
        question: {
          select: {
            itemCode: true,
            questionText: true,
            subcategory: {
              select: {
                name: true,
                category: {
                  select: {
                    name: true,
                    displayOrder: true
                  }
                }
              }
            }
          }
        }
      }
    });

    console.log('\nTotal responses in database:', responses.length);

    // Count non-empty responses
    const nonEmptyResponses = responses.filter(r => r.responseText && r.responseText.trim() !== '');
    console.log('Non-empty responses:', nonEmptyResponses.length);

    // Count empty responses
    const emptyResponses = responses.filter(r => !r.responseText || r.responseText.trim() === '');
    console.log('Empty responses:', emptyResponses.length);

    // Categorize by category
    const byCategory = {};
    responses.forEach(r => {
      const catName = r.question.subcategory.category.name;
      const displayOrder = r.question.subcategory.category.displayOrder;
      const key = `${displayOrder}. ${catName}`;

      if (!byCategory[key]) {
        byCategory[key] = { total: 0, filled: 0, empty: 0 };
      }

      byCategory[key].total++;
      if (r.responseText && r.responseText.trim()) {
        byCategory[key].filled++;
      } else {
        byCategory[key].empty++;
      }
    });

    console.log('\n=== RESPONSES BY CATEGORY ===');
    Object.keys(byCategory).sort().forEach(key => {
      const stats = byCategory[key];
      console.log(`${key}: ${stats.filled}/${stats.total} filled (${stats.empty} empty)`);
    });

    // Find unanswered questions (questions without ANY response record)
    const allQuestions = await prisma.baldrigeQuestion.findMany({
      where: {
        subcategory: {
          category: {
            displayOrder: { gt: 0 } // Only main categories
          }
        }
      },
      select: {
        id: true,
        itemCode: true,
        questionText: true,
        subcategory: {
          select: {
            name: true,
            category: {
              select: {
                name: true,
                displayOrder: true
              }
            }
          }
        }
      }
    });

    const answeredQuestionIds = new Set(responses.map(r => r.question ?
      responses.find(resp =>
        resp.question.itemCode === r.question.itemCode
      )?.id : null
    ).filter(Boolean));

    const unansweredQuestions = allQuestions.filter(q =>
      !responses.some(r => r.question.itemCode === q.itemCode)
    );

    console.log('\n=== UNANSWERED QUESTIONS (no record at all) ===');
    console.log('Count:', unansweredQuestions.length);
    if (unansweredQuestions.length > 0) {
      console.log('\nFirst 10 unanswered:');
      unansweredQuestions.slice(0, 10).forEach(q => {
        console.log(`- [${q.itemCode}] ${q.subcategory.category.name} > ${q.subcategory.name}`);
        console.log(`  ${q.questionText.substring(0, 100)}...`);
      });
    }

    // Find questions with empty responses
    console.log('\n=== QUESTIONS WITH EMPTY RESPONSES ===');
    if (emptyResponses.length > 0) {
      console.log('Count:', emptyResponses.length);
      console.log('\nFirst 10 empty:');
      emptyResponses.slice(0, 10).forEach(r => {
        console.log(`- [${r.question.itemCode}] ${r.question.subcategory.category.name} > ${r.question.subcategory.name}`);
      });
    }

    // Summary
    console.log('\n=== COMPLETION SUMMARY ===');
    console.log(`Required questions: ${totalQuestions}`);
    console.log(`Answered with text: ${nonEmptyResponses.length}`);
    console.log(`Missing: ${totalQuestions - nonEmptyResponses.length}`);
    console.log(`Can submit: ${nonEmptyResponses.length >= totalQuestions ? 'YES ✓' : 'NO ✗'}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCompletion();
