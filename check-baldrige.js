const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkBaldrige() {
  try {
    const questionCount = await prisma.baldrigeQuestion.count()
    const categoryCount = await prisma.baldrigeCategory.count()
    const subcategoryCount = await prisma.baldrigeSubcategory.count()

    console.log('=== BALDRIGE DATABASE STATUS ===\n')
    console.log(`Categories: ${categoryCount}`)
    console.log(`Subcategories: ${subcategoryCount}`)
    console.log(`Questions: ${questionCount}`)
    console.log(`\nStatus: ${questionCount > 0 ? '✅ Baldrige is seeded' : '❌ Baldrige NOT seeded - need to run seed script'}`)

    if (categoryCount > 0) {
      console.log('\n--- Sample Categories ---')
      const categories = await prisma.baldrigeCategory.findMany({
        take: 3,
        include: {
          _count: {
            select: { subcategories: true }
          }
        }
      })
      categories.forEach(cat => {
        console.log(`${cat.displayOrder}. ${cat.name} (${cat._count.subcategories} subcategories)`)
      })
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkBaldrige()
