// Check Database Health
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabaseHealth() {
  try {
    console.log('🔍 Checking Database Health...\n');

    // Check questions
    const questionCount = await prisma.baldrigeQuestion.count();
    console.log(`📝 Baldrige Questions: ${questionCount}`);
    
    if (questionCount === 0) {
      console.log('   ⚠️  WARNING: No questions found! Need to run seed script.');
    } else {
      console.log('   ✅ Questions exist');
    }

    // Check categories
    const categoryCount = await prisma.baldrigeCategory.count();
    console.log(`📂 Baldrige Categories: ${categoryCount}`);
    
    if (categoryCount === 0) {
      console.log('   ⚠️  WARNING: No categories found!');
    } else {
      console.log('   ✅ Categories exist');
    }

    // Check responses
    const responseCount = await prisma.baldrigeResponse.count();
    console.log(`✅ Your Responses: ${responseCount}`);
    
    if (responseCount === 0) {
      console.log('   ⚠️  No responses saved yet');
    } else {
      console.log('   ✅ Responses saved');
    }

    // Check users
    const userCount = await prisma.user.count();
    console.log(`👤 Total Users: ${userCount}`);
    
    if (userCount === 0) {
      console.log('   ⚠️  WARNING: No users found!');
    } else {
      console.log('   ✅ Users exist');
    }

    console.log('\n');

    // Summary
    const allGood = questionCount > 0 && categoryCount > 0 && userCount > 0;
    
    if (allGood) {
      console.log('✅ DATABASE IS READY');
      console.log('   You can start the server and use the assessment.');
    } else {
      console.log('❌ DATABASE NEEDS SETUP');
      console.log('   Run: npx prisma db seed');
      console.log('   Or run specific seed: npx tsx prisma/seed-baldrige.ts');
    }

  } catch (error) {
    console.error('\n❌ DATABASE CONNECTION ERROR:');
    console.error('   Message:', error.message);
    console.error('\n   This is the "Engine is not yet connected" issue.');
    console.error('\n   FIX: Run fix-submission-error.bat');
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseHealth();



