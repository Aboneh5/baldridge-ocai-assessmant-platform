const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanNullResponses() {
  console.log('=== CLEANING NULL userId RESPONSES ===\n');

  try {
    // First, check how many responses have null userId
    const nullResponses = await prisma.response.findMany({
      where: {
        userId: null
      }
    });

    console.log(`Found ${nullResponses.length} responses with null userId\n`);

    if (nullResponses.length === 0) {
      console.log('✅ No responses to clean. Database is clean!');
      await prisma.$disconnect();
      return;
    }

    // Show details
    console.log('Responses to be deleted:');
    nullResponses.forEach((r, i) => {
      console.log(`  ${i + 1}. ID: ${r.id} | Submitted: ${r.submittedAt}`);
    });

    console.log('\n⚠️  WARNING: This will permanently delete these responses!');
    console.log('Press Ctrl+C to cancel, or wait 3 seconds to proceed...\n');

    // Wait 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Delete responses with null userId
    const deleteResult = await prisma.response.deleteMany({
      where: {
        userId: null
      }
    });

    console.log(`\n✅ Deleted ${deleteResult.count} responses with null userId`);

    // Verify
    const remaining = await prisma.response.findMany({
      where: {
        userId: null
      }
    });

    console.log(`\n📊 Verification:`);
    console.log(`   - Responses with null userId remaining: ${remaining.length}`);
    console.log(`   - Database cleaned successfully!`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanNullResponses();
