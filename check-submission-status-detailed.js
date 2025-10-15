// Check Baldrige Submission Status - Detailed Report
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSubmissionStatus() {
  try {
    console.log('='.repeat(80));
    console.log('📊 BALDRIGE ASSESSMENT SUBMISSION STATUS');
    console.log('='.repeat(80));
    console.log('');

    // Get user ID (you can change this if needed)
    const userId = 'cmgpb93lf0001u0m0dv0gb5d0';

    // 1. Check total questions in system
    const totalQuestions = await prisma.baldrigeQuestion.count();
    console.log(`📝 Total Questions in System: ${totalQuestions}`);
    console.log('');

    // 2. Check user's answered questions
    const answeredCount = await prisma.baldrigeResponse.count({
      where: {
        userId: userId,
        responseText: { not: '' }
      }
    });

    const completionRate = ((answeredCount / totalQuestions) * 100).toFixed(1);
    console.log(`✅ Your Answered Questions: ${answeredCount} / ${totalQuestions} (${completionRate}%)`);
    console.log(`⏳ Remaining Questions: ${totalQuestions - answeredCount}`);
    console.log('');

    // 3. Check if can submit
    if (answeredCount >= totalQuestions) {
      console.log('🎉 STATUS: Ready to submit!');
      console.log('✅ All questions have been answered.');
      console.log('');
      console.log('Next step: Go to http://localhost:3010/baldrige/assessment');
      console.log('           Click "Complete Assessment" button');
    } else {
      console.log(`⚠️  STATUS: Cannot submit yet (${totalQuestions - answeredCount} questions remaining)`);
      console.log('');

      // 4. Find which questions are missing
      console.log('🔍 FINDING UNANSWERED QUESTIONS...');
      console.log('');

      const allQuestions = await prisma.baldrigeQuestion.findMany({
        include: {
          subcategory: {
            include: {
              category: true
            }
          }
        },
        orderBy: [
          { subcategory: { category: { displayOrder: 'asc' } } },
          { subcategory: { displayOrder: 'asc' } },
          { orderIndex: 'asc' }
        ]
      });

      const answeredQuestions = await prisma.baldrigeResponse.findMany({
        where: {
          userId: userId,
          responseText: { not: '' }
        },
        select: {
          questionId: true
        }
      });

      const answeredIds = new Set(answeredQuestions.map(r => r.questionId));
      const unanswered = allQuestions.filter(q => !answeredIds.has(q.id));

      // Group by category
      const byCategory = {};
      unanswered.forEach(q => {
        const categoryName = q.subcategory.category.name;
        if (!byCategory[categoryName]) {
          byCategory[categoryName] = [];
        }
        byCategory[categoryName].push({
          itemCode: q.itemCode,
          subcategory: q.subcategory.name,
          questionText: q.questionText.substring(0, 80) + '...'
        });
      });

      // Display missing questions by category
      console.log('📋 UNANSWERED QUESTIONS BY CATEGORY:');
      console.log('-'.repeat(80));
      
      let totalUnanswered = 0;
      Object.entries(byCategory).forEach(([category, questions]) => {
        console.log(`\n${category} (${questions.length} questions):`);
        console.log('-'.repeat(80));
        questions.forEach((q, idx) => {
          console.log(`${idx + 1}. [${q.itemCode}] ${q.subcategory}`);
          console.log(`   ${q.questionText}`);
          console.log('');
          totalUnanswered++;
        });
      });

      console.log('='.repeat(80));
      console.log(`📊 SUMMARY: ${totalUnanswered} questions need to be answered`);
      console.log('='.repeat(80));
      console.log('');
      console.log('📍 NEXT STEPS:');
      console.log('   1. Go to: http://localhost:3010/baldrige/assessment');
      console.log('   2. Navigate to each category listed above');
      console.log('   3. Answer the missing questions');
      console.log('   4. Watch browser console for "POST /api/baldrige/response 200"');
      console.log('   5. Run this script again to check progress');
      console.log('   6. When 97/97 complete, click "Complete Assessment"');
    }

    console.log('');

    // 5. Check if submission already exists
    const existingSubmission = await prisma.baldrigeSubmission.findFirst({
      where: { userId: userId }
    });

    if (existingSubmission) {
      console.log('✅ SUBMISSION RECORD FOUND:');
      console.log(`   Assessment ID: ${existingSubmission.assessmentId}`);
      console.log(`   Submitted At: ${existingSubmission.submittedAt}`);
      console.log(`   Status: ${existingSubmission.isCompleted ? 'Completed' : 'Pending'}`);
    } else {
      console.log('📝 No submission record yet (will be created when you submit)');
    }

    console.log('');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSubmissionStatus();

