const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    const categories = await prisma.baldrigeCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        subcategories: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    console.log('=== All Baldrige Categories ===\n');
    categories.forEach(cat => {
      console.log(`Category ${cat.displayOrder}: "${cat.name}"`);
      console.log(`  Description: ${cat.description || 'N/A'}`);
      console.log(`  Points: ${cat.totalPoints}`);
      console.log(`  Subcategories (${cat.subcategories.length}):`);
      cat.subcategories.forEach(sub => {
        console.log(`    - ${sub.name} (${sub.points} points)`);
      });
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
