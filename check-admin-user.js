const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdminUsers() {
  try {
    // Get all admin users
    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: ['SYSTEM_ADMIN', 'FACILITATOR']
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    console.log('=== Admin Users ===\n');
    admins.forEach(admin => {
      console.log(`Name: ${admin.name}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Role: ${admin.role}`);
      console.log(`ID: ${admin.id}`);
      console.log('');
    });

    if (admins.length === 0) {
      console.log('No admin users found!');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUsers();
