const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserResponses() {
  try {
    // Get all users (to find which one to check)
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
      take: 10,
    });

    console.log('Recent users:');
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) [${user.role}] - ID: ${user.id}`);
    });

    // Check responses for each user
    for (const user of users) {
      const responses = await prisma.baldrigeResponse.findMany({
        where: {
          userId: user.id,
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
      });

      if (responses.length > 0) {
        console.log(`\n=== User: ${user.name} (${user.email}) ===`);
        console.log(`Total responses: ${responses.length}`);

        const nonEmptyResponses = responses.filter(r => r.responseText && r.responseText.trim() !== '');
        console.log(`Non-empty responses: ${nonEmptyResponses.length}`);

        // Group by category
        const byCategory = {};
        responses.forEach(r => {
          const catName = r.question.subcategory.category.name;
          const catOrder = r.question.subcategory.category.displayOrder;
          const key = `${catOrder}: ${catName}`;
          if (!byCategory[key]) {
            byCategory[key] = { total: 0, nonEmpty: 0 };
          }
          byCategory[key].total++;
          if (r.responseText && r.responseText.trim() !== '') {
            byCategory[key].nonEmpty++;
          }
        });

        console.log('\nResponses by category:');
        Object.keys(byCategory).sort().forEach(key => {
          const stats = byCategory[key];
          console.log(`  ${key}: ${stats.nonEmpty}/${stats.total} answered`);
        });

        // Check if any are empty
        const emptyResponses = responses.filter(r => !r.responseText || r.responseText.trim() === '');
        if (emptyResponses.length > 0) {
          console.log(`\nEmpty responses (${emptyResponses.length}):`);
          emptyResponses.forEach(r => {
            console.log(`  - ${r.question.itemCode} (${r.question.subcategory.category.name})`);
          });
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserResponses();
