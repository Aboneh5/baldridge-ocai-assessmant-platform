const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSubmissionStatus() {
  try {
    // Check the user
    const user = await prisma.user.findFirst({
      where: {
        email: 'o.b@gmail.com'
      },
      include: {
        organization: true,
      },
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log(`User: ${user.name} (${user.id})`);
    console.log(`Organization: ${user.organization?.name || 'N/A'}\n`);

    // Check responses
    const responses = await prisma.baldrigeResponse.findMany({
      where: {
        userId: user.id,
      },
    });

    const nonEmptyResponses = responses.filter(r => r.responseText && r.responseText.trim() !== '');
    console.log(`Total responses: ${responses.length}`);
    console.log(`Non-empty responses: ${nonEmptyResponses.length}\n`);

    // Check progress
    const progress = await prisma.baldrigeProgress.findMany({
      where: {
        userId: user.id,
      },
    });

    console.log(`=== BaldrigeProgress Records ===`);
    if (progress.length === 0) {
      console.log('No progress records found');
    } else {
      progress.forEach(p => {
        console.log(`ID: ${p.id}`);
        console.log(`  surveyId: ${p.surveyId || 'null'}`);
        console.log(`  isCompleted: ${p.isCompleted}`);
        console.log(`  completedAt: ${p.completedAt || 'N/A'}`);
        console.log(`  completedQuestions: ${JSON.stringify(p.completedQuestions)}`);
        console.log('');
      });
    }

    // Check submissions
    const submissions = await prisma.baldrigeSubmission.findMany({
      where: {
        userId: user.id,
      },
    });

    console.log(`=== BaldrigeSubmission Records ===`);
    if (submissions.length === 0) {
      console.log('No submission records found');
      console.log('>>> USER HAS NOT SUBMITTED THE ASSESSMENT <<<');
    } else {
      submissions.forEach(s => {
        console.log(`ID: ${s.id}`);
        console.log(`  assessmentId: ${s.assessmentId}`);
        console.log(`  surveyId: ${s.surveyId || 'null'}`);
        console.log(`  isCompleted: ${s.isCompleted}`);
        console.log(`  submittedAt: ${s.submittedAt}`);
        console.log(`  totalQuestions: ${s.totalQuestions}`);
        console.log(`  answeredQuestions: ${s.answeredQuestions}`);
        console.log('');
      });
    }

    // Check total questions
    const totalQuestions = await prisma.baldrigeQuestion.count();
    console.log(`\n=== Assessment Status ===`);
    console.log(`Total questions in system: ${totalQuestions}`);
    console.log(`User answered: ${nonEmptyResponses.length}/${totalQuestions}`);
    console.log(`Ready to submit: ${nonEmptyResponses.length === totalQuestions ? 'YES' : 'NO'}`);
    console.log(`Missing: ${totalQuestions - nonEmptyResponses.length} questions`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSubmissionStatus();
