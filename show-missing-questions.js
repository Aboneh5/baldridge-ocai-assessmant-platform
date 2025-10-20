const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showMissingQuestions() {
  try {
    console.log('Checking which Baldrige questions are missing responses...\n');
    
    // Find the user with 46 responses
    const user = await prisma.user.findUnique({
      where: { id: 'cmgpb93lf0001u0m0dv0gb5d0' },
      select: { id: true, name: true, email: true }
    });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User:', user.name, `(${user.email})`);
    console.log('User ID:', user.id);
    
    // Get all questions grouped by category
    const categories = await prisma.baldrigeCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        subcategories: {
          orderBy: { displayOrder: 'asc' },
          include: {
            questions: {
              orderBy: { orderIndex: 'asc' }
            }
          }
        }
      }
    });
    
    // Get user's responses
    const responses = await prisma.baldrigeResponse.findMany({
      where: { 
        userId: user.id,
        responseText: { not: '' }
      }
    });
    
    const responseQuestionIds = new Set(responses.map(r => r.questionId));
    
    console.log(`\nTotal responses saved: ${responses.length}/97\n`);
    console.log('Missing questions by category:\n');
    
    let totalMissing = 0;
    
    for (const category of categories) {
      const categoryMissing = [];
      
      for (const subcategory of category.subcategories) {
        for (const question of subcategory.questions) {
          if (!responseQuestionIds.has(question.id)) {
            categoryMissing.push({
              code: question.itemCode,
              subcategory: subcategory.name,
              text: question.questionText.substring(0, 80) + '...'
            });
          }
        }
      }
      
      if (categoryMissing.length > 0) {
        console.log(`${category.name} (${categoryMissing.length} missing):`);
        categoryMissing.forEach(q => {
          console.log(`  - ${q.code}: ${q.subcategory}`);
          totalMissing++;
        });
        console.log('');
      }
    }
    
    console.log(`Total missing: ${totalMissing} questions`);
    console.log('\n⚠️  These questions need to be answered after fixing the API.');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

showMissingQuestions();







