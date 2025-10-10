const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findUsers() {
  try {
    console.log('=== FINDING USERS WITH BALDRIGE RESPONSES ===\n');

    // Get all users with Baldrige responses
    const usersWithResponses = await prisma.baldrigeResponse.groupBy({
      by: ['userId'],
      _count: {
        id: true
      }
    });

    console.log('Users with Baldrige responses:', usersWithResponses.length);

    for (const userGroup of usersWithResponses) {
      const user = await prisma.user.findUnique({
        where: { id: userGroup.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          organizationId: true,
          accessKeyUsed: true
        }
      });

      console.log('\n--- User:', user?.name || 'Unknown');
      console.log('Email:', user?.email || 'N/A');
      console.log('ID:', user?.id);
      console.log('Role:', user?.role);
      console.log('Response count:', userGroup._count.id);

      // Get detailed response info
      const responses = await prisma.baldrigeResponse.findMany({
        where: { userId: userGroup.userId },
        select: {
          responseText: true,
          question: {
            select: {
              subcategory: {
                select: {
                  category: {
                    select: {
                      displayOrder: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      const nonEmpty = responses.filter(r => r.responseText && r.responseText.trim() !== '');
      const mainCategoryResponses = responses.filter(r =>
        r.question.subcategory.category.displayOrder > 0
      );
      const nonEmptyMainCategory = mainCategoryResponses.filter(r =>
        r.responseText && r.responseText.trim() !== ''
      );

      console.log('Non-empty responses:', nonEmpty.length);
      console.log('Main category responses (displayOrder > 0):', mainCategoryResponses.length);
      console.log('Non-empty main category:', nonEmptyMainCategory.length);

      // Check total required
      const totalRequired = await prisma.baldrigeQuestion.count({
        where: {
          subcategory: {
            category: {
              displayOrder: { gt: 0 }
            }
          }
        }
      });

      console.log('Required questions:', totalRequired);
      console.log('Can submit:', nonEmptyMainCategory.length >= totalRequired ? 'YES ✓' : 'NO ✗');
    }

    // Also check credential users
    console.log('\n\n=== CREDENTIAL USERS ===');
    const credUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: 'o.b@gmail.com' },
          { email: 'a.t@gmail.com' }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        accessKeyUsed: true
      }
    });

    console.log('Found', credUsers.length, 'credential users');
    credUsers.forEach(u => {
      console.log(`- ${u.name} (${u.email}): ID=${u.id}, accessKeyUsed=${u.accessKeyUsed}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findUsers();
